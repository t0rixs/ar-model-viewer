document.addEventListener('DOMContentLoaded', function() {
    const model = document.getElementById('ar-model');
    const toggleBtn = document.getElementById('toggle-controls');
    const panel = document.getElementById('control-panel');
    const resetBtn = document.getElementById('reset');
    const hideBtn = document.getElementById('hide');
    
    let visible = true;
    
    // パネルの開閉
    toggleBtn.addEventListener('click', function() {
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
        
        slider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            valueSpan.textContent = value;
            callback();
        });
    }
    
    // 位置更新
    function updatePosition() {
        const x = document.getElementById('pos-x').value;
        const y = document.getElementById('pos-y').value;
        const z = document.getElementById('pos-z').value;
        model.setAttribute('position', `${x} ${y} ${z}`);
    }
    
    // スケール更新
    function updateScale() {
        const scale = document.getElementById('scale').value;
        model.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }
    
    // リセット
    resetBtn.addEventListener('click', function() {
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
    });
    
    // 表示/非表示
    hideBtn.addEventListener('click', function() {
        visible = !visible;
        model.setAttribute('visible', visible);
        hideBtn.textContent = visible ? '非表示' : '表示';
        hideBtn.style.background = visible ? '#e74c3c' : '#27ae60';
    });
}); 