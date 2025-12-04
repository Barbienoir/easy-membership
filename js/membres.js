// === DONNÉES DE DÉPART (Simulées dans Local Storage) ===
const OBJECTIF = 300000;
const PAIEMENT_MENSUEL = 25000;
const MOIS_COTES = ["Octobre", "Novembre", "Décembre", "Janvier", "Février"];
const USER_KEY = 'currentUser';
const COTISATIONS_KEY = 'userCotisations';

// Simulation d'authentification: Vérifie l'utilisateur dans localStorage
function simulateAuthGuard() {
    let currentUser = JSON.parse(localStorage.getItem(USER_KEY));
    if (!currentUser || currentUser.role !== 'user') {
        // Redirection simulée vers la page de connexion ou création d'un utilisateur par défaut
        console.log("Utilisateur non standard ou non connecté. Création d'un utilisateur par défaut.");
        currentUser = {
            uid: "sim-user-123",
            email: "utilisateur@asc.com",
            prenom: "Ahmet Tidiane",
            nom: "Cissé",
            role: "user"
        };
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        // Si vous voulez une vraie redirection si non connecté, décommentez la ligne ci-dessous et commentez la création par défaut :
        // window.location.href = "index.html"; 
    }
    return currentUser;
}

// Récupère ou initialise les données de cotisation
function getCotisationsData() {
    let cotisations = JSON.parse(localStorage.getItem(COTISATIONS_KEY));
    if (!cotisations) {
        // Initialisation des données simulées
        cotisations = {
            total: 0,
            payments: MOIS_COTES.map(mois => ({
                mois: mois,
                montant: PAIEMENT_MENSUEL,
                date: null,
                statut: "En attente"
            }))
        };
        localStorage.setItem(COTISATIONS_KEY, JSON.stringify(cotisations));
    }
    return cotisations;
}

// Met à jour les éléments du dashboard
function updateDashboard(cotisations) {
    const total = cotisations.total;
    const montantRestant = OBJECTIF - total;
    const pourcentage = ((total / OBJECTIF) * 100).toFixed(1);

    // Mise à jour des cartes
    document.getElementById("totalCotise").innerText = total.toLocaleString('fr-FR') + " FCFA";
    document.getElementById("montantRestant").innerText = montantRestant.toLocaleString('fr-FR') + " FCFA";
    document.getElementById("sommeCotisé").innerText = total.toLocaleString('fr-FR') + " FCFA";
    document.getElementById("pourcent").innerText = `${pourcentage}% rempli`;

    // Mise à jour de la barre de progression
    const progress = document.getElementById("progressCaisse");
    progress.style.width = `${pourcentage}%`;
    progress.setAttribute('aria-valuenow', pourcentage);

    // Mise à jour du tableau
    const rows = document.querySelectorAll(".cotisation-row");
    cotisations.payments.forEach((payment, index) => {
        const row = rows[index];
        if (row) {
            row.querySelector(".date-cotisation").innerText = payment.date || '-';
            row.querySelector(".montant-cotisation").innerText = `${payment.montant} FCFA`;
            const statusDiv = row.querySelector(".status-cotisation");
            statusDiv.innerText = payment.statut;
            
            // Mise à jour de la couleur du statut (text-success pour Bootstrap)
            if(payment.statut === "Validé") {
                statusDiv.classList.add("text-success"); 
                statusDiv.classList.remove("text-teal-900"); 
            } else {
                statusDiv.classList.add("text-teal-900");
                statusDiv.classList.remove("text-success");
            }
        }
    });

    // Mise à jour des graphiques
    const dataCotisations = cotisations.payments.map(p => p.statut === "Validé" ? p.montant : 0);
    updateLineChart(dataCotisations);
    updatePieChart(total, montantRestant);
    
    // Gestion du bouton 'Cotiser'
    const nextPaymentIndex = cotisations.payments.findIndex(p => p.statut === "En attente");
    const cotiserBtn = document.getElementById("cotiser");
    if (nextPaymentIndex === -1 || total >= OBJECTIF) {
        cotiserBtn.disabled = true;
        cotiserBtn.innerText = "Objectif Atteint";
    } else {
        cotiserBtn.disabled = false;
        cotiserBtn.innerText = `Cotiser (Mois: ${cotisations.payments[nextPaymentIndex].mois})`;
    }
}

// Fonction de déconnexion (simulée)
function logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(COTISATIONS_KEY); // Efface les données pour le prochain utilisateur
    window.location.href = "index.html"; // Redirection simulée
}


// === GRAPHIQUES CHART.JS ===

// Config et initialisation du Line Chart (globale pour y accéder par la fonction de mise à jour)
let lineChart;
let barChart;

function initializeCharts(cotisationsData) {
    const dataCotisations = cotisationsData.payments.map(p => p.statut === "Validé" ? p.montant : 0);
    const total = cotisationsData.total;
    const montantRestant = OBJECTIF - total;

    // Line Chart
    const lineCtx = document.getElementById("lineCanvas").getContext("2d");
    lineChart = new Chart(lineCtx, {
        type: "line",
        data: {
            labels: MOIS_COTES,
            datasets: [{
                label: "Cotisations (FCFA)",
                data: dataCotisations, 
                borderColor: 'var(--bleue-fonce)',
                backgroundColor: 'rgba(0, 59, 112, 0.3)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'var(--bleue-fonce)',
                pointRadius: 6,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } },
        },
    });

    // Pie Chart
    const barCtx = document.getElementById("barCanvas").getContext("2d");
    barChart = new Chart(barCtx, {
        type: "pie",
        data: {
            labels: ["Cotisé", "Restant"],
            datasets: [{
                data: [total, montantRestant],
                backgroundColor: ['var(--bleue)', '#dc3545'],
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
        },
    });
}

function updateLineChart(data) {
    if (lineChart) {
        lineChart.data.datasets[0].data = data;
        lineChart.update();
    }
}

function updatePieChart(total, restant) {
    if (barChart) {
        barChart.data.datasets[0].data = [total, restant];
        barChart.update();
    }
}


// === LOGIQUE D'INITIALISATION ET ÉVÉNEMENTS ===

document.addEventListener("DOMContentLoaded", () => {
    const currentUser = simulateAuthGuard();
    let cotisations = getCotisationsData();
    
    // 1. Afficher le nom de l'utilisateur
    const displayName = currentUser.prenom 
        ? `${currentUser.prenom} ${currentUser.nom || ""}`.trim() 
        : currentUser.email;
    document.getElementById("userName").textContent = displayName;
    
    // 2. Initialiser les graphiques
    initializeCharts(cotisations);

    // 3. Initialiser le dashboard avec les données actuelles
    updateDashboard(cotisations);

    // 4. Gestion de l'événement de validation de paiement
    document.getElementById("validerPayment").addEventListener("click", () => {
        cotisations = JSON.parse(localStorage.getItem(COTISATIONS_KEY));
        const nextPaymentIndex = cotisations.payments.findIndex(p => p.statut === "En attente");

        if (nextPaymentIndex !== -1) {
            // Mise à jour des données de cotisation dans le localStorage
            cotisations.payments[nextPaymentIndex].date = new Date().toLocaleDateString("fr-FR");
            cotisations.payments[nextPaymentIndex].statut = "Validé";
            cotisations.total += PAIEMENT_MENSUEL;
            localStorage.setItem(COTISATIONS_KEY, JSON.stringify(cotisations));

            // Mettre à jour l'affichage
            updateDashboard(cotisations);
            alert("Paiement validé ✅");
        } else {
            alert("⚠️ Toutes les cotisations sont déjà validées !");
        }
    });
    
    // 5. Gestion de la déconnexion
    document.getElementById('confirmLogout').addEventListener('click', logout);
    
    // 6. Gestion de la sidebar mobile (logique client-side)
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById("open-sidebar");
    const closeBtn = document.getElementById("close-sidebar");

    openBtn.addEventListener("click", () => {
        sidebar.classList.add("sidebar-open");
        overlay.classList.remove("d-none");
    });

    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("sidebar-open");
        overlay.classList.add("d-none");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("sidebar-open");
        overlay.classList.add("d-none");
    });
});