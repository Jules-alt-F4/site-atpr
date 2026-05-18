const ogData = {
  "og:title": "ATPR - Tutorat de Pharmacie de Rennes",
  "og:description": "Le site officiel du tutorat de pharmacie pour les étudiants rennais.",
  "og:image": "https://tutorat-pharmacie-rennes.fr/images/logo.png",
  "og:url": window.location.href, // Ça prend automatiquement l'URL de la page actuelle !
  "og:type": "website"
};

Object.entries(ogData).forEach(([property, content]) => {
  let meta = document.createElement('meta');
  meta.setAttribute('property', property);
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
});

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
            <a href="/bureau.html" class="nav-link">Le Bureau</a>
            <a href="/bibliotheque.html" class="nav-link">Bibliothèque</a>
            <a href="/pole-methodo.html" class="nav-link">Pôle Méthodo</a>
            <span class="nav-separator"></span>
            <a href="/contact.html" class="nav-link">Contact</a>
            <a href="/nous-rejoindre.html" class="nav-link">Nous rejoindre</a>
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

        <!-- Bouton hamburger (mobile uniquement) -->
        <button id="nav-hamburger" class="nav-hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>

    <!-- Menu mobile overlay -->
    <div id="nav-mobile-menu" class="nav-mobile-menu">
        <div class="nav-mobile-inner">
            <a href="/index.html#presentation-association" class="nav-mobile-link">L'Institution</a>
            <a href="/bureau.html" class="nav-mobile-link">Le Bureau</a>
            <a href="/bibliotheque.html" class="nav-mobile-link">Bibliothèque</a>
            <a href="/pole-methodo.html" class="nav-mobile-link">Pôle Méthodo</a>
            <a href="/contact.html" class="nav-mobile-link">Contact</a>
            <a href="/nous-rejoindre.html" class="nav-mobile-link">Nous rejoindre</a>
            <div id="auth-guest-mobile" class="nav-mobile-auth">
                <button type="button" onclick="toggleModal('modal-login'); closeMobileMenu()" class="nav-mobile-btn-login">Connexion</button>
                <button type="button" onclick="toggleModal('modal-inscription'); closeMobileMenu()" class="nav-mobile-btn-join">S'inscrire</button>
            </div>
            <div id="auth-user-mobile" class="nav-mobile-auth" style="display:none">
                <button type="button" onclick="openCompte(); closeMobileMenu()" class="nav-mobile-btn-login">Mon Compte</button>
                <button type="button" onclick="handleLogout()" class="nav-mobile-btn-join">Déconnexion</button>
            </div>
        </div>
    </div>`;

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
                    <div style="grid-column: span 2; margin-top: 1.25rem; display: flex; align-items: flex-start; gap: 0.6rem;">
                        <input type="checkbox" id="ins-cgu" style="margin-top: 2px; flex-shrink: 0; accent-color: #c5a059; width: 14px; height: 14px; cursor: pointer;">
                        <label for="ins-cgu" style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.6; color: #000; line-height: 1.7; cursor: pointer; user-select: none;">
                            J&apos;accepte la
                            <span style="color: #c5a059; cursor: pointer; text-decoration: underline;" onclick="event.preventDefault(); showPage('politique-confidentialite')">politique de confidentialité</span>,
                            les
                            <span style="color: #c5a059; cursor: pointer; text-decoration: underline;" onclick="event.preventDefault(); showPage('mentions-legales')">mentions légales</span>
                            et les
                            <span style="color: #c5a059; cursor: pointer; text-decoration: underline;" onclick="event.preventDefault(); showPage('cgu')">CGU</span>
                            de l&apos;ATPr.
                        </label>
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
</div>
<div id="modal-mentions-legales" class="modal-overlay" style="display:none" onclick="if(event.target===this) toggleModal('modal-mentions-legales')">
    <div class="max-w-2xl w-full mx-4 bg-[#f5f2e8] auth-frame-gold relative" style="max-height:85vh;overflow:hidden;border-radius:1rem;">
        <div class="auth-column auth-column-left"></div>
        <div class="auth-column auth-column-right"></div>
        <button onclick="toggleModal('modal-mentions-legales')" class="absolute top-4 right-4 z-50 text-black/40 hover:text-black text-xl">✕</button>
        <div class="p-12">
            <p class="text-[#c5a059] uppercase tracking-wider text-xs mb-2">Informations légales</p>
            <h2 class="font-heritage italic text-4xl text-[#052e16] mb-8">Mentions Légales</h2>
            <div class="space-y-6 text-sm text-[#5b4b2a] leading-relaxed">
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Éditeur du site</h3>
                <p>Association du Tutorat de Pharmacie Rennais (ATPr)<br>UFR des Sciences Pharmaceutiques et Biologiques de Rennes<br>2 Avenue du Professeur Léon Bernard, 35043 Rennes Cedex<br>Email : atpr.rennes@gmail.com</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Hébergement</h3>
                <p>Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, California 94104, USA.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Propriété intellectuelle</h3>
                <p>L'ensemble des contenus présents sur ce site sont la propriété exclusive de l'ATPr. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Responsabilité</h3>
                <p>L'ATPr s'efforce d'assurer l'exactitude des informations diffusées. Elle ne saurait être tenue responsable des erreurs ou de l'utilisation faite de ces informations par des tiers.</p></div>
            </div>
        </div>
    </div>
</div>

<div id="modal-politique-confidentialite" class="modal-overlay" style="display:none" onclick="if(event.target===this) toggleModal('modal-politique-confidentialite')">
    <div class="max-w-2xl w-full mx-4 bg-[#f5f2e8] auth-frame-gold relative" style="max-height:85vh;overflow:hidden;border-radius:1rem;">
        <div class="auth-column auth-column-left"></div>
        <div class="auth-column auth-column-right"></div>
        <button onclick="toggleModal('modal-politique-confidentialite')" class="absolute top-4 right-4 z-50 text-black/40 hover:text-black text-xl">✕</button>
        <div class="p-12">
            <p class="text-[#c5a059] uppercase tracking-wider text-xs mb-2">Vos données</p>
            <h2 class="font-heritage italic text-4xl text-[#052e16] mb-8">Politique de Confidentialité</h2>
            <div class="space-y-6 text-sm text-[#5b4b2a] leading-relaxed">
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Données collectées</h3>
                <p>Lors de votre inscription, nous collectons : prénom, nom, promotion, adresse email universitaire et mot de passe chiffré. Aucune donnée bancaire n'est collectée.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Finalité</h3>
                <p>Ces données sont utilisées exclusivement pour gérer votre accès à l'espace membres de l'ATPr et vous identifier au sein de l'association.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Conservation</h3>
                <p>Vos données sont conservées pour la durée de votre adhésion. Vous pouvez demander leur suppression à tout moment en contactant atpr.rennes@gmail.com.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Hébergement des données</h3>
                <p>Les données sont hébergées sur Supabase, infrastructure sécurisée conforme RGPD, dans des centres de données situés en Union Européenne.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Vos droits</h3>
                <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contactez-nous à atpr.rennes@gmail.com.</p></div>
            </div>
        </div>
    </div>
</div>

<div id="modal-cgu" class="modal-overlay" style="display:none" onclick="if(event.target===this) toggleModal('modal-cgu')">
    <div class="max-w-2xl w-full mx-4 bg-[#f5f2e8] auth-frame-gold relative" style="max-height:85vh;overflow:hidden;border-radius:1rem;">
        <div class="auth-column auth-column-left"></div>
        <div class="auth-column auth-column-right"></div>
        <button onclick="toggleModal('modal-cgu')" class="absolute top-4 right-4 z-50 text-black/40 hover:text-black text-xl">✕</button>
        <div class="p-12">
            <p class="text-[#c5a059] uppercase tracking-wider text-xs mb-2">Conditions d'utilisation</p>
            <h2 class="font-heritage italic text-4xl text-[#052e16] mb-8">Conditions Générales d'Utilisation</h2>
            <div class="space-y-6 text-sm text-[#5b4b2a] leading-relaxed">
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Accès au site</h3>
                <p>L'accès à l'espace membres est réservé aux étudiants et personnels de l'UFR Pharmacie de Rennes, après validation de votre inscription par le bureau de l'ATPr.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Utilisation des ressources</h3>
                <p>Les fiches et conférences sont destinées exclusivement à un usage pédagogique personnel. Toute diffusion, reproduction ou exploitation commerciale est strictement interdite.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Compte membre</h3>
                <p>Chaque membre est responsable de la confidentialité de ses identifiants. En cas d'utilisation frauduleuse, contactez immédiatement atpr.rennes@gmail.com.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Modifications</h3>
                <p>L'ATPr se réserve le droit de modifier les présentes CGU à tout moment. Les membres seront informés de toute modification substantielle.</p></div>
                <div><h3 class="font-semibold text-[#052e16] uppercase tracking-wider text-xs mb-2">Droit applicable</h3>
                <p>Les présentes CGU sont soumises au droit français. Tout litige relèvera de la compétence des tribunaux de Rennes.</p></div>
            </div>
        </div>
    </div>
</div>`;

    // Injecter les modales auth (une seule fois)
    if (!document.getElementById('modal-login')) {
        document.body.insertAdjacentHTML('beforeend', modalesHTML);
    }
    // Injecter les modales légales séparément (toujours)
    if (!document.getElementById('modal-mentions-legales')) {
        const legalesHTML = document.createElement('div');
        legalesHTML.innerHTML = modalesHTML;
        ['modal-mentions-legales','modal-politique-confidentialite','modal-cgu'].forEach(id => {
            const el = legalesHTML.querySelector('#' + id);
            if (el && !document.getElementById(id)) {
                document.body.appendChild(el);
            }
        });
    }


    // ── FOOTER injecté sur toutes les pages ─────────────────────────────────
    if (!document.getElementById('main-footer')) {
        const footerHTML = `
<footer id="main-footer" class="bg-[#000000] border-t border-[#c5a059]/20 py-12 px-6 mt-20">
    <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="text-center md:text-left">
                <span class="font-heritage italic text-2xl text-[#c5a059] block mb-2">ATPr</span>
                <p class="text-[9px] uppercase tracking-[0.08em] text-[#f5f2e8]/60">
                    &copy; 2024 Association du Tutorat de Pharmacie Rennais. <br> Tous droits réservés.
                </p>
            </div>
            <div class="flex flex-wrap justify-center gap-8">
                <button onclick="showPage('mentions-legales')" class="text-[10px] uppercase tracking-wider text-[#f5f2e8]/60 hover:text-[#c5a059] transition-colors">Mentions Légales</button>
                <button onclick="showPage('politique-confidentialite')" class="text-[10px] uppercase tracking-wider text-[#f5f2e8]/60 hover:text-[#c5a059] transition-colors">Politique de Confidentialité</button>
                <button onclick="showPage('cgu')" class="text-[10px] uppercase tracking-wider text-[#f5f2e8]/60 hover:text-[#c5a059] transition-colors">CGU</button>
            </div>
            <div class="text-center md:text-right">
                <p class="text-[10px] uppercase tracking-wider text-[#c5a059] mb-1">Contact</p>
                <p class="text-[11px] text-[#f5f2e8]/30 font-light">atpr.rennes@gmail.com</p>
                <div class="flex space-x-8 mt-4">
                    <a href="https://www.instagram.com/atpr_rennes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="text-[#c5a059] hover:scale-125 transition-transform text-xl">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://m.me/id_messenger_president" target="_blank" class="text-[#c5a059] hover:scale-125 transition-transform text-xl">
                        <i class="fab fa-facebook-messenger"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="mt-12 pt-8 border-t border-white/5 text-center">
            <p class="text-[8px] uppercase tracking-[0.4em] text-[#f5f2e8]/60 italic">
                Savoir, Éthique et Excellence Pharmaceutique
            </p>
        </div>
    </div>
</footer>`;
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    waitForSupabaseThenListen();
}

/* =========================
   ATTENTE DE SUPABASE
========================= */
function waitForSupabaseThenListen() {
    if (!window.supabase) {
        setTimeout(waitForSupabaseThenListen, 50);
        return;
    }

    window.supabase.auth.getSession().then(({ data: { session } }) => {
        applyAuthState(session);
    });

    window.supabase.auth.onAuthStateChange((_event, session) => {
        applyAuthState(session);
    });
}

/* =========================
   LOGIQUE D'AFFICHAGE (UI)
========================= */
function applyAuthState(session) {
    const guest  = document.getElementById('auth-guest');
    const user   = document.getElementById('auth-user');
    const guestM = document.getElementById('auth-guest-mobile');
    const userM  = document.getElementById('auth-user-mobile');

    [guest, guestM].forEach(el => { if (el) el.style.display = session ? 'none' : 'flex'; });
    [user,  userM ].forEach(el => { if (el) el.style.display = session ? 'flex' : 'none'; });
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
        ['modal-login', 'modal-inscription', 'modal-compte'].forEach(otherId => {
            if (otherId !== id) {
                const other = document.getElementById(otherId);
                if (other && other.style.display === 'flex') {
                    other.style.display = 'none';
                }
            }
        });
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
        m.style.display = 'flex';
        document.body.classList.add('modal-open');
    } else {
        m.style.display = 'none';
        const anyOpen = Array.from(document.querySelectorAll('.modal-overlay'))
            .some(el => el.style.display === 'flex');
        if (!anyOpen) {
            document.body.classList.remove('modal-open');
            document.documentElement.style.setProperty('--scrollbar-width', '0px');
        }
    }
};

/* =========================
   MENU MOBILE (HAMBURGER)
========================= */
window.toggleMobileMenu = function() {
    const menu = document.getElementById('nav-mobile-menu');
    const btn  = document.getElementById('nav-hamburger');
    if (!menu) return;
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
};

window.closeMobileMenu = function() {
    document.getElementById('nav-mobile-menu')?.classList.remove('open');
    document.getElementById('nav-hamburger')?.classList.remove('open');
};

window.openCompte = async function() {
    if (!window.supabase) return;
    const { data: { session } } = await window.supabase.auth.getSession();
    if (!session) return;

    const user = session.user;
    const meta = user.user_metadata || {};

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    set('compte-prenom', meta.prenom || meta.first_name);
    set('compte-nom',    meta.nom    || meta.last_name);
    set('compte-promo',  meta.promo  || meta.promotion);
    set('compte-email',  user.email);

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

/* =========================================================
   WIDGET IA MISTRAL - TUTORAT PHARMACIE RENNES
========================================================= */
function injectIAWidget() {
    if (document.getElementById('ia-widget-container')) return;

    const iaContainer = document.createElement('div');
    iaContainer.id = 'ia-widget-container';
    iaContainer.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Montserrat', sans-serif;";

    iaContainer.innerHTML = `
        <div id="ia-bubble" style="width: 60px; height: 60px; background-color: var(--luxury-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: transform 0.2s; user-select: none;">
            🧙‍♂️
        </div>

        <div id="ia-chat-box" style="display: none; width: 360px; height: 480px; background-color: var(--pharma-green); border: 2px solid var(--luxury-gold); border-radius: 12px; position: absolute; bottom: 75px; right: 0; flex-direction: column; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.5); backdrop-filter: blur(8px);">
            
            <div style="background-color: var(--forest-green); padding: 14px; border-bottom: 1px solid var(--luxury-gold); display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">✨</span>
                    <span style="color: var(--luxury-gold); font-weight: 600; font-size: 0.95rem;">Le Mage du Tutorat</span>
                </div>
                <span id="close-ia" style="cursor: pointer; color: var(--parchment); font-size: 1.5rem; line-height: 1;">&times;</span>
            </div>
            
            <div id="ia-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; color: var(--parchment); scroll-behavior: smooth;">
                <div style="background: rgba(245, 242, 232, 0.08); padding: 10px 14px; border-radius: 12px; align-self: flex-start; max-width: 85%; line-height: 1.4;">
                    Salutations, jeune Pupuce ! 🧪 Je suis le <b>Mage du Tutorat</b>. 
                    Je suis là pour répondre à tes questions & même te créer des petits QCM Al Dente ! Mage Pupuce est là pour aider jeune Pupuce !
                </div>
            </div>
            
            <div style="padding: 12px; display: flex; gap: 8px; background: var(--forest-green); border-top: 1px solid rgba(197, 160, 89, 0.2);">
                <input type="text" id="ia-input" placeholder="Pose ton énigme au Mage..." style="flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--luxury-gold); background: var(--pharma-green); color: var(--parchment); font-size: 0.85rem; outline: none;">
                <button id="ia-send-btn" style="background: var(--luxury-gold); border: none; color: var(--forest-green); padding: 0 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: background 0.2s;">Envoyer</button>
            </div>
        </div>
    `;

    document.body.appendChild(iaContainer);

    // Événements d'ouverture/fermeture
    const bubble = document.getElementById('ia-bubble');
    const chatBox = document.getElementById('ia-chat-box');
    const closeBtn = document.getElementById('close-ia');

    bubble.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'none' ? 'flex' : 'none';
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatBox.style.display = 'none';
    });

    // Envoi des messages
    const sendBtn = document.getElementById('ia-send-btn');
    const input = document.getElementById('ia-input');
    const messagesContainer = document.getElementById('ia-messages');
    
    async function gérerEnvoi() {
        const texte = input.value.trim();
        if (!texte) return;

        // 1. Afficher le message de l'étudiant
        const userDiv = document.createElement('div');
        userDiv.style.cssText = "background: var(--luxury-gold); color: var(--forest-green); padding: 10px 14px; border-radius: 12px; align-self: flex-end; max-width: 85%; font-weight: 500; line-height: 1.4;";
        userDiv.textContent = texte;
        messagesContainer.appendChild(userDiv);
        
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 2. Afficher l'indicateur d'effort de réflexion "..."
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'ia-loading-bubble';
        loadingDiv.style.cssText = "background: rgba(245, 242, 232, 0.05); padding: 10px 14px; border-radius: 12px; align-self: flex-start; max-width: 85%; font-style: italic; color: #a1a1aa;";
        loadingDiv.innerHTML = "Le Mage consulte ses grimoires web... <span class='dots'>✨</span>";
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 3. Appel Edge Function Supabase avec le token JWT de l'utilisateur connecté
        try {
            // Récupération du token JWT de la session active
            const { data: { session } } = await window.supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch('https://zcueonuffhzrvnktxzpl.supabase.co/functions/v1/mistral-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ message: texte })
            });

            const data = await response.json();

            // Retirer le message de chargement
            const loadingBubble = document.getElementById('ia-loading-bubble');
            if (loadingBubble) loadingBubble.remove();

            if (!response.ok || data.error) {
                throw new Error(data.error || `Erreur HTTP ${response.status}`);
            }

            // Afficher la réponse du Mage
            const replyDiv = document.createElement('div');
            replyDiv.style.cssText = "background: rgba(245, 242, 232, 0.08); padding: 10px 14px; border-radius: 12px; align-self: flex-start; max-width: 85%; line-height: 1.4;";
            replyDiv.innerHTML = (data.reply || '').replace(/\n/g, '<br>');
            messagesContainer.appendChild(replyDiv);

        } catch (error) {
            console.error("Erreur IA:", error);
            const loadingBubble = document.getElementById('ia-loading-bubble');
            if (loadingBubble) loadingBubble.remove();
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = "background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; padding: 10px 14px; border-radius: 12px; align-self: flex-start; max-width: 85%; color: #fca5a5;";
            errorDiv.textContent = "Une perturbation magique empêche le Mage de répondre. Réessaie plus tard !";
            messagesContainer.appendChild(errorDiv);
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendBtn.addEventListener('click', gérerEnvoi);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') gérerEnvoi(); });
}

// Lancement automatique
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectIAWidget);
} else {
    injectIAWidget();
}

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

    if (!isLibrairie && !isMethodo) return;

    function showContent() {
        if (main) {
            main.style.filter        = '';
            main.style.pointerEvents = '';
            main.style.userSelect    = '';
            main.style.opacity       = '';
        }
        const mErr = document.getElementById('modal-library-error');
        if (mErr && mErr.style.display === 'flex') window.toggleModal('modal-library-error');

        const mPm = document.getElementById('popup-methodo');
        if (mPm) { mPm.style.display = 'none'; document.body.classList.remove('modal-open'); }

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
        if (isLibrairie) {
            const mErr = document.getElementById('modal-library-error');
            if (mErr && mErr.style.display !== 'flex') window.toggleModal('modal-library-error');
        }
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

window.showPage = function(page) {
    const ids = {
        'mentions-legales': 'modal-mentions-legales',
        'politique-confidentialite': 'modal-politique-confidentialite',
        'cgu': 'modal-cgu'
    };
    const modalId = ids[page];
    if (modalId) toggleModal(modalId);
};

// Lancement automatique
document.addEventListener('DOMContentLoaded', () => { injectNavbar(); initPageAccess(); });