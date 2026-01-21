import { useState, useMemo } from 'react';
import { getQuotes } from '@/lib/storage';
import { CleaningQuote, QuoteStatus } from '@/lib/types';
import { BookingDetailsDialog } from '@/components/admin/BookingDetailsDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isPast
} from 'date-fns';

export default function CalendarPage() {
  const [quotes, setQuotes] = useState<CleaningQuote[]>(getQuotes());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<CleaningQuote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const refreshQuotes = () => {
    setQuotes(getQuotes());
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return quotes.filter(q => q.preferred_date === dateStr);
  };

  const statusColors: Record<QuoteStatus, string> = {
    pending: 'bg-yellow-400',
    confirmed: 'bg-green-500',
    completed: 'bg-blue-500',
    cancelled: 'bg-red-500',
  };

  const statusBadgeColors: Record<QuoteStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const handleBookingClick = (booking: CleaningQuote) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-tenor tracking-wide text-foreground">Calendar</h2>
        <p className="text-muted-foreground">View scheduled cleanings by date</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {(['pending', 'confirmed', 'completed', 'cancelled'] as QuoteStatus[]).map((status) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
            <span className="text-sm capitalize">{status}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl font-tenor">
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div 
                key={day} 
                className="text-center text-sm font-medium text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const dayBookings = getBookingsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isCurrentDay = isToday(day);
              const isPastDay = isPast(day) && !isCurrentDay;

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] md:min-h-[120px] p-2 border rounded-lg ${
                    isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                  } ${isCurrentDay ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                  } ${isCurrentDay ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Mobile: dots */}
                  <div className="md:hidden flex flex-wrap gap-1">
                    {dayBookings.map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => handleBookingClick(booking)}
                        className={`w-2 h-2 rounded-full ${statusColors[booking.status]} ${
                          isPastDay ? 'opacity-50' : ''
                        }`}
                        title={`${booking.client_name} - ${booking.cleaning_type}`}
                      />
                    ))}
                  </div>

                  {/* Desktop: list */}
                  <div className="hidden md:block space-y-1">
                    {dayBookings.slice(0, 3).map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => handleBookingClick(booking)}
                        className={`w-full text-left text-xs p-1 rounded truncate ${
                          statusBadgeColors[booking.status]
                        } ${isPastDay ? 'opacity-50' : ''} hover:opacity-80`}
                      >
                        {booking.preferred_time.slice(0, 5)} {booking.cleaning_type}
                      </button>
                    ))}
                    {dayBookings.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{dayBookings.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <BookingDetailsDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={refreshQuotes}
      />
    </div>
  );
}
