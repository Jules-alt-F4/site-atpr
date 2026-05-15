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

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
            return false;
        }

        // Force récupération session
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {

            // Ferme popup
            const modal = document.getElementById('modal-login');

            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('modal-active');
            }

            document.body.classList.remove('modal-open');

            // Update navbar
            await updateUI();
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

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Compte créé avec succès.");

    // Basculer automatiquement vers connexion
    switchModal('modal-inscription', 'modal-login');
}


async function handleLogout() {

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    document.body.classList.remove('modal-open');

    await updateUI();

    window.location.href = 'index.html';
}

async function updateUI() {

    const authGuest = document.getElementById('auth-guest');
    const authUser = document.getElementById('auth-user');

    if (!authGuest || !authUser) return;

    try {

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {

            // MODE CONNECTÉ
            authGuest.classList.add('hidden');

            authUser.classList.remove('hidden');
            authUser.classList.add('flex');

        } else {

            // MODE INVITÉ
            authUser.classList.add('hidden');

            authGuest.classList.remove('hidden');
            authGuest.classList.add('flex');
        }

    } catch (error) {

        console.error("Erreur Auth UI:", error);
    }
}
