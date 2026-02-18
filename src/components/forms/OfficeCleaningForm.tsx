import { useState } from "react";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { useQuotes } from "@/hooks/useQuotes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";
import type { OfficeCleaningFormData } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPhoneNumber, isValidCanadianPhone } from "@/lib/phoneUtils";

interface Errors {
  [key: string]: string;
}

import { SuccessModal } from "../modals/SuccessModal";

export function OfficeCleaningForm() {
  const { toast } = useToast();
  const { createQuote } = useQuotes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [formData, setFormData] = useState<OfficeCleaningFormData>({
    name: "",
    company: "",
    address: "",
    email: "",
    phone: "",
    details: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const updateField = <K extends keyof OfficeCleaningFormData>(
    field: K,
    value: OfficeCleaningFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const updatePhone = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
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
    } else if (!isValidCanadianPhone(formData.phone)) {
      newErrors.phone = "Invalid Canadian phone number. Format: (XXX) XXX-XXXX";
    }
    if (!termsAccepted) newErrors.terms = "You must accept the privacy policy and terms of use";

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
      await createQuote({
        form_type: "office",
        cleaning_type: "office",
        frequency: "custom",
        kitchens: 0,
        bathrooms: "0",
        bedrooms: "0",
        living_rooms: 0,
        extras: [],
        laundry_persons: 0,
        preferred_date: new Date().toISOString().split("T")[0],
        preferred_time: "09:00",
        client_address: formData.address,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        details: formData.details || `Company: ${formData.company}`,
        subtotal: 0,
        discount: 0,
        total: 0,
        status: "pending",
      });

      setShowSuccessModal(true);

      setFormData({
        name: "",
        company: "",
        address: "",
        email: "",
        phone: "",
        details: "",
      });
      setTermsAccepted(false);
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
    <>
      <SuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} />
      <form onSubmit={handleSubmit} className="animate-fade-in max-w-2xl mx-auto bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold text-[#283D8F] mb-6">Office Cleaning</h2>

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
                placeholder="(416) 123-4567"
                value={formData.phone}
                onChange={e => updatePhone(e.target.value)}
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

          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked as boolean);
                  if (checked && errors.terms) {
                    setErrors(prev => ({ ...prev, terms: "" }));
                  }
                }}
                required
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the <a href="https://app.shinypathcleaning.ca/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a> and <a href="https://app.shinypathcleaning.ca/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">terms of use</a> of the Shiny Path website.
                </label>
                {errors.terms && (
                  <p className="text-xs text-destructive">{errors.terms}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Request Custom Quote"}
          </Button>
        </div>
      </form>
    </>
  );
}