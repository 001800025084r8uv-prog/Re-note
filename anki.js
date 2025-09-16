document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('card-form');
    const cardList = document.getElementById('card-list');
    const toggleHideBtn = document.getElementById('toggle-hide-btn');
    const categoryNameInput = document.getElementById('category-name');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const renameCategoryBtn = document.getElementById('rename-category-btn');
    const deleteCategoryBtn = document.getElementById('delete-category-btn');
    const categoryListSelect = document.getElementById('category-list');
    
    let isMeaningHidden = true;
    let currentCategory = 'all';


    // ページを読み込んだときにデータを復元
    loadCategories();
    loadCards();


    // カテゴリーを追加するボタンの処理
    addCategoryBtn.addEventListener('click', () => {
        const categoryName = categoryNameInput.value.trim();
        if (categoryName && !isCategoryExists(categoryName)) {
            addCategoryToSelect(categoryName);
            saveCategories();
            categoryNameInput.value = '';
        } else if (isCategoryExists(categoryName)) {
            alert('そのカテゴリーは既に存在します。');
        }
    });


    // カテゴリー名を変更するボタンの処理
    renameCategoryBtn.addEventListener('click', () => {
        const newName = categoryNameInput.value.trim();
        const oldName = categoryListSelect.value;
        if (newName && oldName !== 'all' && !isCategoryExists(newName)) {
            // ローカルストレージ内のデータを更新
            let cards = JSON.parse(localStorage.getItem('cards')) || [];
            cards.forEach(card => {
                if (card.category === oldName) {
                    card.category = newName;
                }
            });
            localStorage.setItem('cards', JSON.stringify(cards));


            // カテゴリーリストを更新
            const options = document.querySelectorAll('#category-list option');
            options.forEach(option => {
                if (option.value === oldName) {
                    option.value = newName;
                    option.textContent = newName;
                }
            });
            saveCategories();
            categoryNameInput.value = '';
            currentCategory = newName;
            loadCards();
            alert(`カテゴリー名が「${oldName}」から「${newName}」に変更されました。`);
        } else if (oldName === 'all') {
            alert('「すべてのカード」は変更できません。');
        } else if (isCategoryExists(newName)) {
            alert('そのカテゴリーは既に存在します。');
        }
    });


    // カテゴリーを削除するボタンの処理
    deleteCategoryBtn.addEventListener('click', () => {
        const categoryToDelete = categoryListSelect.value;
        if (categoryToDelete === 'all') {
            alert('「すべてのカード」は削除できません。');
            return;
        }


        const confirmDelete = confirm(`「${categoryToDelete}」カテゴリーと、その中のすべてのカードを削除してもよろしいですか？`);
        if (confirmDelete) {
            // カテゴリーをローカルストレージから削除
            let categories = JSON.parse(localStorage.getItem('categories')) || [];
            const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
            localStorage.setItem('categories', JSON.stringify(updatedCategories));


            // そのカテゴリーに紐づくカードをすべて削除
            let cards = JSON.parse(localStorage.getItem('cards')) || [];
            const updatedCards = cards.filter(card => card.category !== categoryToDelete);
            localStorage.setItem('cards', JSON.stringify(updatedCards));


            // ドロップダウンリストからオプションを削除
            const optionToRemove = categoryListSelect.querySelector(`option[value="${categoryToDelete}"]`);
            if (optionToRemove) {
                optionToRemove.remove();
            }


            // 表示を「すべてのカード」に戻す
            categoryListSelect.value = 'all';
            currentCategory = 'all';
            loadCards();
            alert(`カテゴリー「${categoryToDelete}」を削除しました。`);
        }
    });


    // カテゴリー選択が変更されたときの処理
    categoryListSelect.addEventListener('change', () => {
        currentCategory = categoryListSelect.value;
        loadCards();
    });


    // フォームが送信されたときの処理
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const word = document.getElementById('word').value;
        const meaning = document.getElementById('meaning').value;
        if (word && meaning && currentCategory !== 'all') {
            const cardData = { word: word, meaning: meaning, category: currentCategory };
            addCard(cardData);
            saveCard(cardData);
            cardForm.reset();
        } else if (currentCategory === 'all') {
            alert('カードを追加するにはカテゴリーを選択してください。');
        }
    });


    // 隠す側を切り替えるボタンの処理
    toggleHideBtn.addEventListener('click', () => {
        isMeaningHidden = !isMeaningHidden;
        if (isMeaningHidden) {
            toggleHideBtn.textContent = '意味側を隠す';
        } else {
            toggleHideBtn.textContent = '単語側を隠す';
        }
        updateCardDisplay();
    });


    // カードをDOMに追加する関数
    function addCard(cardData) {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        
        cardItem.innerHTML = `
            <div class="card-content">
                <div class="word">${cardData.word}</div>
                <div class="meaning">${cardData.meaning}</div>
            </div>
            <div class="card-controls">
                <button class="move-btn" data-word="${cardData.word}" data-meaning="${cardData.meaning}" data-category="${cardData.category}">移動</button>
                <button class="delete-btn" data-word="${cardData.word}" data-meaning="${cardData.meaning}" data-category="${cardData.category}">削除</button>
            </div>
        `;
        cardList.appendChild(cardItem);


        cardItem.querySelector('.card-content').addEventListener('click', () => {
            cardItem.querySelector('.word').classList.toggle('hidden');
            cardItem.querySelector('.meaning').classList.toggle('hidden');
        });


        cardItem.querySelector('.delete-btn').addEventListener('click', (e) => {
            const wordToDelete = e.target.dataset.word;
            const meaningToDelete = e.target.dataset.meaning;
            const categoryToDelete = e.target.dataset.category;


            let cards = JSON.parse(localStorage.getItem('cards')) || [];
            const updatedCards = cards.filter(card => !(card.word === wordToDelete && card.meaning === meaningToDelete && card.category === categoryToDelete));
            localStorage.setItem('cards', JSON.stringify(updatedCards));
            e.target.closest('.card-item').remove();
        });


        cardItem.querySelector('.move-btn').addEventListener('click', (e) => {
            const currentWord = e.target.dataset.word;
            const currentMeaning = e.target.dataset.meaning;
            const currentCategory = e.target.dataset.category;
            
            const newCategory = prompt('移動先のカテゴリー名を入力してください:');
            if (newCategory) {
                let cards = JSON.parse(localStorage.getItem('cards')) || [];
                const cardToMove = cards.find(card => card.word === currentWord && card.meaning === currentMeaning && card.category === currentCategory);
                if (cardToMove) {
                    cardToMove.category = newCategory;
                    localStorage.setItem('cards', JSON.stringify(cards));
                    loadCards();
                    if (!isCategoryExists(newCategory)) {
                        addCategoryToSelect(newCategory);
                        saveCategories();
                    }
                    alert(`カードが「${newCategory}」に移動しました。`);
                }
            }
        });
    }


    // カテゴリーをドロップダウンに追加する関数
    function addCategoryToSelect(categoryName) {
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        categoryListSelect.appendChild(option);
    }


    // カードをローカルストレージに保存する関数
    function saveCard(cardData) {
        let cards = JSON.parse(localStorage.getItem('cards')) || [];
        cards.push(cardData);
        localStorage.setItem('cards', JSON.stringify(cards));
    }


    // ローカルストレージからカードを読み込む関数
    function loadCards() {
        cardList.innerHTML = '';
        let cards = JSON.parse(localStorage.getItem('cards')) || [];
        const filteredCards = cards.filter(card => currentCategory === 'all' || card.category === currentCategory);
        filteredCards.forEach(cardData => {
            addCard(cardData);
        });
        updateCardDisplay();
    }


    // カテゴリーをローカルストレージに保存する関数
    function saveCategories() {
        let categories = [];
        document.querySelectorAll('#category-list option').forEach(option => {
            if (option.value !== 'all') {
                categories.push(option.value);
            }
        });
        localStorage.setItem('categories', JSON.stringify(categories));
    }


    // ローカルストレージからカテゴリーを読み込む関数
    function loadCategories() {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.forEach(categoryName => {
            addCategoryToSelect(categoryName);
        });
    }


    // カテゴリーが既に存在するかチェック
    function isCategoryExists(categoryName) {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        return categories.includes(categoryName);
    }


    // 表示を更新する関数
    function updateCardDisplay() {
        document.querySelectorAll('.card-item .word').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.card-item .meaning').forEach(el => el.classList.remove('hidden'));
        
        const cardElements = document.querySelectorAll('.card-item');
        cardElements.forEach(cardItem => {
            const wordEl = cardItem.querySelector('.word');
            const meaningEl = cardItem.querySelector('.meaning');
            if (isMeaningHidden) {
                meaningEl.classList.add('hidden');
            } else {
                wordEl.classList.add('hidden');
            }
        });
    }
});