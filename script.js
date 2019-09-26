const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.game_area'),
    car = document.createElement('div');
//тег для музыки на фоне
music = document.createElement(/*'audio'*/ 'embed');
music.setAttribute('src', './audio/schoolboy.mp3');
music.setAttribute('type', 'audio/mp3');
music.classList.add('music');
/*const music = new Audio('./audio/schoolboy.mp3');
music.play();*/

car.classList.add('car'); //добавили класс car элементу

//запись рекорда в память браузера
let topScore = localStorage.getItem('topScore');

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
    start: false, //состоянии игры на момент старта
    score: 0, //очки
    speed: 5, //скорость машинки и дороги
    traffic: 3, //сложность уровня по плотности трафика на дороге
    level: 0
};

//
function getQuantityElements(heightElem) {
    //вычисляем высоту нашей страницы (окна браузера или другого устройства)
    // для того чтобы знать сколько машинок поместиться на видимой части дороги
    return Math.floor(gameArea.offsetHeight / heightElem) + 1;
}

//функция старта игры
function startGame(event) {

    start.classList.add('hide');
    //event.target позволяет определить на каком конкретно элементе произошло событие
    if (event.target.classList.contains('start')) {
        return;
    }
    if (event.target.classList.contains('easy')) {
        setting.speed = 3;
        setting.traffic = 3;
    }
    if (event.target.classList.contains('medium')) {
        setting.speed = 5;
        setting.traffic = 4;
    }
    if (event.target.classList.contains('hard')) {
        setting.speed = 7;
        setting.traffic = 2;
    }

    //отчистка поля игры и очков для того чтобы игра смогла начаться снова
    gameArea.innerHTML = '';

// цикл линий на дороге иммитирующих движение
    for (let i = 0; i < getQuantityElements(75); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 75) + 'px';
        line.y = i * 75;
        gameArea.appendChild(line);
    }

    //цикл для создания трафика вражеских машинок на дороге
    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        //создаем переменную для рандомного выбора картинки двух видов машинок врага
        let enemyImg = Math.floor(Math.random() * 5) + 1;
        enemy.classList.add('enemy');
        //свойство плотности трафика и * i + 1 дает расстояние между машинами
        enemy.y = -75 * setting.traffic * (i + 1);
        //расстояние от верха игрового пространства
        enemy.style.top = enemy.y + 'px';
        //рандомно выставляет автомобили на дороге
        enemy.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px';
        enemy.style.background = `transparent url("./images/enemy${enemyImg}.png") center / cover no-repeat`;
        gameArea.appendChild(enemy);//добавляем элемент машинок в игровую зону
    }

    setting.score = 0;
    setting.start = true;
    //добавили машинку в игровое поле
    gameArea.appendChild(car);
    //параметры оазмещения машинки
    car.style.left = '125px';
    car.style.top = 'auto';
    car.style.bottom = '10px';

    //добавление музыки на фоне игры
    gameArea.appendChild(music);
    /*  music.setAttribute('autoplay', true);
        music.setAttribute('src', './audio/schoolboy.mp3');
        music.setAttribute('controls', true);
    */

    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame); //современная способ анимации функции вместо setTimeout
}

//функции нажатия кнопок
function startRun(event) {
    event.preventDefault(); //убрали стандартное поведение конкретной кнопки (например: скрол страницы)
    if (event.key in keys) {
        keys[event.key] = true;
    }
}

function stopRun(event) {
    event.preventDefault();
    //способ отсеивания ненужных нажатых кнопок которых нет у нас в условиях
    if (event.key in keys) {
        keys[event.key] = false;
    }
}

//функция начала игры
function playGame() {

    let a = 0;

    if (setting.score > 2000 && setting.level === 0) {
        ++setting.speed;
        ++setting.level;
    } else if (setting.score > 5500 && setting.level === 1) {
        ++setting.speed;
        ++setting.level;
    } else if (setting.score > 10000 && setting.level === 2) {
        ++setting.speed;
        ++setting.level;
    }

    //увеличение очков в зависимости от скорости
    setting.score += setting.speed;
    //вывод очков на страницу
    score.innerHTML = 'SCORE</br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
        setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
        setting.x += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
        setting.y -= setting.speed;
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
        setting.y += setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    if (setting.start) {
        requestAnimationFrame(playGame); //рекурсия
    } else {
        music.remove();
    }
}

//функция движения дороги и ее разметки
function moveRoad() {
    let lines = document.querySelectorAll('.line');

    lines.forEach(function (line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= gameArea.offsetHeight) {
            line.y = -75;
        }
    });
}

//функция движения вражеских машин
function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function (enemy) {
//получаем с помощью спец.метода все стороны обьектов в массив
        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();
//определение стыков сторон при которых игра будет окончена из-за столкновения
        if (carRect.top <= enemyRect.bottom - 5 && carRect.right >= enemyRect.left - 5 &&
            carRect.left <= enemyRect.right - 5 && carRect.bottom - 5 >= enemyRect.top) {
            setting.start = false;
            //запись рекордных очков в память игры
            if (topScore < setting.score) {
                localStorage.setItem('topScore', setting.score);
            }

            //вывод очков и после него кнопка старта игры заново
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
        }

        enemy.y += setting.speed / 2;
        enemy.style.top = enemy.y + 'px';

        if (enemy.y >= gameArea.offsetHeight) {
            let enemyImg = Math.floor(Math.random() * 5) + 1;
            enemy.y = -100 * setting.traffic;
            enemy.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px';
            enemy.style.background = `transparent url("./images/enemy${enemyImg}.png") center / cover no-repeat`;
        }
    });
}