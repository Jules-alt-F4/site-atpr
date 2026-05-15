// Variable pour éviter les clics multiples
let isProcessingLibrary = false;

/* =========================
   MODALES — HTML
========================= */

function injectGlobalModals() {

    if (document.getElementById('modal-login')) return;

    const modalsHTML = `
    <div id="modal-login" class="modal-overlay hidden" onclick="if(event.target === this) toggleModal('modal-login')">
        <div class="max-w-md mx-auto bg-[#f5f2e8] p-10 auth-frame-gold relative text-center">
            <h3 class="font-heritage italic text-3xl text-[#052e16] mb-6">Connexion</h3>
            <form id="login-form" class="space-y-4">
                <input type="email" id="login-email" class="auth-input" placeholder="Email" required>
                <input type="password" id="login-password" class="auth-input" placeholder="Mot de passe" required>
                <button type="submit" class="auth-submit-btn w-full">Se connecter</button>
            </form>
            <button onclick="switchModal('modal-login', 'modal-inscription')"
                class="mt-6 text-[10px] uppercase tracking-widest text-[#c5a059] hover:underline">
                Creer un compte
            </button>
        </div>
    </div>

    <div id="modal-inscription" class="modal-overlay hidden" onclick="if(event.target === this) toggleModal('modal-inscription')">
        <div class="max-w-md mx-auto bg-[#f5f2e8] p-10 auth-frame-gold relative text-center">
            <h3 class="font-heritage italic text-3xl text-[#052e16] mb-6">Inscription</h3>
            <form id="signup-form" class="space-y-4">
                <input type="email" id="signup-email" class="auth-input" placeholder="Email" required>
                <input type="password" id="signup-password" class="auth-input" placeholder="Mot de passe" required>
                <button type="submit" class="auth-submit-btn w-full">S'inscrire</button>
            </form>
            <button onclick="switchModal('modal-inscription', 'modal-login')"
                class="mt-6 text-[10px] uppercase tracking-widest text-[#c5a059] hover:underline">
                Deja membre ?
            </button>
        </div>
    </div>

    <div id="modal-library-error" class="modal-overlay hidden" onclick="if(event.target === this) toggleModal('modal-library-error')">
        <div class="max-w-md mx-auto bg-[#f5f2e8] p-12 auth-frame-gold relative text-center">
            <div class="mb-6 text-[#c5a059] text-4xl"><i class="fas fa-lock"></i></div>
            <h3 class="font-heritage italic text-3xl text-[#052e16] mb-4">Acces Restreint</h3>
            <p class="text-[11px] uppercase tracking-widest leading-loose opacity-70 mb-8 text-black">
                La consultation des archives et ressources de l'institution est exclusivement reservee aux membres de l'ATPr.
            </p>
            <div class="flex flex-col gap-4">
                <button onclick="switchModal('modal-library-error', 'modal-login')" class="auth-submit-btn w-full">S'identifier</button>
                <button onclick="switchModal('modal-library-error', 'modal-inscription')"
                    class="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] hover:underline">Devenir membre</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalsHTML);
}

function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    if (loginForm && !loginForm.dataset.initialized) {
        loginForm.onsubmit = handleLogin;
        loginForm.dataset.initialized = 'true';
    }
    const signupForm = document.getElementById('signup-form');
    if (signupForm && !signupForm.dataset.initialized) {
        signupForm.onsubmit = handleSignup;
        signupForm.dataset.initialized = 'true';
    }
}

/* =========================
   NAVBAR
========================= */

function loadNavbar() {

    const navHTML = `
    <nav class="nav-floating">
        <div class="nav-left">
            <a href="index.html" class="logo-text">ATPr</a>
        </div>
        <div class="nav-center-group">
            <a href="index.html#presentation-association" class="nav-link">L'Institution</a>
            <a href="bureau.html" class="nav-link">Le Bureau</a>
            <button type="button" onclick="handleLibraryAccess(event)" class="nav-link" id="lib-btn">Bibliotheque</button>
        </div>
        <div class="nav-right">
            <div id="auth-guest" class="auth-flex flex">
                <button type="button" onclick="switchModal('modal-inscription', 'modal-login')" class="nav-link-auth">Connexion</button>
                <button type="button" onclick="switchModal('modal-login', 'modal-inscription')" class="btn-join">S'inscrire</button>
            </div>
            <div id="auth-user" class="auth-flex hidden">
                <button type="button" class="nav-link-auth" disabled>Mon Compte</button>
                <button type="button" onclick="handleLogout()" class="nav-link-auth">Deconnexion</button>
            </div>
        </div>
    </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    injectGlobalModals();
    initAuthForms();
    if (typeof highlightActiveLink === 'function') highlightActiveLink();

    // ==========================================================
    // onAuthStateChange enregistre ICI — apres injection navbar
    // Supabase fire INITIAL_SESSION immediatement a l'abonnement
    // => auth-guest / auth-user existent deja dans le DOM
    // ==========================================================
    supabase.auth.onAuthStateChange(async (event, session) => {

        await updateUI();

        if (session) {
            ['modal-login', 'modal-inscription', 'modal-library-error'].forEach(id => {
                const modal = document.getElementById(id);
                if (!modal) return;
                modal.classList.add('hidden');
                modal.classList.remove('modal-active');
            });
            document.body.classList.remove('modal-open');

            // Retire le flou bibliotheque si l'utilisateur vient de se connecter
            const mainContent = document.querySelector('main');
            if (mainContent && mainContent.style.filter) {
                mainContent.style.filter = '';
                mainContent.style.pointerEvents = '';
                mainContent.style.userSelect = '';
                mainContent.style.opacity = '';
            }
        }
    });
}

/* =========================
   BIBLIOTHEQUE
========================= */

async function handleLibraryAccess(event) {
    if (event) event.preventDefault();
    if (isProcessingLibrary) return;
    isProcessingLibrary = true;
    window.location.href = 'bibliotheque.html';
    isProcessingLibrary = false;
}

/* =========================
   MODALES — FONCTIONS
========================= */

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.warn('Modale introuvable :', modalId);
        return;
    }
    const isHidden = modal.classList.contains('hidden');
    if (isHidden) {
        modal.classList.remove('hidden');
        modal.classList.add('modal-active');
        document.body.classList.add('modal-open');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('modal-active');
        document.body.classList.remove('modal-open');
    }
}

function switchModal(closeModalId, openModalId) {
    const closeModal = document.getElementById(closeModalId);
    const openModal = document.getElementById(openModalId);
    if (closeModal) {
        closeModal.classList.add('hidden');
        closeModal.classList.remove('modal-active');
    }
    if (openModal) {
        openModal.classList.remove('hidden');
        openModal.classList.add('modal-active');
    }
    document.body.classList.add('modal-open');
}

/* =========================
   INIT
========================= */

document.addEventListener('DOMContentLoaded', loadNavbar);

// Expose au HTML inline
window.handleLogout = handleLogout;
window.toggleModal = toggleModal;
window.switchModal = switchModal;
window.handleLibraryAccess = handleLibraryAccess;