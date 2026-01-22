import { CleaningQuote, QuoteStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/pricing';
import { updateQuoteStatus, deleteQuote } from '@/lib/storage';
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
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingDetailsDialogProps {
  booking: CleaningQuote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function BookingDetailsDialog({ 
  booking, 
  open, 
  onOpenChange,
  onUpdate 
}: BookingDetailsDialogProps) {
  if (!booking) return null;

  const handleStatusChange = (status: QuoteStatus) => {
    updateQuoteStatus(booking.id, status);
    onUpdate();
  };

  const handleDelete = () => {
    deleteQuote(booking.id);
    onOpenChange(false);
    onUpdate();
  };

  const statusColors: Record<QuoteStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            <Badge className={statusColors[booking.status]}>
              {booking.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="font-tenor text-lg tracking-wide mb-3">Client Information</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="font-medium text-lg">{booking.client_name}</p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href={`mailto:${booking.client_email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {booking.client_email}
                </a>
                <a 
                  href={`tel:${booking.client_phone}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
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
            <Button variant="outline" size="sm" asChild>
              <a href={`mailto:${booking.client_email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`sms:${booking.client_phone}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${booking.client_phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
          </div>

          <Separator />

          {/* Service Details */}
          <div>
            <h3 className="font-tenor text-lg tracking-wide mb-3">Service Details</h3>
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
              {booking.form_type === 'house' && (
                <>
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
                </>
              )}
            </div>

            {booking.details && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Additional Notes:</p>
                <p className="mt-1">{booking.details}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Pricing */}
          {booking.total > 0 && (
            <div>
              <h3 className="font-tenor text-lg tracking-wide mb-3">Pricing</h3>
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
            <h3 className="font-tenor text-lg tracking-wide mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
                <Button 
                  variant="default" 
                  onClick={() => handleStatusChange('confirmed')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              )}
              {booking.status === 'confirmed' && (
                <Button 
                  variant="default"
                  onClick={() => handleStatusChange('completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Completed
                </Button>
              )}
              {booking.status !== 'cancelled' && (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('cancelled')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              {booking.status === 'cancelled' && (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('pending')}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reactivate
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
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