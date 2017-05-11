'use strict';

const DIRECTION = ['left', 'top', 'right', 'down'];
const CELL_NAME_SNAKE = 'snake';
const CELL_NAME_FOOD = 'food';
let userPressKey;
let gameTimer;

class Game {

    constructor(width = 50, height = 50, speed = 2000) {
        this.speed = speed;
        this.gameArea = (function () {
            return ((new Array(height)).fill(0)).map(() => {
                return (new Array(width)).fill(0)
            })
        })();
        this.newGameAreaState = [...this.gameArea];
    }

    start() {
        gameTimer = window.setInterval(() => { this.gameStep() }, this.speed);
        let areaDiv = document.createElement("div");
        areaDiv.setAttribute('class', 'game-child');
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
        gameHtmlArea.appendChild(areaDiv);
    }

    updateArea(oldArea, newArea, food) {
        let diffState = this.compareStateArea(this.gameArea, this.newGameAreaState);
        let diff = [];
        this.gameArea.forEach((e, i) => {
            e.forEach((el, j) => {
                if (diffState.oldDiff) {
                    diff.push({ y: i, x: j, change: 0 })
                }
                if (diffState.newDiff) {
                    diff.push({ y: i, x: j, change: 'snake' })
                }
                if (i === food.y && j === food.x) {
                    diff.push({ y: i, x: j, change: 'food' })
                }
            });
        });
        this.updateHTML(diff);
    }

    updateHTML(diff) {
        let gameChild = [...gameHtmlArea.children[0].children];
        diff.forEach((eachObjDiff) => {
            if (eachObjDiff.change === 0) {
                gameChild[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell');
            }
            if (eachObjDiff.change === 'snake') {
                gameChild[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell snake-cell');
            }
            if (eachObjDiff.change === 'food') {
                gameChild[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell food-cell');
            }
        })
    }

    compareStateArea(oldArea, newArea) {
        let diff = []
        oldArea.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== newArea[i][j]) {
                    diff.push({ y: j, x: i, change: newArea[i][j] })
                }
            })
        })
        return diff
    }

    gameStep() {
        let foodPosition = Food.addFoodToArea(this.gameArea);
        this.updateArea(this.gameArea, this.newGameAreaState, foodPosition);
    }

    pause() {
        window.clearInterval(gameTimer);
    }

    end() {
        window.clearInterval(gameTimer);
    }
}

class Snake {

    constructor(area) {
        this.lenght = 4;
        this.headPosition = {
            x: (() => { return Math.floor(area[0].length / 2) })(),
            y: (() => { return Math.floor(area.length / 2) })()
        };
    }

    increaseLength() {
        this.lenght++
    }

    makeNextStep(area, direction, cellNameSnake) {
        if (direction === 'left' && (this.headPosition.x === 0 ||
            !!area[this.headPosition.y][this.headPosition.x - 1] === cellNameSnake)) { return false }
        if (direction === 'right' && (this.headPosition.x === area[0].lenght - 1 ||
            !!area[this.headPosition.y][this.headPosition.x + 1] === cellNameSnake)) { return false }
        if (direction === 'top' && (this.headPosition.y === 0 ||
            !!area[this.headPosition.y - 1][this.headPosition.x] === cellNameSnake)) { return false }
        if (direction === 'bottom' && (this.headPosition.x === area.lenght - 1 ||
            !!area[this.headPosition.y + 1][this.headPosition.x] === cellNameSnake)) { return false }

        return true

    }

}

class Food {

    static addFoodToArea(area) {
        let randomArr = []
        area.forEach((elem, index) => {
            elem.forEach((childElem, childIndex) => {
                randomArr.push({ x: index, y: childIndex })
            })
        })
        return (randomArr.length > 0) ? randomArr[Math.floor(Math.random() * randomArr.length)] :
            null;
    }

}

class Results {
    constructor(res) {
        this.result = res
    }

    saveResult() {
        localStorage.setItem('resultGame', this.result)
    }

    getResult() {
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
)

document.body.addEventListener('keypress', (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
        return helloButtonEventListener()
    }
    return false
})

function helloButtonEventListener() {
    let helloPage = game.querySelector('.wrapper-hello');
    let gamePage = game.querySelector('.wrapper-game');
    let resultPage = game.querySelector('.wrapper-result');
    helloPage.setAttribute('style', 'display: none');
    gamePage.setAttribute('style', 'display: block');
    resultPage.setAttribute('style', 'display: none');
}

document.getElementById('pause-button').addEventListener('click', () => {
    let gamePage = game.querySelector('.wrapper-game');
    let resultPage = game.querySelector('.wrapper-result');
    gamePage.setAttribute('style', 'display: none');
    resultPage.setAttribute('style', 'display: block');
})

const playGame = new Game();
playGame.start();