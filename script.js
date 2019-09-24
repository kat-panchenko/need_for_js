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
    start: false, //состоянии игры на момент старта
    score: 0, //очки
    speed: 3, //скорость машинки и дороги
    traffic: 3 //сложность уровня по плотности трафика на дороге
};

//
function getQuantityElements(heightElem) {
    //вычисляем высоту нашей страницы (окна браузера или другого устройства)
    // для того чтобы знать сколько машинок поместиться на видимой части дороги
    return document.documentElement.clientHeight / heightElem + 1;
}


//функция старта игры
function startGame() {
    start.classList.add('hide');
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
    enemy.classList.add('enemy');
    //свойство плотности трафика и * i + 1 дает расстояние между машинами
    enemy.y = -75 * setting.traffic * (i + 1);
    //расстояние от верха игрового пространства
    enemy.style.top = enemy.y + 'px';
    //рандомно выставляет автомобили на дороге
    enemy.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px';
    enemy.style.background = `transparent url("./images/enemy.png") center / cover no-repeat`;
    gameArea.appendChild(enemy);//добавляем элемент машинок в игровую зону

    }

    setting.start = true;
    gameArea.appendChild(car); //добавили машинку в игровое поле
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
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
    if (setting.start) {
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
        requestAnimationFrame(playGame); //рекурсия
    }
}

//функция движения дороги и ее разметки
function moveRoad() {
    let lines = document.querySelectorAll('.line');

    lines.forEach(function (line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= document.documentElement.clientHeight) {
            line.y = -75;
        }

    });
}

//функция движения вражеских машин
function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function (enemy) {
       enemy.y += setting.speed / 2;
       enemy.style.top = enemy.y + 'px';

        if(enemy.y >= document.documentElement.clientHeight){
            enemy.y = -100 * setting.traffic;
            enemy.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px';
        }
    });
}