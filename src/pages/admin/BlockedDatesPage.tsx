import { useState } from 'react';
import { useBlockedSlots, BlockType, BlockedSlot } from '@/hooks/useBlockedSlots';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, CalendarX2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WEEKDAYS = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

const TIME_SLOTS = [
  'ALL',
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00'
];

export default function BlockedDatesPage() {
  const { blockedSlots, loading, addBlockedSlot, removeBlockedSlot } = useBlockedSlots();
  const [type, setType] = useState<BlockType>('specific');
  const [dateValue, setDateValue] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateValue) {
      toast({ title: 'Error', description: 'Please provide a date value.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { success, error } = await addBlockedSlot({
      type,
      date_value: dateValue,
      time_slot: timeSlot,
    });
    setIsSubmitting(false);

    if (success) {
      toast({ title: 'Success', description: 'Blocked slot added successfully.' });
      setDateValue('');
      setTimeSlot('ALL');
    } else {
      toast({ title: 'Error', description: error?.message || 'Failed to add blocked slot.', variant: 'destructive' });
    }
  };

  const handleRemoveBlock = async (id: string) => {
    const { success, error } = await removeBlockedSlot(id);
    if (success) {
      toast({ title: 'Success', description: 'Blocked slot removed.' });
    } else {
      toast({ title: 'Error', description: error?.message || 'Failed to remove blocked slot.', variant: 'destructive' });
    }
  };

  const renderDateInput = () => {
    switch (type) {
      case 'specific':
        return (
          <div className="space-y-2">
            <Label>Specific Date</Label>
            <Input 
              type="date" 
              value={dateValue} 
              onChange={(e) => setDateValue(e.target.value)} 
              required
            />
          </div>
        );
      case 'weekly':
        return (
          <div className="space-y-2">
            <Label>Day of Week</Label>
            <Select value={dateValue} onValueChange={setDateValue} required>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map(day => (
                  <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'monthly':
        return (
          <div className="space-y-2">
            <Label>Day of Month (1-31)</Label>
            <Input 
              type="number" 
              min="1" 
              max="31"
              value={dateValue} 
              onChange={(e) => setDateValue(e.target.value)} 
              required
            />
          </div>
        );
    }
  };

  const getSlotDescription = (slot: BlockedSlot) => {
    let dateStr = '';
    if (slot.type === 'specific') {
      dateStr = slot.date_value;
    } else if (slot.type === 'weekly') {
      const day = WEEKDAYS.find(d => d.value === slot.date_value);
      dateStr = day ? `Every ${day.label}` : `Day ${slot.date_value}`;
    } else if (slot.type === 'monthly') {
      dateStr = `Every ${slot.date_value} of the month`;
    }

    const timeStr = slot.time_slot === 'ALL' ? 'Whole day' : `at ${slot.time_slot}`;
    return `${dateStr} (${timeStr})`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-tenor tracking-wide text-foreground">Block Dates & Times</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage availability by blocking specific or recurring dates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Block</CardTitle>
            <CardDescription>Select a rule type to block availability.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBlock} className="space-y-4">
              <div className="space-y-2">
                <Label>Block Type</Label>
                <Select value={type} onValueChange={(val: BlockType) => { setType(val); setDateValue(''); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="specific">Specific Date</SelectItem>
                    <SelectItem value="weekly">Weekly Recurring</SelectItem>
                    <SelectItem value="monthly">Monthly Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renderDateInput()}

              <div className="space-y-2">
                <Label>Time Slot</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(time => (
                      <SelectItem key={time} value={time}>{time === 'ALL' ? 'Whole Day' : time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Block
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List of blocked slots */}
        <Card>
          <CardHeader>
            <CardTitle>Active Blocks</CardTitle>
            <CardDescription>Dates and times currently blocked.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : blockedSlots.length === 0 ? (
              <div className="text-center p-6 border rounded-lg border-dashed text-muted-foreground flex flex-col items-center gap-2">
                <CalendarX2 className="h-8 w-8 opacity-50" />
                <p>No blocked dates found.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {blockedSlots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <div>
                      <p className="font-medium text-sm">{getSlotDescription(slot)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{slot.type} block</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveBlock(slot.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
