import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const AuthModal = ({ trigger }: { trigger?: React.ReactNode }) => {
  const { signIn, signUp } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (mode: "signin" | "signup") => {
    try {
      setLoading(true);
      if (mode === "signin") await signIn(email, password);
      else await signUp(email, password);
      toast({ title: mode === "signin" ? "Welcome back!" : "Check your inbox", description: mode === "signin" ? "You're signed in." : "We sent you a confirmation email." });
      setOpen(false);
    } catch (e: any) {
      toast({ title: "Authentication error", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button variant="secondary">Login</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-3">
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full" onClick={() => handle("signin")} disabled={loading}>Sign In</Button>
          </TabsContent>
          <TabsContent value="signup" className="space-y-3">
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full" onClick={() => handle("signup")} disabled={loading}>Create Account</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
