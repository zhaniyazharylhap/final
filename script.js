document.addEventListener("DOMContentLoaded", function() {
    loadArticles();
    setupThemeToggle();
    setupSearch();
    setupCategoryIcons();
    setupSortOptions();
    setupSidebarToggle();
    setupCursorGlow();
});

function loadArticles(sortBy = "views", searchTerm = "", category = "all") {
    fetch("articles.json")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const newsSection = document.getElementById("news-section");
            newsSection.innerHTML = "";

            const filteredArticles = data.articles.filter(article => {
                const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = category === "all" || article.category === category;
                return matchesSearch && matchesCategory;
            });

            console.log("Filtered Articles Before Sorting:", filteredArticles);

            filteredArticles.sort((a, b) => {
                if (sortBy === "views") {
                    return b.views - a.views;
                } else if (sortBy === "date") {
                    return new Date(b.date) - new Date(a.date); 
                }
            });

            console.log("Filtered Articles After Sorting:", filteredArticles);

            if (filteredArticles.length === 0) {
                newsSection.innerHTML = `<p>No articles found matching "${searchTerm}" in ${category} category</p>`;
                return;
            }

            filteredArticles.forEach(article => {
                const readingTime = Math.ceil(article.wordCount / 200);
                const articleCard = document.createElement("div");
                articleCard.className = "col-md-4";
                articleCard.innerHTML = `
                    <div class="card mb-4" data-toggle="modal" data-target="#articleModal" onclick="openModal('${article.title}', '${article.image}', \`${article.content}\`, '${article.date}', '${article.category}', ${article.views}, \`${article.additionalInfo || ''}\`)">
                        <img src="${article.image}" class="card-img-top" alt="${article.title}" onerror="this.onerror=null; this.src='default.png';">
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.content.substring(0, 100)}...</p>
                            <p><small class="text-muted">Category: ${article.category} | Views: ${article.views}</small></p>
                            <p><small class="text-muted">Estimated reading time: ${readingTime} min</small></p>
                        </div>
                    </div>
                `;
                newsSection.appendChild(articleCard);
            });
        })
        .catch(error => console.error("Error loading articles:", error));
}

function openModal(title, image, content, date, category, views, additionalInfo) {
    document.getElementById("articleModalLabel").textContent = title;
    document.getElementById("modalImage").src = image;
    document.getElementById("modalContent").textContent = content;
    document.getElementById("modalDate").textContent = `Published on: ${date}`;
    document.getElementById("modalCategory").textContent = `Category: ${category}`;
    document.getElementById("modalViews").textContent = `Views: ${views}`;
    document.getElementById("additionalInfoText").textContent = additionalInfo;
}

function setupSortOptions() {
    const sortButtons = document.querySelectorAll(".sort-button");

    sortButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const sortBy = event.target.getAttribute("data-sort");

            sortButtons.forEach(btn => btn.classList.remove("active"));
            event.target.classList.add("active");

            loadArticles(sortBy); 
        });
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";

    themeToggle.addEventListener("click", () => {
        const theme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    });
}

function setupSearch() {
    const searchInput = document.getElementById("search-input");
    const mostPopularSection = document.getElementById("most-popular");

    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        if (searchTerm.trim()) {
            mostPopularSection.classList.add("hide");
        } else {
            mostPopularSection.classList.remove("hide");
        }

        loadArticles("views", searchTerm);
    });
}

function setupCategoryIcons() {
    const categoryLinks = document.querySelectorAll(".category-link");
    const mostPopularSection = document.getElementById("most-popular");

    categoryLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const category = link.getAttribute("data-category");

            mostPopularSection.classList.add("hide");

            loadArticles("views", "", category);
        });
    });
}

function setupSidebarToggle() {
    const sidebarMenu = document.getElementById("sidebarMenu");
    const navbarToggler = document.querySelector(".navbar-toggler");
    const closeSidebar = document.querySelector(".close-sidebar");

    navbarToggler.addEventListener("click", () => {
        sidebarMenu.classList.toggle("show");
    });

    closeSidebar.addEventListener("click", () => {
        sidebarMenu.classList.remove("show");
    });
}

function setupCursorGlow() {
    const cursorGlow = document.createElement("div");
    cursorGlow.classList.add("cursor-glow");
    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });
}
