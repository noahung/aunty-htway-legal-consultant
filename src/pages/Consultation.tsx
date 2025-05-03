
import { useState, useEffect } from "react";
import ConsultationLayout from "@/components/ConsultationLayout";
import ChatInterface from "@/components/ChatInterface";

const Consultation = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ConsultationLayout>
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 myanmar-text text-myanmar-primary">မြန်မာပြစ်မှုဆိုင်ရာ ဥပဒေအကြံပေးနှင့် တိုင်ပင်ခြင်း</h1>
          <p className="mb-6 myanmar-text">ဤဆက်သွယ်ရေးစနစ်သည် မြန်မာနိုင်ငံ၏ ပြစ်မှုဆိုင်ရာဥပဒေများအကြောင်း ပညာရှင်အဆင့် အကြံဉာဏ်များ ရယူနိုင်ရန်အတွက် ဖြစ်ပါသည်။</p>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="w-12 h-12 border-4 border-myanmar-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-[calc(100vh-20rem)]">
              <ChatInterface />
            </div>
          )}
        </div>
      </div>
    </ConsultationLayout>
  );
};

export default Consultation;
