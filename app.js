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

        // デフォルト値
        const defaultValues = {
            position: { x: 0.2, y: 0.7, z: 0.5 },
            rotation: { x: 270, y: 0, z: 0 },
            scale: { x: 2, y: 2, z: 2 }
        };

        // 可視領域の設定
        let visibleAreaConfig = {
            size: 2.0,  // 可視領域のサイズ (m)
            showBoundary: true,  // 境界表示フラグ
            monitoringEnabled: true  // 位置監視フラグ
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

        // 可視領域の初期化
        initVisibleAreaSystem();

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

            // 可視領域コントロールのイベント
            const visibleAreaSize = document.getElementById('visible-area-size');
            const visibleAreaValue = document.getElementById('visible-area-value');
            const showVisibleArea = document.getElementById('show-visible-area');

            if (visibleAreaSize && visibleAreaValue) {
                visibleAreaSize.addEventListener('input', function() {
                    visibleAreaValue.textContent = this.value;
                    updateVisibleAreaSize(parseFloat(this.value));
                });
            }

            if (showVisibleArea) {
                showVisibleArea.addEventListener('change', function() {
                    toggleVisibleAreaBoundary(this.checked);
                });
            }
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

            // 可視領域設定をリセット
            const visibleAreaSizeSlider = document.getElementById('visible-area-size');
            const visibleAreaValueSpan = document.getElementById('visible-area-value');
            const showVisibleAreaCheckbox = document.getElementById('show-visible-area');
            
            if (visibleAreaSizeSlider && visibleAreaValueSpan) {
                visibleAreaSizeSlider.value = 2.0;
                visibleAreaValueSpan.textContent = '2.0';
                updateVisibleAreaSize(2.0);
            }
            
            if (showVisibleAreaCheckbox) {
                showVisibleAreaCheckbox.checked = true;
                toggleVisibleAreaBoundary(true);
            }

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

        // 可視領域システムの初期化
        function initVisibleAreaSystem() {
            console.log('可視領域システムを初期化中...');
            
            // 可視領域境界要素を取得
            const visibleAreaBoundary = document.getElementById('visible-area-boundary');
            if (!visibleAreaBoundary) {
                console.error('可視領域境界要素が見つかりません');
                return;
            }

            // ar-modelの読み込み状況をチェック
            const arModel = document.getElementById('ar-model');
            if (arModel) {
                console.log('ar-model要素が見つかりました');
                console.log('初期位置:', arModel.getAttribute('position'));
                console.log('初期可視性:', arModel.getAttribute('visible'));
                
                // モデル読み込み完了イベント
                arModel.addEventListener('model-loaded', function() {
                    console.log('GLBモデルの読み込みが完了しました');
                });
                
                // モデル読み込みエラーイベント
                arModel.addEventListener('model-error', function(event) {
                    console.error('GLBモデルの読み込みエラー:', event);
                });
                
                // 初期状態でモデルを表示に設定
                arModel.setAttribute('visible', true);
                console.log('モデルを強制的に表示に設定しました');
            }

            // ar-modelの位置監視を開始
            startPositionMonitoring();
            
            console.log('可視領域システムが初期化されました');
        }

        // 可視領域サイズの更新
        function updateVisibleAreaSize(newSize) {
            visibleAreaConfig.size = newSize;
            console.log('可視領域サイズを更新:', newSize + 'm');
            
            // 境界表示要素のサイズを更新
            const visibleAreaBoundary = document.getElementById('visible-area-boundary');
            if (visibleAreaBoundary) {
                visibleAreaBoundary.setAttribute('width', newSize);
                visibleAreaBoundary.setAttribute('height', newSize);
            }
        }

        // 可視領域境界の表示/非表示切り替え
        function toggleVisibleAreaBoundary(show) {
            visibleAreaConfig.showBoundary = show;
            const visibleAreaBoundary = document.getElementById('visible-area-boundary');
            if (visibleAreaBoundary) {
                visibleAreaBoundary.setAttribute('visible', show);
                console.log('可視領域境界表示:', show ? 'オン' : 'オフ');
            }
        }

        // ar-modelの位置監視を開始
        function startPositionMonitoring() {
            console.log('位置監視を開始します');
            
            // 100msごとに位置をチェック
            setInterval(function() {
                if (visibleAreaConfig.monitoringEnabled) {
                    checkModelVisibility();
                }
            }, 100);
        }

        // ar-modelの可視性をチェック
        function checkModelVisibility() {
            const arModel = document.getElementById('ar-model');
            if (!arModel) return;
            
            // モデルの現在位置を取得
            const position = arModel.getAttribute('position');
            if (!position) return;
            
            // マーカー中心を基準とした正方形領域内かどうかを判定（XZ平面）
            const halfAreaSize = visibleAreaConfig.size / 2;
            const isVisible =
                Math.abs(position.x) <= halfAreaSize &&
                Math.abs(position.z) <= halfAreaSize;
            
            // モデルの可視性を更新
            if (arModel.getAttribute('visible') !== isVisible) {
                arModel.setAttribute('visible', isVisible);
                console.log('モデル可視性変更:', isVisible ? '表示' : '非表示', 
                           'X:', position.x.toFixed(2) + 'm', 
                           'Z:', position.z.toFixed(2) + 'm',
                           '正方形半径:', halfAreaSize.toFixed(2) + 'm');
            }
        }
    }
});