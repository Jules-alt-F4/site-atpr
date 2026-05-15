/* ==============================================
   INITIALISATION SUPABASE — inclure dans TOUTES
   les pages, AVANT nav.js et auth.js
   Ordre dans chaque HTML :
     1. <script src="supabase-init.js"></script>
     2. <script src="nav.js"></script>
     3. <script src="auth.js"></script>
============================================== */
(function () {
    const SUPABASE_URL = "https://zcueonuffhzrvnktxzpl.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWVvbnVmZmh6cnZua3R4enBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODkzODQsImV4cCI6MjA5NDI2NTM4NH0.oq8tqUKohvmiRkopSRu4BBx9OfaVXsgXhY3MxIkfZD0";

    // Le build UMD expose window.supabase = { createClient, ... }
    // On le remplace par le client instancié
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
        console.error("SDK Supabase non chargé — vérifiez que le CDN UMD est inclus avant supabase-init.js");
    }
})();
