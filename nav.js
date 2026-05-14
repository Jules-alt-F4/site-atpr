let isProcessingLibrary = false; // Verrou anti-spam

function loadNavbar() {
    const navHTML = `
    <nav class="nav-floating">
        <div class="logo">
            <a href="index.html" style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-style: italic; color: #052e16; text-decoration: none;">ATPr</a>
        </div>

        <div class="hidden md:flex space-x-8">
            <a href="index.html#presentation-association" class="text-[13px] uppercase tracking-[0.2em] text-[#052e16] hover:text-[#c5a059] transition-colors no-underline font-medium">L'Institution</a>
            <a href="bureau.html" class="text-[13px] uppercase tracking-widest text-[#052e16] no-underline font-medium">Le Bureau</a>
            
            <a href="javascript:void(0)" 
               onclick="handleLibraryAccess(event)" 
               class="text-[13px] uppercase tracking-widest text-[#052e16] hover:text-[#c5a059] transition-colors no-underline font-medium cursor-pointer">
               Bibliothèque
            </a>
        </div>

        <div class="flex items-center space-x-4">
            <div id="auth-guest">
                <button onclick="toggleModal('modal-login')" class="text-[13px] uppercase tracking-widest mr-6 text-[#052e16] hover:text-[#c5a059] transition-colors bg-transparent border-none cursor-pointer font-medium">Connexion</button>
                <button onclick="toggleModal('modal-inscription')" style="background: #052e16; color: white !important; padding: 12px 28px; border-radius: 50px; font-size: 13px; font-weight: 500; text-transform: uppercase; cursor: pointer; border: none; letter-spacing: 0.1em;">S'inscrire</button>
            </div>
            <div id="auth-user" class="hidden">
                <a href="compte.html" class="text-[13px] uppercase tracking-widest mr-4 text-[#052e16] no-underline font-medium">Mon Compte</a>
                <button onclick="handleLogout()" class="text-[13px] uppercase tracking-widest text-[#052e16] bg-transparent border-none cursor-pointer font-medium">Déconnexion</button>
            </div>
        </div>
    </nav>

    <div id="modal-library-error" class="modal-overlay hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-[#f5f2e8] p-12 rounded-2xl max-w-md w-full text-center border border-[#c5a059]/30 shadow-2xl">
            <div class="text-[#c5a059] text-4xl mb-6"><i class="fas fa-lock"></i></div>
            <h3 class="font-heritage text-3xl text-[#052e16] mb-4">Accès Réservé</h3>
            <p class="text-[13px] text-[#052e16]/70 leading-relaxed mb-10">
                Le contenu de la bibliothèque est exclusivement réservé aux membres de l'ATPr.
            </p>
            <div class="flex flex-col space-y-4">
                <button onclick="switchFromErrorTo('modal-login')" class="bg-[#052e16] text-white py-4 rounded-full text-[13px] uppercase tracking-widest font-bold cursor-pointer">Se Connecter</button>
                <button onclick="switchFromErrorTo('modal-inscription')" class="bg-[#052e16] text-white py-4 rounded-full text-[13px] uppercase tracking-widest font-bold cursor-pointer">S'inscrire</button>
            </div>
            <button onclick="toggleModal('modal-library-error')" class="mt-8 text-[10px] uppercase tracking-widest text-[#052e16]/40 hover:text-[#c5a059] cursor-pointer">Fermer</button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    updateUI();
}

// 2. Gestion de l'accès Bibliothèque
async function handleLibraryAccess(event) {
    if (event) event.preventDefault();
    if (isProcessingLibrary) return; // Bloque si un clic est déjà en cours

    isProcessingLibrary = true;

    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            window.location.href = 'bibliotheque.html';
        } else {
            toggleModal('modal-library-error');
        }
    } catch (error) {
        console.error("Erreur d'accès:", error);
    } finally {
        // On libère le verrou après un court délai pour éviter le spam
        setTimeout(() => { isProcessingLibrary = false; }, 500);
    }
}

// 3. Mise à jour Interface (Connexion/Déconnexion)
async function updateUI() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const guestGroup = document.getElementById('auth-guest');
        const userGroup = document.getElementById('auth-user');

        if (session) {
            if(guestGroup) guestGroup.classList.add('hidden');
            if(userGroup) userGroup.classList.remove('hidden');
        } else {
            if(guestGroup) guestGroup.classList.remove('hidden');
            if(userGroup) userGroup.classList.add('hidden');
        }
    } catch (e) { console.log("Supabase non initialisé"); }
}

// 4. Modales
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error("La modale " + modalId + " n'existe pas dans le DOM.");
        return;
    }

    const isHidden = modal.classList.contains('hidden');
    if (isHidden) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Bloque le scroll derrière
    } else {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Libère le scroll
    }
}

// La fonction magique qui fait le pont entre les modales
function switchFromErrorTo(targetModalId) {
    // 1. Ferme la modale d'erreur
    toggleModal('modal-library-error');

    // 2. Attend 300ms (fin de transition) pour ouvrir la suivante
    setTimeout(() => {
        toggleModal(targetModalId);
    }, 300);
}


// 5. Déconnexion
async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}

// Lancement au chargement de la page

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();

    // --- NOUVEAU : Vérification de la redirection forcée ---
    if (sessionStorage.getItem('showLibraryError') === 'true') {
        // On attend un tout petit peu que la navbar soit bien injectée
        setTimeout(() => {
            toggleModal('modal-library-error');
            sessionStorage.removeItem('showLibraryError'); // On nettoie pour ne pas l'avoir en boucle
        }, 500);
    }
});