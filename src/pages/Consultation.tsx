
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2 myanmar-text text-myanmar-primary">အန်တီထွေးအမှုအတွက် ဥပဒေအကြံပေးနှင့် တိုင်ပင်ခြင်း</h1>
              <p className="mb-3 myanmar-text">ဤဆက်သွယ်ရေးစနစ်သည် မြန်မာနိုင်ငံ၏ ပြစ်မှုဆိုင်ရာဥပဒေများအကြောင်း ပညာရှင်အဆင့် အကြံဉာဏ်များ ရယူနိုင်ရန်အတွက် ဖြစ်ပါသည်။</p>
            </div>
            
            <div className="bg-myanmar-light p-3 rounded-lg shadow-sm mb-4 md:mb-0 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-myanmar-primary mb-2">
                <img 
                  src="/lovable-uploads/27373df5-fa38-44df-9e3a-f1d9cad8e26b.png" 
                  alt="Dr. Htway Htway" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-center myanmar-text font-medium">အန်တီထွေး အား ဂုဏ်ပြုသတိရခြင်း</p>
            </div>
          </div>
          
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
