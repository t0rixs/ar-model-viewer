// アプリケーションの主要な機能を実装するJavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - アプリケーション開始');
    
    // HTTPS チェック
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.warn('HTTPS接続が必要です。ARカメラが動作しない可能性があります。');
    }
    
    // 要素の取得
    const loadingScreen = document.getElementById('loading-screen');
    const instructions = document.getElementById('instructions');
    const closeInstructionsBtn = document.getElementById('close-instructions');
    const toggleModelBtn = document.getElementById('toggle-model');
    
    // ARシーンが読み込まれたらローディング画面を非表示
    const scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', function () {
        console.log('A-Frameシーンが読み込まれました');
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    });

    // カメラアクセスエラー時の処理
    scene.addEventListener('camera-error', function(event) {
        console.error('カメラアクセスエラー:', event);
        alert('カメラへのアクセスができませんでした。ブラウザの設定を確認してください。');
    });
    
    // GLTFモデルの読み込み状況をチェック
    const marker = document.querySelector('a-marker');
    const entity = marker.querySelector('a-entity[gltf-model]');
    if (entity) {
        entity.addEventListener('model-loaded', function() {
            console.log('GLBモデルが正常に読み込まれました');
        });
        entity.addEventListener('model-error', function(event) {
            console.error('GLBモデルの読み込みエラー:', event);
        });
    }

    // マーカーが検出されたときの処理
    marker.addEventListener('markerFound', function() {
        console.log('マーカーを検出しました');
        // マーカー検出時に追加のアニメーションなどを実装可能
    });

    // マーカーを見失ったときの処理
    marker.addEventListener('markerLost', function() {
        console.log('マーカーを見失いました');
    });

    // 説明を閉じるボタンの処理
    closeInstructionsBtn.addEventListener('click', function() {
        instructions.classList.add('hidden');
    });

    // オフライン検出
    window.addEventListener('online', function() {
        console.log('オンラインに戻りました');
    });
    
    window.addEventListener('offline', function() {
        console.log('オフラインになりました');
        // オフラインモードの通知を表示するなどの処理を追加可能
    });
});