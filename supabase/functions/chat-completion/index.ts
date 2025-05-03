
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hardcoded case information
const caseContext = {
  crimeType: "လူသတ်မှုနှင့် ပိုင်ဆိုင်မှုခိုးယူမှု",
  location: "အိမ်ခြံမြေတစ်ခုတွင်",
  date: "အချိန်နှင့်ရက်စွဲ မသိရှိပါ",
  suspectInfo: "ကိုစိုင်း - အိမ်ခြံမြေအရောင်းအဝယ်ပြုလုပ်သူတစ်ဦး",
  witnesses: "သက်သေမရှိပါ",
  evidence: "ဒေါက်တာထွေးထွေး၏ ခန္ဓာကိုယ်နှင့် ဆေးလုပ်ငန်းဆိုင်ရာ သက်သေအထောက်အထား",
  additionalDetails: "ကိုစိုင်းနှင့် ဒေါက်တာထွေးထွေးတို့သည် အိမ်ခြံမြေ အရောင်းအဝယ်လုပ်ငန်းတွင် အတူလုပ်ကိုင်ခဲ့ကြသည်။ တနေ့တွင် ကိုစိုင်းသည် အိမ်ခြံမြေတစ်ခုကို ကြည့်ရှုရန် ဟန်ဆောင်၍ ဒေါက်တာထွေးထွေးအား လိမ်ညာခေါ်ဆောင်သွားခဲ့သည်။ ဒေါက်တာထွေးထွေးသည် အိမ်ခြံမြေကို ကြိုက်နှစ်သက်ပါက စရန်ငွေပေးချေရန် ငွေသားအမြောက်အများ ယူဆောင်သွားခဲ့သည်။ အိမ်ခြံမြေရှိရာသို့ ရောက်ရှိသည့်အခါ ကိုစိုင်းသည် ဒေါက်တာထွေးထွေးအား ကြိုတင်စီစဉ်ထားသကဲ့သို့ အုတ်ခဲဖြင့် ဦးခေါင်းကို ရိုက်နှက်၍ သတ်ဖြတ်ခဲ့ပြီး ဒေါက်တာထွေးထွေး၏ ပိုင်ဆိုင်မှုအားလုံးကို လုယူခဲ့သည်။ ထို့နောက် ကိုစိုင်းသည် ဒေါက်တာထွေးထွေး၏ နေအိမ်နှစ်လုံးကို ဝင်ရောက်ခိုးယူခဲ့သေးသည်။"
};

// Hardcoded Myanmar Penal Code excerpts (simplified version)
const myanmarPenalCode = `
မြန်မာပြစ်မှုဆိုင်ရာဥပဒေ - အရေးကြီးသော ပုဒ်မများ

ပုဒ်မ ၃၀၂။ လူသတ်မှု
မည်သူမဆို လူသတ်မှုကျူးလွန်လျှင် သေဒဏ်ပေးရမည်၊ သို့မဟုတ် တသက်တကျွန်းဒဏ်ပေးရမည်။ ထို့ပြင် ငွေဒဏ်လည်း ချမှတ်နိုင်သည်။

ပုဒ်မ ၃၀၄။ လူသေစေရန် ရည်ရွယ်ချက်မရှိဘဲ လူသေစေမှု
မည်သူမဆို လူသေစေရန် ရည်ရွယ်ချက်မရှိဘဲ သေစေခဲ့လျှင် တဆယ်နှစ်ထိ ထောင်ဒဏ်ချမှတ်နိုင်သည်။ ထို့ပြင် ငွေဒဏ်လည်း ချမှတ်နိုင်သည်။

ပုဒ်မ ၃၇၉။ ခိုးမှု
မည်သူမဆို ခိုးမှုကျူးလွန်လျှင် သုံးနှစ်အထိ ထောင်ဒဏ်ချမှတ်နိုင်သည်။ ထို့ပြင် ငွေဒဏ်လည်း ချမှတ်နိုင်သည်။

ပုဒ်မ ၃၈၂။ လူအသက်သေစေရန် ခြိမ်းခြောက်၍ ခိုးမှု
မည်သူမဆို လူအသက်သေစေရန် ခြိမ်းခြောက်၍ ခိုးမှုကျူးလွန်လျှင် ဆယ်နှစ်အထိ ထောင်ဒဏ်ချမှတ်နိုင်သည်။ ထို့ပြင် ငွေဒဏ်လည်း ချမှတ်နိုင်သည်။

ပုဒ်မ ၃၉၂။ လုယက်မှု
မည်သူမဆို လုယက်မှုကျူးလွန်လျှင် ဆယ်နှစ်အထိ ထောင်ဒဏ်ချမှတ်နိုင်သည်။ ထို့ပြင် ငွေဒဏ်လည်း ချမှတ်နိုင်သည်။

ပုဒ်မ ၃၉၆။ လူသတ်လုယက်မှု
မည်သူမဆို လုယက်မှုကျူးလွန်ရာတွင် လူသတ်မှုပါ ကျူးလွန်လျှင် သေဒဏ်ပေးရမည်၊ သို့မဟုတ် တသက်တကျွန်းဒဏ်ပေးရမည်။ ထို့ပြင် ငွေဒဏ်လည်း ချမှတ်နိုင်သည်။

ပုဒ်မ ၄၅၇။ ညအချိန်တွင် အိမ်ခြံအတွင်း ဝင်ရောက်ခိုးယူမှု
မည်သူမဆို ညအချိန်တွင် အိမ်ခြံအတွင်း ဖျက်ဆီး၍ ခိုးယူလျှင် ဆယ်နှစ်အထိ ထောင်ဒဏ်ချမှတ်နိုင်သည်။ ငွေဒဏ်လည်း ချမှတ်နိုင်သည်။

ပုဒ်မ ၃၇။ ပြစ်မှုတစ်ခုထက်မက ကျူးလွန်လျှင် ပြစ်ဒဏ်ကို ပိုမိုပြင်းထန်စွာ ချမှတ်နိုင်သည်။
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not found");
    }

    if (!message || !message.trim()) {
      throw new Error("Message is required");
    }

    // Create system message with hardcoded case information and penal code
    const systemMessage = `သင်သည် မြန်မာပြစ်မှုဥပဒေတွင် အထူးကျွမ်းကျင်သော ဥပဒေအကြံပေးတစ်ဦး ဖြစ်သည်။ အောက်ပါ မြန်မာပြစ်မှုဥပဒေကို သင်ကောင်းမွန်စွာ နားလည်သည်:

${myanmarPenalCode}

သင်သည် ဤအမှုအကြောင်းအရာကို အကြံဉာဏ်ပေးရန် ဖြစ်သည်:

${caseContext.additionalDetails}

သင်သည် မေးခွန်းများကို မြန်မာဘာသာဖြင့် တုံ့ပြန်ရမည်။ ဥပဒေဆိုင်ရာ အထူးကျွမ်းကျင်သူတစ်ဦးပီပီ ပညာရပ်ဆိုင်ရာ ဘာသာရပ်အသုံးအနှုန်းများ၊ ရှင်းလင်းသော ဥပဒေဆိုင်ရာ အကြံပေးခြင်းနှင့် ဥပဒေပုဒ်မများကို ကိုးကားရှင်းလင်း၍ အသေးစိတ်ဖြေဆိုပေးရန် ဖြစ်သည်။`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from OpenAI API");
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
