document.addEventListener('DOMContentLoaded', () => {
    const mindmapForm = document.getElementById('mindmap-form');
    const mindmapList = document.getElementById('mindmap-list');
    const formSubmitButton = mindmapForm.querySelector('button[type="submit"]');


    let editingMindmap = null; // 編集中のマインドマップデータを保持


    // ページ読み込み時に保存されたデータを表示
    loadMindmaps();


    // フォームが送信されたときの処理
    mindmapForm.addEventListener('submit', (e) => {
        e.preventDefault();


        const title = document.getElementById('title').value;
        const keywords = document.getElementById('keywords').value;
        const description = document.getElementById('description').value;
        const imageUrl = document.getElementById('image-url').value;


        if (title) {
            const newMindmapData = {
                title: title,
                keywords: keywords,
                description: description,
                imageUrl: imageUrl,
                learningDate: new Date().toDateString()
            };


            if (editingMindmap) {
                // 編集中の場合
                updateMindmap(editingMindmap, newMindmapData);
                editingMindmap = null;
                formSubmitButton.textContent = 'マインドマップを保存';
                alert('マインドマップが更新されました。');
            } else {
                // 新規作成の場合
                addMindmap(newMindmapData);
                saveMindmap(newMindmapData);
            }
            mindmapForm.reset();
        }
    });


    // マインドマップをDOMに追加する関数
    function addMindmap(mindmapData) {
        const mindmapItem = document.createElement('div');
        mindmapItem.className = 'mindmap-item';
        mindmapItem.innerHTML = `
            <div class="mindmap-content">
                <h3>${mindmapData.title}</h3>
                <p><strong>キーワード:</strong> ${mindmapData.keywords}</p>
                <p><strong>説明:</strong> ${mindmapData.description.replace(/\n/g, '<br>')}</p>
                ${mindmapData.imageUrl ? `<img src="${mindmapData.imageUrl}" alt="関連イラスト">` : ''}
            </div>
            <button class="edit-btn">編集</button>
            <button class="delete-btn">削除</button>
        `;
        mindmapList.appendChild(mindmapItem);


        // 削除ボタンの処理
        mindmapItem.querySelector('.delete-btn').addEventListener('click', () => {
            let mindmaps = JSON.parse(localStorage.getItem('mindmaps')) || [];
            const updatedMindmaps = mindmaps.filter(map => map.title !== mindmapData.title);
            localStorage.setItem('mindmaps', JSON.stringify(updatedMindmaps));
            mindmapItem.remove();
        });


        // 編集ボタンの処理
        mindmapItem.querySelector('.edit-btn').addEventListener('click', () => {
            // フォームにデータをセット
            document.getElementById('title').value = mindmapData.title;
            document.getElementById('keywords').value = mindmapData.keywords;
            document.getElementById('description').value = mindmapData.description;
            document.getElementById('image-url').value = mindmapData.imageUrl;
            
            formSubmitButton.textContent = '更新';
            editingMindmap = mindmapData;
        });
    }


    // マインドマップをローカルストレージに保存する関数
    function saveMindmap(mindmapData) {
        let mindmaps = JSON.parse(localStorage.getItem('mindmaps')) || [];
        mindmaps.push(mindmapData);
        localStorage.setItem('mindmaps', JSON.stringify(mindmaps));
    }


    // ローカルストレージ内のデータを更新する関数
    function updateMindmap(oldData, newData) {
        let mindmaps = JSON.parse(localStorage.getItem('mindmaps')) || [];
        const index = mindmaps.findIndex(map => map.title === oldData.title);
        if (index !== -1) {
            mindmaps[index] = newData;
            localStorage.setItem('mindmaps', JSON.stringify(mindmaps));
            loadMindmaps(); // 再描画
        }
    }


    // ローカルストレージからマインドマップを読み込む関数
    function loadMindmaps() {
        mindmapList.innerHTML = ''; // 一度クリア
        let mindmaps = JSON.parse(localStorage.getItem('mindmaps')) || [];
        mindmaps.forEach(mapData => {
            addMindmap(mapData);
        });
    }
});