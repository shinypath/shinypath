import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_PRICING, type PricingConfig } from '@/lib/pricing';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const PRICING_QUERY_KEY = ['pricing'];

export function usePricing() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: pricing, isLoading, error } = useQuery({
        queryKey: PRICING_QUERY_KEY,
        queryFn: async () => {
            // Fetch active pricing config
            const { data, error } = await supabase
                .from('pricing_settings')
                .select('config')
                .eq('is_active', true)
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error('Error fetching pricing:', error);
                // Return default pricing to prevent infinite loading
                return DEFAULT_PRICING;
            }

            if (!data) {
                // If no config exists, return default pricing for public users
                // Only admins can insert new pricing via the admin panel
                console.warn('No pricing configuration found in database, using default');
                return DEFAULT_PRICING;
            }

            // Validate structure to prevent crashes with malformed data
            const config = data.config as any;
            if (!config || !config.cleaningTypes || !config.frequencies || !config.extras) {
                console.warn("Fetched pricing config is malformed, using default.", config);
                return DEFAULT_PRICING;
            }

            return data.config as unknown as PricingConfig;
        },
        staleTime: 0, // Always consider data stale
        cacheTime: 0, // Don't cache at all
        refetchInterval: 5000, // Poll every 5 seconds as a fallback
        retry: 3,
        retryDelay: 1000,
    });

    // Subscribe to realtime changes
    useEffect(() => {
        console.log('Setting up realtime subscription for pricing_settings...');
        const channel = supabase
            .channel('pricing_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'pricing_settings',
                    // Removed filter to ensure we catch all events for debugging
                },
                (payload) => {
                    console.log('Pricing updated realtime:', payload);
                    queryClient.invalidateQueries({ queryKey: PRICING_QUERY_KEY });
                }
            )
            .subscribe((status, err) => {
                console.log('Realtime subscription status:', status);
                if (err) {
                    console.error('Realtime subscription error:', err);
                }
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Successfully subscribed to pricing_settings changes');
                }
            });

        return () => {
            console.log('Cleaning up realtime subscription...');
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    const updatePricing = useMutation({
        mutationFn: async (newConfig: PricingConfig) => {
            // We update the existing active record
            // First get the ID of the active record
            const { data: currentData } = await supabase
                .from('pricing_settings')
                .select('id')
                .eq('is_active', true)
                .limit(1)
                .maybeSingle();

            if (currentData) {
                const { error } = await supabase
                    .from('pricing_settings')
                    .update({ config: newConfig as any }) // eslint-disable-line @typescript-eslint/no-explicit-any
                    .eq('id', currentData.id);

                if (error) throw error;
            } else {
                // Fallback if somehow no record exists
                const { error } = await supabase
                    .from('pricing_settings')
                    .insert([{ config: newConfig, is_active: true }]);

                if (error) throw error;
            }
        },
        onSuccess: () => {
            // Invalidate strictly to be sure, though realtime should catch it too
            queryClient.invalidateQueries({ queryKey: PRICING_QUERY_KEY });
            toast({
                title: "Pricing updated",
                description: "The new pricing configuration has been saved.",
            });
        },
        onError: (error) => {
            console.error('Failed to update pricing:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update pricing. Please try again.",
            });
        },
    });

    const resetPricingToDefault = useMutation({
        mutationFn: async () => {
            const { data: currentData } = await supabase
                .from('pricing_settings')
                .select('id')
                .eq('is_active', true)
                .limit(1)
                .maybeSingle();

            if (currentData) {
                const { error } = await supabase
                    .from('pricing_settings')
                    .update({ config: DEFAULT_PRICING as any }) // eslint-disable-line @typescript-eslint/no-explicit-any
                    .eq('id', currentData.id);

                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRICING_QUERY_KEY });
            toast({
                title: "Pricing reset",
                description: "Pricing has been restored to default values.",
            });
        },
    });

    return {
        pricing: pricing || DEFAULT_PRICING,
        isLoading,
        error,
        updatePricing: updatePricing.mutate,
        isUpdating: updatePricing.isPending,
        resetPricing: resetPricingToDefault.mutate,
        isResetting: resetPricingToDefault.isPending,
    };
}
