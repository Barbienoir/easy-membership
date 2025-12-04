document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginRoleSelect = document.getElementById('inputRole'); // Ajout de la sélection de rôle
    const toggleButtons = document.querySelectorAll('.toggle-password');

    // --- Fonctions utilitaires (inchangées) ---
    
    function displayLoginError(inputElement, message) {
        inputElement.classList.remove('is-valid');
        inputElement.classList.add('is-invalid');
        const parentDiv = inputElement.closest('.input-group') || inputElement.closest('.input-group-lg');
        let feedbackElement = parentDiv ? parentDiv.querySelector('.invalid-feedback') : null;
        
        if (!feedbackElement) {
            // Pour le select qui n'a pas de parent .input-group
            let nextSibling = inputElement.nextElementSibling;
            if (nextSibling && nextSibling.classList.contains('invalid-feedback')) {
                feedbackElement = nextSibling;
            }
        }

        if (!feedbackElement) {
            console.error("Veuillez ajouter un div.invalid-feedback pour afficher les erreurs.");
        } else {
            feedbackElement.textContent = message;
        }
    }
    
    function resetValidationState(inputElement) {
        inputElement.classList.remove('is-invalid', 'is-valid');
    }

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

    // --- Logique de connexion et de redirection par rôle ---
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Réinitialiser les états
        resetValidationState(loginEmailInput);
        resetValidationState(loginPasswordInput);
        resetValidationState(loginRoleSelect); // Réinitialiser l'état du rôle

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();
        const role = loginRoleSelect.value; // Récupérer la valeur du rôle sélectionné

        // Validation simple
        let isValid = true;
        if (email === '') { displayLoginError(loginEmailInput, "L'email est requis."); isValid = false; }
        if (password === '') { displayLoginError(loginPasswordInput, "Le mot de passe est requis."); isValid = false; }
        if (role === '') { displayLoginError(loginRoleSelect, "Le rôle est requis."); isValid = false; }
        
        if (!isValid) return;

        // 1. Récupérer les utilisateurs (simulé par Local Storage)
        const usersString = localStorage.getItem('registeredUsers');
        const users = usersString ? JSON.parse(usersString) : [];

        // 2. Trouver l'utilisateur par email et vérifier le rôle
        const user = users.find(u => u.email === email && u.role === role); // Ajout de la vérification du rôle

        if (!user) {
            // Utilisateur non trouvé ou rôle/email incorrect
            const message = "Email, mot de passe ou rôle incorrect.";
            displayLoginError(loginEmailInput, message);
            displayLoginError(loginPasswordInput, message);
            displayLoginError(loginRoleSelect, message);
            return;
        }

        // 3. Vérifier le mot de passe
        if (user.password === password) {
            // CONNEXION RÉUSSIE
            alert(`Bienvenue, ${user.nom} (Rôle: ${user.role}) ! Connexion réussie.`);
            
            // **ACTION CLÉ 1: Stocker le statut et le rôle**
            localStorage.setItem('isAuthenticated', 'true'); 
            localStorage.setItem('userRole', user.role);     // Stocker le rôle ('Président', 'Secrétaire', 'Membre')
            localStorage.setItem('userName', user.nom);      // Optionnel : Stocker le nom pour l'affichage

            // **ACTION CLÉ 2: Redirection conditionnelle**
            if (user.role === 'Président') {
                // Le Président accède directement à la page Cotisations
                window.location.href = 'cotisations.html'; 
            } else {
                // Tous les autres (Secrétaire, Membre) accèdent au Dashboard Membre
                window.location.href = 'dashboardmembre.html'; 
            }

        } else {
            // Mot de passe incorrect
            const message = "Email, mot de passe ou rôle incorrect.";
            displayLoginError(loginEmailInput, message);
            displayLoginError(loginPasswordInput, message);
            displayLoginError(loginRoleSelect, message);
        }
    });
});