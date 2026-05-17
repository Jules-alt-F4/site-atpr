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
            <a href="/index.html" class="logo-text" style="display:flex;align-items:center;gap:8px;">
                <img src="https://zcueonuffhzrvnktxzpl.supabase.co/storage/v1/object/public/images-atpr/logo-noir-atpr.png"
                     alt="Logo ATPr"
                     style="height:52px;width:auto;object-fit:contain;flex-shrink:0;">
            </a>
        </div>
        <div class="nav-center-group">
            <a href="/index.html#presentation-association" class="nav-link">L'Institution</a>
            <a href="bureau.html" class="nav-link">Le Bureau</a>
            <a href="/bibliotheque.html" class="nav-link">Bibliothèque</a>
            <a href="pole-methodo.html" class="nav-link">Pôle Méthodo</a>
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

    // ── MODALES injectées sur toutes les pages ──────────────────────────────
    const modalesHTML = `

<div id="modal-login" class="modal-overlay" onclick="if(event.target === this) toggleModal('modal-login')" style="display:none">
    <div class="max-w-4xl mx-auto flex flex-col md:flex-row auth-frame-gold w-full mx-4">
        <div class="auth-column auth-column-left"></div>
        <div class="auth-column auth-column-right"></div>
        <button onclick="toggleModal('modal-login')" class="absolute top-4 right-4 z-50 text-black/40 hover:text-black">✕</button>
        <div class="md:w-1/3 bg-[#052e16] p-12 text-white flex flex-col justify-center relative overflow-hidden">
            <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/marble-white.png')]"></div>
            <span class="text-[10px] tracking-[0.06em] uppercase text-[#c5a059] mb-4 block z-10">Authentification</span>
            <h2 class="text-4xl font-heritage italic mb-6 z-10 leading-tight">Accès <br>Membres</h2>
            <div class="h-[1px] w-20 bg-[#c5a059] mb-6 z-10"></div>
            <p class="text-[12px] leading-loose opacity-60 z-10 tracking-[0.08em] uppercase">Entrez dans l&apos;espace privé de l&apos;institution.</p>
        </div>
        <div class="md:w-2/3 p-12 relative bg-[#f5f2e8]">
            <div class="auth-column auth-column-left"></div>
            <div class="auth-column auth-column-right"></div>
            <div class="relative z-10">
                <h3 class="auth-title">Connexion</h3>
                <form onsubmit="handleLogin(event)" class="space-y-6">
                    <div>
                        <label class="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50 block text-black">Email Académique</label>
                        <input type="email" id="login-email" class="auth-input" placeholder="prenom.nom@etudiant.univ-rennes.fr" required>
                    </div>
                    <div>
                        <label class="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50 block text-black">Mot de passe</label>
                        <input type="password" id="login-password" class="auth-input" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="auth-submit-btn w-full shadow-sm">Se connecter au portail</button>
                </form>
                <div class="mt-10 text-center border-t border-black/5 pt-8">
                    <p class="text-[9px] uppercase tracking-[0.08em] opacity-40 mb-2 text-black">Pas encore membre de l&apos;ATPr ?</p>
                    <button onclick="toggleModal('modal-login'); toggleModal('modal-inscription')" class="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider hover:underline">Créer un compte adhésion</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="modal-inscription" class="modal-overlay" onclick="if(event.target === this) toggleModal('modal-inscription')" style="display:none">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row shadow-2xl relative auth-frame-gold w-full mx-4">
        <button onclick="toggleModal('modal-inscription')" class="absolute top-4 right-4 z-50 text-black/40 hover:text-black">✕</button>
        <div class="md:w-5/12 bg-[#052e16] p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/marble-white.png')]"></div>
            <div class="relative z-10">
                <h2 class="text-5xl font-heritage italic mb-8 leading-tight">Rejoindre l&apos;Excellence</h2>
                <p class="text-[12px] leading-loose opacity-60 z-10 tracking-[0.08em] uppercase">L&apos;adhésion à l&apos;ATPr est exclusivement réservée aux étudiants et personnels de l&apos;UFR Pharmacie de Rennes.</p>
            </div>
            <div class="mt-12 pt-8 border-t border-white/10 relative z-10">
                <p class="text-[9px] uppercase tracking-[0.1em] opacity-50">Association du tutorat de pharmacie rennais</p>
            </div>
        </div>
        <div class="md:w-7/12 p-12 relative bg-[#f5f2e8]">
            <div class="auth-column auth-column-left"></div>
            <div class="auth-column auth-column-right"></div>
            <div class="relative z-10">
                <form id="form-inscription" onsubmit="handleSignup(event)" class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <h3 class="auth-title col-span-2">Adhésion</h3>
                    <div class="col-span-1">
                        <label class="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50 block text-black">Prénom</label>
                        <input type="text" id="ins-prenom" class="auth-input" placeholder="Jean" required>
                    </div>
                    <div class="col-span-1">
                        <label class="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50 block text-black">Nom</label>
                        <input type="text" id="ins-nom" class="auth-input" placeholder="Dupont" required>
                    </div>
                    <div class="col-span-2">
                        <label class="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50 block text-black">Cursus / Promotion</label>
                        <select id="ins-promo" class="auth-input" required>
                            <option value="">Sélectionnez votre promotion</option>
                            <option value="P2">Deuxième Année (P2)</option>
                            <option value="P3">Troisième Année (P3)</option>
                            <option value="P4">Quatrième Année (P4)</option>
                            <option value="P5">Cinquième Année (P5)</option>
                            <option value="P6">Sixième Année (P6)</option>
                            <option value="MASTER">Étudiant en Master</option>
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label class="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50 block text-black">Email Académique</label>
                        <input type="email" id="ins-email" class="auth-input" placeholder="prenom.nom@etudiant.univ-rennes.fr" required>
                    </div>
                    <div class="col-span-1">
                        <label class="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50 block text-black">Mot de passe</label>
                        <input type="password" id="ins-mdp" class="auth-input" placeholder="••••••••" required oninput="checkPasswordStrength(this.value)">
                        <div class="flex items-center space-x-2 px-1 mb-4">
                            <div class="flex-1 h-1 bg-black/10 rounded-full overflow-hidden">
                                <div id="strength-bar" class="h-full w-0 transition-all duration-500 bg-red-500"></div>
                            </div>
                            <span id="strength-text" class="text-[7px] uppercase tracking-wider opacity-60 font-bold text-black">Faible</span>
                        </div>
                    </div>
                    <div class="col-span-1">
                        <label class="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-50 block text-black">Confirmation</label>
                        <input type="password" id="ins-mdp-conf" class="auth-input" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="auth-submit-btn w-full shadow-sm col-span-2 mt-4">Soumettre la demande</button>
                    <p class="text-[9px] text-center col-span-2 mt-6 uppercase tracking-[0.08em] opacity-40 cursor-pointer hover:text-[#c5a059] text-black" onclick="toggleModal('modal-inscription'); toggleModal('modal-login')">
                        Déjà membre ? S&apos;identifier
                    </p>
                </form>
                <div id="success-msg" class="hidden py-12 text-center">
                    <div class="w-16 h-16 border border-emerald-500 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
                    <h3 class="auth-title">Demande Transmise Ma Pupuce</h3>
                    <p class="text-sm opacity-60 text-black">Le bureau étudiera tes informations sous 24 à 48 heures.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="modal-compte" class="modal-overlay" onclick="if(event.target === this) toggleModal('modal-compte')" style="display:none">
    <div class="max-w-3xl mx-auto flex flex-col md:flex-row auth-frame-gold w-full mx-4">
        <div class="auth-column auth-column-left"></div>
        <div class="auth-column auth-column-right"></div>
        <button onclick="toggleModal('modal-compte')" class="absolute top-3 right-4 z-50 text-black/40 hover:text-black">✕</button>
        <div class="md:w-2/7 bg-[#052e16] px-8 py-8 text-white flex flex-col justify-center relative overflow-hidden" style="min-width:180px;max-width:220px">
            <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/marble-white.png')]"></div>
            <span class="text-[9px] tracking-[0.12em] uppercase text-[#c5a059] mb-3 block z-10">Espace Membre</span>
            <h2 class="text-2xl font-heritage italic mb-4 z-10 leading-tight">Mon <br>Compte</h2>
            <div class="h-[1px] w-12 bg-[#c5a059] mb-4 z-10"></div>
            <p class="text-[11px] leading-loose opacity-60 z-10 tracking-[0.06em] uppercase">Informations de votre adhésion.</p>
        </div>
        <div class="flex-1 px-8 py-7 relative bg-[#f5f2e8]">
            <div class="auth-column auth-column-left"></div>
            <div class="auth-column auth-column-right"></div>
            <div class="relative z-10">
                <h3 class="font-heritage italic text-2xl text-center text-[#1a1a1a] mb-5">Profil</h3>
                <div class="grid grid-cols-2 gap-x-5 mb-4">
                    <div>
                        <p class="text-[11px] uppercase tracking-wider opacity-50 text-black mb-1">Prénom</p>
                        <p id="compte-prenom" class="text-sm font-semibold text-[#052e16] border-b border-black/10 pb-1">—</p>
                    </div>
                    <div>
                        <p class="text-[11px] uppercase tracking-wider opacity-50 text-black mb-1">Nom</p>
                        <p id="compte-nom" class="text-sm font-semibold text-[#052e16] border-b border-black/10 pb-1">—</p>
                    </div>
                </div>
                <div class="flex justify-center mb-4">
                    <div class="w-1/2 text-center">
                        <p class="text-[11px] uppercase tracking-wider opacity-50 text-black mb-1">Promotion</p>
                        <p id="compte-promo" class="text-sm font-semibold text-[#052e16] border-b border-black/10 pb-1">—</p>
                    </div>
                </div>
                <div class="mb-4">
                    <p class="text-[11px] uppercase tracking-wider opacity-50 text-black mb-1">Adresse e-mail</p>
                    <p id="compte-email" class="text-sm font-semibold text-[#052e16] border-b border-black/10 pb-1">—</p>
                </div>
                <div class="flex items-center gap-2 my-4">
                    <div class="flex-1 h-[1px] bg-[#c5a059]/30"></div>
                    <span class="text-[#c5a059] text-[10px]">◈</span>
                    <div class="flex-1 h-[1px] bg-[#c5a059]/30"></div>
                </div>
                <div class="space-y-2 mb-3">
                    <input type="password" id="compte-mdp-nouveau" class="auth-input" placeholder="Nouveau mot de passe">
                    <input type="password" id="compte-mdp-confirm" class="auth-input" placeholder="Confirmer le mot de passe">
                    <p id="compte-mdp-msg" class="text-[11px] tracking-wide" style="display:none"></p>
                </div>
                <button onclick="handleChangePassword()" class="auth-submit-btn w-full shadow-sm">Mettre à jour le mot de passe</button>
                <div class="mt-4 text-center border-t border-black/5 pt-4">
                    <button onclick="toggleModal('modal-compte'); handleLogout();" class="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider hover:underline">Se déconnecter</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="modal-library-error" class="modal-overlay" style="display:none">
    <div class="max-w-md mx-auto bg-[#f5f2e8] p-12 auth-frame-gold relative text-center">
        <div class="auth-column auth-column-left"></div>
        <div class="auth-column auth-column-right"></div>
        <div class="mb-6 text-[#c5a059] text-4xl"><i class="fas fa-lock"></i></div>
        <h3 class="font-heritage italic text-3xl text-[#052e16] mb-4">Accès Restreint</h3>
        <p class="text-[11px] uppercase tracking-wider leading-loose opacity-70 mb-8 text-black">
            La consultation des archives et ressources de l&apos;institution est exclusivement réservée aux membres de l&apos;ATPr.
        </p>
        <div class="flex flex-col gap-4">
            <button onclick="switchFromErrorTo('modal-login')" class="auth-submit-btn w-full">S&apos;identifier</button>
            <button onclick="switchFromErrorTo('modal-inscription')" class="text-[10px] uppercase font-bold tracking-wider text-[#c5a059] hover:underline">Devenir membre</button>
        </div>
    </div>
</div>`;

    // Injecter les modales à la fin du body (une seule fois)
    if (!document.getElementById('modal-login')) {
        document.body.insertAdjacentHTML('beforeend', modalesHTML);
    }

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
        // Fermer toutes les autres modales auth avant d'ouvrir la nouvelle
        ['modal-login', 'modal-inscription', 'modal-compte'].forEach(otherId => {
            if (otherId !== id) {
                const other = document.getElementById(otherId);
                if (other && other.style.display === 'flex') {
                    other.style.display = 'none';
                }
            }
        });
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
        window.location.href = '/bibliotheque.html';
    }
};


window.switchFromErrorTo = function(targetModal) {
    toggleModal('modal-library-error');
    toggleModal(targetModal);
};


/* =========================
   GESTION ACCÈS PAGES PROTÉGÉES
   Gère le flou + popup selon la page
========================= */
async function initPageAccess() {
    if (!window.supabase) {
        setTimeout(initPageAccess, 50);
        return;
    }

    const main = document.querySelector('main');
    const path = window.location.pathname;
    const isLibrairie = path.includes('/bibliotheque') || path.includes('bibliotheque');
    const isMethodo   = path.includes('/pole-methodo') || path.includes('pole-methodo');

    if (!isLibrairie && !isMethodo) return; // page non protégée

    function showContent() {
        if (main) {
            main.style.filter      = '';
            main.style.pointerEvents = '';
            main.style.userSelect  = '';
            main.style.opacity     = '';
        }
        // Bibliothèque : fermer modal-library-error
        const mErr = document.getElementById('modal-library-error');
        if (mErr && mErr.style.display === 'flex') window.toggleModal('modal-library-error');

        // Méthodo : fermer popup-methodo
        const mPm = document.getElementById('popup-methodo');
        if (mPm) { mPm.style.display = 'none'; document.body.classList.remove('modal-open'); }

        // Contenu méthodo
        const cm = document.getElementById('contenu-methodo');
        if (cm) { cm.style.display = 'block'; cm.style.filter = ''; cm.style.pointerEvents = ''; cm.style.opacity = ''; }
    }

    function blurContent() {
        if (main) {
            main.style.filter        = 'blur(2px)';
            main.style.pointerEvents = 'none';
            main.style.userSelect    = 'none';
            main.style.opacity       = '0.9';
        }
        // Bibliothèque : ouvrir modal-library-error
        if (isLibrairie) {
            const mErr = document.getElementById('modal-library-error');
            if (mErr && mErr.style.display !== 'flex') window.toggleModal('modal-library-error');
        }
        // Méthodo : ouvrir popup-methodo + flouter contenu
        if (isMethodo) {
            const cm = document.getElementById('contenu-methodo');
            if (cm) { cm.style.display = 'block'; cm.style.filter = 'blur(2px)'; cm.style.pointerEvents = 'none'; cm.style.opacity = '0.9'; }
            const mPm = document.getElementById('popup-methodo');
            if (mPm) { mPm.style.display = 'flex'; document.body.classList.add('modal-open'); }
        }
    }

    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) { blurContent(); } else { showContent(); }

    window.supabase.auth.onAuthStateChange((_event, session) => {
        if (session) { showContent(); } else { blurContent(); }
    });
}

// Lancement automatique
document.addEventListener('DOMContentLoaded', () => { injectNavbar(); initPageAccess(); });