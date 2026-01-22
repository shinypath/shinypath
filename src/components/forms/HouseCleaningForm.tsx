import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { FormTextarea } from "./FormTextarea";
import { FrequencyCheckbox } from "./FrequencyCheckbox";
import { ExtraToggle } from "./ExtraToggle";
import { Summary } from "./Summary";
import { FridgeIcon, OvenIcon, CabinetsIcon, DishesIcon, PetsIcon } from "../icons/CleaningIcons";
import { useCalculator } from "@/hooks/useCalculator";
import { getPricing, formatCurrency } from "@/lib/pricing";
import { saveQuote } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { HouseCleaningFormData } from "@/lib/types";
import { useBookedSlots, type DateAvailability } from "@/hooks/useBookedSlots";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const BATHROOM_OPTIONS = [
  "0", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8"
].map(v => ({ value: v, label: v }));

const BEDROOM_OPTIONS = [
  "0", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8"
].map(v => ({ value: v, label: v }));

const KITCHEN_OPTIONS = [0, 1, 2, 3, 4].map(v => ({ value: String(v), label: String(v) }));
const LIVING_ROOM_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(v => ({ value: String(v), label: String(v) }));
const LAUNDRY_OPTIONS = [
  { value: "0", label: "None" },
  { value: "1", label: "1 person" },
  { value: "2", label: "2 persons" },
  { value: "3", label: "3 persons" },
  { value: "4", label: "4 persons" },
  { value: "5", label: "5 persons" },
];

interface Errors {
  [key: string]: string;
}

// Business hours time slots (8:00 AM to 6:00 PM)
const TIME_SLOTS = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
];

export function HouseCleaningForm() {
  const { toast } = useToast();
  const pricing = getPricing();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { getBookedTimesForDate, isDateFullyBooked, getDateAvailability, getAvailableSlotsCount, loading: loadingSlots } = useBookedSlots();
  
  const [formData, setFormData] = useState<HouseCleaningFormData>({
    cleaningType: "standard",
    frequency: "one-time",
    kitchens: 1,
    bathrooms: "1",
    bedrooms: "1",
    livingRooms: 1,
    extras: [],
    laundry: 0,
    date: "",
    time: "",
    address: "",
    name: "",
    email: "",
    phone: "",
    details: "",
  });

  // Get available time slots for the selected date
  const availableTimeSlots = useMemo(() => {
    if (!formData.date) return TIME_SLOTS;
    
    const bookedTimes = getBookedTimesForDate(formData.date);
    return TIME_SLOTS.filter(slot => !bookedTimes.includes(slot.value));
  }, [formData.date, getBookedTimesForDate]);

  const calculation = useCalculator({
    cleaningType: formData.cleaningType,
    frequency: formData.frequency,
    kitchens: formData.kitchens,
    bathrooms: formData.bathrooms,
    bedrooms: formData.bedrooms,
    livingRooms: formData.livingRooms,
    extras: formData.extras,
    laundry: formData.laundry,
  });

  const updateField = <K extends keyof HouseCleaningFormData>(
    field: K,
    value: HouseCleaningFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const toggleExtra = (extra: string, checked: boolean) => {
    updateField(
      "extras",
      checked
        ? [...formData.extras, extra]
        : formData.extras.filter(e => e !== extra)
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s\-\(\)\+]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      saveQuote({
        form_type: "house",
        cleaning_type: formData.cleaningType,
        frequency: formData.frequency,
        kitchens: formData.kitchens,
        bathrooms: formData.bathrooms,
        bedrooms: formData.bedrooms,
        living_rooms: formData.livingRooms,
        extras: formData.extras,
        laundry_persons: formData.laundry,
        preferred_date: formData.date,
        preferred_time: formData.time,
        client_address: formData.address,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        details: formData.details,
        subtotal: calculation.subtotal,
        discount: calculation.discountAmount,
        total: calculation.total,
        status: "pending",
      });

      toast({
        title: "Quote Submitted!",
        description: "We'll get back to you shortly with confirmation.",
      });

      // Reset form
      setFormData({
        cleaningType: "standard",
        frequency: "one-time",
        kitchens: 1,
        bathrooms: "1",
        bedrooms: "1",
        livingRooms: 1,
        extras: [],
        laundry: 0,
        date: "",
        time: "",
        address: "",
        name: "",
        email: "",
        phone: "",
        details: "",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = Object.entries(pricing.cleaningTypes).map(([value, { label, price }]) => ({
    value,
    label: `${label} (${formatCurrency(price)})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="grid lg:grid-cols-[1fr,320px] gap-8">
        {/* Form Fields */}
        <div className="space-y-6 bg-card rounded-lg border p-6">
          {/* Type of Cleaning */}
          <div className="space-y-2">
            <FormLabel required>Type of Cleaning</FormLabel>
            <FormSelect
              value={formData.cleaningType}
              onChange={e => updateField("cleaningType", e.target.value)}
              options={typeOptions}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-3">
            <FormLabel required>Frequency</FormLabel>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(pricing.frequencies).map(([value, { label, discount }]) => (
                <FrequencyCheckbox
                  key={value}
                  value={value}
                  label={label}
                  discountLabel={discount > 0 ? `${Math.round(discount * 100)}% off` : undefined}
                  checked={formData.frequency === value}
                  onChange={(val) => updateField("frequency", val)}
                />
              ))}
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <FormLabel>Kitchen</FormLabel>
              <FormSelect
                value={String(formData.kitchens)}
                onChange={e => updateField("kitchens", Number(e.target.value))}
                options={KITCHEN_OPTIONS}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Bathroom</FormLabel>
              <FormSelect
                value={formData.bathrooms}
                onChange={e => updateField("bathrooms", e.target.value)}
                options={BATHROOM_OPTIONS}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Bedroom</FormLabel>
              <FormSelect
                value={formData.bedrooms}
                onChange={e => updateField("bedrooms", e.target.value)}
                options={BEDROOM_OPTIONS}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Living Room</FormLabel>
              <FormSelect
                value={String(formData.livingRooms)}
                onChange={e => updateField("livingRooms", Number(e.target.value))}
                options={LIVING_ROOM_OPTIONS}
              />
            </div>
          </div>

          {/* Extras */}
          <div className="space-y-3">
            <FormLabel>Extras</FormLabel>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              <ExtraToggle
                value="inside-fridge"
                label="Inside Fridge"
                price={formatCurrency(pricing.extras["inside-fridge"].price)}
                icon={<FridgeIcon className="w-6 h-6" />}
                checked={formData.extras.includes("inside-fridge")}
                onChange={toggleExtra}
              />
              <ExtraToggle
                value="inside-oven"
                label="Inside Oven"
                price={formatCurrency(pricing.extras["inside-oven"].price)}
                icon={<OvenIcon className="w-6 h-6" />}
                checked={formData.extras.includes("inside-oven")}
                onChange={toggleExtra}
              />
              <ExtraToggle
                value="inside-cabinets"
                label="Inside Cabinets"
                price={formatCurrency(pricing.extras["inside-cabinets"].price)}
                icon={<CabinetsIcon className="w-6 h-6" />}
                checked={formData.extras.includes("inside-cabinets")}
                onChange={toggleExtra}
              />
              <ExtraToggle
                value="dishes"
                label="Dishes"
                price={formatCurrency(pricing.extras["dishes"].price)}
                icon={<DishesIcon className="w-6 h-6" />}
                checked={formData.extras.includes("dishes")}
                onChange={toggleExtra}
              />
              <ExtraToggle
                value="pets"
                label="Pets"
                price={formatCurrency(pricing.extras["pets"].price)}
                icon={<PetsIcon className="w-6 h-6" />}
                checked={formData.extras.includes("pets")}
                onChange={toggleExtra}
              />
            </div>
          </div>

          {/* Laundry */}
          <div className="space-y-2">
            <FormLabel>Laundry & Folding</FormLabel>
            <FormSelect
              value={String(formData.laundry)}
              onChange={e => updateField("laundry", Number(e.target.value))}
              options={LAUNDRY_OPTIONS}
            />
            {formData.laundry > 0 && (
              <p className="text-xs text-muted-foreground">
                +{formatCurrency(pricing.laundryPerPerson)} per person
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel required>Preferred Date</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
                      !formData.date && "text-muted-foreground",
                      errors.date && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(new Date(formData.date + "T12:00:00"), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span>Limited</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span>Full</span>
                      </div>
                    </div>
                  </div>
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date + "T12:00:00") : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const dateStr = format(date, "yyyy-MM-dd");
                        updateField("date", dateStr);
                        updateField("time", ""); // Clear time to force re-selection
                      }
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) return true;
                      const dateStr = format(date, "yyyy-MM-dd");
                      return isDateFullyBooked(dateStr);
                    }}
                    modifiers={{
                      available: (date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date < today) return false;
                        const dateStr = format(date, "yyyy-MM-dd");
                        return getDateAvailability(dateStr) === 'available';
                      },
                      limited: (date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date < today) return false;
                        const dateStr = format(date, "yyyy-MM-dd");
                        return getDateAvailability(dateStr) === 'limited';
                      },
                      full: (date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date < today) return false;
                        const dateStr = format(date, "yyyy-MM-dd");
                        return getDateAvailability(dateStr) === 'full';
                      },
                    }}
                    modifiersClassNames={{
                      available: "!bg-emerald-500/20 hover:!bg-emerald-500/30 !text-emerald-700 dark:!text-emerald-300",
                      limited: "!bg-amber-500/20 hover:!bg-amber-500/30 !text-amber-700 dark:!text-amber-300",
                      full: "!bg-destructive/20 !text-destructive !opacity-50 !cursor-not-allowed",
                    }}
                    className="p-3 pointer-events-auto"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
              {formData.date && (
                <p className="text-xs text-muted-foreground">
                  {getAvailableSlotsCount(formData.date)} time slots available
                </p>
              )}
            </div>
            <div className="space-y-2">
              <FormLabel required>Preferred Time</FormLabel>
              {loadingSlots ? (
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50 text-muted-foreground text-sm">
                  Loading available times...
                </div>
              ) : !formData.date ? (
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50 text-muted-foreground text-sm">
                  Select a date first
                </div>
              ) : availableTimeSlots.length === 0 ? (
                <div className="flex items-center h-10 px-3 border rounded-md bg-destructive/10 text-destructive text-sm">
                  No available times for this date
                </div>
              ) : (
                <FormSelect
                  value={formData.time}
                  onChange={e => updateField("time", e.target.value)}
                  options={[
                    { value: "", label: "Select a time" },
                    ...availableTimeSlots,
                  ]}
                  error={errors.time}
                />
              )}
              {errors.time && formData.date && availableTimeSlots.length > 0 && (
                <p className="text-xs text-destructive">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <FormLabel required>Address</FormLabel>
              <FormInput
                placeholder="123 Main St, City, Province"
                value={formData.address}
                onChange={e => updateField("address", e.target.value)}
                error={errors.address}
              />
            </div>
            <div className="space-y-2">
              <FormLabel required>Name</FormLabel>
              <FormInput
                placeholder="Your full name"
                value={formData.name}
                onChange={e => updateField("name", e.target.value)}
                error={errors.name}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel required>Email</FormLabel>
                <FormInput
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => updateField("email", e.target.value)}
                  error={errors.email}
                />
              </div>
              <div className="space-y-2">
                <FormLabel required>Phone</FormLabel>
                <FormInput
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={e => updateField("phone", e.target.value)}
                  error={errors.phone}
                />
              </div>
            </div>
            <div className="space-y-2">
              <FormLabel>Additional Details</FormLabel>
              <FormTextarea
                placeholder="Any special requests or instructions..."
                value={formData.details}
                onChange={e => updateField("details", e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Summary */}
          <div className="lg:hidden">
            <Summary
              cleaningType={formData.cleaningType}
              frequency={formData.frequency}
              kitchens={formData.kitchens}
              bathrooms={formData.bathrooms}
              bedrooms={formData.bedrooms}
              livingRooms={formData.livingRooms}
              extras={formData.extras}
              laundry={formData.laundry}
              calculation={calculation}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Request Quote"}
          </Button>
        </div>

        {/* Desktop Summary */}
        <div className="hidden lg:block">
          <Summary
            cleaningType={formData.cleaningType}
            frequency={formData.frequency}
            kitchens={formData.kitchens}
            bathrooms={formData.bathrooms}
            bedrooms={formData.bedrooms}
            livingRooms={formData.livingRooms}
            extras={formData.extras}
            laundry={formData.laundry}
            calculation={calculation}
          />
        </div>
      </div>
    </form>
  );
}