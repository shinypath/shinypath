import { useState } from "react";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { useQuotes } from "@/hooks/useQuotes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, HardHat } from "lucide-react";
import type { PostConstructionFormData } from "@/lib/types";

interface Errors {
  [key: string]: string;
}

import { SuccessModal } from "../modals/SuccessModal";

export function PostConstructionForm() {
  const { toast } = useToast();
  const { createQuote } = useQuotes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [formData, setFormData] = useState<PostConstructionFormData>({
    name: "",
    address: "",
    email: "",
    phone: "",
    details: "",
  });

  const updateField = <K extends keyof PostConstructionFormData>(
    field: K,
    value: PostConstructionFormData[K]
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
    } else if (!/^[\d\s\-()+]{7,20}$/.test(formData.phone)) {
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
      await createQuote({
        form_type: "post-construction",
        cleaning_type: "post-construction",
        frequency: "one-time",
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
        details: formData.details,
        subtotal: 0,
        discount: 0,
        total: 0,
        status: "pending",
      });

      setShowSuccessModal(true);

      setFormData({
        name: "",
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
    <>
      <SuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} />
      <form onSubmit={handleSubmit} className="animate-fade-in max-w-2xl mx-auto bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold text-[#283D8F] mb-6">Post-Construction Cleaning</h2>

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
            <FormLabel required>Property Address</FormLabel>
            <FormInput
              placeholder="123 Main St, City, Province"
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
            <FormLabel>Project Details</FormLabel>
            <FormTextarea
              placeholder="Please describe the construction/renovation work completed, property size, and any specific areas that need attention..."
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
    </>
  );
}