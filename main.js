var score = 0;
var btnStart = document.getElementById('btnStart');
var btnCheckAndNext = document.getElementById('btnCheckAndNext');
var closeQuest = document.getElementById('close');
var sheetOfGame = document.getElementById('sheetOfGame');
var sheetOfPresent = document.getElementById('sheetOfPresent');
var sheetOfResults = document.getElementById('sheetOfResults');
var backToMenuBtn = document.getElementById('backToMenu');
var howManyTime = 0;
var howManuQuest = 0;
var levelBtns = document.querySelectorAll('.setLevelBtn');
var closeLevel = document.getElementById('closeLevel');
var currentContainer = "";
var currentSwitchBtn = "";
var arrayWrongAnswers = [];
var endedOfGames = 0;
var closeAchives = document.getElementById('closeAchives');
var wrapperForOldAchives = document.getElementById('wrapperForOldAchives');

//Таймер
var timer = {};
timer.start = function() {
    timerId = setInterval(this.go, 1000);
    howManyTime = 0;  
};
timer.go = function() {
    this.howManyTime++;
    document.getElementById('timer').innerHTML = this.howManyTime;
};
timer.stop = function() {
    clearInterval(timerId);
};
//Переключение по контейнерам уровней и ачивок
var btnsSwitch = document.querySelectorAll('.container_start-Btn');
btnsSwitch.forEach(function(item) {
    item.addEventListener('click', function() {
        currentSwitchBtn = item;
        if(!currentSwitchBtn.classList.contains('clicked')){
            sheetOfPresent.classList.add('hidden');
            currentSwitchBtn.classList.add('clicked');
            currentContainer = currentSwitchBtn.getAttribute('data-tab');
            document.getElementById(currentContainer).classList.add('nonHidden');
        }
        if(currentContainer == "oldAchives") {
            createListOfOldAchives();
        } 
    })
})

//Установка уровня сложности
    var checkLevel = localStorage.getItem("levelKey");
    if(checkLevel) {
        var arrayInfoOfLevel = checkLevel.split("__");
        var level = Number(arrayInfoOfLevel[0]);
        var numberOfBtn = Number(arrayInfoOfLevel[2]);
        var numberCoef = Number(arrayInfoOfLevel[1]);
        levelBtns[Number(arrayInfoOfLevel[2])].classList.add('active');
    } else {//по умолчанию
        levelBtns[0].classList.add('active');
        var level = 2; 
        var numberOfBtn = 0;
        var numberCoef = 10;
    }
    
//установка сложности по клику
    levelBtns.forEach(function (item) {
        item.addEventListener('click', function () {
            var currentBtn = item;
            if(!currentBtn.classList.contains('active')){
                levelBtns.forEach(function(item) {
                    item.classList.remove('active');
                })  
                currentBtn.classList.add('active');
            }

            var checkBtn = item.innerHTML;
            if(checkBtn == "Легко") {
                level = 2;
                numberCoef = 10;
                numberOfBtn = 0;
            } else if (checkBtn == "Средне") {
                level = 4;
                numberCoef = 20;
                numberOfBtn = 1;
            } else if(checkBtn == "Сложно") {
                level = 4;
                numberCoef = 50;
                numberOfBtn = 2;
            }
            levelValue = String(level) + "__" + String(numberCoef)+ "__" + String(numberOfBtn);
            localStorage.removeItem("levelKey");
            localStorage.setItem("levelKey", levelValue);
        })
    })
//Основа кода, создание примеров
var startAndSetNumber = {};
startAndSetNumber.start = function () {

    if (howManuQuest === 0) {
        document.getElementById('WrongAnswers').classList.add('hidden');
        document.getElementById('howManuQuest').innerHTML = 0;
        timer.start();
        sheetOfGame.classList.remove('hidden');
        sheetOfPresent.classList.add('hidden');
    } else if (howManuQuest === 30) { 
        sheetOfGame.classList.add('hidden');
        sheetOfResults.classList.remove('hidden');
        if(arrayWrongAnswers.length > 0) {
            document.getElementById('WrongAnswers').innerHTML += '<br>' + arrayWrongAnswers.join('<br>');
            document.getElementById('WrongAnswers').classList.remove('hidden');
            arrayWrongAnswers = [];
        }
        results();
        timer.stop();
    }

    var a = Math.floor(Math.random() * numberCoef);
    var b = Math.floor(Math.random() * numberCoef);

    var arrayOperation = ["+", "-", "*", "/"];
    var operation = arrayOperation[Math.floor(Math.random() * level)];
    if (operation == "-") {
        b = Math.floor(Math.random() * a);
    }
    
    var quest = a + operation + b;
    if (operation == "/") {
        a += 1;
        b += 1;
        var c = a * b;
        quest = c + operation + a;
    }
    
    document.getElementById("quest").innerHTML = quest;
    document.getElementById("input").value = '';
    document.getElementById("input").focus();
}
startAndSetNumber.quest = quest;

function start() {
    startAndSetNumber.start();
}
//Проверка выражения и сравнения
function checkAnswerAndNext() {
    var input = Number(document.getElementById("input").value);
    var spanQ = startAndSetNumber.quest.innerHTML;
    var rightAnswer = eval(spanQ, 10);

    if (input == rightAnswer) {
        score++;
    } else {
        var wrongAnswers = spanQ + "=" + input;
        arrayWrongAnswers.push(wrongAnswers);
    }
    document.getElementById("input").innerHTML = '';
    howManuQuest++;
    document.getElementById('howManuQuest').innerHTML =  howManuQuest;
    start();
}


//Помещение результатов в спаны и создание записи о резульатете в локальном хранилище
function results() {
    document.getElementById('resultTime').innerHTML = howManyTime;
    document.getElementById('resultRightAnswer').innerHTML = score;

    //создание записи о резульатете в локальном хранилище
    var arrayOfOldGame = [];
    arrayOfOldGame.push("Верных ответов: " + score);
    arrayOfOldGame.push(" Время: " + howManyTime + "сек.");
    if(numberOfBtn == 0) {
        var nameOfLevel = "Легко";
    } else if (numberOfBtn == 1) {
        var nameOfLevel = "Средне";
    }else if (numberOfBtn == 2) {
        var nameOfLevel = "Сложно";
    }
    arrayOfOldGame.push(" Сложность: " + nameOfLevel);
    var d=new Date();
    var day=d.getDate();
    var month=d.getMonth() + 1;
    var year=d.getFullYear();
    var hour = d.getHours();
    let min = d.getMinutes();
    let dateOfGame = year + "/" + month + "/" + day + " " + hour + ":" + min;
    arrayOfOldGame.push(" Дата игры: " + dateOfGame);

    if(localStorage.getItem("Количество сыгранных игр")){
        var gemeId = Number(localStorage.getItem("Количество сыгранных игр")) + 1;
        localStorage.setItem(gemeId, arrayOfOldGame);
        localStorage.removeItem("Количество сыгранных игр");
        localStorage.setItem("Количество сыгранных игр", gemeId);
    }else {
        endedOfGames++;
        localStorage.setItem("Количество сыгранных игр", endedOfGames);
        localStorage.setItem(endedOfGames, arrayOfOldGame);
    }
}
//Выведение данных о прошлых играх
function createListOfOldAchives() {
    if(localStorage.getItem("Количество сыгранных игр")) {
        wrapperForOldAchives.innerHTML = "Ваши текущие достижения: " + "<br>";     
        for(i = Number(localStorage.getItem("Количество сыгранных игр")); i >= 1; --i) {
            wrapperForOldAchives.innerHTML += i + ") " + localStorage.getItem(i) + "<br>";
        }
    }
}


//Возвращение в меню из процесса решения
function backToMenu() {
    sheetOfResults.classList.add('hidden');
    sheetOfPresent.classList.remove('hidden');
    sheetOfGame.classList.add('hidden');
    timer.stop();
    howManuQuest = 0;
    score = 0;
}



//Листенеры
btnStart.addEventListener('click', start);
btnCheckAndNext.addEventListener('click', checkAnswerAndNext);
closeLevel.addEventListener('click', function() {
    document.getElementById(currentContainer).classList.remove('nonHidden');
    sheetOfPresent.classList.remove('hidden');
    currentSwitchBtn.classList.remove('clicked');
});
closeAchives.addEventListener('click',function() {
    document.getElementById(currentContainer).classList.remove('nonHidden');
    sheetOfPresent.classList.remove('hidden');
    currentSwitchBtn.classList.remove('clicked');
})
closeQuest.addEventListener('click', backToMenu);
backToMenuBtn.addEventListener('click', backToMenu);

//Переключение по нажатию на ентер с телефона
var inputEnter = document.getElementById("input");
inputEnter.addEventListener('keyup', function(event) {
    if (event.code == 'Enter' || event.keyCode == 13 || event.code == 13 && sheetOfGame.className !== "container hidden") {
        checkAnswerAndNext();
    } 
});





