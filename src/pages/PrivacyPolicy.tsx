import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container py-16 px-4 max-w-4xl mx-auto">
                <h1 className="font-tenor text-[#283D8F] text-[32px] md:text-[40px] uppercase mb-8 border-b pb-4">
                    Privacy Policy
                </h1>

                <div className="prose prose-blue max-w-none space-y-6 text-[#283D8F]/80 font-ubuntu">
                    <section>
                        <p className="font-medium text-[#283D8F]">Last Updated: February 18, 2026</p>
                        <p>
                            At Shiny Path Cleaning, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when using our website and services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">1. Information We Collect</h2>
                        <p>We collect personal information that you provide to us when you request a quote, book a service, or contact us. This may include:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Contact Information: Name, email address, phone number, and physical address.</li>
                            <li>Service Details: Information about your property, cleaning preferences, and specific instructions.</li>
                            <li>Payment Information: We process payments through secure third-party providers. We do not store full credit card details on our servers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate cleaning quotes and schedule services.</li>
                            <li>Communicate with you regarding your bookings and inquiries.</li>
                            <li>Process payments and manage your account.</li>
                            <li>Improve our website, services, and customer experience.</li>
                            <li>Send occasional promotional emails or updates (you may opt-out at any time).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">3. Data Protection and Sharing</h2>
                        <p>
                            Your privacy is paramount. We do not sell, rent, or trade your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business (e.g., payment processors), provided they agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">4. Cookies and Tracking</h2>
                        <p>
                            Our website may use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us analyze web traffic and remember your preferences. You can choose to disable cookies in your browser settings, although this may affect some functionality of our site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">5. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or request the deletion of your personal information at any time. To exercise these rights, please contact us at the email address provided below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">6. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this Privacy Policy, please contact us at:
                        </p>
                        <div className="mt-4 p-4 bg-[#F5F8FC] rounded-sm">
                            <p><strong>Shiny Path Cleaning</strong></p>
                            <p>Email: info@shinypathcleaning.ca</p>
                            <p>Website: https://shinypathcleaning.ca</p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
