document.addEventListener("DOMContentLoaded", function(){
    const rows = document.querySelectorAll(".member-table tbody tr");

    const voirModal = new bootstrap.Modal(document.getElementById('voirModal'));
    const modifierModal = new bootstrap.Modal(document.getElementById('modifierModal'));

    rows.forEach((row, index) => {
        const nom = row.children[0].textContent;
        const date = row.children[1].textContent;
        const cotise = row.children[2].textContent;
        const restant = row.children[3].textContent;

        const voir = row.querySelector(".bi-eye");
        const modifier = row.querySelector(".bi-pencil-square");
        const bloquer = row.querySelector(".bi-slash-circle");
        const debloquer = row.querySelector(".bi-check-circle");

   
        voir.addEventListener("click", () => {
            document.getElementById('voirNom').textContent = row.children[0].textContent;
            document.getElementById('voirDate').textContent = row.children[1].textContent;
            document.getElementById('voirCotise').textContent = row.children[2].textContent;
            document.getElementById('voirRestant').textContent = row.children[3].textContent;
            voirModal.show();
        });

   
        modifier.addEventListener("click", () => {
            document.getElementById('modifierRowIndex').value = index;
            document.getElementById('modifierDate').value = row.children[1].textContent;
            document.getElementById('modifierCotise').value = row.children[2].textContent.replace(' FCFA','');
            document.getElementById('modifierRestant').value = row.children[3].textContent.replace(' FCFA','');
            modifierModal.show();
        });

     
        if(bloquer){
            bloquer.addEventListener("click", () => {
                bloquer.style.display = "none";
                debloquer.style.display = "inline-block";
                row.style.backgroundColor = "#f8d7da";
            });
        }

        if(debloquer){
            debloquer.addEventListener("click", () => {
                debloquer.style.display = "none";
                bloquer.style.display = "inline-block";
                row.style.backgroundColor = "";
            });
        }
    });

    document.getElementById('modifierForm').addEventListener('submit', function(e){
        e.preventDefault();
        const rowIndex = document.getElementById('modifierRowIndex').value;
        const row = rows[rowIndex];
        row.children[1].textContent = document.getElementById('modifierDate').value;
        row.children[2].textContent = document.getElementById('modifierCotise').value + ' FCFA';
        row.children[3].textContent = document.getElementById('modifierRestant').value + ' FCFA';
        modifierModal.hide();
    });
});






document.addEventListener("DOMContentLoaded", function(){
    const rows = Array.from(document.querySelectorAll(".member-table tbody tr"));
    const rowsPerPage = 3;
    const pagination = document.getElementById("pagination");
    let currentPage = 1;
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    function showPage(page) {
        currentPage = page;
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

      
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? "" : "none";
        });

      
        pagination.innerHTML = "";

      
        const prevLi = document.createElement("li");
        prevLi.className = "page-item " + (page === 1 ? "disabled" : "");
        prevLi.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        prevLi.addEventListener("click", (e) => {
            e.preventDefault();
            if(currentPage > 1) showPage(currentPage - 1);
        });
        pagination.appendChild(prevLi);

   
        for(let i = 1; i <= totalPages; i++){
            const li = document.createElement("li");
            li.className = "page-item " + (i === page ? "active" : "");
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", (e) => {
                e.preventDefault();
                showPage(i);
            });
            pagination.appendChild(li);
        }

       
        const nextLi = document.createElement("li");
        nextLi.className = "page-item " + (page === totalPages ? "disabled" : "");
        nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
        nextLi.addEventListener("click", (e) => {
            e.preventDefault();
            if(currentPage < totalPages) showPage(currentPage + 1);
        });
        pagination.appendChild(nextLi);
    }

  
    showPage(1);
});
