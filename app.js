(function () {
    const API = "http://127.0.0.1:8000";
    const username = localStorage.getItem("currentUser");

    if (!username) {
        window.location.replace("index.html");
        return;
    }

    function getInitials(name) {
        return name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part[0].toUpperCase())
            .join("");
    }

    function displayUser(name) {
    document.querySelectorAll("[data-current-username]")
        .forEach(element => {
            element.textContent = name;
        });

    document.querySelectorAll("[data-current-initials]")
        .forEach(element => {
            element.textContent = getInitials(name);
        });
    }
    displayUser(username);

    // Load account information from FastAPI.
    async function loadCurrentUser() {
        try {
            const response = await fetch(
                `${API}/users/${encodeURIComponent(username)}`
            );

            if (response.status === 404) {
                localStorage.removeItem("currentUser");
                window.location.replace("index.html");
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const user = await response.json();

            if (user.role !== "user") {
                window.location.replace(
                    user.role === "admin" ? "admin.html" : "index.html"
                );
                return;
            }
            displayUser(user.username);
        } catch (error) {
            console.error(
                "Unable to load account from backend:",
                error
            );
        }
    }

    // Logout.
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        window.location.replace("index.html");
    });

    // Sidebar.
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");

    menuBtn?.addEventListener("click", () => {
        sidebar?.classList.toggle("open");
    });

    loadCurrentUser();
})();
