import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    // Laisse bien écrit "MISTRAL_API_KEY" ici. C'est le NOM du tiroir secret.
    const apiKey = Deno.env.get("MISTRAL_API_KEY")
    if (!apiKey) {
      throw new Error("La clé MISTRAL_API_KEY est manquante dans les secrets Supabase.")
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "agent_id": "ag_019e3b930bd976c49f3b562e9d08273b", // Ton ID est parfait !
        "messages": [
          { "role": "user", "content": message }
        ]
      })
    })

    const data = await response.json()
    const reply = data.choices[0].message.content

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    })
  }
})