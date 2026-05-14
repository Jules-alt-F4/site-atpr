// Variable pour éviter les clics multiples
let isProcessingLibrary = false;

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

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = 'bibliotheque.html';
    } else {
        if (typeof toggleModal === 'function') toggleModal('modal-library-error');
    }
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