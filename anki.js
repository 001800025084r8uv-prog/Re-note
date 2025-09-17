document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('card-form');
    const cardList = document.getElementById('card-list');
    const toggleHideBtn = document.getElementById('toggle-hide-btn');
    const startTestBtn = document.getElementById('start-test-btn');
    const testSection = document.getElementById('test-section');
    const cardManagementSection = document.getElementById('card-management-section');
    const testCard = document.getElementById('test-card');
    const testWord = document.getElementById('test-word');
    const testMeaning = document.getElementById('test-meaning');
    const toggleTestDirectionBtn = document.getElementById('toggle-test-direction');
    const nextCardBtn = document.getElementById('next-card-btn');
    const endTestBtn = document.getElementById('end-test-btn');
    
    let isMeaningHidden = true;
    let currentCategory = '';
    let selectedCards = [];
    let testCards = [];
    let currentTestIndex = 0;
    let isWordToMeaning = true; // true: 単語→意味, false: 意味→単語


    // URLからカテゴリー名を取得
    const params = new URLSearchParams(window.location.search);
    currentCategory = params.get('category');


    if (currentCategory) {
        document.getElementById('category-title').textContent = currentCategory;
        loadCards();
    } else {
        document.querySelector('main').innerHTML = '<p>カテゴリーが選択されていません。</p>';
    }


    // フォームが送信されたときの処理
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const word = document.getElementById('word').value;
        const meaning = document.getElementById('meaning').value;
        if (word && meaning) {
            const cardData = { word: word, meaning: meaning, category: currentCategory };
            saveCard(cardData);
            cardForm.reset();
            loadCards(); // カードを再読み込みして選択機能を追加
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


    // 確認テストを始めるボタンの処理
    startTestBtn.addEventListener('click', () => {
        selectedCards = getSelectedCards();
        if (selectedCards.length > 0) {
            startTest();
        } else {
            alert('確認テストを開始するには、カードを1枚以上選択してください。');
        }
    });


    // テスト中のカードをタップした時の処理
    testCard.addEventListener('click', () => {
        if (isWordToMeaning) {
            testMeaning.classList.toggle('hidden');
        } else {
            testWord.classList.toggle('hidden');
        }
    });


    // 次のカードボタンの処理
    nextCardBtn.addEventListener('click', () => {
        currentTestIndex++;
        if (currentTestIndex < testCards.length) {
            displayTestCard();
        } else {
            alert('すべてのカードの確認が終了しました！');
            endTest();
        }
    });


    // テスト方向切り替えボタンの処理
    toggleTestDirectionBtn.addEventListener('click', () => {
        isWordToMeaning = !isWordToMeaning;
        if (isWordToMeaning) {
            toggleTestDirectionBtn.textContent = '意味→単語';
        } else {
            toggleTestDirectionBtn.textContent = '単語→意味';
        }
        displayTestCard();
    });


    // テスト終了ボタンの処理
    endTestBtn.addEventListener('click', () => {
        endTest();
    });


    // カードをDOMに追加する関数（選択機能を追加）
    function addCard(cardData) {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        
        cardItem.innerHTML = `
            <div class="card-content">
                <div class="word">${cardData.word}</div>
                <div class="meaning">${cardData.meaning}</div>
            </div>
            <div class="card-controls">
                <input type="checkbox" class="select-card-checkbox">
                <button class="delete-btn">削除</button>
            </div>
        `;
        cardList.appendChild(cardItem);


        cardItem.querySelector('.card-content').addEventListener('click', () => {
            cardItem.querySelector('.word').classList.toggle('hidden');
            cardItem.querySelector('.meaning').classList.toggle('hidden');
        });


        cardItem.querySelector('.delete-btn').addEventListener('click', (e) => {
            const wordToDelete = e.target.closest('.card-item').querySelector('.word').textContent;
            const meaningToDelete = e.target.closest('.card-item').querySelector('.meaning').textContent;


            let cards = JSON.parse(localStorage.getItem('cards')) || [];
            const updatedCards = cards.filter(card => !(card.word === wordToDelete && card.meaning === meaningToDelete && card.category === currentCategory));
            localStorage.setItem('cards', JSON.stringify(updatedCards));
            e.target.closest('.card-item').remove();
            selectedCards = getSelectedCards(); // 削除後、選択中のカードリストを更新
        });
    }


    // 選択されたカードを取得する関数
    function getSelectedCards() {
        const checkboxes = document.querySelectorAll('.select-card-checkbox:checked');
        const selected = [];
        checkboxes.forEach(checkbox => {
            const cardItem = checkbox.closest('.card-item');
            const word = cardItem.querySelector('.word').textContent;
            const meaning = cardItem.querySelector('.meaning').textContent;
            selected.push({ word, meaning });
        });
        return selected;
    }


    // 確認テストを開始する関数
    function startTest() {
        // 表示を切り替える
        cardManagementSection.classList.add('hidden');
        testSection.classList.remove('hidden');


        // カードをシャッフル
        testCards = shuffleArray(selectedCards);
        currentTestIndex = 0;
        isWordToMeaning = true;
        toggleTestDirectionBtn.textContent = '意味→単語';
        
        displayTestCard();
    }


    // 確認テストを終了する関数
    function endTest() {
        // 表示を元に戻す
        cardManagementSection.classList.remove('hidden');
        testSection.classList.add('hidden');


        // チェックボックスをすべて解除
        document.querySelectorAll('.select-card-checkbox').forEach(checkbox => checkbox.checked = false);
    }


    // テスト用のカードを表示する関数
    function displayTestCard() {
        const card = testCards[currentTestIndex];
        if (!card) return;


        testWord.textContent = card.word;
        testMeaning.textContent = card.meaning;


        // 表示・非表示を切り替える
        if (isWordToMeaning) {
            testWord.classList.remove('hidden');
            testMeaning.classList.add('hidden');
        } else {
            testWord.classList.add('hidden');
            testMeaning.classList.remove('hidden');
        }
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
        const filteredCards = cards.filter(card => card.category === currentCategory);
        filteredCards.forEach(cardData => {
            addCard(cardData);
        });
        updateCardDisplay();
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


    // 配列をシャッフルする関数 (フィッシャー・イェーツのシャッフル)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});