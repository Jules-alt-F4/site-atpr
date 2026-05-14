// Variable pour éviter les clics multiples
let isProcessingLibrary = false;

function injectGlobalModals() {

    // Évite les doublons
    if (document.getElementById('modal-login')) return;

    const modalsHTML = `

    <div id="modal-login" class="modal-overlay hidden" onclick="if(event.target === this) toggleModal('modal-login')">
        <div class="max-w-md mx-auto bg-[#f5f2e8] p-10 auth-frame-gold relative text-center">
            <h3 class="font-heritage italic text-3xl text-[#052e16] mb-6">Connexion</h3>

            <form onsubmit="handleLogin(event)" class="space-y-4">
                <input type="email" id="login-email" class="auth-input" placeholder="Email" required>
                <input type="password" id="login-password" class="auth-input" placeholder="Mot de passe" required>

                <button type="submit" class="auth-submit-btn w-full">
                    Se connecter
                </button>
            </form>

            <button
                onclick="switchModal('modal-login', 'modal-inscription')"
                class="mt-6 text-[10px] uppercase tracking-widest text-[#c5a059] hover:underline">
                Créer un compte
            </button>
        </div>
    </div>

    <div id="modal-inscription" class="modal-overlay hidden" onclick="if(event.target === this) toggleModal('modal-inscription')">
        <div class="max-w-md mx-auto bg-[#f5f2e8] p-10 auth-frame-gold relative text-center">
            <h3 class="font-heritage italic text-3xl text-[#052e16] mb-6">Inscription</h3>

            <form onsubmit="handleSignup(event)" class="space-y-4">
                <input type="text" class="auth-input" placeholder="Prénom" required>
                <input type="text" class="auth-input" placeholder="Nom" required>
                <input type="email" class="auth-input" placeholder="Email" required>
                <input type="password" class="auth-input" placeholder="Mot de passe" required>

                <button type="submit" class="auth-submit-btn w-full">
                    S'inscrire
                </button>
            </form>

            <button
                onclick="switchModal('modal-inscription', 'modal-login')"
                class="mt-6 text-[10px] uppercase tracking-widest text-[#c5a059] hover:underline">
                Déjà membre ?
            </button>
        </div>
    </div>

    <div id="modal-library-error" class="modal-overlay hidden" onclick="if(event.target === this) toggleModal('modal-library-error')">
        <div class="max-w-md mx-auto bg-[#f5f2e8] p-12 auth-frame-gold relative text-center">

            <div class="mb-6 text-[#c5a059] text-4xl">
                <i class="fas fa-lock"></i>
            </div>

            <h3 class="font-heritage italic text-3xl text-[#052e16] mb-4">
                Accès Restreint
            </h3>

            <p class="text-[11px] uppercase tracking-widest leading-loose opacity-70 mb-8 text-black">
                Cette section est réservée aux membres.
            </p>

            <div class="flex flex-col gap-4">
                <button onclick="switchModal('modal-library-error', 'modal-login')" class="auth-submit-btn w-full">
                    S'identifier
                </button>

                <button onclick="switchModal('modal-library-error', 'modal-inscription')" class="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] hover:underline">
                    Devenir membre
                </button>
            </div>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalsHTML);
}

function loadNavbar() {
    const navHTML = `
    <nav class="nav-floating">
        <div class="nav-left">
            <a href="index.html" class="logo-text">ATPr</a>
        </div>

        <div class="nav-center-group">
            <a href="index.html#presentation-association" class="nav-link">L'Institution</a>
            <a href="bureau.html" class="nav-link">Le Bureau</a>
            <button type="button" onclick="handleLibraryAccess(event)" class="nav-link" id="lib-btn">Bibliothèque</button>
        </div>

        <div class="nav-right">
            <div id="auth-guest" class="auth-flex">
                <button type="button" onclick="switchModal('modal-inscription', 'modal-login')" class="nav-link-auth">Connexion</button>
                <button type="button" onclick="switchModal('modal-login', 'modal-inscription')" class="btn-join">S'inscrire</button>
            </div>
            <div id="auth-user" class="auth-flex hidden">
                <a href="compte.html" class="nav-link-auth">Mon Compte</a>
                <button type="button" onclick="handleLogout()" class="nav-link-auth">Déconnexion</button>
            </div>
        </div>
    </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    injectGlobalModals();

    // Initialisation des fonctionnalités
    updateUI();
    if (typeof highlightActiveLink === 'function') highlightActiveLink();
}

// GESTION DE L'AFFICHAGE (Connecté vs Déconnecté)
async function updateUI() {
    const authGuest = document.getElementById('auth-guest');
    const authUser = document.getElementById('auth-user');

    if (!authGuest || !authUser) return;

    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            authGuest.classList.add('hidden');
            authUser.classList.remove('hidden');
            authUser.style.display = 'flex';
        } else {
            authUser.classList.add('hidden');
            authGuest.classList.remove('hidden');
            authGuest.style.display = 'flex';
        }
    } catch (error) {
        console.error("Erreur Auth UI:", error);
    }
}

// GESTION BIBLIOTHÈQUE
async function handleLibraryAccess(event) {
    if (event) event.preventDefault();
    if (isProcessingLibrary) return;

    isProcessingLibrary = true;

    window.location.href = 'bibliotheque.html';

    isProcessingLibrary = false;
}

// MODALES ET LOGOUT
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) {
        console.warn(`Modale introuvable : ${modalId}`);
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

async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload(); // Recharge pour mettre à jour la barre
}

document.addEventListener('DOMContentLoaded', loadNavbar);