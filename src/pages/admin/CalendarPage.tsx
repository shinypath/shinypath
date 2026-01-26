import { useMemo, useState } from 'react';
import { useQuotes } from '@/hooks/useQuotes';
import { CleaningQuote, QuoteStatus } from '@/lib/types';
import { BookingDetailsDialog } from '@/components/admin/BookingDetailsDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Loader2, Clock, User } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isPast,
  isSameDay
} from 'date-fns';

export default function CalendarPage() {
  const { quotes, loading, fetchQuotes, updateQuoteStatus, deleteQuote } = useQuotes();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<CleaningQuote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const handleDateClick = (day: Date, isMobile: boolean) => {
    if (isMobile) {
      // On mobile, select the date to show bookings list
      if (selectedDate && isSameDay(selectedDate, day)) {
        setSelectedDate(null); // Toggle off if already selected
      } else {
        setSelectedDate(day);
      }
    }
  };

  const selectedDateBookings = selectedDate ? getBookingsForDay(selectedDate) : [];

  const weekDaysFull = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            {weekDaysFull.map((day, idx) => (
              <div 
                key={day} 
                className="text-center text-xs sm:text-sm font-medium text-muted-foreground p-1 sm:p-2"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{weekDaysShort[idx]}</span>
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
              const isSelected = selectedDate && isSameDay(selectedDate, day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day, true)}
                  className={`
                    aspect-square sm:aspect-auto sm:min-h-[100px] md:min-h-[120px] 
                    p-1 sm:p-2 border rounded-lg cursor-pointer md:cursor-default
                    transition-colors
                    ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                    ${isCurrentDay ? 'ring-2 ring-primary' : ''}
                    ${isSelected ? 'bg-primary/10 border-primary' : ''}
                  `}
                >
                  <div className={`text-xs sm:text-sm font-medium ${
                    isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                  } ${isCurrentDay ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Mobile: just show dots indicator */}
                  <div className="md:hidden flex justify-center mt-1 gap-0.5">
                    {dayBookings.length > 0 && (
                      <div className="flex gap-0.5">
                        {dayBookings.slice(0, 3).map((booking) => (
                          <div
                            key={booking.id}
                            className={`w-1.5 h-1.5 rounded-full ${statusColors[booking.status]} ${
                              isPastDay ? 'opacity-50' : ''
                            }`}
                          />
                        ))}
                        {dayBookings.length > 3 && (
                          <span className="text-[8px] text-muted-foreground ml-0.5">+{dayBookings.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Desktop: list */}
                  <div className="hidden md:block space-y-1 mt-1">
                    {dayBookings.slice(0, 3).map((booking) => (
                      <button
                        key={booking.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(booking);
                        }}
                        className={`w-full text-left text-xs p-1 rounded truncate ${
                          statusBadgeColors[booking.status]
                        } ${isPastDay ? 'opacity-50' : ''} hover:opacity-80`}
                      >
                        {booking.preferred_time?.slice(0, 5)} {booking.cleaning_type}
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

      {/* Mobile: Selected date bookings list */}
      {selectedDate && (
        <Card className="md:hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-tenor flex items-center justify-between">
              <span>{format(selectedDate, 'EEEE, MMM d')}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedDate(null)}
                className="text-muted-foreground"
              >
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {selectedDateBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No bookings for this date
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDateBookings.map((booking) => (
                  <button
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    className="w-full p-3 border rounded-lg text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{booking.client_name}</span>
                      </div>
                      <Badge className={statusBadgeColors[booking.status]}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.preferred_time?.slice(0, 5) || 'No time'}
                      </span>
                      <span>{booking.cleaning_type}</span>
                      {booking.total && (
                        <span className="font-medium text-foreground">
                          ${booking.total.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <BookingDetailsDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={fetchQuotes}
        onStatusChange={updateQuoteStatus}
        onDelete={deleteQuote}
      />
    </div>
  );
}
