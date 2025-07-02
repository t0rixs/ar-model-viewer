// アプリケーションの主要な機能を実装するJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // スマホ判定
    const isMobile = window.innerWidth <= 768;
    
    // スマホ用スタイル強制適用関数
    function forceMobileStyles() {
        if (!isMobile) return;
        
        const scene = document.querySelector('a-scene');
        const canvas = document.querySelector('a-scene canvas');
        
        if (scene) {
            scene.style.cssText = `
                width: 100vw !important;
                height: 100vh !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
            `;
        }
        
        if (canvas) {
            canvas.style.cssText = `
                width: 100vw !important;
                height: 100vh !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                object-fit: cover !important;
                object-position: center center !important;
                transform: none !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
            `;
        }
    }
    
    // A-Frameの変更を監視するMutationObserver
    function setupMobileStyleWatcher() {
        if (!isMobile) return;
        
        const scene = document.querySelector('a-scene');
        if (!scene) return;
        
        // 初回適用
        forceMobileStyles();
        
        // MutationObserverでCanvasの変更を監視
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    forceMobileStyles();
                }
            });
        });
        
        // シーン全体を監視
        observer.observe(scene, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'width', 'height']
        });
        
        // 定期的な強制適用（フォールバック） - より頻繁に
        setInterval(forceMobileStyles, 100);
        
        // リサイズイベントをブロック
        window.addEventListener('resize', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setTimeout(forceMobileStyles, 10);
        }, true);
        
        // A-Frameの内部イベントをブロック
        scene.addEventListener('render-target-loaded', forceMobileStyles);
        scene.addEventListener('renderstart', forceMobileStyles);
        scene.addEventListener('loaded', forceMobileStyles);
        
        // Canvasのサイズ変更を監視
        const canvasResizeObserver = new ResizeObserver(function(entries) {
            console.log('Canvas サイズ変更を検出:', entries);
            forceMobileStyles();
        });
        
        // Canvas要素が見つかったら ResizeObserver を設定
        function setupCanvasObserver() {
            const canvas = document.querySelector('a-scene canvas');
            if (canvas) {
                try {
                    canvasResizeObserver.observe(canvas);
                    console.log('Canvas ResizeObserver を設定しました');
                } catch (e) {
                    console.log('ResizeObserver 設定エラー:', e);
                }
            }
        }
        
        // Canvas検索を定期的に実行
        const canvasSearchInterval = setInterval(function() {
            const canvas = document.querySelector('a-scene canvas');
            if (canvas) {
                setupCanvasObserver();
                clearInterval(canvasSearchInterval);
            }
        }, 100);
        
        console.log('スマホ用スタイル監視を開始しました');
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
        
        // スマホ用スタイル監視を開始
        setupMobileStyleWatcher();
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // スマホ用スタイルを再適用
            forceMobileStyles();
            
            // デバッグパネルの初期化（PC限定）- 少し遅延させてエンティティが確実に読み込まれるのを待つ
            setTimeout(() => {
                initDebugPanel();
                // スマホ用スタイルを再度適用
                forceMobileStyles();
            }, 500);
        }, 1000);
    });
    
    // Canvasが追加されたときも監視
    const canvasObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'CANVAS') {
                        console.log('新しいCanvasが検出されました');
                        setTimeout(forceMobileStyles, 100);
                    }
                });
            }
        });
    });
    
    // bodyの変更を監視してCanvasの追加を検出
    canvasObserver.observe(document.body, {
        childList: true,
        subtree: true
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

        // デフォルト値（HTMLの初期値と一致させる）
        const defaultValues = {
            position: { x: 0.2, y: 0.7, z: 2.6 },
            rotation: { x: 270, y: 0, z: 0 },
            scale: { x: 2, y: 2, z: 2 }
        };

        // 可視領域制御の設定
        let visibilityControl = {
            enabled: true,
            maxDistance: 2.0, // メートル単位
            isVisible: true,
            monitoringInterval: null // setIntervalのIDを保存
        };

        // 折りたたみ機能
        toggleDebugBtn.addEventListener('click', function() {
            debugControls.classList.toggle('collapsed');
            toggleDebugBtn.textContent = debugControls.classList.contains('collapsed') ? '▼' : '▲';
        });

        // スライダーのイベントリスナーを設定
        setupSliderListeners();

        // 可視領域制御のイベントリスナーを設定
        setupVisibilityControl();

        // position監視を開始
        startPositionMonitoring();

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

        function setupVisibilityControl() {
            const visibilityArea = document.getElementById('visibility-area');
            const visibilityAreaValue = document.getElementById('visibility-area-value');
            const enableVisibilityCheck = document.getElementById('enable-visibility-check');

            if (!visibilityArea || !visibilityAreaValue || !enableVisibilityCheck) {
                console.log('可視領域制御の要素が見つかりません');
                return;
            }

            // 可視領域サイズスライダー
            visibilityArea.addEventListener('input', function() {
                visibilityControl.maxDistance = parseFloat(this.value);
                visibilityAreaValue.textContent = this.value;
                console.log('可視領域サイズを変更:', visibilityControl.maxDistance, 'm');
            });

            // 可視領域制御の有効/無効切り替え
            enableVisibilityCheck.addEventListener('change', function() {
                visibilityControl.enabled = this.checked;
                console.log('可視領域制御:', visibilityControl.enabled ? '有効' : '無効');
                
                if (!visibilityControl.enabled) {
                    // 監視を停止
                    if (visibilityControl.monitoringInterval) {
                        clearInterval(visibilityControl.monitoringInterval);
                        visibilityControl.monitoringInterval = null;
                        console.log('position監視を停止しました');
                    }
                    
                    // 強制的に表示状態に戻す
                    arModel.setAttribute('visible', true);
                    visibilityControl.isVisible = true;
                    
                    // 表示を更新
                    document.getElementById('visibility-status').textContent = '制御無効';
                    document.getElementById('distance-display').textContent = '-';
                } else {
                    // 監視を再開
                    startPositionMonitoring();
                }
            });
        }

        function startPositionMonitoring() {
            const distanceDisplay = document.getElementById('distance-display');
            const visibilityStatus = document.getElementById('visibility-status');
            
            if (!distanceDisplay || !visibilityStatus) {
                console.log('表示要素が見つかりません');
                return;
            }

            // 既に監視中の場合は停止してから開始
            if (visibilityControl.monitoringInterval) {
                clearInterval(visibilityControl.monitoringInterval);
                console.log('既存の監視を停止しました');
            }

            // 定期的にposition監視（60FPS想定で約16ms間隔）
            visibilityControl.monitoringInterval = setInterval(function() {
                if (!arModel || !visibilityControl.enabled) return;

                // 現在のposition取得
                const position = arModel.getAttribute('position');
                if (!position) return;

                // マーカー中心（原点）からの距離を計算
                // Y軸は高さなので、XZ平面での距離を計算
                const distance = Math.sqrt(position.x * position.x + position.z * position.z);
                
                // 距離をメートル単位で表示（小数点2桁まで）
                distanceDisplay.textContent = distance.toFixed(2);

                // 可視領域制御
                const shouldBeVisible = distance <= visibilityControl.maxDistance;
                
                if (shouldBeVisible !== visibilityControl.isVisible) {
                    visibilityControl.isVisible = shouldBeVisible;
                    arModel.setAttribute('visible', shouldBeVisible);
                    
                    // 状態表示を更新
                    visibilityStatus.textContent = shouldBeVisible ? '範囲内' : '範囲外';
                    
                    console.log(`モデル表示状態変更: ${shouldBeVisible ? '表示' : '非表示'} (距離: ${distance.toFixed(2)}m, 制限: ${visibilityControl.maxDistance}m)`);
                } else {
                    // 状態表示だけ更新
                    if (visibilityControl.enabled) {
                        visibilityStatus.textContent = shouldBeVisible ? '範囲内' : '範囲外';
                    }
                }
            }, 16); // 約60FPS
            
            console.log('position監視を開始しました');
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

            // 可視領域制御の設定をリセット
            const visibilityArea = document.getElementById('visibility-area');
            const visibilityAreaValue = document.getElementById('visibility-area-value');
            const enableVisibilityCheck = document.getElementById('enable-visibility-check');
            
            if (visibilityArea && visibilityAreaValue) {
                visibilityArea.value = 2.0;
                visibilityAreaValue.textContent = '2.0';
                visibilityControl.maxDistance = 2.0;
            }
            
            if (enableVisibilityCheck) {
                enableVisibilityCheck.checked = true;
                visibilityControl.enabled = true;
            }

            // 監視を停止してから再開
            if (visibilityControl.monitoringInterval) {
                clearInterval(visibilityControl.monitoringInterval);
                visibilityControl.monitoringInterval = null;
            }

            // 状態表示をリセット
            const visibilityStatus = document.getElementById('visibility-status');
            const distanceDisplay = document.getElementById('distance-display');
            if (visibilityStatus) visibilityStatus.textContent = '範囲内';
            if (distanceDisplay) distanceDisplay.textContent = '0.0';

            // モデルを表示状態に戻す
            arModel.setAttribute('visible', true);
            visibilityControl.isVisible = true;

            // 3Dモデルを初期状態に戻す（文字列形式で設定）
            arModel.setAttribute('position', `${defaultValues.position.x} ${defaultValues.position.y} ${defaultValues.position.z}`);
            arModel.setAttribute('rotation', `${defaultValues.rotation.x} ${defaultValues.rotation.y} ${defaultValues.rotation.z}`);
            arModel.setAttribute('scale', `${defaultValues.scale.x} ${defaultValues.scale.y} ${defaultValues.scale.z}`);
            
            // オブジェクト形式でも設定
            arModel.setAttribute('position', defaultValues.position);
            arModel.setAttribute('rotation', defaultValues.rotation);
            arModel.setAttribute('scale', defaultValues.scale);
            
            // 監視を再開（少し遅延させてモデルの設定が反映されるのを待つ）
            setTimeout(() => {
                if (visibilityControl.enabled) {
                    startPositionMonitoring();
                }
            }, 100);
            
            console.log('モデルをリセットしました');
        }
    }
});