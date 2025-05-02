
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { CaseInformation } from "./CaseInformationForm";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  documentUploaded: boolean;
  caseInformation: CaseInformation | null;
}

const ChatInterface = ({ documentUploaded, caseInformation }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const username = localStorage.getItem("username") || "အသုံးပြုသူ";

  // Add initial greeting message when component mounts or case info changes
  useEffect(() => {
    if (caseInformation && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "မင်္ဂလာပါ။ ကျွန်ုပ်သည် သင့်အမှုအတွက် ဥပဒေ အကြံပေးအဖြစ် ကူညီမည့်သူ ဖြစ်ပါသည်။ အမှုအကြောင်း အချက်အလက်များအရ ကျွန်ုပ်က မှတ်ချက်ပြုရမည် ဆိုလျှင်၊ လူသတ်မှု ဖြစ်စဉ်တွင် ပြစ်မှုဆိုင်ရာဥပဒေအရ မည်သည့် အခြေအနေများကို ထည့်သွင်းစဉ်းစားရမည်ကို ကျွန်ုပ်က အကြံပြုပေးနိုင်ပါသည်။ ပြဿနာတစ်ခုခုမေးလိုပါက မေးပါ။",
        },
      ]);
    }
  }, [caseInformation]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!documentUploaded) {
      toast({
        title: "မြန်မာပြစ်မှုဥပဒေ တင်ရန်လိုအပ်ပါသည်",
        description: "AI က အကြံပေးနိုင်ရန် ပြစ်မှုဥပဒေ PDF ဖိုင်ကို တင်ပေးရန် လိုအပ်ပါသည်။",
        variant: "destructive",
      });
      return;
    }

    if (!caseInformation) {
      toast({
        title: "အမှုအကြောင်း အချက်အလက်များ လိုအပ်ပါသည်",
        description: "အမှုအကြောင်း အချက်အလက်များကို အရင် ဖြည့်စွက်ပေးပါ။",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Here we would normally send a request to the OpenAI API
    // For this prototype, we'll simulate a response
    setTimeout(() => {
      // Check if the message is in English or Burmese
      // This is a very simple check, in a real app you'd use a proper language detection library
      const isEnglish = /^[A-Za-z\s.,!?'-]+$/.test(input);
      
      let aiResponse = "";
      if (isEnglish) {
        aiResponse = "Based on the Myanmar Penal Code and the case details you've provided, I can advise you on the legal implications of this murder case. In homicide cases, the evidence collection and witness statements are crucial. Given that there were no witnesses, forensic evidence will be particularly important. I would suggest focusing on the timeline between the death and when the body was discovered, as this can provide important context. Would you like me to explain the specific sections of the Myanmar Penal Code that might apply to this case?";
      } else {
        aiResponse = "မြန်မာပြစ်မှုဥပဒေနှင့် သင်ပေးထားသော အမှုအကြောင်း အချက်အလက်များအရ၊ ဤလူသတ်မှုအမှု၏ ဥပဒေဆိုင်ရာ သက်ရောက်မှုများကို အကြံပေးနိုင်ပါသည်။ လူသတ်မှုများတွင်၊ သက်သေခံ စုဆောင်းခြင်းနှင့် မျက်မြင်သက်သေ ထွက်ဆိုချက်များသည် အရေးကြီးပါသည်။ မျက်မြင်သက်သေမရှိခြင်းကြောင့်၊ မှုခင်းဆေးပညာဆိုင်ရာ သက်သေများသည် အထူးအရေးကြီးပါမည်။ သေဆုံးချိန်နှင့် အလောင်းတွေ့ရှိချိန်အကြား အချိန်ကာလကို အာရုံစိုက်ရန် အကြံပြုလိုပါသည်၊ ဤသည်က အရေးကြီးသော အခြေအနေများကို ပေးနိုင်ပါသည်။ ဤအမှုနှင့် သက်ဆိုင်နိုင်သော မြန်မာပြစ်မှုဥပဒေ၏ သီးခြားပုဒ်မများကို ရှင်းပြပေးစေလိုပါသလား?";
      }

      setMessages((prevMessages) => [...prevMessages, { 
        role: "assistant", 
        content: aiResponse
      }]);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="myanmar-text">ဥပဒေ အကြံပေးနှင့် စကားပြောရန်</CardTitle>
        <CardDescription className="myanmar-text">
          {documentUploaded && caseInformation ? 
            "သင့်အမှုအကြောင်း မေးခွန်းများ မေးပါ။ ဗမာလို သို့မဟုတ် အင်္ဂလိပ်လို ရေးသားနိုင်ပါသည်။" : 
            "အမှုအကြောင်း အချက်အလက်များနှင့် မြန်မာပြစ်မှုဥပဒေ PDF ဖိုင်ကို အရင် တင်ပေးပါ။"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto mb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.role === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-grow">
                  {message.role === "user" && (
                    <p className="font-medium mb-1">
                      [{username}]
                    </p>
                  )}
                  <p className="myanmar-text">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message ai-message">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="w-full flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={documentUploaded && caseInformation ? "မေးခွန်းများ ဤနေရာတွင် ရေးပါ..." : "အမှုအကြောင်း အချက်အလက်များနှင့် ပြစ်မှုဥပဒေ PDF ဖိုင်ကို အရင် တင်ပေးပါ။"}
            className="flex-grow myanmar-text resize-none"
            disabled={!documentUploaded || !caseInformation || isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
          />
          <Button 
            onClick={handleSend}
            disabled={!documentUploaded || !caseInformation || isLoading || !input.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
