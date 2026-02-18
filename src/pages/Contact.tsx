import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuotes } from "@/hooks/useQuotes";
import { Loader2, Phone, Mail, Clock } from "lucide-react";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { Footer } from "@/components/layout/Footer";
import type { ContactFormData } from "@/lib/types";

interface Errors {
    [key: string]: string;
}

export default function Contact() {
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

    const scrollToForm = () => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <SuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} />
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#E6EDF5] via-[#F5F8FC] to-[#E6EDF5] py-16 md:py-24">
                <div className="container px-4 text-center space-y-6">
                    <h1 className="font-tenor text-[#283D8F] text-[32px] md:text-[40px] lg:text-[48px] uppercase tracking-wide">
                        CONTACT US
                    </h1>
                    <p className="font-ubuntu text-[#283D8F] text-[18px] md:text-[22px] font-medium">
                        Get in touch with us
                    </p>
                    <p className="max-w-2xl mx-auto text-[#283D8F]/80 text-[15px] md:text-[16px] leading-relaxed">
                        We're available Monday to Friday from 9am to 4pm. For weekend or after-hours service, please contact us and we'll do our best to accommodate your needs.
                    </p>
                    <Button
                        onClick={scrollToForm}
                        className="bg-[#283D8F] hover:bg-[#1f2f6f] text-white px-8 py-6 text-[15px] font-ubuntu font-medium uppercase tracking-wide h-auto"
                    >
                        LET'S TALK
                    </Button>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="container px-4 py-12 md:py-16">
                <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 lg:gap-12">
                    {/* Contact Info - Desktop: Left, Mobile: Bottom */}
                    <div className="order-2 lg:order-1 space-y-6">
                        <h2 className="font-tenor text-[#283D8F] text-[24px] md:text-[28px] uppercase tracking-wide mb-6">
                            CONTACT INFO
                        </h2>

                        {/* Call Us Card */}
                        <div className="bg-white border-2 border-[#E6EDF5] rounded-sm p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#283D8F]" />
                                <h3 className="font-ubuntu text-[#283D8F] text-[16px] font-semibold uppercase tracking-wide">
                                    CALL US
                                </h3>
                            </div>
                            <p className="text-[#283D8F] text-[18px] font-medium">
                                +1 (416) 896-0190
                            </p>
                        </div>

                        {/* Email Us Card */}
                        <div className="bg-white border-2 border-[#E6EDF5] rounded-sm p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#283D8F]" />
                                <h3 className="font-ubuntu text-[#283D8F] text-[16px] font-semibold uppercase tracking-wide">
                                    EMAIL US
                                </h3>
                            </div>
                            <p className="text-[#283D8F] text-[18px] font-medium">
                                info@shinypathcleaning.ca
                            </p>
                        </div>

                        {/* Business Hours Card */}
                        <div className="bg-white border-2 border-[#E6EDF5] rounded-sm p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-[#283D8F]" />
                                <h3 className="font-ubuntu text-[#283D8F] text-[16px] font-semibold uppercase tracking-wide">
                                    BUSINESS HOURS
                                </h3>
                            </div>
                            <div className="text-[#283D8F] text-[15px] space-y-1">
                                <p>• Monday to Friday: 9am - 5pm</p>
                                <p>• Saturdays and Sundays: Upon request</p>
                                <p>• After Hours: Upon request</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Desktop: Right, Mobile: Top */}
                    <div id="contact-form" className="order-1 lg:order-2">
                        <div className="bg-white border-2 border-[#E6EDF5] rounded-sm p-6 md:p-8">
                            <h2 className="font-tenor text-[#283D8F] text-[24px] md:text-[28px] uppercase tracking-wide mb-6">
                                SEND US A MESSAGE
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={e => updateField("name", e.target.value)}
                                        className={`h-12 border-[#E6EDF5] focus:border-[#283D8F] ${errors.name ? "border-destructive" : ""
                                            }`}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={e => updateField("email", e.target.value)}
                                        className={`h-12 border-[#E6EDF5] focus:border-[#283D8F] ${errors.email ? "border-destructive" : ""
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Input
                                        type="tel"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={e => updateField("phone", e.target.value)}
                                        className={`h-12 border-[#E6EDF5] focus:border-[#283D8F] ${errors.phone ? "border-destructive" : ""
                                            }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-destructive">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Message"
                                        value={formData.message}
                                        onChange={e => updateField("message", e.target.value)}
                                        className={`min-h-[150px] border-[#E6EDF5] focus:border-[#283D8F] resize-none ${errors.message ? "border-destructive" : ""
                                            }`}
                                    />
                                    {errors.message && (
                                        <p className="text-xs text-destructive">{errors.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-[#283D8F] hover:bg-[#1f2f6f] text-white h-14 text-[15px] font-ubuntu font-semibold uppercase tracking-wide"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSubmitting ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
