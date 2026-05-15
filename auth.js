function checkPasswordStrength(password) {

    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');

    if (!bar || !text) return;

    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;

    if (strength <= 1) {
        bar.style.width = '25%';
        bar.style.background = '#dc2626';
        text.textContent = 'Faible';
    }
    else if (strength === 2) {
        bar.style.width = '50%';
        bar.style.background = '#f59e0b';
        text.textContent = 'Moyen';
    }
    else if (strength === 3) {
        bar.style.width = '75%';
        bar.style.background = '#84cc16';
        text.textContent = 'Bon';
    }
    else {
        bar.style.width = '100%';
        bar.style.background = '#16a34a';
        text.textContent = 'Fort';
    }
}

async function handleLogin(event) {

    // Stop COMPLET du submit HTML
    event.preventDefault();
    event.stopPropagation();

    const email = document.getElementById('login-email').value.trim();

    const password = document.getElementById('login-password').value;

    try {

        const { data, error } = await window.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
            return false;
        }

        // Force récupération session
        const { data: sessionData } = await window.supabase.auth.getSession();

        if (sessionData.session) {

            // Ferme popup proprement via toggleModal
            if (typeof window.toggleModal === 'function') {
                const modal = document.getElementById('modal-login');
                if (modal && !modal.classList.contains('hidden')) {
                    window.toggleModal('modal-login');
                }
            }

            // Update navbar (défini dans nav.js)
            if (typeof window.updateUI === 'function') window.updateUI();
        }

    } catch (err) {

        console.error(err);
    }

    return false;
}

async function handleSignup(event) {

    event.preventDefault();

    const form = event.target;

    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const { data, error } = await window.supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Compte créé avec succès.");

    // Fermer inscription, ouvrir connexion
    if (typeof window.toggleModal === 'function') {
        const ins = document.getElementById('modal-inscription');
        if (ins && !ins.classList.contains('hidden')) window.toggleModal('modal-inscription');
        window.toggleModal('modal-login');
    }
}


async function handleLogout() {

    const { error } = await window.supabase.auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    document.body.classList.remove('modal-open');

    if (typeof window.updateUI === 'function') window.updateUI();

    window.location.href = 'index.html';
}

// updateUI est définie dans nav.js via window.updateUI

// toggleModal est défini dans nav.js — ne pas redéfinir ici pour éviter les conflits