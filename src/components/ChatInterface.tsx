
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { CaseInformation } from "./CaseInformationForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DbMessage {
  id?: string;
  username: string;
  content: string;
  is_ai: boolean;
  created_at?: string;
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

  // Load chat history from database
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching chat history:", error);
          return;
        }

        if (data && data.length > 0) {
          const formattedMessages: Message[] = data.map((msg: DbMessage) => ({
            role: msg.is_ai ? "assistant" : "user",
            content: msg.content,
          }));
          setMessages(formattedMessages);
        } else if (caseInformation) {
          // If no chat history but case info exists, add initial greeting
          const greeting: Message = {
            role: "assistant",
            content: "မင်္ဂလာပါ။ ကျွန်ုပ်သည် သင့်အမှုအတွက် ဥပဒေ အကြံပေးအဖြစ် ကူညီမည့်သူ ဖြစ်ပါသည်။ အမှုအကြောင်း အချက်အလက်များအရ ကျွန်ုပ်က မှတ်ချက်ပြုရမည် ဆိုလျှင်၊ လူသတ်မှု ဖြစ်စဉ်တွင် ပြစ်မှုဆိုင်ရာဥပဒေအရ မည်သည့် အခြေအနေများကို ထည့်သွင်းစဉ်းစားရမည်ကို ကျွန်ုပ်က အကြံပြုပေးနိုင်ပါသည်။ ပြဿနာတစ်ခုခုမေးလိုပါက မေးပါ။",
          };
          
          setMessages([greeting]);
          
          // Save greeting to database
          await saveMessageToDb({
            username: "AI Assistant",
            content: greeting.content,
            is_ai: true
          });
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

    if (documentUploaded && caseInformation) {
      loadChatHistory();
    }
  }, [documentUploaded, caseInformation]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveMessageToDb = async (message: DbMessage) => {
    try {
      const { error } = await supabase
        .from("messages")
        .insert(message);

      if (error) {
        console.error("Error saving message:", error);
      }
    } catch (err) {
      console.error("Error saving message to database:", err);
    }
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
    await saveMessageToDb({
      username,
      content: input,
      is_ai: false
    });
    
    setInput("");
    setIsLoading(true);

    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("chat-completion", {
        body: {
          message: input,
          caseInformation
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      const aiResponse = data?.response || "ပြဿနာတစ်ခု ဖြစ်ပေါ်နေပါသည်။ ထပ်မံကြိုးစားပါ။";
      
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      
      // Save AI response to database
      await saveMessageToDb({
        username: "AI Assistant",
        content: aiResponse,
        is_ai: true
      });
      
    } catch (err) {
      console.error("Error calling OpenAI:", err);
      toast({
        title: "အမှားတစ်ခုဖြစ်ပွားခဲ့သည်",
        description: "AI နှင့် ဆက်သွယ်ရာတွင် ပြဿနာရှိနေပါသည်။ ထပ်မံကြိုးစားပါ။",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
