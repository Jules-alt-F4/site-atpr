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
    const { message, history, context, mode, pdfContent } = await req.json()

    const apiKey = Deno.env.get("MISTRAL_API_KEY")
    if (!apiKey) throw new Error("Clé MISTRAL_API_KEY manquante.")

    // Construction du prompt système enrichi selon le mode
    let systemPrompt = `Tu es le Mage du Tutorat, un assistant pédagogique expert et bienveillant de l'ATPr (Association du Tutorat de Pharmacie de Rennes).
Tu aides les étudiants en pharmacie (P2, P3, P4, P5) à réviser leurs cours, comprendre des notions complexes de pharmacie, et préparer leurs examens.
Tu réponds toujours en français, avec un ton chaleureux, précis et pédagogique.`

    if (context) {
      systemPrompt += `\n\nContexte actuel : L'étudiant consulte la page "${context}". Adapte tes réponses à ce contexte.`
    }

    if (pdfContent) {
      systemPrompt += `\n\nContenu du document fourni par l'étudiant :\n"""\n${pdfContent}\n"""\nBase tes réponses sur ce contenu en priorité.`
    }

    if (mode === 'qcm') {
      systemPrompt += `\n\nMODE QCM ACTIVÉ : Génère exactement 5 questions à choix multiples (A, B, C, D) avec les bonnes réponses et explications à la fin. Format :
**Question N : [intitulé]**
A) ...
B) ...
C) ...
D) ...
✅ Réponse : [lettre] — [explication courte]`
    } else if (mode === 'fiche') {
      systemPrompt += `\n\nMODE FICHE ACTIVÉ : Génère une fiche mémo structurée avec : titre, définition, points clés (bullet points), à retenir, et un moyen mnémotechnique si possible.`
    } else if (mode === 'resume') {
      systemPrompt += `\n\nMODE RÉSUMÉ ACTIVÉ : Fais un résumé clair et concis en bullet points, organisé par thèmes. Maximum 200 mots.`
    }

    // Construction des messages avec historique
    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []),
      { role: "user", content: message }
    ]

    const response = await fetch("https://api.mistral.ai/v1/agents/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        agent_id: "ag_019e3c1e0f597401a748995a31866ad3",
        messages
      })
    })

    const data = await response.json()

    if (!response.ok) throw new Error(`Erreur Mistral ${response.status} : ${JSON.stringify(data)}`)
    if (!data.choices?.[0]) throw new Error("Réponse Mistral invalide : " + JSON.stringify(data))

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