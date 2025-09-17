import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');


    // あなたのFirebase設定をここに貼り付けます
    // Firebase コンソールのプロジェクト設定で確認できます
    const firebaseConfig = {
        apiKey: "AIzaSyD6d6N8fJj8s8Jj8s8Jj8s8Jj8s8Jj8s8Jj8s8", // あなたのapiKeyに置き換える
        authDomain: "re-note-f83a1.firebaseapp.com", // あなたのauthDomainに置き換える
        projectId: "re-note-f83a1", // あなたのprojectIdに置き換える
        storageBucket: "re-note-f83a1.appspot.com", // あなたのstorageBucketに置き換える
        messagingSenderId: "29683883171", // あなたのmessagingSenderIdに置き換える
        appId: "1:29683883171:web:e5a3164ddbd23d9397506" // あなたのappIdに置き換える
    };


    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);


    // ユーザーがログイン状態かどうかを監視
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ログインしている場合、マイページにリダイレクト
            window.location.href = 'index.html';
        } else {
            // ログインしていない場合
            console.log('User is signed out');
        }
    });


    // ログインボタンがクリックされた時の処理
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // ログイン成功
                const user = userCredential.user;
                console.log('ログイン成功', user);
                errorMessage.textContent = 'ログインしました！';
            })
            .catch((error) => {
                // ログイン失敗
                const errorCode = error.code;
                const errorMessageText = error.message;
                console.error('ログイン失敗', errorCode, errorMessageText);
                if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
                    errorMessage.textContent = 'メールアドレスまたはパスワードが間違っています。';
                } else {
                    errorMessage.textContent = 'ログインに失敗しました。もう一度お試しください。';
                }
            });
    });


    // 新規登録ボタンがクリックされた時の処理
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;


        if (password.length < 6) {
            errorMessage.textContent = 'パスワードは6文字以上で入力してください。';
            return;
        }


        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // 新規登録成功
                const user = userCredential.user;
                console.log('新規登録成功', user);
                errorMessage.textContent = '新規登録が完了しました！';
            })
            .catch((error) => {
                // 新規登録失敗
                const errorCode = error.code;
                const errorMessageText = error.message;
                console.error('新規登録失敗', errorCode, errorMessageText);
                if (errorCode === 'auth/email-already-in-use') {
                    errorMessage.textContent = 'このメールアドレスは既に使用されています。';
                } else {
                    errorMessage.textContent = '新規登録に失敗しました。もう一度お試しください。';
                }
            });
    });
});