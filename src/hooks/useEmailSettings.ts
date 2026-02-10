import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EmailTemplate {
  id: string;
  template_type: string;
  subject: string;
  body_html: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailSettings {
  id: string;
  admin_email: string;
  from_email: string;
  from_name: string;
  reminder_hours_before: number;
  send_admin_notifications: boolean;
  send_client_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export function useEmailSettings() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('email_templates')
      .select('*')
      .order('template_type');

    if (fetchError) {
      console.error('Error fetching templates:', fetchError);
      setError(fetchError.message);
    } else {
      setTemplates((data as EmailTemplate[]) || []);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('email_settings')
      .select('*')
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching settings:', fetchError);
      setError(fetchError.message);
    } else {
      setSettings(data as EmailSettings);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchTemplates(), fetchSettings()]);
    setLoading(false);
  }, [fetchTemplates, fetchSettings]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateTemplate = async (id: string, updates: Partial<EmailTemplate>): Promise<boolean> => {
    const { error: updateError } = await supabase
      .from('email_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating template:', updateError);
      throw new Error(updateError.message);
    }

    await fetchTemplates();
    return true;
  };

  const updateSettings = async (updates: Partial<EmailSettings>): Promise<boolean> => {
    if (!settings) return false;

    const { error: updateError } = await supabase
      .from('email_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', settings.id);

    if (updateError) {
      console.error('Error updating settings:', updateError);
      throw new Error(updateError.message);
    }

    await fetchSettings();
    return true;
  };

  const sendTestEmail = async (templateType: string): Promise<{ success: boolean; error?: string }> => {
    // For testing, we'd need a quote ID - this is a placeholder
    return { success: false, error: 'Test emails require a valid quote ID' };
  };

  return {
    templates,
    settings,
    loading,
    error,
    refresh,
    updateTemplate,
    updateSettings,
    sendTestEmail,
  };
}

export type NotificationType = 'appointment_created' | 'appointment_confirmed' | 'appointment_cancelled' | 'appointment_reminder';

export async function sendNotificationEmail(
  quoteId: string,
  notificationType: NotificationType,
  sendToClient = true,
  sendToAdmin = true
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        quote_id: quoteId,
        notification_type: notificationType,
        send_to_client: sendToClient,
        send_to_admin: sendToAdmin,
      },
    });

    if (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('Error invoking send-notification-email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
