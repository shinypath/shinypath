import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HouseCleaningForm } from "@/components/forms/HouseCleaningForm";
import { OfficeCleaningForm } from "@/components/forms/OfficeCleaningForm";
import { PostConstructionForm } from "@/components/forms/PostConstructionForm";
import { Home, Building2, HardHat, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Header } from "@/components/layout/Header";

export default function QuoteRequest() {
  const [activeTab, setActiveTab] = useState("house");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="container py-8 md:py-16 px-4">
        <div className="text-center mb-12 space-y-6">
          <div className="inline-block bg-[#E6EDF5] px-6 py-2 rounded-[2px]">
            <span className="text-[#283D8F] font-ubuntu font-medium text-[13px] md:text-[15px] tracking-[0.05em] uppercase">
              CLEANING QUOTE REQUEST
            </span>
          </div>

          <h1 className="font-tenor text-[#283D8F] text-[24px] md:text-[27px] leading-relaxed max-w-4xl mx-auto uppercase">
            CHOOSE YOUR OPTION AND FILL THE FORM BELOW TO GET A FREE QUOTE
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger
              value="house"
              className="flex items-center gap-2 data-[state=active]:bg-[#283D8F] data-[state=active]:text-white"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">House</span>
            </TabsTrigger>
            <TabsTrigger
              value="office"
              className="flex items-center gap-2 data-[state=active]:bg-[#283D8F] data-[state=active]:text-white"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Office</span>
            </TabsTrigger>
            <TabsTrigger
              value="post-construction"
              className="flex items-center gap-2 data-[state=active]:bg-[#283D8F] data-[state=active]:text-white"
            >
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
