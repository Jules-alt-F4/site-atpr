// nav.js

function loadNavbar() {
    const navHTML = `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-[#052e16]/90 backdrop-blur-md border-b border-[#c5a059]/20">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div class="flex items-center">
                <a href="index.html" class="font-heritage text-2xl italic text-[#c5a059] tracking-tighter">ATPr</a>
            </div>

            <div class="hidden md:flex items-center space-x-10">
                <a href="index.html" class="text-[10px] uppercase tracking-[0.2em] hover:text-[#c5a059] transition-colors">L'Institution</a>
                <a href="bureau.html" class="text-[10px] uppercase tracking-[0.2em] hover:text-[#c5a059] transition-colors">Le Bureau</a>
                <a href="bibliotheque.html" id="nav-biblio" class="hidden text-[10px] uppercase tracking-[0.3em] font-bold text-[#c5a059]">Bibliothèque</a>
            </div>

            <div class="flex items-center space-x-6">
                <div id="auth-guest" class="flex items-center space-x-6">
                    <button onclick="toggleModal('modal-login')" class="text-[10px] uppercase tracking-[0.2em] hover:text-[#c5a059]">Connexion</button>
                    <a href="index.html#presentation-association" id="btn-rejoindre" class="border border-[#c5a059] px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all">Rejoindre</a>
                </div>
                
                <div id="auth-user" class="hidden flex items-center space-x-6">
                    <a href="compte.html" class="text-[10px] uppercase tracking-[0.2em] hover:text-[#c5a059]">Mon Compte</a>
                    <button onclick="handleLogout()" class="border border-[#c5a059] px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all">Déconnexion</button>
                </div>
            </div>
        </div>
    </nav>
    `;

    // On insère le HTML au tout début du body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // Une fois injecté, on vérifie l'état de la connexion Supabase
    checkUserStatus();
}

// Fonction pour vérifier la session Supabase et ajuster l'affichage
async function checkUserStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    
    const guestGroup = document.getElementById('auth-guest');
    const userGroup = document.getElementById('auth-user');
    const navBiblio = document.getElementById('nav-biblio');
    const btnRejoindre = document.getElementById('btn-rejoindre');

    if (session) {
        if(guestGroup) guestGroup.classList.add('hidden');
        if(userGroup) userGroup.classList.remove('hidden');
        if(navBiblio) navBiblio.classList.remove('hidden');
        if(btnRejoindre) btnRejoindre.classList.add('hidden');
    }
}

// Lancer le chargement
document.addEventListener('DOMContentLoaded', loadNavbar);
