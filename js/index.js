'use strict';

const DIRECTION = ['left', 'top', 'right', 'down'];
const CELL_NAME_SNAKE = 'snake';
const CELL_NAME_FOOD = 'food';
let userPressKey;
let gameTimer;

class Game {

    constructor(width = 50, height = 50, speed = 2000) {
        this.speed = speed;
        this.gameArea = () => {
            return ((new Array(height)).fill(0)).map(colum => {
                column = (new Array(width)).fill(0)
            })
        }
    }

    start() {
        gameTimer = window.setInterval(() => {this.gameStep()}, this.speed);
    }

    gameStep() {

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

    addFoodToArea(area) {
        let randomArr = []
        area.forEach((elem, index) => {
            elem.forEach((childElem, childIndex) => {
                randomArr.push({ col: elem, row: childIndex })
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
listStartButtons.map(elem => elem.addEventListener('click', () => {
    let helloPage = game.querySelector('.wrapper-hello');
    let gamePage = game.querySelector('.wrapper-game');
    let resultPage = game.querySelector('.wrapper-result');
    helloPage.setAttribute('style', 'display: none');
    gamePage.setAttribute('style', 'display: block');
    resultPage.setAttribute('style', 'display: none');
})
)

document.getElementById('pause-button').addEventListener('click', () => {
    let gamePage = game.querySelector('.wrapper-game');
    let resultPage = game.querySelector('.wrapper-result');
    gamePage.setAttribute('style', 'display: none');
    resultPage.setAttribute('style', 'display: block');
})
