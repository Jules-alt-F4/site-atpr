/* =========================
   INJECTION DE LA NAVBAR
========================= */
function injectNavbar() {
    // 1. Sécurité : Ne pas injecter deux fois
    if (document.getElementById('main-nav')) return;

    // 2. Le HTML de la barre
    const navHTML = `
    <nav id="main-nav" class="nav-floating">
        <div class="nav-left">
            <a href="index.html" class="logo-text">ATPr</a>
        </div>
        <div class="nav-center-group">
            <a href="index.html#presentation-association" class="nav-link">L'Institution</a>
            <a href="bureau.html" class="nav-link">Le Bureau</a>
            <a href="bibliotheque.html" class="nav-link">Bibliothèque</a>
        </div>
        <div class="nav-right">
            <div id="auth-guest" class="auth-flex">
                <button type="button" onclick="toggleModal('modal-login')" class="nav-link-auth">Connexion</button>
                <button type="button" onclick="toggleModal('modal-inscription')" class="btn-join">S'inscrire</button>
            </div>
            <div id="auth-user" class="auth-flex" style="display:none">
                <button type="button" onclick="openCompte()" class="nav-link-auth">Mon Compte</button>
                <button type="button" onclick="handleLogout()" class="btn-join">Déconnexion</button>
            </div>
        </div>
    </nav>`;

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // 3. Une fois la navbar injectée, on attend que Supabase soit prêt
    //    puis on branche le listener temps réel
    waitForSupabaseThenListen();
}

/* =========================
   ATTENTE DE SUPABASE
========================= */
function waitForSupabaseThenListen() {
    // Supabase peut ne pas être encore initialisé au moment de l'injection,
    // on retente toutes les 50ms jusqu'à ce qu'il soit disponible.
    if (!window.supabase) {
        setTimeout(waitForSupabaseThenListen, 50);
        return;
    }

    // Lecture de la session actuelle (pour l'état initial au chargement)
    window.supabase.auth.getSession().then(({ data: { session } }) => {
        applyAuthState(session);
    });

    // Listener temps réel : se déclenche à chaque connexion / déconnexion
    window.supabase.auth.onAuthStateChange((_event, session) => {
        applyAuthState(session);
    });
}

/* =========================
   LOGIQUE D'AFFICHAGE (UI)
========================= */
function applyAuthState(session) {
    const guest = document.getElementById('auth-guest');
    const user  = document.getElementById('auth-user');
    if (!guest || !user) return;

    if (session) {
        // Utilisateur connecté → afficher "Mon Compte / Déconnexion"
        guest.style.display = 'none';
        user.style.display  = 'flex';
    } else {
        // Aucune session → afficher "Connexion / S'inscrire"
        user.style.display  = 'none';
        guest.style.display = 'flex';
    }
}

// Compatibilité ascendante (appelée depuis auth.js si besoin)
window.updateUI = function() {
    if (!window.supabase) return;
    window.supabase.auth.getSession().then(({ data: { session } }) => {
        applyAuthState(session);
    });
};

/* =========================
   FONCTIONS GLOBALES
========================= */
window.toggleModal = function(id) {
    const m = document.getElementById(id);
    if (!m) return;

    const isOpening = (m.style.display === 'none' || m.style.display === '');

    if (isOpening) {
        // Compenser la scrollbar avant de la cacher
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
        m.style.display = 'flex';
        document.body.classList.add('modal-open');
    } else {
        m.style.display = 'none';
        // Retirer modal-open seulement si aucune autre modale n'est ouverte
        const anyOpen = Array.from(document.querySelectorAll('.modal-overlay'))
            .some(el => el.style.display === 'flex');
        if (!anyOpen) {
            document.body.classList.remove('modal-open');
            document.documentElement.style.setProperty('--scrollbar-width', '0px');
        }
    }
};

window.openCompte = async function() {
    if (!window.supabase) return;
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) return;

    const user = session.user;
    const meta = user.user_metadata || {};

    // Infos figées
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    set('compte-prenom', meta.prenom || meta.first_name);
    set('compte-nom',    meta.nom    || meta.last_name);
    set('compte-promo',  meta.promo  || meta.promotion);
    set('compte-email',  user.email);

    // Réinitialiser le formulaire mdp
    ['compte-mdp-nouveau', 'compte-mdp-confirm'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    const msg = document.getElementById('compte-mdp-msg');
    if (msg) { msg.textContent = ''; msg.style.display = 'none'; }

    window.toggleModal('modal-compte');
};

window.handleChangePassword = async function() {
    const nouveau  = document.getElementById('compte-mdp-nouveau')?.value || '';
    const confirm  = document.getElementById('compte-mdp-confirm')?.value || '';
    const msg      = document.getElementById('compte-mdp-msg');

    const showMsg = (text, color) => {
        if (!msg) return;
        msg.textContent = text;
        msg.style.color = color;
        msg.style.display = 'block';
    };

    if (!nouveau || nouveau.length < 6) return showMsg('Le mot de passe doit contenir au moins 6 caractères.', '#dc2626');
    if (nouveau !== confirm)            return showMsg('Les mots de passe ne correspondent pas.', '#dc2626');

    const { error } = await window.supabase.auth.updateUser({ password: nouveau });

    if (error) return showMsg(error.message, '#dc2626');

    showMsg('Mot de passe mis à jour avec succès.', '#16a34a');
    document.getElementById('compte-mdp-nouveau').value = '';
    document.getElementById('compte-mdp-confirm').value = '';
};

window.handleLogout = async function() {
    await window.supabase.auth.signOut();
    window.location.reload();
};

window.handleLibraryAccess = async function(e) {
    e.preventDefault();
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) {
        window.toggleModal('modal-library-error');
    } else {
        window.location.href = 'bibliotheque.html';
    }
};

// Lancement automatique
document.addEventListener('DOMContentLoaded', injectNavbar);