
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
  username: string;
}

interface DbMessage {
  id?: string;
  username: string;
  content: string;
  is_ai: boolean;
  created_at?: string;
}

const ChatInterface = () => {
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
            username: msg.username, // Include the username from the database
          }));
          setMessages(formattedMessages);
        } else {
          // If no chat history, add initial greeting
          const greeting: Message = {
            role: "assistant",
            content: "မင်္ဂလာပါ။ ကျွန်ုပ်သည် မြန်မာပြစ်မှုဥပဒေနှင့် ပတ်သက်၍ အထူးအကြံဉာဏ်ပေးသည့် ဥပဒေအကြံပေးတစ်ဦး ဖြစ်ပါသည်။ ကိုစိုင်းနှင့် ဒေါက်တာထွေးထွေးတို့၏ အမှုကိစ္စနှင့်ပတ်သက်၍ သင့်မေးခွန်းများကို မေးမြန်းနိုင်ပါပြီ။",
            username: "ဥပဒေအကြံပေး"
          };
          
          setMessages([greeting]);
          
          // Save greeting to database
          await saveMessageToDb({
            username: "ဥပဒေအကြံပေး",
            content: greeting.content,
            is_ai: true
          });
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };

    loadChatHistory();
  }, []);

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

    const userMessage: Message = {
      role: "user",
      content: input,
      username: username,
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
          message: input
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      const aiResponse = data?.response || "ပြဿနာတစ်ခု ဖြစ်ပေါ်နေပါသည်။ ထပ်မံကြိုးစားပါ။";
      
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        username: "ဥပဒေအကြံပေး"
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      
      // Save AI response to database
      await saveMessageToDb({
        username: "ဥပဒေအကြံပေး",
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
    <div className="w-full h-full flex flex-col rounded-lg border overflow-hidden">
      <div className="bg-myanmar-primary text-white p-4">
        <h2 className="text-lg font-medium myanmar-text">ဥပဒေအကြံပေးနှင့် စကားပြောရန်</h2>
        <p className="text-sm myanmar-text text-gray-100">
          မြန်မာဘာသာဖြင့် သို့မဟုတ် အင်္ဂလိပ်ဘာသာဖြင့် မေးခွန်းများ မေးနိုင်ပါသည်။
        </p>
      </div>
      
      <div className="flex-grow overflow-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === "user" 
                  ? "bg-blue-100 ml-12" 
                  : "bg-myanmar-light mr-12"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-grow">
                  {message.role === "user" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6 bg-blue-300">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-gray-700">
                        [{message.username}]
                      </p>
                    </div>
                  )}
                  {message.role === "assistant" && (
                    <p className="font-medium mb-1 text-myanmar-primary">
                      [ဥပဒေအကြံပေး]
                    </p>
                  )}
                  <p className="myanmar-text whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="p-4 rounded-lg bg-myanmar-light mr-12">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-myanmar-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-myanmar-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-myanmar-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-4 bg-white">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="မေးခွန်းများ ဤနေရာတွင် ရေးပါ..."
            className="flex-grow myanmar-text resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
          />
          <Button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 bg-myanmar-primary hover:bg-myanmar-primary-dark"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
