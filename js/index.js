'use strict';

let gameTimer;

class Game {

    constructor(width = 20, height = 20, speed = 200) {
        this.speed = speed;
        this.snakeName = 'snake';
        this.foodName = 'food';
        this.zeroFieldName = 0;
        this.gameArea = ((zero) => {
            return ((new Array(height)).fill(zero)).map(() => {
                return (new Array(width)).fill(zero)
            })
        })(this.zeroFieldName);
        this.newGameAreaState = function() {
            return ((new Array(height)).fill(this.zeroFieldName)).map(() => {
                return (new Array(width)).fill(this.zeroFieldName)
            })
        };
        this.foodPosition = Food.generateFoodPosition(this.gameArea);
        this.userPressKey = 'right';
        this.direction = 'right';
        this.gamePaused = false;
        this.snake = new Snake(this.newGameAreaState());
        this.resultGame = new Results();
    }

    createHtmlMarkUpGamePlace(){
        let areaDiv = document.createElement("div");
        areaDiv.setAttribute('class', 'game-child');
        document.getElementById('game-score').textContent = this.resultGame.result;
        this.gameArea.forEach((e) => {
            let areaDivRow = document.createElement("div");
            areaDivRow.setAttribute('class', 'game-child-row');
            e.forEach(() => {
                let areaDivCell = document.createElement("div");
                areaDivCell.setAttribute('class', 'game-child-cell');
                areaDivRow.appendChild(areaDivCell);
            });
            areaDiv.appendChild(areaDivRow);
        });
        return areaDiv
    }

    start() {
        let areaDiv = this.createHtmlMarkUpGamePlace();
        if (gameHtmlArea.hasChildNodes()) {
            gameHtmlArea.replaceChild(areaDiv, gameHtmlArea.children[0]);
        } else {
            gameHtmlArea.appendChild(areaDiv);
        }
        this.gameStep();
        gameTimer = window.setInterval(() => { this.gameStep() }, this.speed);
    }

    addSnakeToArea(newGameAreaState, snakePosArr, snakeName) {
        let gamePlace = newGameAreaState.map(e => { return e.map(el => { return el }) });
        snakePosArr.forEach(pos => {
            gamePlace[pos.y][pos.x] = snakeName
        });
        return gamePlace
    }

    compareStateArea(oldArea, newArea) {
        let diffAreas = [];
        oldArea.forEach((row, i) => {
            return row.forEach((cell, j) => {
                if (cell !== newArea[i][j]) { 
                    diffAreas.push({ y: i, x: j, change: newArea[i][j] }) 
                }
            })
        });
        return diffAreas
    }

    updateArea(oldArea, newArea) {
        let diffState = this.compareStateArea(oldArea, newArea, this.snakeName);
        diffState.forEach((diffCell) => {
            newArea[diffCell.y][diffCell.x] = diffCell.change
        });
        return diffState
    }

    updateHTML(diff, gameAreaHTML) {
        diff.forEach((eachObjDiff) => {
            if (eachObjDiff.change === this.zeroFieldName) {
                gameAreaHTML[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell');
            }
            if (eachObjDiff.change === this.snakeName) {
                gameAreaHTML[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell snake-cell');
            }
            if (eachObjDiff.change === this.foodName) {
                gameAreaHTML[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell food-cell');
            }
        })
    }

    static getDirection(direction, userPressKeyButton = direction) {
        if (direction === 'left' && userPressKeyButton === 'right') { return 'left' }
        if (direction === 'right' && userPressKeyButton === 'left') { return 'right' }
        if (direction === 'up' && userPressKeyButton === 'down') { return 'up' }
        if (direction === 'down' && userPressKeyButton === 'up') { return 'down' }
        return userPressKeyButton;
    }

    addFoodToArea(newGamePlace, foodPosition) {
        let gamePlace = newGamePlace.map(e => { return e.map(el => { return el }) });
        gamePlace[foodPosition.y][foodPosition.x] = this.foodName;
        return gamePlace
    }

    gameStep() {
        let gamePlaceHtml = [...gameHtmlArea.children[0].children];
        this.direction = Game.getDirection(this.direction, this.userPressKey);
        let newGamePlace = this.addFoodToArea(this.newGameAreaState(), this.foodPosition);
        const snakePosArr = this.snake.makeNextStep(this.gameArea, this.direction, this.snakeName, this.foodPosition);
        if (snakePosArr) { 
            newGamePlace = this.addSnakeToArea(newGamePlace, snakePosArr, this.snakeName);
        } else { 
            this.end();
        }
        if (!newGamePlace.some(x => x.some(y => y === this.foodName))) {
            this.foodPosition = Food.generateFoodPosition(newGamePlace);
            newGamePlace = this.addFoodToArea(newGamePlace, this.foodPosition);
            this.resultGame.result++;
            document.getElementById('game-score').textContent = this.resultGame.result;
        }
        const diff = this.updateArea(this.gameArea, newGamePlace);
        this.updateHTML(diff, gamePlaceHtml);
        this.gameArea = newGamePlace.map(e => { return e.map(el => { return el }) });
        this.userPressKey = void (0);
    }

    pause() {
        if (this.gamePaused) {
            this.gamePaused = false;
            gameTimer = window.setInterval(() => { this.gameStep() }, this.speed);
        } else {
            this.gamePaused = true;
            window.clearInterval(gameTimer)
        }
    }

    end() {
        if (!Results.getResult() || this.resultGame.result >= Results.getResult()) {
            Results.saveResult(this.resultGame.result)
        }
        document.getElementById('current-score').textContent = this.resultGame.result.toString();
        document.getElementById('record-score').textContent = Results.getResult() || 0;
        window.clearInterval(gameTimer);
        goResultPageEventListener();
    }
}

class Snake {

    constructor(area) {
        this.lenght = 4;
        this.headPosition = {
            x: Math.floor(area[0].length / 2),
            y: Math.floor(area.length / 2)
        };
        this.positionEachElement = ((lenght, headPosition) => {
            // initial place snake, return array objects
            return ((new Array(lenght)).fill(0)).map((e, i) => {
                return {
                    x: headPosition.x - i,
                    y: headPosition.y,
                }
            })
        })(this.lenght, this.headPosition)
    }

    increaseLength() {
        this.length++
    }

    snakeEatFood(foodPos) {
        return (foodPos.x === this.headPosition.x && foodPos.y === this.headPosition.y)
    }

    _updatePosSnake(foodPos) {
        this.positionEachElement.unshift({
            x: this.headPosition.x,
            y: this.headPosition.y,
        });
        if (!this.snakeEatFood(foodPos)) {
            this.positionEachElement.pop();
        }
    }

    makeNextStep(area, direction, cellNameSnake, foodPos) {
        if (direction === 'left' && (this.headPosition.x === 0 ||
            area[this.headPosition.y][this.headPosition.x - 1] === cellNameSnake)) { return false }
        if (direction === 'right' && (this.headPosition.x === area[0].length - 1 ||
            area[this.headPosition.y][this.headPosition.x + 1] === cellNameSnake)) { return false }
        if (direction === 'up' && (this.headPosition.y === 0 ||
            area[this.headPosition.y - 1][this.headPosition.x] === cellNameSnake)) { return false }
        if (direction === 'down' && (this.headPosition.y === area.length - 1 ||
            area[this.headPosition.y + 1][this.headPosition.x] === cellNameSnake)) { return false }

        if (direction === 'left') {
            this.headPosition.x--;
            this._updatePosSnake(foodPos);
        }
        if (direction === 'right') {
            this.headPosition.x++;
            this._updatePosSnake(foodPos);
        }
        if (direction === 'up') {
            this.headPosition.y--;
            this._updatePosSnake(foodPos);
        }
        if (direction === 'down') {
            this.headPosition.y++;
            this._updatePosSnake(foodPos);
        }
        return this.positionEachElement
    }
}

class Food {

    static generateFoodPosition(area) {
        let randomArr = [];
        area.forEach((elem, index) => {
            elem.forEach((childElem, childIndex) => {
                if (!childElem) randomArr.push({ x: childIndex, y: index })
            })
        });
        return (randomArr.length > 0) ? randomArr[Math.floor(Math.random() * randomArr.length)] :
            null;
    }

}

class Results {
    constructor() {
        this.result = 0;
    }

    static saveResult(resultGame) {
        localStorage.setItem('resultGame', resultGame)
    }

    static getResult() {
        return localStorage.resultGame
    }
}

let listStartButtons = [...document.getElementsByClassName('start-button')];
const game = document.getElementById('game');
const gameHtmlArea = document.getElementById('game-area');

listStartButtons.map(elem =>
    elem.addEventListener('click', () => {
        return helloButtonEventListener()
    })
);


function helloButtonEventListener() {
    let helloPage = game.querySelector('.wrapper-hello');
    let gamePage = game.querySelector('.wrapper-game');
    let resultPage = game.querySelector('.wrapper-result');
    helloPage.setAttribute('style', 'display: none');
    gamePage.setAttribute('style', 'display: block');
    resultPage.setAttribute('style', 'display: none');
    playGame.start();
}

function goResultPageEventListener() {
    let gamePage = game.querySelector('.wrapper-game');
    let resultPage = game.querySelector('.wrapper-result');
    gamePage.setAttribute('style', 'display: none');
    resultPage.setAttribute('style', 'display: block');
}

let playGame = new Game();

document.getElementById('pause-button').addEventListener('click', () => {
    return playGame.pause();
});


window.addEventListener('keydown', (event) => {
    if (event.preventDefaulted) {
        return; // Do nothing if event already handled
    }
    switch (event.code) {
    case "Enter":
    case "Space":
        helloButtonEventListener();
        break;
    case "KeyS":
    case "ArrowDown":
        playGame.userPressKey = 'down';
        break;
    case "KeyW":
    case "ArrowUp":
        playGame.userPressKey = 'up';
        break;
    case "KeyA":
    case "ArrowLeft":
        playGame.userPressKey = 'left';
        break;
    case "KeyD":
    case "ArrowRight":
        playGame.userPressKey = 'right';
        break;
    default: false
    }
});
