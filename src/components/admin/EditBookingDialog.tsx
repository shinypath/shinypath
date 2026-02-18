import { useState, useEffect } from 'react';
import { CleaningQuote, QuoteStatus, CleaningFormType } from '@/lib/types';
import { formatCurrency, type PricingConfig } from '@/lib/pricing';
import { useQuotes } from '@/hooks/useQuotes';
import { useBookedSlots } from "@/hooks/useBookedSlots";
import { usePricing } from "@/hooks/usePricing";
import { useCalculator } from "@/hooks/useCalculator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EditBookingDialogProps {
    booking: CleaningQuote | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

const TIME_SLOTS = [
    { value: "08:00", label: "8:00 AM" },
    { value: "09:00", label: "9:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "13:00", label: "01:00 PM" },
    { value: "14:00", label: "02:00 PM" },
    { value: "15:00", label: "03:00 PM" },
    { value: "16:00", label: "04:00 PM" },
];

export function EditBookingDialog({
    booking,
    open,
    onOpenChange,
    onUpdate,
}: EditBookingDialogProps) {
    const { updateQuote } = useQuotes();
    const [isSaving, setIsSaving] = useState(false);

    // New hooks for time availability
    const { getBookedTimesForDate, loading: loadingSlots } = useBookedSlots();
    const [timeOpen, setTimeOpen] = useState(false);

    // Pricing & Calculation
    const { pricing } = usePricing() as unknown as { pricing: PricingConfig };

    // Form State
    const [formData, setFormData] = useState<Partial<CleaningQuote>>({});

    const calculatorInput = {
        cleaningType: formData.cleaning_type || 'standard',
        frequency: formData.frequency || 'one-time',
        kitchens: formData.kitchens || 0,
        bathrooms: formData.bathrooms || '0',
        bedrooms: formData.bedrooms || '0',
        livingRooms: formData.living_rooms || 0,
        extras: formData.extras || [],
        laundry: formData.laundry_persons || 0,
    };

    const calculation = useCalculator(calculatorInput, pricing);

    // Initialize form data when booking changes
    useEffect(() => {
        if (booking) {
            setFormData({
                client_name: booking.client_name,
                client_email: booking.client_email,
                client_phone: booking.client_phone,
                client_address: booking.client_address,
                preferred_date: booking.preferred_date,
                preferred_time: booking.preferred_time || '',
                cleaning_type: booking.cleaning_type,
                frequency: booking.frequency,
                bathrooms: booking.bathrooms,
                bedrooms: booking.bedrooms,
                kitchens: booking.kitchens,
                living_rooms: booking.living_rooms,
                laundry_persons: booking.laundry_persons,
                extras: booking.extras,
                details: booking.details || '',
                total: booking.total
            });
        }
    }, [booking]);

    const handleChange = (field: keyof CleaningQuote, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleExtrasChange = (extra: string, checked: boolean) => {
        const currentExtras = formData.extras || [];
        if (checked) {
            handleChange('extras', [...currentExtras, extra]);
        } else {
            handleChange('extras', currentExtras.filter(e => e !== extra));
        }
    };

    const handleSave = async () => {
        if (!booking) return;

        setIsSaving(true);
        try {
            const { id, created_at, updated_at, ...rest } = booking;
            // Merge original booking with form data updates and calculated pricing
            const updates = {
                ...rest,
                ...formData,
                subtotal: calculation.subtotal,
                discount: calculation.discountAmount,
                total: calculation.total
            };

            await updateQuote(booking.id, updates);

            toast.success('Booking updated successfully');
            onUpdate();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to update booking:', error);
            toast.error('Failed to update booking');
        } finally {
            setIsSaving(false);
        }
    };

    if (!booking) return null;

    const isHouseCleaning = booking.form_type === 'house';

    // Calculate booked times for the specific date
    const bookedTimesForDate = new Set(formData.preferred_date ? getBookedTimesForDate(formData.preferred_date) : []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Edit Booking</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 pt-2">
                    <div className="space-y-6">

                        {/* Client Info Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Client Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="client_name">Name</Label>
                                    <Input
                                        id="client_name"
                                        value={formData.client_name || ''}
                                        onChange={(e) => handleChange('client_name', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client_email">Email</Label>
                                    <Input
                                        id="client_email"
                                        value={formData.client_email || ''}
                                        onChange={(e) => handleChange('client_email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client_phone">Phone</Label>
                                    <Input
                                        id="client_phone"
                                        value={formData.client_phone || ''}
                                        onChange={(e) => handleChange('client_phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client_address">Address</Label>
                                    <Input
                                        id="client_address"
                                        value={formData.client_address || ''}
                                        onChange={(e) => handleChange('client_address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Details Section - Only for House Cleaning */}
                        {isHouseCleaning && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Service Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="preferred_date">Date</Label>
                                        <Input
                                            id="preferred_date"
                                            type="date"
                                            value={formData.preferred_date || ''}
                                            onChange={(e) => handleChange('preferred_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="preferred_time">Time</Label>
                                        <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={timeOpen}
                                                    className="w-full justify-between"
                                                >
                                                    {formData.preferred_time
                                                        ? TIME_SLOTS.find((slot) => slot.value === formData.preferred_time)?.label || formData.preferred_time
                                                        : "Select time..."}
                                                    <Clock className="ml-2 h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0" align="start">
                                                <div className="p-3 border-b">
                                                    <div className="flex items-center gap-4 text-xs">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                                            <span>Available</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-3 h-3 rounded-full bg-destructive" />
                                                            <span>Booked</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-2 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                                    {TIME_SLOTS.map((slot) => {
                                                        const isBooked = bookedTimesForDate.has(slot.value);
                                                        const isSelected = formData.preferred_time === slot.value;

                                                        return (
                                                            <Button
                                                                key={slot.value}
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={isBooked}
                                                                onClick={() => {
                                                                    handleChange('preferred_time', slot.value);
                                                                    setTimeOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "text-xs",
                                                                    isSelected && "bg-primary text-primary-foreground",
                                                                    isBooked && "bg-destructive/10 text-destructive/50 border-destructive/20 line-through"
                                                                )}
                                                            >
                                                                {slot.label}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="frequency">Frequency</Label>
                                        <Select
                                            value={formData.frequency || ''}
                                            onValueChange={(v) => handleChange('frequency', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select frequency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['one-time', 'weekly', 'every-other-week', 'every-4-weeks'].map((freqValue) => {
                                                    const freqConfig = pricing?.frequencies[freqValue as keyof typeof pricing.frequencies];
                                                    const discount = freqConfig?.discount || 0;
                                                    // Map our internal keys to the display labels we want (or use config labels)
                                                    // The original dialog used "Bi-weekly" and "Monthly" which differ slightly from config labels sometimes
                                                    // but let's use the config labels for consistency if possible, or fallback to manual mapping if needed to match exact UI reqs.
                                                    // Given the previous code used "Bi-weekly" for "every-other-week" and "Monthly" for "every-4-weeks",
                                                    // and config likely has "Every other week" and "Every 4 weeks".
                                                    // I will stick to the labels that were there or use the config ones?
                                                    // The user request said "like in the house cleaning form".
                                                    // HouseCleaningForm uses `freqData.label`.
                                                    // standard: One-time, Weekly, Every other week, Every 4 weeks.
                                                    // The Edit dialog previously had: One-time, Weekly, Bi-weekly, Monthly.
                                                    // I will use the labels from the pricing config to be consistent with the main form as requested.
                                                    const label = freqConfig?.label || freqValue;

                                                    return (
                                                        <SelectItem key={freqValue} value={freqValue}>
                                                            {label}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cleaning_type">Type</Label>
                                        <Select
                                            value={formData.cleaning_type || ''}
                                            onValueChange={(v) => handleChange('cleaning_type', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="standard">Standard</SelectItem>
                                                <SelectItem value="deep">Deep</SelectItem>
                                                <SelectItem value="move">Move In/Out</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Rooms */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>Bedrooms</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.bedrooms || '0'}
                                            onChange={(e) => handleChange('bedrooms', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bathrooms</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.bathrooms || '0'}
                                            onChange={(e) => handleChange('bathrooms', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kitchens</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.kitchens || 0}
                                            onChange={(e) => handleChange('kitchens', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Living Rooms</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.living_rooms || 0}
                                            onChange={(e) => handleChange('living_rooms', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>

                                {/* Extras */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Extras</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {pricing?.extras && Object.entries(pricing.extras).map(([key, config]) => (
                                                <div key={key} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`extra-${key}`}
                                                        checked={formData.extras?.includes(key)}
                                                        onCheckedChange={(checked) => handleExtrasChange(key, checked as boolean)}
                                                    />
                                                    <label
                                                        htmlFor={`extra-${key}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {config.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Laundry (Persons)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={formData.laundry_persons || 0}
                                            onChange={(e) => handleChange('laundry_persons', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes Section */}
                        <div className="space-y-2">
                            <Label htmlFor="details">Notes / Details</Label>
                            <Textarea
                                id="details"
                                rows={4}
                                value={formData.details || ''}
                                onChange={(e) => handleChange('details', e.target.value)}
                            />
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-4">
                            <h3 className="font-ubuntu text-lg uppercase tracking-wide mb-3 text-primary">Pricing</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span>{formatCurrency(calculation.subtotal)}</span>
                                </div>
                                {calculation.discountPercent > 0 && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Discount:</span>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                            {Math.round(calculation.discountPercent * 100)}% off
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-primary">{formatCurrency(calculation.total)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <DialogFooter className="p-6 pt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
