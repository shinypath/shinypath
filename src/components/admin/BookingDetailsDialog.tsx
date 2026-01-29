import { useState } from 'react';
import { CleaningQuote, QuoteStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/pricing';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trash2,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingDetailsDialogProps {
  booking: CleaningQuote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  onStatusChange: (id: string, status: QuoteStatus) => Promise<CleaningQuote | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export function BookingDetailsDialog({ 
  booking, 
  open, 
  onOpenChange,
  onUpdate,
  onStatusChange,
  onDelete
}: BookingDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!booking) return null;

  // Generate email template based on form type
  const generateEmailTemplate = () => {
    const clientName = booking.client_name.split(' ')[0]; // First name
    let subject = '';
    let body = '';

    if (booking.form_type === 'house') {
      subject = `Booking Confirmation - ${booking.preferred_date}`;
      body = `Hi ${clientName},

Thank you for your booking request with Shiny Path Cleaning!

Here are your booking details:
- Service: ${booking.cleaning_type} Cleaning
- Date: ${booking.preferred_date}
- Time: ${booking.preferred_time || 'To be confirmed'}
- Address: ${booking.client_address}
- Rooms: ${booking.kitchens} Kitchen, ${booking.bathrooms} Bath, ${booking.bedrooms} Bed, ${booking.living_rooms} Living
${booking.extras.length > 0 ? `- Extras: ${booking.extras.join(', ')}` : ''}
${booking.laundry_persons > 0 ? `- Laundry: ${booking.laundry_persons} person(s)` : ''}
- Total: $${booking.total.toFixed(2)}

Please confirm if everything looks correct.

Best regards,
Shiny Path Cleaning Team`;
    } else if (booking.form_type === 'office') {
      subject = 'Office Cleaning Quote Request';
      body = `Hi ${clientName},

Thank you for your office cleaning quote request with Shiny Path Cleaning!

We have received your request and will assess your needs shortly.

Your contact details:
- Phone: ${booking.client_phone}
- Address: ${booking.client_address}
${booking.details ? `\nProject Details:\n${booking.details}` : ''}

We will get back to you with a customized quote.

Best regards,
Shiny Path Cleaning Team`;
    } else {
      subject = 'Post-Construction Cleaning Quote Request';
      body = `Hi ${clientName},

Thank you for your post-construction cleaning quote request with Shiny Path Cleaning!

We have received your request and will assess your needs shortly.

Your contact details:
- Phone: ${booking.client_phone}
- Address: ${booking.client_address}
${booking.details ? `\nProject Details:\n${booking.details}` : ''}

We will get back to you with a customized quote.

Best regards,
Shiny Path Cleaning Team`;
    }

    return { subject, body };
  };

  // Generate SMS template based on form type
  const generateSmsTemplate = () => {
    const clientName = booking.client_name.split(' ')[0]; // First name
    
    if (booking.form_type === 'house') {
      const extras = booking.extras.length > 0 ? `\nExtras: ${booking.extras.join(', ')}` : '';
      const laundry = booking.laundry_persons > 0 ? `\nLaundry: ${booking.laundry_persons} person(s)` : '';
      const notes = booking.details ? `\nNotes: ${booking.details}` : '';
      
      return `Hi ${clientName}! This is Shiny Path Cleaning confirming your booking:

Service: ${booking.cleaning_type} Cleaning
Frequency: ${booking.frequency}
Date: ${booking.preferred_date}
Time: ${booking.preferred_time || 'To be confirmed'}
Address: ${booking.client_address}
Rooms: ${booking.kitchens} Kitchen, ${booking.bathrooms} Bath, ${booking.bedrooms} Bed, ${booking.living_rooms} Living${extras}${laundry}${notes}

Total: $${booking.total.toFixed(2)}

Reply to confirm or call us with any questions!`;
    } else if (booking.form_type === 'office') {
      const details = booking.details ? `\nProject Details: ${booking.details}` : '';
      return `Hi ${clientName}! This is Shiny Path Cleaning. We received your office cleaning quote request.

Contact: ${booking.client_phone}
Email: ${booking.client_email}
Address: ${booking.client_address}${details}

We'll assess your needs and get back to you shortly with a customized quote. Thank you!`;
    } else {
      const details = booking.details ? `\nProject Details: ${booking.details}` : '';
      return `Hi ${clientName}! This is Shiny Path Cleaning. We received your post-construction cleaning quote request.

Contact: ${booking.client_phone}
Email: ${booking.client_email}
Address: ${booking.client_address}${details}

We'll assess your needs and get back to you shortly with a customized quote. Thank you!`;
    }
  };

  const emailTemplate = generateEmailTemplate();
  const smsTemplate = generateSmsTemplate();

  const handleStatusChange = async (status: QuoteStatus) => {
    setIsUpdating(true);
    try {
      await onStatusChange(booking.id, status);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(booking.id);
      onOpenChange(false);
      onUpdate();
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const statusColors: Record<QuoteStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <span className="font-tenor uppercase tracking-wide">Booking Details</span>
            <Badge className={`${statusColors[booking.status]} font-ubuntu hover:bg-inherit cursor-default`}>
              {booking.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="font-ubuntu text-lg uppercase tracking-wide mb-3 text-primary">Client Information</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="font-medium text-lg">{booking.client_name}</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
                <a 
                  href={`mailto:${booking.client_email}`}
                  className="flex items-center gap-2 text-primary hover:underline text-sm sm:text-base break-all"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  {booking.client_email}
                </a>
                <a 
                  href={`tel:${booking.client_phone}`}
                  className="flex items-center gap-2 text-primary hover:underline text-sm sm:text-base"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  {booking.client_phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                {booking.client_address}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="min-h-[44px] sm:min-h-0" asChild>
              <a href={`mailto:${booking.client_email}?subject=${encodeURIComponent(emailTemplate.subject)}&body=${encodeURIComponent(emailTemplate.body)}`}>
                <Mail className="h-4 w-4 mr-2" />
                <span>Email</span>
              </a>
            </Button>
            <Button variant="outline" size="sm" className="min-h-[44px] sm:min-h-0" asChild>
              <a href={`sms:${booking.client_phone}?body=${encodeURIComponent(smsTemplate)}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>SMS</span>
              </a>
            </Button>
            <Button variant="outline" size="sm" className="min-h-[44px] sm:min-h-0" asChild>
              <a href={`tel:${booking.client_phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                <span>Call</span>
              </a>
            </Button>
          </div>

          <Separator />

          {/* Service Details */}
          <div>
            <h3 className="font-ubuntu text-lg uppercase tracking-wide mb-3 text-primary">Service Details</h3>
            
            {/* House Cleaning specific fields */}
            {booking.form_type === 'house' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.preferred_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.preferred_time || 'Not specified'}</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{booking.cleaning_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-medium">{booking.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rooms:</span>
                    <span>
                      {booking.kitchens} Kitchen, {booking.bathrooms} Bath, {booking.bedrooms} Bed, {booking.living_rooms} Living
                    </span>
                  </div>
                  {booking.extras.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extras:</span>
                      <span>{booking.extras.join(', ')}</span>
                    </div>
                  )}
                  {booking.laundry_persons > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Laundry:</span>
                      <span>{booking.laundry_persons} person(s)</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Office Cleaning specific fields */}
            {booking.form_type === 'office' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">Office Cleaning</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">Quote Request (awaiting assessment)</span>
                </div>
              </div>
            )}

            {/* Post-Construction specific fields */}
            {booking.form_type === 'post-construction' && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">Post-Construction Cleaning</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">Quote Request (awaiting assessment)</span>
                </div>
              </div>
            )}

            {booking.details && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {booking.form_type === 'house' ? 'Additional Notes:' : 'Project Details:'}
                </p>
                <p className="mt-1">{booking.details}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Pricing */}
          {booking.total > 0 && (
            <div>
              <h3 className="font-ubuntu text-lg uppercase tracking-wide mb-3 text-primary">Pricing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(booking.subtotal)}</span>
                </div>
                {booking.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(booking.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(booking.total)}</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Status Actions */}
          <div>
            <h3 className="font-ubuntu text-lg uppercase tracking-wide mb-3 text-primary">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {/* Confirm/Cancel only for House Cleaning (has scheduled date/time) */}
              {booking.form_type === 'house' && (
                <>
                  {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
                    <Button 
                      variant="default" 
                      onClick={() => handleStatusChange('confirmed')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Confirm
                    </Button>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button 
                      variant="default"
                      onClick={() => handleStatusChange('completed')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Mark Completed
                    </Button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusChange('cancelled')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                      Cancel
                    </Button>
                  )}
                  {booking.status === 'cancelled' && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusChange('pending')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                      Reactivate
                    </Button>
                  )}
                </>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the booking 
                      for {booking.client_name}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground">
            <p>Created: {format(new Date(booking.created_at), 'PPpp')}</p>
            <p>Updated: {format(new Date(booking.updated_at), 'PPpp')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
