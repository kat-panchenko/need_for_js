const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.game_area'),
    car = document.createElement('div');
car.classList.add('car'); //добавили класс car элементу

//оброботчик события старта игры на клик по элементу Старт
start.addEventListener('click', startGame);

//оброботчик событий при нажатии и отпускании кнопок-стрелок на клавиатуре
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

//обьект с названиями клавиш для управления машиной
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

//обьект начальных свойств игры
const setting = {
    start: false,
    score: 0,
    speed: 3
};

//функция старта игры
function startGame() {
    start.classList.add('hide');
    setting.start = true;
    gameArea.appendChild(car); //добавили машинку в игровое поле
    requestAnimationFrame(playGame); //современная способ анимации функции вместо setTimeout
}

//функции нажатия кнопок
function startRun(event) {
    event.preventDefault(); //убрали стандартное поведение конкретной кнопки (например: скрол страницы)
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

//функция начала игры
function playGame() {
    console.log('play game');
    if (setting.start) {
        requestAnimationFrame(playGame); //рекурсия
    }
}

