// アプリケーションの主要な機能を実装するJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // モバイル対応のAR設定を初期化
    initMobileARSettings();
    
    // 要素の取得
    const loadingScreen = document.getElementById('loading-screen');
    const instructions = document.getElementById('instructions');
    const closeInstructionsBtn = document.getElementById('close-instructions');
    const toggleModelBtn = document.getElementById('toggle-model');
    
    // ARシーンが読み込まれたらローディング画面を非表示
    const scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', function () {
        // カメラ映像のサイズ調整
        adjustCameraVideo();
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // デバッグパネルの初期化（PC限定）- 少し遅延させてエンティティが確実に読み込まれるのを待つ
            setTimeout(() => {
                initDebugPanel();
            }, 500);
        }, 1000);
    });

    // リサイズ時の対応
    window.addEventListener('resize', function() {
        adjustCameraVideo();
    });

    // 画面回転時の対応
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            adjustCameraVideo();
        }, 100);
    });

    // カメラアクセスエラー時の処理
    scene.addEventListener('camera-error', function() {
        alert('カメラへのアクセスができませんでした。ブラウザの設定を確認してください。');
    });

    // マーカーが検出されたときの処理
    const marker = document.querySelector('a-marker');
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

    // モバイル対応のAR設定を初期化
    function initMobileARSettings() {
        const scene = document.querySelector('a-scene');
        if (!scene) return;

        // 画面サイズを取得
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width <= 768;
        
        console.log(`画面サイズ: ${width}x${height}, モバイル: ${isMobile}`);
        
        // モバイル用の最適化設定
        if (isMobile) {
            // モバイル向けの解像度設定
            const sourceWidth = Math.min(width, 640);
            const sourceHeight = Math.min(height, 480);
            
            const arjsConfig = {
                trackingMethod: 'best',
                sourceType: 'webcam',
                sourceWidth: sourceWidth,
                sourceHeight: sourceHeight,
                displayWidth: width,
                displayHeight: height,
                debugUIEnabled: false
            };
            
            // AR.jsの設定を更新
            const arjsString = Object.entries(arjsConfig)
                .map(([key, value]) => `${key}: ${value}`)
                .join('; ');
            
            scene.setAttribute('arjs', arjsString);
            console.log('モバイル用AR設定を適用:', arjsString);
        }
    }

    // カメラ映像のサイズ調整
    function adjustCameraVideo() {
        const scene = document.querySelector('a-scene');
        const canvas = scene ? scene.querySelector('canvas') : null;
        
        if (!canvas) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // canvasのサイズを強制的に画面サイズに合わせる
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.style.maxWidth = width + 'px';
        canvas.style.maxHeight = height + 'px';
        canvas.style.minWidth = width + 'px';
        canvas.style.minHeight = height + 'px';
        canvas.style.objectFit = 'cover';
        canvas.style.objectPosition = 'center';
        canvas.style.transform = 'none';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.right = '0';
        canvas.style.bottom = '0';
        
        console.log(`カメラ映像サイズ調整: ${width}x${height}`);
    }

    // デバッグパネルの初期化（PC限定）
    function initDebugPanel() {
        console.log('画面幅:', window.innerWidth, 'px');
        
        // PC画面でない場合は何もしない
        if (window.innerWidth < 1024) {
            console.log('画面幅が1024px未満のため、デバッグパネルは表示されません');
            return;
        }

        console.log('デバッグパネルを初期化中...');
        
        const arModel = document.getElementById('ar-model');
        if (!arModel) {
            console.log('ARモデルが見つかりません');
            return;
        }
        
        console.log('ARモデルが見つかりました:', arModel);

        // モデルが読み込まれているかチェック
        if (arModel.hasLoaded) {
            console.log('モデルは既に読み込まれています');
        } else {
            console.log('モデルの読み込みを待っています...');
            arModel.addEventListener('model-loaded', function() {
                console.log('モデルが読み込まれました');
            });
        }

        // デバッグコントロールの要素を取得
        const debugPanel = document.getElementById('debug-panel');
        const toggleDebugBtn = document.getElementById('toggle-debug');
        const debugControls = document.getElementById('debug-controls');
        const resetBtn = document.getElementById('reset-model');

        console.log('デバッグパネル要素:', {
            debugPanel: debugPanel,
            toggleDebugBtn: toggleDebugBtn,
            debugControls: debugControls,
            resetBtn: resetBtn
        });

        if (!debugPanel || !toggleDebugBtn || !debugControls || !resetBtn) {
            console.error('デバッグパネルの要素が見つかりません');
            return;
        }

        // デフォルト値
        const defaultValues = {
            position: { x: 2, y: 0.7, z: 4.4 },
            rotation: { x: 270, y: 0, z: 0 },
            scale: { x: 2, y: 2, z: 2 }
        };

        // 折りたたみ機能
        toggleDebugBtn.addEventListener('click', function() {
            debugControls.classList.toggle('collapsed');
            toggleDebugBtn.textContent = debugControls.classList.contains('collapsed') ? '▼' : '▲';
        });

        // スライダーのイベントリスナーを設定
        setupSliderListeners();

        // リセットボタンの処理
        resetBtn.addEventListener('click', function() {
            resetToDefaults();
        });

        function setupSliderListeners() {
            // Position スライダー
            const posX = document.getElementById('pos-x');
            const posY = document.getElementById('pos-y');
            const posZ = document.getElementById('pos-z');
            const posXValue = document.getElementById('pos-x-value');
            const posYValue = document.getElementById('pos-y-value');
            const posZValue = document.getElementById('pos-z-value');


            // Scale スライダー
            const scaleX = document.getElementById('scale-x');
            const scaleY = document.getElementById('scale-y');
            const scaleZ = document.getElementById('scale-z');
            const scaleXValue = document.getElementById('scale-x-value');
            const scaleYValue = document.getElementById('scale-y-value');
            const scaleZValue = document.getElementById('scale-z-value');

            // Position スライダーのイベント
            posX.addEventListener('input', function() {
                posXValue.textContent = this.value;
                updateModelProperty('position', 'x', parseFloat(this.value));
            });

            posY.addEventListener('input', function() {
                posYValue.textContent = this.value;
                updateModelProperty('position', 'y', parseFloat(this.value));
            });

            posZ.addEventListener('input', function() {
                posZValue.textContent = this.value;
                updateModelProperty('position', 'z', parseFloat(this.value));
            });

            // Scale スライダーのイベント
            scaleX.addEventListener('input', function() {
                scaleXValue.textContent = this.value;
                updateModelProperty('scale', 'x', parseFloat(this.value));
            });

            scaleY.addEventListener('input', function() {
                scaleYValue.textContent = this.value;
                updateModelProperty('scale', 'y', parseFloat(this.value));
            });

            scaleZ.addEventListener('input', function() {
                scaleZValue.textContent = this.value;
                updateModelProperty('scale', 'z', parseFloat(this.value));
            });
        }

        function updateModelProperty(property, axis, value) {
            const currentProperty = arModel.getAttribute(property);
            console.log(`更新前の${property}:`, currentProperty);
            
            // 現在の値を取得
            let x = currentProperty.x || 0;
            let y = currentProperty.y || 0;
            let z = currentProperty.z || 0;
            
            // 指定された軸の値を更新
            if (axis === 'x') x = value;
            if (axis === 'y') y = value;
            if (axis === 'z') z = value;
            
            // 文字列形式で設定（A-Frameで確実に動作する方法）
            const propertyString = `${x} ${y} ${z}`;
            console.log(`設定する${property}文字列:`, propertyString);
            
            // 両方の方法で設定を試す
            arModel.setAttribute(property, propertyString);
            arModel.setAttribute(property, {x: x, y: y, z: z});
            
            // 更新が反映されたかを確認
            setTimeout(() => {
                const updatedProperty = arModel.getAttribute(property);
                console.log(`実際の${property}:`, updatedProperty);
            }, 100);
        }

        function resetToDefaults() {
            // スライダーの値をリセット
            document.getElementById('pos-x').value = defaultValues.position.x;
            document.getElementById('pos-y').value = defaultValues.position.y;
            document.getElementById('pos-z').value = defaultValues.position.z;
            document.getElementById('scale-x').value = defaultValues.scale.x;
            document.getElementById('scale-y').value = defaultValues.scale.y;
            document.getElementById('scale-z').value = defaultValues.scale.z;

            // 表示値を更新
            document.getElementById('pos-x-value').textContent = defaultValues.position.x;
            document.getElementById('pos-y-value').textContent = defaultValues.position.y;
            document.getElementById('pos-z-value').textContent = defaultValues.position.z;
            document.getElementById('scale-x-value').textContent = defaultValues.scale.x;
            document.getElementById('scale-y-value').textContent = defaultValues.scale.y;
            document.getElementById('scale-z-value').textContent = defaultValues.scale.z;

            // 3Dモデルを初期状態に戻す（文字列形式で設定）
            arModel.setAttribute('position', `${defaultValues.position.x} ${defaultValues.position.y} ${defaultValues.position.z}`);
            arModel.setAttribute('rotation', `${defaultValues.rotation.x} ${defaultValues.rotation.y} ${defaultValues.rotation.z}`);
            arModel.setAttribute('scale', `${defaultValues.scale.x} ${defaultValues.scale.y} ${defaultValues.scale.z}`);
            
            // オブジェクト形式でも設定
            arModel.setAttribute('position', defaultValues.position);
            arModel.setAttribute('rotation', defaultValues.rotation);
            arModel.setAttribute('scale', defaultValues.scale);
            
            console.log('モデルをリセットしました');
        }
    }
});