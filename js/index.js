// @flow
'use strict';

let gameTimer;
import Food from './Food';
import Results from './Results';
import Snake from './Snake';
import VisualRepresentation from './VisualRepresentation';

class Game {

    speed: number;
    snakeName: string;
    foodName: string;
    zeroFieldName: number;
    gameArea: Array<Array<mixed>>;
    newGameAreaState: Function;
    foodPosition: { x: number, y: number } | null;
    userPressKey: string | void;
    direction: string;
    gamePaused: boolean;
    snake: Snake;
    resultGame: Results;

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
        this.newGameAreaState = function (): Array<Array<number>> {
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

    start() {
        this.gameArea = this.gameArea.map(row => {
            return row.map(() => {
                return this.zeroFieldName
            })
        });
        VisualRepresentation.createHtmlMarkUpGamePlace(this.resultGame.result.toString(), this.gameArea);
        this.snake = new Snake(this.newGameAreaState());
        this.gameStep();
        gameTimer = window.setInterval(() => {
            this.gameStep()
        }, this.speed);
    }

    setuserPressKey(key) {
        this.userPressKey = key
    }

    addSnakeToArea(newGameAreaState, snakePosArr, snakeName) {
        let gamePlace = newGameAreaState.map(e => {
            return e.map(el => {
                return el
            })
        });
        snakePosArr.forEach(pos => {
            gamePlace[pos.y][pos.x] = snakeName
        });
        return gamePlace
    }

    compareStateArea(oldArea: Array<Array<mixed>>, newArea: Array<Array<mixed>>): Array<{ x: number, y: number, change: number | string }> {
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
        if (direction === 'left' && userPressKeyButton === 'right') {
            return 'left'
        }
        if (direction === 'right' && userPressKeyButton === 'left') {
            return 'right'
        }
        if (direction === 'up' && userPressKeyButton === 'down') {
            return 'up'
        }
        if (direction === 'down' && userPressKeyButton === 'up') {
            return 'down'
        }
        return userPressKeyButton;
    }

    addFoodToArea(newGamePlace: Array<Array<mixed>>, foodPosition: { x: number, y: number }) {
        let gamePlace = newGamePlace.map(e => {
            return e.map(el => {
                return el
            })
        });
        gamePlace[foodPosition.y][foodPosition.x] = this.foodName;
        return gamePlace
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
        if (!newGamePlace.some(x => x.some(y => y === this.foodName))) {
            this.foodPosition = Food.generateFoodPosition(newGamePlace);
            if (this.foodPosition === null) {
                this.end()
            }
            newGamePlace = this.addFoodToArea(newGamePlace, this.foodPosition);
            this.resultGame.result++;
            VisualRepresentation.addGameScore(this.resultGame.result.toString());
        }
        const diff = this.updateArea(this.gameArea, newGamePlace);
        VisualRepresentation.updateHTMLgameArea(diff, this.zeroFieldName, this.snakeName, this.foodName);
        this.gameArea = newGamePlace.map(e => {
            return e.map(el => {
                return el
            })
        });
        this.userPressKey = void (0);
    }

    pause() {
        if (this.gamePaused) {
            this.gamePaused = false;
            gameTimer = window.setInterval(() => {
                this.gameStep()
            }, this.speed);
        } else {
            this.gamePaused = true;
            window.clearInterval(gameTimer)
        }
    }

    end() {
        if (!parseInt(Results.getResult()) || this.resultGame.result >= parseInt(Results.getResult())) {
            Results.saveResult(this.resultGame.result)
        }
        window.clearInterval(gameTimer);
        VisualRepresentation.addFinishGameScore(this.resultGame.result.toString());
        VisualRepresentation.addRecordGameScore(Results.getResult().toString());
        VisualRepresentation.goResultPageEventListener();
    }
}

let playGame = new Game();

VisualRepresentation.addKeysEventListener(playGame.setuserPressKey.bind(playGame), playGame.start.bind(playGame));
VisualRepresentation.addStartButtonEventListener(playGame.start.bind(playGame));
VisualRepresentation.addPauseGameEventListener(playGame.pause.bind(playGame));
