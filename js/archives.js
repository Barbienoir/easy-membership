// Sidebar toggle
    const btn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("sidebar");

    btn.addEventListener("click", () => {
      sidebar.classList.toggle("-translate-x-full");
    });

    // Sous-menu toggle
    function toggleMenu() {
      const submenu = document.getElementById("submenu");
      const arrow = document.getElementById("arrow");
      submenu.classList.toggle("hidden");
      arrow.classList.toggle("rotate-180");
    }