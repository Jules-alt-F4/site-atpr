async function fetchConferences() {
    const { data, error } = await window.supabase
        .from('conferences')
        .select('*')
        .order('date_evenement', { ascending: true });

    const listElement = document.getElementById('conference-list');

    if (error) {
        console.error('Erreur:', error);
        listElement.innerHTML = "<p class='text-center opacity-50'>Erreur de chargement des conférences.</p>";
        return;
    }

    if (data.length === 0) {
        listElement.innerHTML = "<p class='text-center opacity-50 italic'>Aucune conférence prévue prochainement.</p>";
        return;
    }

    // On vide le message de chargement
    listElement.innerHTML = '';

    // On génère le HTML pour chaque conférence
    data.forEach(conf => {
        const dateFr = new Date(conf.date_evenement).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long'
        });

        listElement.innerHTML += `
            <div class="flex items-center justify-between p-4 border-b border-[#c5a059]/10 hover:bg-[#c5a059]/5 transition-colors group">
                <div class="flex flex-col">
                    <span class="text-[10px] text-[#c5a059] uppercase tracking-widest mb-1">${conf.ue}</span>
                    <h4 class="font-heritage italic text-xl text-white/90">${conf.titre}</h4>
                    <p class="text-[10px] opacity-50 uppercase tracking-tighter mt-1">Avec ${conf.intervenant}</p>
                </div>
                <div class="text-right">
                    <p class="font-heritage text-lg text-[#c5a059]">${dateFr}</p>
                    <p class="text-[9px] opacity-40 uppercase tracking-widest">${conf.heure} — ${conf.salle}</p>
                </div>
            </div>
        `;
    });
}

// Appeler la fonction au chargement
document.addEventListener('DOMContentLoaded', fetchConferences);
