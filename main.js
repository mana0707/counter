var counterId = 0; // 各カウンターに一意のIDを割り当てるための変数

function createCounterElement(counterId) {
    // カウンター要素を作成

    name = document.getElementById('countername').value;
    document.getElementById('countername').value = '';

    var counterContainer = document.createElement('div');
    counterContainer.className = 'counter'; counterContainer.id = `counter-${counterId}`;
    counterContainer.innerHTML = `<p>${name}カウント: <span id='counterValue-${counterId}'>0</span></p><button onclick='incrementCounter(${counterId})'>増やす</button><button onclick='decrementCounter(${counterId})'>減らす</button><button onclick='resetCounter(${counterId})'>リセット</button><label for='countInput${counterId}'>個数を入力:</label><input type='number' id='countInput${counterId}' /><button onclick='setCount(${counterId})'>セット</button><button onclick="deleteCounter(${counterId})">カウンターを削除</button>`;
    console.log(counterContainer);
    return counterContainer;
}

function addCounter() {
    counterId++; // 新しいカウンターのために一意のIDを生成
    var newCounter = createCounterElement(counterId);
    document.getElementById('counters').appendChild(newCounter);
}

function deleteCounter(id) {
    const counterElement = document.getElementById(`counter-${id}`);
    if (counterElement) {
        counterElement.remove();
    } else {
        alert("削除するカウンターがありません。");
    }
}

function setCount(id) {
    var counterValueElement = document.getElementById(`counterValue-${id}`);
    var value = document.getElementById(`countInput${id}`).value;
    if (value == '') {
        value = 0;
    }
    counterValueElement.textContent = value;
    document.getElementById(`countInput${id}`).value = ``;
}

function incrementCounter(id) {
    var counterValueElement = document.getElementById(`counterValue-${id}`);
    var value = parseInt(counterValueElement.textContent, 10);
    value++;
    counterValueElement.textContent = value;
}

function decrementCounter(id) {
    var counterValueElement = document.getElementById(`counterValue-${id}`);
    var value = parseInt(counterValueElement.textContent, 10);
    value--;
    //-でもカウントし続ける
    counterValueElement.textContent = value;
}

function resetCounter(id) {
    var counterValueElement = document.getElementById(`counterValue-${id}`);
    counterValueElement.textContent = 0;
}

function save() {
    const counters = document.querySelectorAll('.counter');
    const data = [];

    counters.forEach(counter => {
        const id = counter.id.split('-')[1];
        const name = counter.querySelector('p').textContent.split('カウント:')[0];
        const value = parseInt(document.getElementById(`counterValue-${id}`).textContent, 10);
        data.push({ id, name, value });
    });

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'counters.json';
    a.click();
    URL.revokeObjectURL(url);
}

function load() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            const data = JSON.parse(e.target.result);
            data.forEach(item => {
                addCounter();
                counterId = item.id;
                const counterElement = document.getElementById(`counter-${counterId}`);
                const nameElement = counterElement.querySelector('p');
                nameElement.textContent = `${item.name}カウント: `;

                document.getElementById(`counterValue-${counterId}`).textContent = item.value;
            });
        };
        reader.readAsText(file);
    };
    input.click();
}