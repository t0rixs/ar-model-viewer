document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM読み込み完了');
    
    // A-Frameシーンの読み込み完了を待つ
    const scene = document.querySelector('a-scene');
    if (scene) {
        if (scene.hasLoaded) {
            initControls();
        } else {
            scene.addEventListener('loaded', function() {
                console.log('A-Frameシーン読み込み完了');
                initControls();
            });
        }
    } else {
        // フォールバック：遅延実行
        setTimeout(initControls, 1000);
    }
    
    function initControls() {
        console.log('コントロール初期化開始');
        
        const model = document.getElementById('ar-model');
        const toggleBtn = document.getElementById('toggle-controls');
        const panel = document.getElementById('control-panel');
        const resetBtn = document.getElementById('reset');
        const hideBtn = document.getElementById('hide');
        
        // 要素の存在確認
        if (!model) {
            console.error('ar-model要素が見つかりません');
            return;
        }
        if (!toggleBtn || !panel || !resetBtn || !hideBtn) {
            console.error('UI要素が見つかりません');
            return;
        }
        
        console.log('全ての要素が見つかりました');
        
        let visible = true;
        
        // パネルの開閉
        toggleBtn.addEventListener('click', function() {
            console.log('パネル切り替えボタンクリック');
            panel.classList.toggle('hidden');
        });
        
        // スライダーの設定
        setupSlider('pos-x', 'pos-x-val', updatePosition);
        setupSlider('pos-y', 'pos-y-val', updatePosition);
        setupSlider('pos-z', 'pos-z-val', updatePosition);
        setupSlider('scale', 'scale-val', updateScale);
        
        // スライダー設定のヘルパー関数
        function setupSlider(id, valueId, callback) {
            const slider = document.getElementById(id);
            const valueSpan = document.getElementById(valueId);
            
            if (!slider || !valueSpan) {
                console.error(`スライダー要素が見つかりません: ${id}, ${valueId}`);
                return;
            }
            
            slider.addEventListener('input', function() {
                const value = parseFloat(this.value);
                valueSpan.textContent = value;
                callback();
                console.log(`${id}の値が変更されました: ${value}`);
            });
        }
        
        // 位置更新
        function updatePosition() {
            const x = document.getElementById('pos-x').value;
            const y = document.getElementById('pos-y').value;
            const z = document.getElementById('pos-z').value;
            const positionStr = `${x} ${y} ${z}`;
            model.setAttribute('position', positionStr);
            console.log(`位置更新: ${positionStr}`);
        }
        
        // スケール更新
        function updateScale() {
            const scale = document.getElementById('scale').value;
            const scaleStr = `${scale} ${scale} ${scale}`;
            model.setAttribute('scale', scaleStr);
            console.log(`スケール更新: ${scaleStr}`);
        }
        
        // リセット
        resetBtn.addEventListener('click', function() {
            console.log('リセットボタンクリック');
            
            document.getElementById('pos-x').value = 0.2;
            document.getElementById('pos-y').value = 0.7;
            document.getElementById('pos-z').value = 2.6;
            document.getElementById('scale').value = 20;
            
            document.getElementById('pos-x-val').textContent = '0.2';
            document.getElementById('pos-y-val').textContent = '0.7';
            document.getElementById('pos-z-val').textContent = '2.6';
            document.getElementById('scale-val').textContent = '20';
            
            model.setAttribute('position', '0.2 0.7 2.6');
            model.setAttribute('scale', '20 20 20');
            
            console.log('リセット完了');
        });
        
        // 表示/非表示
        hideBtn.addEventListener('click', function() {
            visible = !visible;
            model.setAttribute('visible', visible);
            hideBtn.textContent = visible ? '非表示' : '表示';
            hideBtn.style.background = visible ? '#e74c3c' : '#27ae60';
            console.log(`表示状態変更: ${visible}`);
        });
        
        console.log('コントロール初期化完了');
    }
}); 