
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-myanmar-light">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-6xl font-bold text-myanmar-primary mb-4">404</h1>
        <p className="text-xl text-myanmar-dark mb-8 myanmar-text">ဤစာမျက်နှာကို ရှာမတွေ့ပါ</p>
        <Button asChild>
          <Link to="/" className="myanmar-text">
            ပင်မစာမျက်နှာသို့ ပြန်သွားရန်
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
