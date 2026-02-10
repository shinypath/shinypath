import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HouseCleaningForm } from "@/components/forms/HouseCleaningForm";
import { OfficeCleaningForm } from "@/components/forms/OfficeCleaningForm";
import { PostConstructionForm } from "@/components/forms/PostConstructionForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { Home, Building2, HardHat, Eye, MessageSquare } from "lucide-react";

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState("house");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-display text-2xl mb-1">Quote Request Forms</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview the forms as your clients see them
        </p>
      </div>

      <div className="bg-background/50 rounded-lg border p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
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
              <span className="hidden sm:inline">Post-Const.</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
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
          <TabsContent value="contact">
            <ContactForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
