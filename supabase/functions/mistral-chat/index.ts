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

    const apiKey = Deno.env.get("MISTRAL_API_KEY")
    if (!apiKey) {
      throw new Error("La clé MISTRAL_API_KEY est manquante dans les secrets Supabase.")
    }

    const response = await fetch("https://api.mistral.ai/v1/agents/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "agent_id": "ag_019e3c1e0f597401a748995a31866ad3",
        "messages": [
          { "role": "user", "content": message }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Erreur Mistral ${response.status} : ${JSON.stringify(data)}`)
    }

    if (!data.choices || !data.choices[0]) {
      throw new Error("Réponse Mistral invalide : " + JSON.stringify(data))
    }

    const reply = data.choices[0].message.content

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    })

  } catch (error) {
    console.error("Erreur :", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    })
  }
})