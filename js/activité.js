document.addEventListener('DOMContentLoaded', function() {
  let activities = JSON.parse(localStorage.getItem('activities')) || [
    { title: "Test Activité", location: "Test Activité", dateISO: "2024-05-11T02:00", description: "Test Activité, Test Activité, Test Activité", category: "Autre", guests: [] },
    { title: "Formation Leadership", location: "Dakar - SN", dateISO: "2024-05-25T09:30", description: "Session de formation dédiée au développement du leadership pour jeunes entrepreneurs.", category: "Formation", guests: [] },
    { title: "Investiture du Président", location: "CICAD", dateISO: "2024-04-02T02:00", description: "Cérémonie officielle d'investiture du nouveau président.", category: "Politique", guests: [] },
    { title: "Séminaire Transformation Digitale", location: "Azalai Hôtel", dateISO: "2024-06-08T10:00", description: "Digitalisation des entreprises africaines.", category: "Technologie", guests: [] },
    { title: "Atelier Design Thinking", location: "Saint-Louis - SN", dateISO: "2024-06-18T14:00", description: "Atelier de co-création pour stimuler l’innovation.", category: "Formation", guests: [] },
    { title: "Conférence Économie Bleue", location: "Université Iba Der Thiam", dateISO: "2024-07-12T11:20", description: "Opportunités économiques liées à la mer.", category: "Économie", guests: [] },
    { title: "Projet Eco-Scientifique", location: "Parc de Hann", dateISO: "2024-08-03T09:00", description: "Activité environnementale dédiée à la biodiversité.", category: "Autre", guests: [] },
    { title: "Hackathon Jeunesse", location: "ESP Dakar", dateISO: "2024-08-20T08:00", description: "Compétition technologique de 48h.", category: "Technologie", guests: [] },
    { title: "Forum des Associations", location: "Place du Souvenir", dateISO: "2024-09-01T13:00", description: "Networking entre associations nationales.", category: "Autre", guests: [] },
    { title: "Journée Culturelle", location: "Maison de la Culture Douta Seck", dateISO: "2024-09-15T16:30", description: "Évènement artistique et culturel.", category: "Culture", guests: [] }
  ];

  activities = activities.map(a => {
    if(!a.dateISO && a.date){
      const iso = new Date(a.date).toISOString().slice(0,16);
      return {...a, dateISO: iso};
    }
    return a;
  });

  let itemsPerPage = 4;
  let currentIndex = 1;

  const container = document.getElementById('activities-container');
  const pagination = document.getElementById('pagination');

  // Bouton retour
  const backBtn = document.getElementById("backBtn");
  if(backBtn){
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html"; // ← mettre le nom de la page d'accueil
    });
  }

  function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  function formatDateForDisplay(dateISO) {
    const d = new Date(dateISO);
    if (isNaN(d)) return '';
    return d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  function sortActivities(order='recent') {
    activities.sort((a,b) => order==='recent' ? new Date(b.dateISO) - new Date(a.dateISO) : new Date(a.dateISO) - new Date(b.dateISO));
  }

  function renderActivities() {
    container.innerHTML = '';
    sortActivities(document.getElementById('sortSelect')?.value || 'recent');

    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterCat = document.getElementById('filterCategory')?.value || '';
    const filtered = activities.filter(a => 
      (a.title.toLowerCase().includes(search) || a.location.toLowerCase().includes(search)) &&
      (filterCat === '' || a.category === filterCat)
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentIndex-1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filtered.slice(start, end);

    paginated.forEach((a,i) => {
      container.innerHTML += `
        <div class="col-md-6">
          <div class="card-activity">
            <h4 class="title-activity">
              ${a.title} 
              ${a.category ? `<span class="category-badge">${a.category}</span>` : ''}
            </h4>
            <p><i class="bi bi-geo-alt"></i> ${a.location}</p>
            <p><i class="bi bi-calendar3"></i> ${formatDateForDisplay(a.dateISO)}</p>
            <p>${a.description}</p>
            <div class="mt-2">
              <i class="bi bi-pencil-square text-primary me-2" onclick="editActivity(${activities.indexOf(a)})"></i>
              <i class="bi bi-trash text-danger" onclick="deleteActivity(${activities.indexOf(a)})"></i>
            </div>
          </div>
        </div>
      `;
    });

    renderPagination(totalPages);
  }

  function renderPagination(total) {
    pagination.innerHTML = '';
    for(let i=1; i<=total; i++) {
      pagination.innerHTML += `<li class="page-item ${i===currentIndex?'active':''}"><a class="page-link" onclick="gotoPage(${i})">${i}</a></li>`;
    }
  }

  window.gotoPage = function(page) {
    currentIndex = page;
    renderActivities();
  }

  function addOrUpdateEvent(e){
    e.preventDefault();
    const index = document.getElementById('editingIndex').value;

    const eventData = {
      title: document.getElementById('eventTitle').value,
      location: document.getElementById('eventLocation').value,
      dateISO: document.getElementById('eventDate').value,
      description: document.getElementById('eventDescription').value,
      category: document.getElementById('eventCategory').value || '',
      guests: []
    };

    if(index === '') activities.unshift(eventData);
    else activities[index] = eventData;

    saveActivities();
    bootstrap.Modal.getInstance(document.getElementById('createEventModal')).hide();
    document.getElementById('eventForm').reset();
    currentIndex = 1;
    renderActivities();
  }

  window.editActivity = function(i) {
    const a = activities[i];
    document.getElementById('editingIndex').value = i;
    document.getElementById('eventTitle').value = a.title;
    document.getElementById('eventLocation').value = a.location;
    document.getElementById('eventDate').value = a.dateISO;
    document.getElementById('eventDescription').value = a.description;
    document.getElementById('eventCategory').value = a.category || '';
    new bootstrap.Modal(document.getElementById('createEventModal')).show();
  }

  window.deleteActivity = function(i) {
    if(confirm('Supprimer cet événement ?')) {
      activities.splice(i,1);
      saveActivities();
      renderActivities();
    }
  }

  document.getElementById('eventForm').addEventListener('submit', addOrUpdateEvent);
  document.getElementById('searchInput').addEventListener('input', ()=>{currentIndex=1; renderActivities();});
  document.getElementById('filterCategory').addEventListener('change', ()=>{currentIndex=1; renderActivities();});
  document.getElementById('sortSelect').addEventListener('change', ()=>{currentIndex=1; renderActivities();});

  renderActivities();
});
