import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PlanCard = ({ title, price, features, cta, onClick }: { title: string; price: string; features: string[]; cta: string; onClick?: () => void }) => (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <p className="text-muted-foreground">{price}</p>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 mb-6 list-disc pl-5">
        {features.map((f) => (
          <li key={f} className="text-sm text-foreground/80">{f}</li>
        ))}
      </ul>
      <Button className="w-full" onClick={onClick}>{cta}</Button>
    </CardContent>
  </Card>
);

export const PricingSection = () => {
  const { user, subscribed } = useAuth();

  const startCheckout = async () => {
    if (!user) {
      toast({ title: "Please sign in first" });
      return;
    }
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast({ title: "Checkout error", description: e.message });
    }
  };

  const openPortal = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast({ title: "Portal error", description: e.message });
    }
  };

  return (
    <section className="py-20">
      <div className="container">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold">Pricing</h2>
          <p className="text-muted-foreground mt-2">Choose the plan that fits your needs.</p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlanCard
            title="Free"
            price="Free • 5 tests / month"
            features={["5 analyses per month", "Basic insights", "Email support"]}
            cta={subscribed ? "You're Subscribed" : "Get Started"}
            onClick={() => toast({ title: "You're on the Free plan" })}
          />
          <PlanCard
            title="Pro"
            price="$49 / month"
            features={["Unlimited analyses", "Deeper recommendations", "Priority support"]}
            cta={subscribed ? "Manage Subscription" : "Upgrade to Pro"}
            onClick={subscribed ? openPortal : startCheckout}
          />
          <PlanCard
            title="Enterprise"
            price="Custom"
            features={["Usage-based pricing", "SLA & onboarding", "Dedicated support"]}
            cta="Contact Us"
            onClick={() => (window.location.href = "mailto:sales@example.com?subject=Enterprise%20Inquiry")}
          />
        </div>
      </div>
    </section>
  );
};
