document.addEventListener("DOMContentLoaded", function() {
    loadArticles();
    setupThemeToggle();
    setupSorting();
    setupSearch();
    setupCategoryIcons();
});

function setupSearch() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        loadArticles(undefined, searchTerm);
    });
}

function setupCategoryIcons() {
    const categoryLinks = document.querySelectorAll(".category-link");
    categoryLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Отменяем переход по ссылке
            const category = link.getAttribute("data-category");
            loadArticles(undefined, "", category);
        });
    });
}

function loadArticles(sortBy = "views", searchTerm = "", category = "all") {
    fetch("articles.json")
        .then(response => response.json())
        .then(data => {
            const newsSection = document.getElementById("news-section");
            const mostPopularArticle = document.getElementById("most-popular-article");
            newsSection.innerHTML = "";

            // Фильтрация по заголовку и категории
            const filteredArticles = data.articles.filter(article => {
                const matchesSearch = article.title.toLowerCase().includes(searchTerm);
                const matchesCategory = category === "all" || article.category === category;
                return matchesSearch && matchesCategory;
            });

            if (filteredArticles.length === 0) {
                newsSection.innerHTML = `<p>No articles found matching "${searchTerm}" in ${category} category</p>`;
                return;
            }

            // Сортировка статей по выбранному критерию
            filteredArticles.sort((a, b) => {
                if (sortBy === "views") {
                    return b.views - a.views;
                } else if (sortBy === "date") {
                    return new Date(b.date) - new Date(a.date);
                }
            });

            // Отображение самой популярной статьи
            const topArticle = filteredArticles[0];
            const topReadingTime = Math.ceil(topArticle.wordCount / 200);
            mostPopularArticle.innerHTML = `
                <h5>${topArticle.title}</h5>
                <img src="${topArticle.image}" alt="${topArticle.title}" class="img-fluid mb-2">
                <p>${topArticle.content.substring(0, 150)}...</p>
                <p><small>Views: ${topArticle.views} | Reading time: ${topReadingTime} min</small></p>
            `;

            // Отображение всех статей
            filteredArticles.forEach(article => {
                const readingTime = Math.ceil(article.wordCount / 200);
                newsSection.innerHTML += `
                    <div class="col-md-4">
                        <div class="card">
                            <img src="${article.image}" class="card-img-top" alt="${article.title}">
                            <div class="card-body">
                                <h5 class="card-title">${article.title}</h5>
                                <p class="card-text">${article.content.substring(0, 100)}...</p>
                                <p><small class="text-muted">Category: ${article.category} | Views: ${article.views}</small></p>
                                <p><small class="text-muted">Estimated reading time: ${readingTime} min</small></p>
                            </div>
                        </div>
                    </div>`;
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

function setupSorting() {
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (event) => {
            loadArticles(event.target.value);
        });
    }
}
