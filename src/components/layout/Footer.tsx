import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t bg-card mt-12">
            <div className="container py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground order-2 md:order-1 text-center md:text-left">
                        © {new Date().getFullYear()} Shiny Path Cleaning. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground order-1 md:order-2">
                        <Link
                            to="/privacy-policy"
                            className="hover:text-[#283D8F] transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms-of-use"
                            className="hover:text-[#283D8F] transition-colors"
                        >
                            Terms of Use
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
