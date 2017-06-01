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

    // Rewiew: move game settings to the separated object. options values should be also moved to the constants 
    constructor(width = 20, height = 20, speed = 200) {
        this.speed = speed;
        this.snakeName = 'snake';
        this.foodName = 'food';
        this.zeroFieldName = 0;

        // Rewiew: you can add special method which will generate game field, f.e. generateGameField(args) {}, ...
        this.gameArea = ((zero) => {
            return ((new Array(height)).fill(zero)).map(() => {
                return (new Array(width)).fill(zero)
            })
        })(this.zeroFieldName);

        // Rewiew: ... and call this method (this.generateGameField(args)) here
        this.newGameAreaState = function (): Array<Array<number>> {
            return ((new Array(height)).fill(this.zeroFieldName)).map(() => {
                return (new Array(width)).fill(this.zeroFieldName)
            })
        };
        this.foodPosition = Food.generateFoodPosition(this.gameArea);

        // Rewiew: why should we use this in constructor and .start() method? 
        this.userPressKey = 'right';
        this.direction = 'right';

        this.gamePaused = true;

        // Rewiew: why should we use this in constructor and .start() method? 
        this.snake = new Snake(this.newGameAreaState());
        this.resultGame = new Results();
    }

    start() {
        // Rewiew: please use separated method that generates game area
        this.gameArea = this.gameArea.map(row => {
            return row.map(() => {
                return this.zeroFieldName
            })
        });
        VisualRepresentation.createHtmlMarkUpGamePlace(this.resultGame.result.toString(), this.gameArea);
        this.userPressKey = void (0);
        this.direction = 'right';
        this.snake = new Snake(this.newGameAreaState());
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

    addSnakeToArea(newGameAreaState, snakePosArr, snakeName) {
        // Rewiew: please use separated method that generates game area
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
            // Review: could we return just a direction in all cases?
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
        // Rewiew: please use separated method that generates game place
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
            // Review: 
            newGamePlace = this.addSnakeToArea(newGamePlace, snakePosArr, this.snakeName);
        } else {
            this.end();
        }

        // Review: this part of code could be moved to a separated method
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

        // Rewiew: please use separated method that generates game place
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
        // Review: you can add a variables to save Results.getResult() and this.resultGame.result values
        if (!parseInt(Results.getResult()) || this.resultGame.result >= parseInt(Results.getResult())) {
            Results.saveResult(this.resultGame.result)
        }
        window.clearInterval(gameTimer);
        this.gamePaused = true;
        VisualRepresentation.addFinishGameScore(this.resultGame.result.toString());
        VisualRepresentation.addRecordGameScore(Results.getResult().toString());
        VisualRepresentation.goResultPageEventListener();
    }
}

let playGame = new Game();

VisualRepresentation.addKeysEventListener(playGame.setuserPressKey.bind(playGame), playGame.start.bind(playGame));
VisualRepresentation.addStartButtonEventListener(playGame.start.bind(playGame));
VisualRepresentation.addPauseGameEventListener(playGame.pause.bind(playGame));
