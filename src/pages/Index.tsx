import { AuthProvider } from "@/contexts/AuthContext";
import { HeroAnalyzeCard } from "@/components/HeroAnalyzeCard";
import { PricingSection } from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const Header = () => {
  const { user, signOut } = useAuth();
  return (
    <header className="w-full">
      <nav className="container py-4 flex items-center justify-between">
        <a href="#" className="text-xl font-extrabold">RateMyWebsite</a>
        <div className="flex items-center gap-3">
          {user ? (
            <Button variant="secondary" onClick={signOut}>Sign Out</Button>
          ) : (
            <AuthModal />
          )}
        </div>
      </nav>
    </header>
  );
};

const Footer = () => (
  <footer className="border-t">
    <div className="container py-8 text-sm text-muted-foreground flex items-center justify-between">
      <p>© {new Date().getFullYear()} RateMyWebsite</p>
      <a href="#pricing" className="hover:underline">Pricing</a>
    </div>
  </footer>
);

const Page = () => (
  <>
    <Header />
    <main>
      <HeroAnalyzeCard />
      <div id="pricing">
        <PricingSection />
      </div>
    </main>
    <Footer />
  </>
);

const Index = () => {
  return (
    <AuthProvider>
      <Page />
    </AuthProvider>
  );
};

export default Index;
