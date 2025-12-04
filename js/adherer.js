document.addEventListener('DOMContentLoaded', function() {
    // 1. Sélection des éléments du DOM
    const form = document.getElementById('myForm');
    const inputNom = document.getElementById('inputNom');
    const inputTelephone = document.getElementById('inputTelephone');
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword'); 
    const inputTitre = document.getElementById('inputTitre');
    const inputAdresse = document.getElementById('inputAdresse');
    const inputRole = document.getElementById('inputRole');
    
    // Sélection des icônes œil pour la visibilité du mot de passe
    const passwordEyeIcons = document.querySelectorAll('.input-group .bi-eye-fill');

    // 2. Fonction utilitaire pour gérer l'affichage des erreurs Bootstrap
    function setValidationState(inputElement, isValid, message = '') {
        if (isValid) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
        } else {
            inputElement.classList.remove('is-valid');
            inputElement.classList.add('is-invalid');
        }

        // Trouve le div.invalid-feedback pour afficher le message
        const parentDiv = inputElement.closest('.input-group') || inputElement.closest('.input-group-lg') || inputElement.closest('div');
        const feedbackElement = parentDiv ? parentDiv.querySelector('.invalid-feedback') : null;

        if (feedbackElement) {
            feedbackElement.textContent = message;
        }
        return isValid; // Retourne le statut de validation
    }

    // 3. Fonctions de validation spécifiques

    // a. Validation des champs non vides (requis)
    function validateRequired(inputElement, fieldName) {
        return setValidationState(
            inputElement, 
            inputElement.value.trim() !== '', 
            `Le champ ${fieldName} est obligatoire.`
        );
    }

    // b. Validation du format Email
    function validateEmail(inputElement) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validateRequired(inputElement, 'Email')) return false;
        
        return setValidationState(
            inputElement,
            emailRegex.test(inputElement.value.trim()),
            "Le format de l'adresse email n'est pas valide."
        );
    }

    // c. Validation du format Téléphone
    function validatePhone(inputElement) {
        const phoneValue = inputElement.value.trim();
        if (!validateRequired(inputElement, 'Téléphone')) return false;
        
        const isValid = !isNaN(phoneValue) && phoneValue.length >= 8 && phoneValue.length <= 15;
        
        return setValidationState(
            inputElement,
            isValid,
            "Le numéro de téléphone doit être valide (8 à 15 chiffres)."
        );
    }

    // d. Validation du Mot de passe (complexité)
    function validatePassword(inputElement) {
        // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial.
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!validateRequired(inputElement, 'Mot de passe')) return false;
        
        return setValidationState(
            inputElement,
            passwordRegex.test(inputElement.value.trim()),
            "Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 spécial."
        );
    }

    // e. Validation de la correspondance des mots de passe (NOUVEAU)
    function validatePasswordMatch() {
        const passwordValue = inputPassword.value.trim();
        const confirmPasswordValue = inputConfirmPassword.value.trim();

        if (!validateRequired(inputConfirmPassword, 'Confirmation Mot de passe')) return false;
        
        // Si le mot de passe principal n'est pas valide, on force l'erreur de non-correspondance
        if (!validatePassword(inputPassword)) {
             setValidationState(inputConfirmPassword, false, "Corrigez d'abord le mot de passe principal.");
             return false;
        }
        
        return setValidationState(
            inputConfirmPassword,
            passwordValue === confirmPasswordValue,
            "Les mots de passe ne correspondent pas."
        );
    }

    // f. Validation de la sélection de rôle
    function validateRole(selectElement) {
         return setValidationState(
            selectElement,
            selectElement.value !== '',
            "Veuillez choisir un rôle."
        );
    }
    
    // 4. Fonction d'affichage/masquage du mot de passe
    function togglePasswordVisibility(iconElement) {
        const passwordInput = iconElement.closest('.input-group').querySelector('input[type="password"], input[type="text"]');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            iconElement.classList.remove('bi-eye-fill');
            iconElement.classList.add('bi-eye-slash-fill');
        } else {
            passwordInput.type = 'password';
            iconElement.classList.remove('bi-eye-slash-fill');
            iconElement.classList.add('bi-eye-fill');
        }
    }

    // 5. Enregistrement des données dans le Local Storage (NOUVEAU)
    function saveUserToLocalStorage(newUser) {
        // 1. Récupérer les utilisateurs existants ou initialiser un tableau
        let users = localStorage.getItem('registeredUsers');
        users = users ? JSON.parse(users) : []; 

        // 2. Vérifier si l'email existe déjà
        const emailExists = users.some(user => user.email === newUser.email);
        
        if (emailExists) {
            setValidationState(inputEmail, false, "Cette adresse email est déjà utilisée.");
            return false;
        }

        // 3. Ajouter le nouvel utilisateur
        users.push(newUser);

        // 4. Sauvegarder la liste mise à jour
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        return true;
    }

    // 6. Fonction de validation et d'enregistrement principale
    function validerFormulaire(event) {
        event.preventDefault(); 

        // Exécuter toutes les validations et stocker le résultat
        let isNomValid = validateRequired(inputNom, 'Prénom et Nom');
        let isPhoneValid = validatePhone(inputTelephone);
        let isEmailValid = validateEmail(inputEmail);
        // Important: valider le mot de passe principal avant le match
        let isPasswordValid = validatePassword(inputPassword);
        let isConfirmPasswordValid = validatePasswordMatch(); 
        let isTitreValid = validateRequired(inputTitre, 'Profession');
        let isAdresseValid = validateRequired(inputAdresse, 'Adresse');
        let isRoleValid = validateRole(inputRole);
        
        // Vérifie si TOUTES les validations sont TRUE
        const isFormValid = isNomValid && isPhoneValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTitreValid && isAdresseValid && isRoleValid;

        if (isFormValid) {
            // Créer l'objet utilisateur
            const newUser = {
                nom: inputNom.value.trim(),
                telephone: inputTelephone.value.trim(),
                email: inputEmail.value.trim(),
                password: inputPassword.value.trim(), // Non sécurisé pour la production!
                titre: inputTitre.value.trim(),
                adresse: inputAdresse.value.trim(),
                role: inputRole.options[inputRole.selectedIndex].text // Texte du rôle sélectionné
            };

            if (saveUserToLocalStorage(newUser)) {
                form.classList.add('was-validated');
                alert("Félicitations, Reine du jour ! Inscription réussie. Vous pouvez maintenant vous connecter.");
                // Optionnel: Réinitialiser le formulaire
                // form.reset(); 
            }
            
        } else {
            // Afficher tous les messages d'erreur Bootstrap
            form.classList.add('was-validated');
            alert("Veuillez corriger les erreurs dans le formulaire.");
        }
    }

    // 7. Écouteurs d'événements

    // Écouteur principal pour la soumission du formulaire
    form.addEventListener('submit', validerFormulaire);
    
    // Écouteurs pour l'affichage/masquage du mot de passe
    passwordEyeIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', () => togglePasswordVisibility(icon));
    });
    
    // Validation en temps réel (lorsque l'utilisateur quitte le champ)
    inputNom.addEventListener('blur', () => validateRequired(inputNom, 'Prénom et Nom'));
    inputTelephone.addEventListener('blur', () => validatePhone(inputTelephone));
    inputEmail.addEventListener('blur', () => validateEmail(inputEmail));
    inputPassword.addEventListener('blur', () => { 
        validatePassword(inputPassword); 
        // Si le champ de confirmation n'est pas vide, on le revalide aussi
        if (inputConfirmPassword.value.trim() !== '') {
            validatePasswordMatch();
        }
    });
    inputConfirmPassword.addEventListener('blur', validatePasswordMatch);
    inputTitre.addEventListener('blur', () => validateRequired(inputTitre, 'Profession'));
    inputAdresse.addEventListener('blur', () => validateRequired(inputAdresse, 'Adresse'));
    inputRole.addEventListener('change', () => validateRole(inputRole)); 
});