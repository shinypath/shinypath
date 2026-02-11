import { useState, useEffect } from 'react';
import {
  DEFAULT_PRICING,
  formatCurrency,
  type PricingConfig
} from '@/lib/pricing';
import { usePricing } from '@/hooks/usePricing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Save, RotateCcw, Loader2 } from 'lucide-react';

export default function PricingConfigPage() {
  const { pricing, isLoading, updatePricing, isUpdating, resetPricing, isResetting } = usePricing();
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Sync state with fetched pricing when it loads or updates externally
  useEffect(() => {
    if (pricing) {
      setConfig(pricing);
    }
  }, [pricing]);

  const handleSave = () => {
    updatePricing(config, {
      onSuccess: () => {
        setHasChanges(false);
      }
    });
  };

  const handleReset = () => {
    resetPricing(undefined, {
      onSuccess: () => {
        setHasChanges(false);
      }
    });
  };

  // ... update handlers ...

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-tenor tracking-wide text-foreground">Pricing Configuration</h2>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Manage prices for cleaning services</p>
            {pricing && (
              <p className="text-xs text-muted-foreground/80">
                Last synced from DB: {new Date().toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isResetting || isUpdating}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Pricing?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all prices to their default values. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleSave} disabled={!hasChanges || isUpdating || isResetting}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

  const updateCleaningType = (type: string, price: number) => {
        setConfig(prev => ({
          ...prev,
          cleaningTypes: {
            ...prev.cleaningTypes,
            [type]: { ...prev.cleaningTypes[type as keyof typeof prev.cleaningTypes], price }
          }
        }));
      setHasChanges(true);
  };

  const updateFrequencyDiscount = (freq: string, discount: number) => {
        setConfig(prev => ({
          ...prev,
          frequencies: {
            ...prev.frequencies,
            [freq]: { ...prev.frequencies[freq as keyof typeof prev.frequencies], discount: discount / 100 }
          }
        }));
      setHasChanges(true);
  };

  const updateExtra = (extra: string, price: number) => {
        setConfig(prev => ({
          ...prev,
          extras: {
            ...prev.extras,
            [extra]: { ...prev.extras[extra as keyof typeof prev.extras], price }
          }
        }));
      setHasChanges(true);
  };

  const updateLaundry = (value: number) => {
        setConfig(prev => ({ ...prev, laundryPerPerson: value }));
      setHasChanges(true);
  };

  const updateRoomPrice = (roomType: 'kitchens' | 'bathrooms' | 'bedrooms' | 'livingRooms', key: string, price: number) => {
        setConfig(prev => ({
          ...prev,
          [roomType]: {
            ...prev[roomType],
            [key]: price
          }
        }));
      setHasChanges(true);
  };

      return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-tenor tracking-wide text-foreground">Pricing Configuration</h2>
            <p className="text-sm text-muted-foreground">Manage prices for cleaning services</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Pricing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all prices to their default values. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={['cleaning-types']} className="space-y-4">
          {/* Cleaning Types */}
          <AccordionItem value="cleaning-types" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Cleaning Types (Base Price)
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                {Object.entries(config.cleaningTypes).map(([type, data]) => (
                  <div key={type} className="space-y-2">
                    <Label>{data.label}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={data.price}
                        onChange={(e) => updateCleaningType(type, Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Frequency Discounts */}
          <AccordionItem value="frequency" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Frequency Discounts
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
                {Object.entries(config.frequencies).map(([freq, data]) => (
                  <div key={freq} className="space-y-2">
                    <Label>{data.label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={Math.round(data.discount * 100)}
                        onChange={(e) => updateFrequencyDiscount(freq, Number(e.target.value))}
                        min={0}
                        max={100}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Kitchens */}
          <AccordionItem value="kitchens" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Kitchens
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
                {Object.entries(config.kitchens)
                  .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
                  .map(([qty, price]) => (
                    <div key={qty} className="space-y-2">
                      <Label>{qty} kitchen{qty !== '1' ? 's' : ''}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => updateRoomPrice('kitchens', qty, Number(e.target.value))}
                          min={0}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Bathrooms */}
          <AccordionItem value="bathrooms" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Bathrooms
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
                {Object.entries(config.bathrooms)
                  .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
                  .map(([qty, price]) => (
                    <div key={qty} className="space-y-2">
                      <Label>{qty} bathroom{qty !== '1' ? 's' : ''}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => updateRoomPrice('bathrooms', qty, Number(e.target.value))}
                          min={0}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Bedrooms */}
          <AccordionItem value="bedrooms" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Bedrooms
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
                {Object.entries(config.bedrooms)
                  .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
                  .map(([qty, price]) => (
                    <div key={qty} className="space-y-2">
                      <Label>{qty} bedroom{qty !== '1' ? 's' : ''}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => updateRoomPrice('bedrooms', qty, Number(e.target.value))}
                          min={0}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Living Rooms */}
          <AccordionItem value="livingRooms" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Living Rooms
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
                {Object.entries(config.livingRooms)
                  .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
                  .map(([qty, price]) => (
                    <div key={qty} className="space-y-2">
                      <Label>{qty} living room{qty !== '1' ? 's' : ''}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => updateRoomPrice('livingRooms', qty, Number(e.target.value))}
                          min={0}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Extras */}
          <AccordionItem value="extras" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Extras & Add-ons
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                {Object.entries(config.extras).map(([extra, data]) => (
                  <div key={extra} className="space-y-2">
                    <Label>{data.label}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={data.price}
                        onChange={(e) => updateExtra(extra, Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Laundry */}
          <AccordionItem value="laundry" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium">
              Laundry & Folding
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-4">
                <div className="space-y-2 max-w-xs">
                  <Label>Price per person</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      value={config.laundryPerPerson}
                      onChange={(e) => updateLaundry(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {hasChanges && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
            You have unsaved changes
          </div>
        )}
      </div>
      );
}
