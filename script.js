document.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.getElementById('user-name');


    // ローカルストレージからユーザー名を読み込む
    let userName = localStorage.getItem('userName');


    if (!userName) {
        // ユーザー名が保存されていない場合、入力を求める
        userName = prompt('Re:noteへようこそ！あなたの名前を教えてください。');
        if (userName) {
            // 入力されたユーザー名をローカルストレージに保存
            localStorage.setItem('userName', userName);
        } else {
            // 名前が入力されなかった場合
            userName = 'ゲスト';
        }
    }


    // 画面にユーザー名を表示
    userNameSpan.textContent = userName;
});
// ... 既存のコード ...


document.getElementById('go-to-anki').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'anki_card.html'; // 暗記カードページへ移動
});
// ... 既存のコード ...


document.getElementById('go-to-mindmap').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'mind_map.html';
});
// ... 既存のコード …


document.getElementById('go-to-calendar').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'calendar.html';
});