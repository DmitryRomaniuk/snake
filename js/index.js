// @flow
'use strict';

let gameTimer;
import Food from './Food';
import Results from './Results';
import Snake from './Snake';
import VisualRepresentation from './VisualRepresentation';

let config = {
    width: 20,
    height: 20,
    speed: 200,
    firstDirection: 'right'
};

class Game {

    width: number;
    height: number;
    speed: number;
    snakeName: string;
    foodName: string;
    firstDirection: string;
    zeroFieldName: number;
    gameArea: Array<Array<mixed>>;
    newGameAreaState: Function;
    foodPosition: { x: number, y: number };
    userPressKey: string | void;
    direction: string;
    gamePaused: boolean;
    snake: Snake;
    resultGame: Results;

    constructor({width, height, speed, firstDirection}: { width: number, height: number, speed: number, firstDirection: string}) {
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.snakeName = 'snake';
        this.foodName = 'food';
        this.zeroFieldName = 0;
        this.gameArea = this.generateGameField(this.zeroFieldName, this.height, this.width);
        this.newGameAreaState = () => { return this.generateGameField(this.zeroFieldName, this.height, this.width) };
        this.foodPosition = Food.generateFoodPosition(this.gameArea);
        this.userPressKey = firstDirection;
        this.direction = firstDirection;
        this.firstDirection = firstDirection;
        this.gamePaused = true;
        this.resultGame = new Results();
    }

    start() {
        this.snake = new Snake(this.newGameAreaState());
        this.gameArea = this.generateGameField(this.zeroFieldName, this.height, this.width);
        this.resultGame = new Results();
        VisualRepresentation.createHtmlMarkUpGamePlace(this.resultGame.result.toString(), this.gameArea);
        this.userPressKey = void (0);
        this.direction = this.firstDirection;
        this.gameStep();
        if (this.gamePaused) {
            this.gamePaused = false;
            gameTimer = window.setInterval(() => {
                this.gameStep()
            }, this.speed);
        }
    }

    setuserPressKey(key) {
        this.userPressKey = key
    }

    generateGameField(zero, height, width): Array<Array<mixed>> {
        return ((new Array(height)).fill(zero)).map(() => {
            return (new Array(width)).fill(zero)
        })
    }

    cloneGameField(arr): Array<Array<mixed>> {
        return arr.map(e => {
            return e.map(el => {
                return el
            })
        })
    }

    addSnakeToArea(newGameAreaState, snakePosArr, snakeName) {
        let gamePlace = this.cloneGameField(newGameAreaState);
        snakePosArr.forEach(pos => {
            gamePlace[pos.y][pos.x] = snakeName
        });
        return gamePlace
    }

    compareStateArea(oldArea: Array<Array<mixed>>, newArea: Array<Array<mixed>>): Array<{ x: number, y: number, change: any }> {
        let diffAreas = [];
        oldArea.forEach((row, i) => {
            return row.forEach((cell, j) => {
                if (cell !== newArea[i][j]) {
                    diffAreas.push({y: i, x: j, change: newArea[i][j]})
                }
            })
        });
        return diffAreas
    }

    updateArea(oldArea: Array<Array<mixed>>, newArea: Array<Array<mixed>>) {
        let diffState = this.compareStateArea(oldArea, newArea, this.snakeName);
        diffState.forEach((diffCell) => {
            newArea[diffCell.y][diffCell.x] = diffCell.change
        });
        return diffState
    }

    static getDirection(direction: string, userPressKeyButton: string = direction) {
        const compareDirections = (
            direction === 'left' && userPressKeyButton === 'right' ||
            direction === 'right' && userPressKeyButton === 'left' ||
            direction === 'up' && userPressKeyButton === 'down' ||
            direction === 'down' && userPressKeyButton === 'up'
        );
        return (compareDirections)? direction : userPressKeyButton;
    }

    addFoodToArea(newGamePlace: Array<Array<mixed>>, positionFood: { x: number, y: number }) {
        let gamePlace = this.cloneGameField(newGamePlace);
        gamePlace[positionFood.y][positionFood.x] = this.foodName;
        return gamePlace
    }

    checkFoodPosition (newGamePlace: Array<Array<mixed>>): boolean {
        return !(newGamePlace.some(x => x.some(y => y === this.foodName)));
    }

    gameStep() {
        this.direction = Game.getDirection(this.direction, this.userPressKey);
        let newGamePlace = this.addFoodToArea(this.newGameAreaState(), this.foodPosition);
        const snakePosArr = this.snake.makeNextStep(this.gameArea, this.direction, this.snakeName, this.foodPosition);
        if (snakePosArr) {
            newGamePlace = this.addSnakeToArea(newGamePlace, snakePosArr, this.snakeName);
        } else {
            this.end();
        }

        if (this.checkFoodPosition(newGamePlace)) {
            this.foodPosition = Food.generateFoodPosition(newGamePlace);
            if (this.foodPosition.x === -1 && this.foodPosition.y === -1) {
                this.end()
            }
            newGamePlace = this.addFoodToArea(newGamePlace, this.foodPosition);
            this.resultGame.result++;
            VisualRepresentation.addGameScore(this.resultGame.result.toString());
        }
        const diff = this.updateArea(this.gameArea, newGamePlace);
        VisualRepresentation.updateHTMLgameArea(diff, this.zeroFieldName, this.snakeName, this.foodName);

        this.gameArea = this.cloneGameField(newGamePlace);
        this.userPressKey = void (0);
    }

    pause() {
        if (this.gamePaused) {
            this.gamePaused = false;
            VisualRepresentation.tooglePauseResumeButton('Pause');
            gameTimer = window.setInterval(() => {
                this.gameStep()
            }, this.speed);
        } else {
            this.gamePaused = true;
            VisualRepresentation.tooglePauseResumeButton('Resume');
            window.clearInterval(gameTimer)
        }
    }

    end() {
        let getResultLocalStorage = parseInt(Results.getResult());
        if (!getResultLocalStorage || this.resultGame.result >= getResultLocalStorage) {
            Results.saveResult(this.resultGame.result)
        }
        window.clearInterval(gameTimer);
        this.gamePaused = true;
        VisualRepresentation.addFinishGameScore(this.resultGame.result.toString());
        VisualRepresentation.addRecordGameScore(Results.getResult().toString());
        VisualRepresentation.goResultPageEventListener();
    }
}

let playGame = new Game(config);

VisualRepresentation.addKeysEventListener(playGame.setuserPressKey.bind(playGame), playGame.start.bind(playGame));
VisualRepresentation.addStartButtonEventListener(playGame.start.bind(playGame));
VisualRepresentation.addPauseGameEventListener(playGame.pause.bind(playGame));
