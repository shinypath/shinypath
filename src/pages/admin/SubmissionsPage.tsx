import { useState, useMemo } from 'react';
import { useQuotes } from '@/hooks/useQuotes';
import { CleaningQuote, QuoteStatus, CleaningFormType } from '@/lib/types';
import { formatCurrency } from '@/lib/pricing';
import { BookingDetailsDialog } from '@/components/admin/BookingDetailsDialog';
import { SwipeableSubmissionCard } from '@/components/admin/SwipeableSubmissionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SubmissionsPage() {
  const { quotes, loading, fetchQuotes, updateQuoteStatus, deleteQuote } = useQuotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CleaningFormType | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<CleaningQuote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<CleaningQuote | null>(null);

  const refreshQuotes = () => {
    fetchQuotes();
  };

  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((quote) => {
        const matchesSearch = 
          quote.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.client_address.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
        const matchesType = typeFilter === 'all' || quote.form_type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [quotes, searchTerm, statusFilter, typeFilter]);

  const statusColors: Record<QuoteStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const typeLabels: Record<CleaningFormType, string> = {
    house: 'House',
    office: 'Office',
    'post-construction': 'Post-Construction',
  };

  const handleRowClick = (booking: CleaningQuote) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, quote: CleaningQuote) => {
    e.stopPropagation();
    setQuoteToDelete(quote);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (quoteToDelete) {
      deleteQuote(quoteToDelete.id);
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-tenor tracking-wide text-foreground">Submissions</h2>
        <p className="text-muted-foreground">Manage all quote requests and bookings</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as QuoteStatus | 'all')}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as CleaningFormType | 'all')}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="post-construction">Post-Construction</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refreshQuotes} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Submissions</span>
            <Badge variant="secondary">{filteredQuotes.length} results</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredQuotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No submissions found. Adjust your filters or wait for new quote requests.
            </p>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredQuotes.map((quote) => (
                  <SwipeableSubmissionCard
                    key={quote.id}
                    quote={quote}
                    onClick={() => handleRowClick(quote)}
                    onDelete={deleteQuote}
                    statusColors={statusColors}
                    typeLabels={typeLabels}
                  />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Form</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow 
                        key={quote.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(quote)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{quote.client_name}</p>
                            <p className="text-xs text-muted-foreground">{quote.client_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {typeLabels[quote.form_type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{quote.cleaning_type}</TableCell>
                        <TableCell>{quote.form_type === 'house' ? quote.preferred_date : '—'}</TableCell>
                        <TableCell>{quote.form_type === 'house' ? quote.preferred_time : '—'}</TableCell>
                        <TableCell className="font-medium">
                          {quote.total > 0 ? formatCurrency(quote.total) : 'Quote'}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[quote.status]}>
                            {quote.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-destructive hover:text-white"
                            onClick={(e) => handleDeleteClick(e, quote)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <BookingDetailsDialog
        booking={selectedBooking}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={refreshQuotes}
        onStatusChange={updateQuoteStatus}
        onDelete={deleteQuote}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this submission from {quoteToDelete?.client_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
