import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuotes } from '@/lib/storage';
import { formatCurrency } from '@/lib/pricing';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';
import { format, isToday, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function AdminDashboard() {
  const quotes = getQuotes();

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const total = quotes.length;
    const pending = quotes.filter(q => q.status === 'pending').length;
    const confirmed = quotes.filter(q => q.status === 'confirmed').length;
    const completed = quotes.filter(q => q.status === 'completed').length;
    
    const todayBookings = quotes.filter(q => {
      try {
        return isToday(new Date(q.preferred_date));
      } catch {
        return false;
      }
    }).length;

    const monthlyRevenue = quotes
      .filter(q => {
        try {
          const date = new Date(q.created_at);
          return isWithinInterval(date, { start: monthStart, end: monthEnd }) && 
                 (q.status === 'confirmed' || q.status === 'completed');
        } catch {
          return false;
        }
      })
      .reduce((sum, q) => sum + q.total, 0);

    const totalRevenue = quotes
      .filter(q => q.status === 'confirmed' || q.status === 'completed')
      .reduce((sum, q) => sum + q.total, 0);

    return { total, pending, confirmed, completed, todayBookings, monthlyRevenue, totalRevenue };
  }, [quotes]);

  const recentBookings = useMemo(() => {
    return [...quotes]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [quotes]);

  const statCards = [
    { 
      title: 'Total Bookings', 
      value: stats.total, 
      icon: CalendarDays, 
      color: 'text-primary' 
    },
    { 
      title: 'Pending', 
      value: stats.pending, 
      icon: Clock, 
      color: 'text-yellow-600' 
    },
    { 
      title: 'Confirmed', 
      value: stats.confirmed, 
      icon: CheckCircle, 
      color: 'text-green-600' 
    },
    { 
      title: "Today's Bookings", 
      value: stats.todayBookings, 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Monthly Revenue', 
      value: formatCurrency(stats.monthlyRevenue), 
      icon: TrendingUp, 
      color: 'text-emerald-600' 
    },
    { 
      title: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      icon: DollarSign, 
      color: 'text-primary' 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-tenor tracking-wide text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your cleaning business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No bookings yet. They will appear here once customers submit quotes.
            </p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{booking.client_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.cleaning_type} • {booking.preferred_date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {booking.total > 0 ? formatCurrency(booking.total) : 'Quote'}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
