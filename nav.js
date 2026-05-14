// nav.js
function loadNavbar() {
    const navHTML = `
    <nav class="nav-floating">
        <div class="logo">
            <a href="index.html" style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; italic">ATPr</a>
        </div>

        <div class="hidden md:flex space-x-8">
            <a href="index.html#presentation-association" class="text-[13px] uppercase tracking-[0.2em] text-[#052e16] hover:text-[#c5a059] transition-colors no-underline font-medium">L'Institution</a>
            <a href="bureau.html" class="text-[13px] uppercase tracking-widest">Le Bureau</a>
            <a href="bibliotheque.html" id="nav-biblio" class="hidden text-[10px] uppercase tracking-widest">Bibliothèque</a>
        </div>

        <div class="flex items-center space-x-4">
        <div id="auth-guest">
            <button onclick="toggleModal('modal-login')" 
                class="text-[13px] uppercase tracking-widest mr-6 text-[#052e16] hover:text-[#c5a059] transition-colors bg-transparent border-none cursor-pointer font-medium">
                Connexion
            </button>
            
            <button onclick="toggleModal('modal-inscription')" 
                style="background: #052e16; color: white !important; padding: 12px 28px; border-radius: 50px; font-size: 13px; text-transform: uppercase; cursor: pointer; border: none; letter-spacing: 0.1em; font-weight: 500;">
                S'inscrire
            </button>
        </div>
            </div>
            <div id="auth-user" class="hidden">
                <a href="compte.html" class="text-[10px] uppercase tracking-widest mr-4">Mon Compte</a>
                <button onclick="handleLogout()" class="text-[10px] uppercase tracking-widest">Déconnexion</button>
            </div>
        </div>
    </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    checkUserStatus();
}

async function checkUserStatus() {
    // On utilise window.supabase configuré dans l'index.html
    if (window.supabase) {
        const { data: { session } } = await window.supabase.auth.getSession();
        const guestGroup = document.getElementById('auth-guest');
        const userGroup = document.getElementById('auth-user');

        if (session) {
            if(guestGroup) guestGroup.classList.add('hidden');
            if(userGroup) userGroup.classList.remove('hidden');
        }
    }
}

// Lancement automatique
document.addEventListener('DOMContentLoaded', loadNavbar);

async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', loadNavbar);

    // Logique des Modales

    function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const isOpening = modal.style.display === 'none' || modal.style.display === '';
        modal.style.display = isOpening ? 'flex' : 'none';

        // Verrouille ou déverrouille le défilement du corps de la page
        if (isOpening) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }
}

    // (Gardez votre code existant pour la connexion)

   async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // On utilise "sb" comme dans ton code
    const { error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
        alert("Erreur de connexion : " + error.message);
    } else {
        // 1. On ferme la modale
        toggleModal('modal-login');

        // 2. On recharge la page actuelle
        // Cela va relancer le script nav.js qui détectera la session
        // et affichera automatiquement "Bibliothèque" dans le menu.
        window.location.reload();
    }
}

    async function handleSignup(e) {
        e.preventDefault();

        const email = document.getElementById('ins-email').value.trim().toLowerCase();
        const password = document.getElementById('ins-mdp').value;
        const passwordConf = document.getElementById('ins-mdp-conf').value;

        // Vérification mail universitaire
        const allowedDomains = ['@etudiant.univ-rennes.fr', '@univ-rennes.fr'];
        const isUniversityEmail = allowedDomains.some(domain => email.endsWith(domain));

        if (!isUniversityEmail) {
            alert("Accès refusé : Utilisez votre adresse académique de l'Université de Rennes.");
            return;
        }

        if (password !== passwordConf) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        const { data: authData, error: authError } = await sb.auth.signUp({ email, password });

        if (authError) {
            alert(authError.message);
            return;
        }

        // Création du profil dans la table 'profils'
        const { error: profileError } = await sb.from('profils').insert([{
            prenom: document.getElementById('ins-prenom').value,
            nom: document.getElementById('ins-nom').value,
            promo: document.getElementById('ins-promo').value,
            email: email,
            est_valide: false
        }]);

        if (profileError) {
            alert("Erreur profil : " + profileError.message);
        } else {
            document.getElementById('form-inscription').classList.add('hidden');
            document.getElementById('success-msg').classList.remove('hidden');
        }
    }

    // Vérifier l'état de connexion au chargement
    document.addEventListener('DOMContentLoaded', async () => {
        const { data: { session } } = await supabase.auth.getSession();
        updateUI(session);

        // Écouter les changements d'état (connexion/déconnexion)
        supabase.auth.onAuthStateChange((_event, session) => {
            updateUI(session);
        });
    });

    function updateUI(session) {
        const guestGroup = document.getElementById('auth-guest');
        const userGroup = document.getElementById('auth-user');
        const navBiblio = document.getElementById('nav-biblio');
        const ctaRejoindre = document.querySelector('a[href="#presentation-association"]')?.closest('.btn-gold');

        if (session) {
            // Utilisateur CONNECTÉ
            if(guestGroup) guestGroup.classList.add('hidden');
            if(userGroup) userGroup.classList.remove('hidden');
            if(navBiblio) navBiblio.classList.remove('hidden');
            // Masquer le bouton "Nous rejoindre" sur l'accueil
            if(ctaRejoindre) ctaRejoindre.classList.add('hidden');
        } else {
            // Utilisateur DÉCONNECTÉ
            if(guestGroup) guestGroup.classList.remove('hidden');
            if(userGroup) userGroup.classList.add('hidden');
            if(navBiblio) navBiblio.classList.add('hidden');
            if(ctaRejoindre) ctaRejoindre.classList.remove('hidden');
        }
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (!error) window.location.href = 'index.html';
    }

    // --- UTILITAIRES ---

    function checkPasswordStrength(password) {
        const bar = document.getElementById('strength-bar');
        const text = document.getElementById('strength-text');
        if(!bar || !text) return;

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;

        const levels = [
            { width: '20%', color: '#ef4444', label: 'Trop court' },
            { width: '50%', color: '#eab308', label: 'Moyen' },
            { width: '100%', color: '#c5a059', label: 'Excellence' }
        ];

        const level = strength < 2 ? levels[0] : (strength < 4 ? levels[1] : levels[2]);
        bar.style.width = level.width;
        bar.style.backgroundColor = level.color;
        text.innerText = level.label;
        text.style.color = level.color;
    }

    // --- ÉCOUTEURS D'ÉVÉNEMENTS ---

    document.addEventListener('DOMContentLoaded', () => {
        // Lie le formulaire de connexion
        const loginForm = document.getElementById('form-login'); // Vérifiez que votre <form> a cet ID
        if (loginForm) loginForm.addEventListener('submit', handleLogin);

        // Lie le formulaire d'inscription
        const signupForm = document.getElementById('form-inscription');
        if (signupForm) signupForm.addEventListener('submit', handleSignup);
    });


