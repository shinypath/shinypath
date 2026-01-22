import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  quote_id: string;
  notification_type: 'appointment_created' | 'appointment_confirmed' | 'appointment_cancelled' | 'appointment_reminder' | 'admin_new_booking';
  send_to_client?: boolean;
  send_to_admin?: boolean;
}

interface Quote {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  cleaning_type: string;
  frequency: string;
  preferred_date: string;
  preferred_time: string | null;
  total: number | null;
  status: string;
}

function replaceTemplateVariables(template: string, quote: Quote, adminUrl?: string): string {
  const variables: Record<string, string> = {
    '{{client_name}}': quote.client_name || '',
    '{{client_email}}': quote.client_email || '',
    '{{client_phone}}': quote.client_phone || '',
    '{{client_address}}': quote.client_address || '',
    '{{cleaning_type}}': quote.cleaning_type || '',
    '{{frequency}}': quote.frequency || '',
    '{{preferred_date}}': quote.preferred_date ? new Date(quote.preferred_date).toLocaleDateString('en-CA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '',
    '{{preferred_time}}': quote.preferred_time || 'To be confirmed',
    '{{total}}': quote.total?.toFixed(2) || '0.00',
    '{{admin_url}}': adminUrl || '',
  };

  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }
  return result;
}

async function sendEmailViaResend(
  apiKey: string,
  from: string,
  to: string[],
  subject: string,
  html: string
): Promise<{ id?: string; error?: string }> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("Resend API error:", data);
    return { error: data.message || "Failed to send email" };
  }
  
  return { id: data.id };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-notification-email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured. Please add RESEND_API_KEY." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { quote_id, notification_type, send_to_client = true, send_to_admin = true }: EmailRequest = await req.json();
    
    console.log(`Processing ${notification_type} for quote ${quote_id}`);

    // Fetch quote details
    const { data: quote, error: quoteError } = await supabase
      .from('cleaning_quotes')
      .select('*')
      .eq('id', quote_id)
      .single();

    if (quoteError || !quote) {
      console.error("Quote not found:", quoteError);
      return new Response(
        JSON.stringify({ error: "Quote not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch email settings
    const { data: settings, error: settingsError } = await supabase
      .from('email_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError) {
      console.error("Email settings error:", settingsError);
      return new Response(
        JSON.stringify({ error: "Email settings not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_type', notification_type)
      .single();

    if (templateError || !template) {
      console.error("Template not found:", templateError);
      return new Response(
        JSON.stringify({ error: `Email template not found for: ${notification_type}` }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!template.enabled) {
      console.log(`Template ${notification_type} is disabled, skipping`);
      return new Response(
        JSON.stringify({ message: "Email template is disabled", skipped: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const adminUrl = `${Deno.env.get("SITE_URL") || "https://app.shinypathcleaning.ca"}/admin/submissions`;
    const emailResults = [];

    // Send to client
    if (send_to_client && settings.send_client_notifications && notification_type !== 'admin_new_booking') {
      const clientSubject = replaceTemplateVariables(template.subject, quote as Quote);
      const clientBody = replaceTemplateVariables(template.body_html, quote as Quote, adminUrl);

      console.log(`Sending client email to: ${quote.client_email}`);
      
      const clientEmailResult = await sendEmailViaResend(
        resendApiKey,
        `${settings.from_name} <${settings.from_email}>`,
        [quote.client_email],
        clientSubject,
        clientBody
      );

      console.log("Client email result:", clientEmailResult);
      emailResults.push({ type: 'client', result: clientEmailResult });
    }

    // Send to admin
    if (send_to_admin && settings.send_admin_notifications) {
      // Fetch admin template if it's not admin_new_booking
      let adminTemplate = template;
      if (notification_type !== 'admin_new_booking') {
        const { data: adminNotifTemplate } = await supabase
          .from('email_templates')
          .select('*')
          .eq('template_type', 'admin_new_booking')
          .single();
        
        if (adminNotifTemplate && notification_type === 'appointment_created') {
          adminTemplate = adminNotifTemplate;
        }
      }

      const adminSubject = notification_type === 'admin_new_booking' || notification_type === 'appointment_created'
        ? replaceTemplateVariables(adminTemplate.subject, quote as Quote)
        : `[Admin] ${replaceTemplateVariables(template.subject, quote as Quote)}`;
      
      const adminBody = notification_type === 'admin_new_booking' || notification_type === 'appointment_created'
        ? replaceTemplateVariables(adminTemplate.body_html, quote as Quote, adminUrl)
        : replaceTemplateVariables(template.body_html, quote as Quote, adminUrl);

      console.log(`Sending admin email to: ${settings.admin_email}`);
      
      const adminEmailResult = await sendEmailViaResend(
        resendApiKey,
        `${settings.from_name} <${settings.from_email}>`,
        [settings.admin_email],
        adminSubject,
        adminBody
      );

      console.log("Admin email result:", adminEmailResult);
      emailResults.push({ type: 'admin', result: adminEmailResult });
    }

    return new Response(
      JSON.stringify({ success: true, results: emailResults }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-notification-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
