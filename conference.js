 type="module"
    import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

    const supabaseUrl = 'https://zcueonuffhzrvnktxzpl.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWVvbnVmZmh6cnZua3R4enBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODkzODQsImV4cCI6MjA5NDI2NTM4NH0.oq8tqUKohvmiRkopSRu4BBx9OfaVXsgXhY3MxIkfZD0';

    // Initialisation de Supabase avec persistance de la session
    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            storage: {
                getItem: (key) => localStorage.getItem(key),
                setItem: (key, value) => localStorage.setItem(key, value),
                removeItem: (key) => localStorage.removeItem(key),
            },
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });

    // Rendre `supabase` accessible globalement
    window.supabase = supabase;

    // Vérifier la session au chargement de la page
    document.addEventListener('DOMContentLoaded', async () => {
        await loadNavbar(); // Charge la navbar
        await updateUI();  // Met à jour l'UI en fonction de la session
    });

async function fetchConferences() {
    const listElement = document.getElementById('conference-list');
    
    // 1. Récupération des données depuis Supabase
    const { data, error } = await window.supabase
        .from('conferences')
        .select('*')
        .order('date_evenement', { ascending: true });

    // 2. Gestion des erreurs
    if (error) {
        console.error('Erreur Supabase:', error);
        listElement.innerHTML = `<p class="text-center opacity-50 py-4">Erreur lors de la récupération des archives.</p>`;
        return;
    }

    // 3. Si aucune conférence n'est prévue
    if (!data || data.length === 0) {
        listElement.innerHTML = `<p class="text-center opacity-30 py-8 italic uppercase tracking-widest text-[10px]">Aucune conférence programmée pour le moment.</p>`;
        return;
    }

    // 4. Nettoyage du loader et affichage des données
    listElement.innerHTML = '';

    data.forEach(conf => {
        // Formatage de la date (ex: 12 Octobre)
        const dateObj = new Date(conf.date_evenement);
        const options = { day: 'numeric', month: 'long' };
        const dateFr = dateObj.toLocaleDateString('fr-FR', options);

        const card = `
            <div class="flex items-center justify-between p-6 border-b border-[#c5a059]/10 hover:bg-[#c5a059]/5 transition-all duration-500 group">
                <div class="flex flex-col">
                    <span class="text-[9px] text-[#c5a059] uppercase tracking-[0.3em] mb-2 font-bold">${conf.ue || 'Général'}</span>
                    <h4 class="font-heritage italic text-2xl text-white/90 group-hover:text-[#c5a059] transition-colors">${conf.titre}</h4>
                    <p class="text-[10px] opacity-50 uppercase tracking-widest mt-2">Intervenant : ${conf.intervenant}</p>
                </div>
                <div class="text-right">
                    <p class="font-heritage text-xl text-[#c5a059]">${dateFr}</p>
                    <p class="text-[9px] opacity-40 uppercase tracking-[0.2em] mt-1">${conf.heure.substring(0,5)} — ${conf.salle}</p>
                </div>
            </div>
        `;
        listElement.innerHTML += card;
    });
}

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', fetchConferences);
