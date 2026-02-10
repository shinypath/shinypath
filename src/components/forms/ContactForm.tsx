import { useState } from "react";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { FormTextarea } from "./FormTextarea";
import { useQuotes } from "@/hooks/useQuotes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ContactFormData } from "@/lib/types";
import { SuccessModal } from "../modals/SuccessModal";

interface Errors {
    [key: string]: string;
}

export function ContactForm() {
    const { toast } = useToast();
    const { createQuote } = useQuotes();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const updateField = <K extends keyof ContactFormData>(
        field: K,
        value: ContactFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Errors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
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
        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
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
                form_type: "contact",
                cleaning_type: "contact",
                frequency: "one-time",
                client_name: formData.name,
                client_email: formData.email,
                client_phone: formData.phone,
                client_address: "",
                preferred_date: new Date().toISOString().split('T')[0],
                details: formData.message,
                status: "pending",
            });

            setShowSuccessModal(true);

            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                message: "",
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
                <h2 className="text-xl font-semibold text-[#283D8F] mb-6">Contact Form</h2>

                <div className="space-y-4">
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
                        <FormLabel required>Message</FormLabel>
                        <FormTextarea
                            placeholder="How can we help you? Please provide details about your inquiry..."
                            value={formData.message}
                            onChange={e => updateField("message", e.target.value)}
                            error={errors.message}
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </div>
            </form>
        </>
    );
}
