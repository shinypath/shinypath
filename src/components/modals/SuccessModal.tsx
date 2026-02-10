import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface SuccessModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SuccessModal({ open, onOpenChange }: SuccessModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-[95%] rounded-lg border-2 border-[#283D8F]/10">
                <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-8 pb-4">
                    <DialogTitle className="text-2xl font-display tracking-wide text-center">
                        Thanks for contacting us!
                    </DialogTitle>

                    <DialogDescription className="text-base text-foreground/80 leading-relaxed space-y-4 text-center">
                        <p>
                            We're excited to help make your space shine. We've received your message and will be in touch very soon via SMS, phone call, or email to get things started.
                        </p>
                        <p className="font-medium pt-2">
                            Talk to you shortly,<br />
                            The Shiny Path Team
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center pb-4">
                    <a href="https://shinypathcleaning.ca" className="inline-block">
                        <button className="bg-[#283D8F] text-white px-8 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-[#283D8F]/90 transition-colors">
                            Back to Homepage
                        </button>
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}
