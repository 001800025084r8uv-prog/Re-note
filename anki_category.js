document.addEventListener('DOMContentLoaded', () => {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const categoryNameInput = document.getElementById('category-name');
    const categoryListGrid = document.getElementById('category-list');


    loadCategories();


    addCategoryBtn.addEventListener('click', () => {
        const categoryName = categoryNameInput.value.trim();
        if (categoryName && !isCategoryExists(categoryName)) {
            addCategoryToDisplay(categoryName);
            saveCategories(categoryName);
            categoryNameInput.value = '';
        }
    });


    function addCategoryToDisplay(categoryName) {
        const categoryCard = document.createElement('a');
        categoryCard.href = `anki.html?category=${encodeURIComponent(categoryName)}`;
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `<h3>${categoryName}</h3>`;
        categoryListGrid.appendChild(categoryCard);
    }


    function saveCategories(categoryName) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.push(categoryName);
        localStorage.setItem('categories', JSON.stringify(categories));
    }


    function loadCategories() {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.forEach(categoryName => {
            addCategoryToDisplay(categoryName);
        });
    }


    function isCategoryExists(categoryName) {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        return categories.includes(categoryName);
    }
});