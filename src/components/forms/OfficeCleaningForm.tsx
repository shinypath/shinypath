import { useState } from "react";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { saveQuote } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";
import type { OfficeCleaningFormData } from "@/lib/types";

interface Errors {
  [key: string]: string;
}

export function OfficeCleaningForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [formData, setFormData] = useState<OfficeCleaningFormData>({
    name: "",
    company: "",
    address: "",
    email: "",
    phone: "",
    details: "",
  });

  const updateField = <K extends keyof OfficeCleaningFormData>(
    field: K,
    value: OfficeCleaningFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
        form_type: "office",
        cleaning_type: "office",
        frequency: "custom",
        kitchens: 0,
        bathrooms: 0,
        bedrooms: 0,
        living_rooms: 0,
        extras: [],
        laundry: 0,
        preferred_date: new Date().toISOString().split("T")[0],
        preferred_time: "09:00",
        address: formData.address,
        client_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        additional_details: formData.details,
        subtotal: 0,
        discount: 0,
        total: 0,
        status: "pending",
      });

      toast({
        title: "Quote Request Submitted!",
        description: "We'll contact you shortly with a custom quote.",
      });

      setFormData({
        name: "",
        company: "",
        address: "",
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

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in max-w-2xl">
      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg uppercase tracking-wide">Office Cleaning</h3>
            <p className="text-sm text-muted-foreground">Custom quotes based on your needs</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Office cleaning requires a custom assessment. Fill out the form below and we'll 
          contact you to discuss your specific needs and provide a tailored quote.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <FormLabel required>Contact Name</FormLabel>
          <FormInput
            placeholder="Your full name"
            value={formData.name}
            onChange={e => updateField("name", e.target.value)}
            error={errors.name}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Company Name</FormLabel>
          <FormInput
            placeholder="Your company name (optional)"
            value={formData.company}
            onChange={e => updateField("company", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <FormLabel required>Office Address</FormLabel>
          <FormInput
            placeholder="123 Business St, Suite 100, City"
            value={formData.address}
            onChange={e => updateField("address", e.target.value)}
            error={errors.address}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel required>Email</FormLabel>
            <FormInput
              type="email"
              placeholder="you@company.com"
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
          <FormLabel>Details About Your Office</FormLabel>
          <FormTextarea
            placeholder="Please describe your office space: approximate size, number of rooms, any special requirements..."
            value={formData.details}
            onChange={e => updateField("details", e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Request Custom Quote"}
        </Button>
      </div>
    </form>
  );
}
