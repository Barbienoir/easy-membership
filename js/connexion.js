document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const toggleButtons = document.querySelectorAll('.toggle-password');

    // Fonction utilitaire pour gérer les erreurs de connexion
    function displayLoginError(inputElement, message) {
        // Utiliser les classes Bootstrap pour l'affichage de l'erreur
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        
        // Trouver le feedback (si vous en ajoutez un dans le HTML de connexion)
        const parentDiv = inputElement.closest('.input-group') || inputElement.closest('.input-group-lg');
        let feedbackElement = parentDiv ? parentDiv.querySelector('.invalid-feedback') : null;
        
        // Si pas de feedback, on peut utiliser un alert ou ajouter le feedback dynamiquement
        if (!feedbackElement) {
             console.error("Veuillez ajouter un div.invalid-feedback à l'élément de l'email pour afficher les erreurs.");
        } else {
            feedbackElement.textContent = message;
        }
    }
    
    // Réinitialiser l'état visuel du champ
    function resetValidationState(inputElement) {
        inputElement.classList.remove('is-invalid', 'is-valid');
    }

    // Fonction de bascule d'affichage du mot de passe (réutilisée)
    function togglePasswordVisibility(button) {
        const passwordInput = button.previousElementSibling;
        const icon = button.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye-fill');
            icon.classList.add('bi-eye-slash-fill');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye-slash-fill');
            icon.classList.add('bi-eye-fill');
        }
    }

    // Ajout des écouteurs pour masquer/afficher le mot de passe
    toggleButtons.forEach(button => {
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => togglePasswordVisibility(button));
    });

    // Gestion de la soumission du formulaire de connexion
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Réinitialiser les états
        resetValidationState(loginEmailInput);
        resetValidationState(loginPasswordInput);

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (email === '' || password === '') {
            if (email === '') displayLoginError(loginEmailInput, "L'email est requis.");
            if (password === '') displayLoginError(loginPasswordInput, "Le mot de passe est requis.");
            return;
        }

        // 1. Récupérer les utilisateurs
        const usersString = localStorage.getItem('registeredUsers');
        const users = usersString ? JSON.parse(usersString) : [];

        // 2. Trouver l'utilisateur par email
        const user = users.find(u => u.email === email);

        if (!user) {
            // Utilisateur non trouvé
            displayLoginError(loginEmailInput, "Email ou mot de passe incorrect.");
            displayLoginError(loginPasswordInput, "Email ou mot de passe incorrect.");
            loginForm.classList.add('was-validated');
            return;
        }

        // 3. Vérifier le mot de passe (Rappel: NON SÉCURISÉ)
        if (user.password === password) {
            // CONNEXION RÉUSSIE
            alert(`Bienvenue, ${user.nom} (Role: ${user.role}) ! Connexion réussie.`);
            
            // Stocker l'utilisateur actuellement connecté (par exemple, son email)
            localStorage.setItem('currentUser', user.email); 
            
            // Optionnel : Rediriger vers un tableau de bord
            // window.location.href = 'dashboard.html';

        } else {
            // Mot de passe incorrect
            displayLoginError(loginEmailInput, "Email ou mot de passe incorrect.");
            displayLoginError(loginPasswordInput, "Email ou mot de passe incorrect.");
            loginForm.classList.add('was-validated');
        }
    });
});