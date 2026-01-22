import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useEmailSettings, EmailTemplate } from '@/hooks/useEmailSettings';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Settings, 
  FileText, 
  Bell, 
  Clock, 
  Send, 
  Eye, 
  Edit2, 
  Save, 
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const templateTypeLabels: Record<string, { label: string; description: string; icon: React.ReactNode }> = {
  appointment_created: {
    label: 'Booking Request Received',
    description: 'Sent when a customer submits a new booking request',
    icon: <Mail className="h-4 w-4" />,
  },
  appointment_confirmed: {
    label: 'Appointment Confirmed',
    description: 'Sent when admin confirms an appointment',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  appointment_cancelled: {
    label: 'Appointment Cancelled',
    description: 'Sent when an appointment is cancelled',
    icon: <XCircle className="h-4 w-4" />,
  },
  appointment_reminder: {
    label: 'Appointment Reminder',
    description: 'Sent before the scheduled appointment',
    icon: <Bell className="h-4 w-4" />,
  },
  admin_new_booking: {
    label: 'Admin: New Booking Alert',
    description: 'Sent to admin when a new booking is received',
    icon: <AlertCircle className="h-4 w-4" />,
  },
};

export default function EmailSettingsPage() {
  const { toast } = useToast();
  const { templates, settings, loading, updateTemplate, updateSettings, refresh } = useEmailSettings();
  
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local form state for settings
  const [settingsForm, setSettingsForm] = useState({
    admin_email: '',
    from_email: '',
    from_name: '',
    reminder_hours_before: 24,
    send_admin_notifications: true,
    send_client_notifications: true,
  });

  // Update local form when settings load
  useState(() => {
    if (settings) {
      setSettingsForm({
        admin_email: settings.admin_email,
        from_email: settings.from_email,
        from_name: settings.from_name,
        reminder_hours_before: settings.reminder_hours_before,
        send_admin_notifications: settings.send_admin_notifications,
        send_client_notifications: settings.send_client_notifications,
      });
    }
  });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings(settingsForm);
      toast({ title: 'Settings saved', description: 'Email settings updated successfully.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTemplate = async (template: EmailTemplate) => {
    try {
      await updateTemplate(template.id, { enabled: !template.enabled });
      toast({ 
        title: template.enabled ? 'Template disabled' : 'Template enabled',
        description: `${templateTypeLabels[template.template_type]?.label} notifications are now ${template.enabled ? 'disabled' : 'enabled'}.`
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    
    setIsSaving(true);
    try {
      await updateTemplate(editingTemplate.id, {
        subject: editingTemplate.subject,
        body_html: editingTemplate.body_html,
      });
      toast({ title: 'Template saved', description: 'Email template updated successfully.' });
      setEditingTemplate(null);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Update form when settings change
  if (settings && settingsForm.admin_email === '' && settings.admin_email) {
    setSettingsForm({
      admin_email: settings.admin_email,
      from_email: settings.from_email,
      from_name: settings.from_name,
      reminder_hours_before: settings.reminder_hours_before,
      send_admin_notifications: settings.send_admin_notifications,
      send_client_notifications: settings.send_client_notifications,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-tenor tracking-wide text-foreground">Email Notifications</h2>
        <p className="text-muted-foreground">Configure email templates and notification settings</p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="setup" className="gap-2">
            <Info className="h-4 w-4" />
            Setup Guide
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize the email content sent to customers and admin. Use variables like {'{{client_name}}'}, {'{{preferred_date}}'}, {'{{total}}'} etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No email templates found.</p>
                  <p className="text-sm">Run the database migration to create default templates.</p>
                </div>
              ) : (
                templates.map((template) => {
                  const info = templateTypeLabels[template.template_type] || {
                    label: template.template_type,
                    description: '',
                    icon: <Mail className="h-4 w-4" />,
                  };
                  
                  return (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${template.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {info.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{info.label}</h4>
                            <Badge variant={template.enabled ? 'default' : 'secondary'}>
                              {template.enabled ? 'Active' : 'Disabled'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{info.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Subject: {template.subject.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTemplate({ ...template })}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={template.enabled}
                          onCheckedChange={() => handleToggleTemplate(template)}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Available Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Available Template Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {[
                  '{{client_name}}',
                  '{{client_email}}',
                  '{{client_phone}}',
                  '{{client_address}}',
                  '{{cleaning_type}}',
                  '{{frequency}}',
                  '{{preferred_date}}',
                  '{{preferred_time}}',
                  '{{total}}',
                  '{{admin_url}}',
                ].map((variable) => (
                  <code key={variable} className="bg-muted px-2 py-1 rounded text-xs">
                    {variable}
                  </code>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure sender information and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from_name">From Name</Label>
                  <Input
                    id="from_name"
                    value={settingsForm.from_name}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, from_name: e.target.value }))}
                    placeholder="Shiny Path Cleaning"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from_email">From Email</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={settingsForm.from_email}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, from_email: e.target.value }))}
                    placeholder="noreply@shinypathcleaning.ca"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be a verified domain in Resend
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="admin_email">Admin Email</Label>
                <Input
                  id="admin_email"
                  type="email"
                  value={settingsForm.admin_email}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, admin_email: e.target.value }))}
                  placeholder="admin@shinypathcleaning.ca"
                />
                <p className="text-xs text-muted-foreground">
                  Receives new booking notifications
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Reminder Settings
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="reminder_hours">Send Reminder Before (hours)</Label>
                  <Input
                    id="reminder_hours"
                    type="number"
                    min={1}
                    max={168}
                    value={settingsForm.reminder_hours_before}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, reminder_hours_before: parseInt(e.target.value) || 24 }))}
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    How many hours before the appointment to send a reminder (1-168 hours)
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Toggles</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send Client Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Email customers about their bookings
                      </p>
                    </div>
                    <Switch
                      checked={settingsForm.send_client_notifications}
                      onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, send_client_notifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send Admin Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email alerts for new bookings
                      </p>
                    </div>
                    <Switch
                      checked={settingsForm.send_admin_notifications}
                      onCheckedChange={(checked) => setSettingsForm(prev => ({ ...prev, send_admin_notifications: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full sm:w-auto">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Setup Guide Tab */}
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Service Setup Guide</CardTitle>
              <CardDescription>
                Follow these steps to enable email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Create a Resend Account</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Go to <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">resend.com</a> and sign up for a free account.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Verify Your Domain</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      In Resend dashboard, go to <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-primary underline">Domains</a> and add <code className="bg-muted px-1 rounded">shinypathcleaning.ca</code>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You'll need to add DNS records (TXT, MX, CNAME) to verify ownership.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Create an API Key</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Go to <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">API Keys</a> and create a new key with sending permissions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Add API Key to Supabase</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      In your Supabase project, go to <strong>Settings → Edge Functions → Secrets</strong> and add:
                    </p>
                    <code className="block bg-muted p-2 rounded text-sm">
                      RESEND_API_KEY = re_xxxxxxxx...
                    </code>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium">Run Database Migration</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Execute the SQL migration to create email_templates and email_settings tables.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    6
                  </div>
                  <div>
                    <h4 className="font-medium">Test Your Setup</h4>
                    <p className="text-sm text-muted-foreground">
                      Submit a test booking form and check if emails are sent correctly.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Using Existing SMTP</h4>
                <p className="text-sm text-muted-foreground">
                  If you already have SMTP configured on your main domain, Resend can work alongside it.
                  The emails will be sent through Resend's infrastructure, not your existing SMTP.
                  Both can coexist on the same domain with proper DNS configuration.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain Setup</CardTitle>
              <CardDescription>
                Configure app.shinypathcleaning.ca or booking.shinypathcleaning.ca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Choose Your Subdomain</h4>
                    <p className="text-sm text-muted-foreground">
                      Recommended: <code className="bg-muted px-1 rounded">booking.shinypathcleaning.ca</code> or <code className="bg-muted px-1 rounded">app.shinypathcleaning.ca</code>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Add DNS Records</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      In your domain provider (where shinypathcleaning.ca is hosted), add an A record:
                    </p>
                    <code className="block bg-muted p-2 rounded text-sm">
                      Type: A<br />
                      Name: booking (or app)<br />
                      Value: 185.158.133.1
                    </code>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Connect in Lovable</h4>
                    <p className="text-sm text-muted-foreground">
                      In Lovable project settings → Domains, click "Connect Domain" and enter your subdomain.
                      Lovable will verify and provision SSL automatically.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Template: {editingTemplate && templateTypeLabels[editingTemplate.template_type]?.label}
            </DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, subject: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>HTML Body</Label>
                <Textarea
                  value={editingTemplate.body_html}
                  onChange={(e) => setEditingTemplate(prev => prev ? { ...prev, body_html: e.target.value } : null)}
                  className="font-mono text-xs min-h-[400px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>Cancel</Button>
            <Button onClick={handleSaveTemplate} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Template Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Preview: {previewTemplate && templateTypeLabels[previewTemplate.template_type]?.label}
            </DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="bg-muted p-2 rounded">
                <strong>Subject:</strong> {previewTemplate.subject}
              </div>
              <div 
                className="border rounded-lg p-4 bg-white"
                dangerouslySetInnerHTML={{ __html: previewTemplate.body_html }}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Close</Button>
            <Button onClick={() => {
              setPreviewTemplate(null);
              setEditingTemplate(previewTemplate);
            }}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
