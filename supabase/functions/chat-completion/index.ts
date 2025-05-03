
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, caseInformation } = await req.json();
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not found");
    }

    if (!message || !message.trim()) {
      throw new Error("Message is required");
    }

    // Create system message with case information context
    let systemMessage = "You are a legal advisor specialized in Myanmar criminal law. ";
    
    if (caseInformation) {
      systemMessage += `You are providing advice for a case with the following details: 
      Crime Type: ${caseInformation.crimeType}
      Location: ${caseInformation.location}
      Date: ${caseInformation.date}
      Suspect Information: ${caseInformation.suspectInfo}
      Witnesses: ${caseInformation.witnesses}
      Evidence: ${caseInformation.evidence}
      Additional Details: ${caseInformation.additionalDetails}`;
    }

    systemMessage += " Respond in the same language the user uses - either Burmese or English.";

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
