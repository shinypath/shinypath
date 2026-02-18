import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container py-16 px-4 max-w-4xl mx-auto">
                <h1 className="font-tenor text-[#283D8F] text-[32px] md:text-[40px] uppercase mb-8 border-b pb-4">
                    Terms of Use
                </h1>

                <div className="prose prose-blue max-w-none space-y-6 text-[#283D8F]/80 font-ubuntu">
                    <section>
                        <p className="font-medium text-[#283D8F]">Last Updated: February 18, 2026</p>
                        <p>
                            Welcome to Shiny Path Cleaning. By accessing or using our website and services, you agree to be bound by these Terms of Use. Please read them carefully.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">1. Acceptance of Terms</h2>
                        <p>
                            By using our website (https://shinypathcleaning.ca), you confirm that you have read, understood, and agreed to these Terms of Use and our Privacy Policy. If you do not agree, please refrain from using our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">2. Service Description</h2>
                        <p>
                            Shiny Path Cleaning provides cleaning services for residential, office, and post-construction properties. Quotes provided through our website are estimates based on the information provided and may be subject to adjustment upon physical inspection or changes in scope.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">3. User Obligations</h2>
                        <p>
                            When using our quote forms and booking services, you agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate, current, and complete information.</li>
                            <li>Provide a safe working environment for our cleaning staff.</li>
                            <li>Give at least 24 hours notice for any cancellations or rescheduling.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">4. Limitation of Liability</h2>
                        <p>
                            Shiny Path Cleaning and its employees shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services, including but not limited to loss of profits or data. Our maximum liability shall not exceed the total amount paid for the service in question.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">5. Intellectual Property</h2>
                        <p>
                            All content on this website, including text, logos, designs, and images, is the property of Shiny Path Cleaning and is protected by copyright and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">6. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to this website. Your continued use of our services constitutes acceptance of the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">7. Governing Law</h2>
                        <p>
                            These Terms of Use are governed by the laws of our operating jurisdiction. Any disputes shall be subject to the exclusive jurisdiction of the local courts.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#283D8F] uppercase">8. Contact Info</h2>
                        <p>
                            If you have any questions regarding these Terms of Use, please contact us at info@shinypathcleaning.ca.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
