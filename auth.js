/* =========================
   FORCE DE MOT DE PASSE
========================= */
function checkPasswordStrength(password) {
    const bar  = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    if (!bar || !text) return;

    let strength = 0;
    if (password.length >= 6)           strength++;
    if (password.match(/[A-Z]/))        strength++;
    if (password.match(/[0-9]/))        strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;

    const levels = [
        { w: '25%',  bg: '#dc2626', label: 'Faible' },
        { w: '25%',  bg: '#dc2626', label: 'Faible' },
        { w: '50%',  bg: '#f59e0b', label: 'Moyen'  },
        { w: '75%',  bg: '#84cc16', label: 'Bon'    },
        { w: '100%', bg: '#16a34a', label: 'Fort'   },
    ];
    const l = levels[strength];
    bar.style.width      = l.w;
    bar.style.background = l.bg;
    text.textContent     = l.label;
}

/* =========================
   CONNEXION
========================= */
async function handleLogin(event) {
    event.preventDefault();
    event.stopPropagation();

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const { error } = await window.supabase.auth.signInWithPassword({ email, password });

        if (error) {
            alert(error.message);
            return false;
        }

        // Ferme la modale (gérée par style.display dans nav.js)
        if (typeof window.toggleModal === 'function') {
            window.toggleModal('modal-login');
        }

        // Met à jour la navbar
        if (typeof window.updateUI === 'function') window.updateUI();

    } catch (err) {
        console.error(err);
    }

    return false;
}

/* =========================
   INSCRIPTION
========================= */
async function handleSignup(event) {
    event.preventDefault();

    // Lecture des champs par leur ID exact dans le formulaire
    const prenom   = (document.getElementById('ins-prenom')?.value  || '').trim();
    const nom      = (document.getElementById('ins-nom')?.value      || '').trim();
    const promo    = (document.getElementById('ins-promo')?.value    || '');
    const email    = (document.getElementById('ins-email')?.value    || '').trim();
    const password = (document.getElementById('ins-mdp')?.value      || '');
    const confirm  = (document.getElementById('ins-mdp-conf')?.value || '');

    if (!prenom || !nom || !promo || !email || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    if (password !== confirm) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }
    if (password.length < 6) {
        alert('Le mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    const { error } = await window.supabase.auth.signUp({
        email,
        password,
        options: {
            data: { prenom, nom, promo }
        }
    });

    if (error) {
        alert(error.message);
        return;
    }

    // Afficher le message de succès dans la modale
    const form       = document.getElementById('form-inscription');
    const successMsg = document.getElementById('success-msg');
    if (form)       form.style.display       = 'none';
    if (successMsg) successMsg.style.display = 'block';
}

/* =========================
   DÉCONNEXION
========================= */
async function handleLogout() {
    const { error } = await window.supabase.auth.signOut();
    if (error) { console.error(error); return; }
    document.body.classList.remove('modal-open');
    window.location.href = 'index.html';
}

// updateUI et toggleModal sont définis dans nav.js