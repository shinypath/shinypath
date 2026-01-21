import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, ExternalLink, Info } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-tenor tracking-wide text-foreground">Settings</h2>
        <p className="text-muted-foreground">Configure your admin panel</p>
      </div>

      {/* Google Calendar Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Google Calendar Integration</CardTitle>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
          <CardDescription>
            Sync bookings automatically with your Google Calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p>
                Google Calendar integration requires a backend service to handle OAuth 
                authentication securely. This feature will be available when the app 
                is connected to Supabase or another backend provider.
              </p>
              <p className="mt-2">
                Once enabled, confirmed bookings will automatically appear in your 
                Google Calendar with client details and appointment times.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Email Notifications</CardTitle>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
          <CardDescription>
            Automatic email notifications for bookings and status updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Email notifications require a backend service with email sending capabilities. 
              When enabled, clients will receive confirmation emails, reminders, and status 
              update notifications automatically.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Info (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Your business details shown to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input id="business-name" defaultValue="Shiny Path Cleaning" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-email">Business Email</Label>
              <Input id="business-email" type="email" defaultValue="info@shinypathcleaning.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-phone">Business Phone</Label>
              <Input id="business-phone" type="tel" defaultValue="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-area">Service Area</Label>
              <Input id="service-area" defaultValue="Greater Toronto Area" />
            </div>
          </div>
          <Button disabled>Save Business Info</Button>
          <p className="text-xs text-muted-foreground">
            Business info editing requires backend integration.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Demo Info */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Demo Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This admin panel is running in demo mode with localStorage. 
            Data persists in your browser but is not shared across devices.
          </p>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-muted-foreground">
              Email: admin@shinypathcleaning.com<br />
              Password: demo123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
