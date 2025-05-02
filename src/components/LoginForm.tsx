
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if password matches the hardcoded password
    if (password === "ZoologyProf") {
      // Save username to localStorage for use in chat
      localStorage.setItem("username", username);
      
      setTimeout(() => {
        setLoading(false);
        navigate("/consultation");
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "မှားယွင်းနေပါသည်",
          description: "စကားဝှက် မှားယွင်းနေပါသည်။ ထပ်စမ်းကြည့်ပါ။",
          variant: "destructive",
        });
      }, 1000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center myanmar-text">မြန်မာဥပဒေ အကြံပေး</CardTitle>
        <CardDescription className="text-center myanmar-text">
          ဝင်ရောက်ရန် သင့်အမည်နှင့် စကားဝှက်ကို ထည့်သွင်းပါ။
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="username" className="myanmar-text">အမည်</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="myanmar-text"
                placeholder="သင့်အမည် သို့ အမျိုးအမည်"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="myanmar-text">စကားဝှက်</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="myanmar-text"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? (
                <span className="myanmar-text">ဝင်ရောက်နေသည်...</span>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  <span className="myanmar-text">ဝင်ရောက်ရန်</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <p className="myanmar-text">
          မိသားစုဝင်များသာ အသုံးပြုနိုင်သည့် ဝန်ဆောင်မှု
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
