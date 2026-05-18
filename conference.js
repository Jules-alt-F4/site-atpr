/* =========================
   CONFÉRENCES
   Accès restreint aux membres connectés
========================= */
async function fetchConferences() {
    const listElement = document.getElementById('conference-list');
    if (!listElement) return;

    if (!window.supabase) {
        setTimeout(fetchConferences, 50);
        return;
    }

    const { data: { session } } = await window.supabase.auth.getSession();

    if (!session) {
        _showConferenceRestricted(listElement);
        // Re-écouter en cas de connexion
        window.supabase.auth.onAuthStateChange((_event, newSession) => {
            if (newSession) fetchConferences();
        });
        return;
    }

    // Session valide : charger les conférences
    const { data, error } = await window.supabase
        .from('conferences_agenda')
        .select('*')
        .order('date_evenement', { ascending: true });

    if (error) {
        console.error('Erreur Supabase:', error);
        listElement.innerHTML = `<p class="text-center opacity-50 py-4">Erreur lors de la récupération des archives.</p>`;
        return;
    }

    if (!data || data.length === 0) {
        listElement.innerHTML = `<p class="text-center opacity-30 py-8 italic uppercase tracking-widest text-[10px]">Aucune conférence programmée pour le moment.</p>`;
        return;
    }

    listElement.innerHTML = '';
    data.forEach(conf => {
        const dateObj = new Date(conf.date_evenement);
        const dateFr  = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
        listElement.innerHTML += `
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
            </div>`;
    });

    // Déconnexion en cours de navigation
    window.supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!newSession) _showConferenceRestricted(listElement);
    });
}

function _showConferenceRestricted(listElement) {
    // Afficher un message d'accès restreint directement dans le bloc conférences
    listElement.innerHTML = `
        <div style="padding:24px 16px;text-align:center;">
            <div style="font-size:1.4rem;margin-bottom:10px;opacity:0.5;">🔒</div>
            <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.18em;opacity:0.5;margin-bottom:14px;line-height:1.8;">
                Réservé aux membres de l'ATPr
            </p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                <button
                    onclick="if(typeof toggleModal==='function') toggleModal('modal-login')"
                    style="font-size:9px;text-transform:uppercase;letter-spacing:0.12em;padding:8px 18px;background:#c5a059;color:#052e16;border:none;cursor:pointer;font-weight:700;border-radius:2px;transition:opacity 0.2s;"
                    onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
                    S'identifier
                </button>
                <button
                    onclick="if(typeof toggleModal==='function') toggleModal('modal-inscription')"
                    style="font-size:9px;text-transform:uppercase;letter-spacing:0.12em;padding:8px 18px;background:transparent;color:#c5a059;border:1px solid rgba(197,160,89,0.4);cursor:pointer;font-weight:700;border-radius:2px;">
                    Devenir membre
                </button>
            </div>
        </div>`;
}

document.addEventListener('DOMContentLoaded', fetchConferences);