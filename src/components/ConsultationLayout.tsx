
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ConsultationLayoutProps {
  children: React.ReactNode;
}

const ConsultationLayout = ({ children }: ConsultationLayoutProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/");
      return;
    }
    setUsername(storedUsername);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  if (!username) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-myanmar-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold myanmar-text">မြန်မာဥပဒေ အကြံပေး</h1>
          <div className="flex items-center gap-3">
            <span className="myanmar-text hidden sm:inline">မင်္ဂလာပါ {username}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-white border-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="myanmar-text">ထွက်ရန်</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>
      <footer className="bg-myanmar-light p-4 text-center text-sm text-myanmar-dark">
        <div className="container mx-auto myanmar-text">
          မြန်မာဥပဒေ အကြံပေး အသုံးပြုမှုသည် တရားရုံးတွင် ရှေ့နေတစ်ဦး၏ လုပ်ဆောင်မှုကို အစားထိုးခြင်း မဟုတ်ပါ။
        </div>
      </footer>
    </div>
  );
};

export default ConsultationLayout;
