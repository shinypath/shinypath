import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setSupabaseConfig, supabaseConfig } from '@/integrations/supabase/client';

function isValidSupabaseUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function SupabaseSetup() {
  const [url, setUrl] = useState(supabaseConfig.url ?? '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey ?? '');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return isValidSupabaseUrl(url) && anonKey.trim().length > 20;
  }, [url, anonKey]);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidSupabaseUrl(url)) {
      setError('Please enter a valid https:// Supabase URL.');
      return;
    }
    if (anonKey.trim().length < 20) {
      setError('Please enter your Supabase anon key.');
      return;
    }

    setSupabaseConfig(url, anonKey);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="font-tenor tracking-wide">Connect your Supabase</CardTitle>
          <CardDescription>
            Your app needs the Supabase URL + anon key available in the frontend build.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabase-url">Supabase URL</Label>
              <Input
                id="supabase-url"
                placeholder="https://xxxx.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supabase-anon">Supabase anon key</Label>
              <Input
                id="supabase-anon"
                placeholder="eyJhbGciOi..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This key is public (anon). Do not use your service_role key.
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              Save & Reload
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
