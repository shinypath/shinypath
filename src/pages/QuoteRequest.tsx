import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HouseCleaningForm } from "@/components/forms/HouseCleaningForm";
import { OfficeCleaningForm } from "@/components/forms/OfficeCleaningForm";
import { PostConstructionForm } from "@/components/forms/PostConstructionForm";
import { Home, Building2, HardHat, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuoteRequest() {
  const [activeTab, setActiveTab] = useState("house");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-display text-xl uppercase tracking-wide">Shiny Path Cleaning</span>
          </div>
          <Link 
            to="/admin/login" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide mb-2">
            Request a Quote
          </h1>
          <p className="text-muted-foreground">
            Get an instant estimate for your cleaning needs
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="house" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">House</span>
            </TabsTrigger>
            <TabsTrigger value="office" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Office</span>
            </TabsTrigger>
            <TabsTrigger value="post-construction" className="flex items-center gap-2">
              <HardHat className="w-4 h-4" />
              <span className="hidden sm:inline">Post-Construction</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="house">
            <HouseCleaningForm />
          </TabsContent>

          <TabsContent value="office">
            <OfficeCleaningForm />
          </TabsContent>

          <TabsContent value="post-construction">
            <PostConstructionForm />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Shiny Path Cleaning. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
