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

        // Vérifier que le compte est validé par l'équipe ATPr
        const { data: profil } = await window.supabase
            .from('profils')
            .select('valide')
            .single();

        if (!profil || !profil.valide) {
            // Compte non validé — déconnecter et afficher message
            await window.supabase.auth.signOut();
            alert("Votre compte est en attente de validation par l'équipe ATPr. Vous serez notifié dès que votre accès sera activé.");
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

    const { data, error } = await window.supabase.auth.signUp({
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

    // Insérer dans la table profils avec valide = false
    if (data?.user) {
        await window.supabase.from('profils').insert({
            id:     data.user.id,
            prenom: prenom,
            nom:    nom,
            promo:  promo,
            email:  email,
            valide: false
        });
    }

    // Déconnecter immédiatement
    await window.supabase.auth.signOut();

    // Afficher le message d'attente de validation
    const form       = document.getElementById('form-inscription');
    const successMsg = document.getElementById('success-msg');
    if (form) form.style.display = 'none';
    if (successMsg) {
        successMsg.innerHTML =
            '<div class="text-center px-4">' +
            '<div class="text-[#c5a059] text-3xl mb-3">&#10003;</div>' +
            '<p class="font-heritage italic text-xl text-[#052e16] mb-3">Demande envoy&eacute;e</p>' +
            '<p class="text-[11px] uppercase tracking-widest opacity-60 leading-loose">' +
            'Votre demande d'adh&eacute;sion a bien &eacute;t&eacute; re&ccedil;ue.<br><br>' +
            'L'&eacute;quipe ATPr va examiner votre profil<br>et valider votre compte.<br><br>' +
            'Vous serez notifi&eacute; d&egrave;s que votre acc&egrave;s sera activ&eacute;.' +
            '</p></div>';
        successMsg.style.display = 'block';
    }
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