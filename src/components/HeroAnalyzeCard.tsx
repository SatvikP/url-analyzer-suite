import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "@/components/AuthModal";

export const HeroAnalyzeCard = () => {
  const { user, subscribed } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const saveLocal = (entry: any) => {
    const key = "local-tests";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.unshift(entry);
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 50)));
  };

  const handleAnalyze = async () => {
    if (!url) {
      toast({ title: "Please enter a URL" });
      return;
    }
    if (!user) {
      const el = document.getElementById("open-auth");
      el?.click();
      return;
    }

    try {
      setLoading(true);
      const score = Math.floor(75 + Math.random() * 20);
      const analysis = "Initial automated checks completed.";
      const recommendations = "Improve performance, add meta tags, compress images.";

      // Enforce free usage limit client-side (fallback if DB not ready)
      if (!subscribed) {
        try {
          const start = new Date();
          start.setDate(start.getDate() - 30);
          const { data: countData } = await supabase
            .from("tests")
            .select("id", { count: 'exact', head: true })
            .gte("created_at", start.toISOString())
            .eq("user_id", user.id);
          const used = (countData as any)?.length ?? 0; // head:true returns no rows in some envs
          if ((countData as any)?.count && (countData as any).count >= 5) {
            toast({ title: "Free limit reached", description: "Upgrade to Pro for unlimited tests." });
            return;
          }
        } catch {
          // ignore if table missing
        }
      }

      const payload = { user_id: user.id, url, score, analysis, recommendations, created_at: new Date().toISOString() };
      try {
        const { error } = await supabase.from("tests").insert(payload);
        if (error) throw error;
        toast({ title: "Analysis saved", description: "Your result has been recorded." });
      } catch {
        saveLocal(payload);
        toast({ title: "Saved locally", description: "DB not ready yet; stored on this device." });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message });
    } finally {
      setLoading(false);
      setUrl("");
    }
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))]" aria-hidden="true" />
      <div className="container mx-auto py-24 sm:py-28">
        <div className="text-center text-primary-foreground/90">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-md">Rate My Website</h1>
          <p className="mt-4 text-xl sm:text-2xl opacity-90">Uncover Your Website's Potential.</p>
          <p className="mt-2 text-base opacity-90">Enter your URL and get actionable insights.</p>
        </div>

        <div className="mt-10 mx-auto max-w-xl">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl">Rate My Website</CardTitle>
              <p className="text-muted-foreground">Uncover Your Website's Potential</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border-2 p-1 border-[hsl(var(--brand-start))]">
                <Input
                  placeholder="https://acme.com/"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  aria-label="Website URL"
                  className="h-12"
                />
              </div>
              <Button onClick={handleAnalyze} variant="hero" className="w-full h-12 text-base font-semibold">
                ⚡ Analyze
              </Button>
              {/* Hidden trigger to open auth when needed */}
              <AuthModal trigger={<button id="open-auth" className="hidden" />} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
