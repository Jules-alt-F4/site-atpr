async function handleLibraryAccess(event) {
  if (event) event.preventDefault();
  if (isProcessingLibrary) return;
  isProcessingLibrary = true;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // Si non connecté, afficher la modale de connexion
    toggleModal('modal-library-error');
    isProcessingLibrary = false;
    return;
  }

  // Si connecté, naviguer vers la bibliothèque
 window.location.href = '/bibliotheque.html';
  isProcessingLibrary = false;
}
