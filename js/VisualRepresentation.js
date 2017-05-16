//@flow
class VisualRepresentation {

    static addGameScore(score: string) {
        document.getElementById('game-score').textContent = score;
    }

    static addFinishGameScore(score: string) {
        document.getElementById('current-score').textContent = score;
    }

    static addRecordGameScore(score: string = '0') {
        document.getElementById('record-score').textContent = score;
    }

    static createHtmlMarkUpGamePlace(result: string, gameArea: Array<Array<mixed>>) {
        let gameHtmlArea = document.getElementById('game-area');
        let areaDiv = document.createElement("div");
        areaDiv.setAttribute('class', 'game-child');
        VisualRepresentation.addGameScore(result);
        gameArea.forEach((e) => {
            let areaDivRow = document.createElement("div");
            areaDivRow.setAttribute('class', 'game-child-row');
            e.forEach(() => {
                let areaDivCell = document.createElement("div");
                areaDivCell.setAttribute('class', 'game-child-cell');
                areaDivRow.appendChild(areaDivCell);
            });
            areaDiv.appendChild(areaDivRow);
        });
        if (gameHtmlArea.hasChildNodes()) {
            gameHtmlArea.replaceChild(areaDiv, gameHtmlArea.children[0]);
        } else {
            gameHtmlArea.appendChild(areaDiv);
        }
        return areaDiv
    }

    static updateHTMLgameArea(diff: Array<{ x: number, y: number }>, zeroFieldName: string, snakeName: string, foodName: string) {
        let gameHtmlArea = document.getElementById('game-area');
        let gamePlaceHtml = [...gameHtmlArea.children[0].children];
        diff.forEach((eachObjDiff) => {
            if (eachObjDiff.change === zeroFieldName) {
                gamePlaceHtml[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell');
            }
            if (eachObjDiff.change === snakeName) {
                gamePlaceHtml[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell snake-cell');
            }
            if (eachObjDiff.change === foodName) {
                gamePlaceHtml[eachObjDiff.y].children[eachObjDiff.x].setAttribute('class', 'game-child-cell food-cell');
            }
        })
    }

    static addPauseGameEventListener(callback: Function) {
        document.getElementById('pause-button').addEventListener('click', () => {
            return callback();
        });
    }

    static addStartButtonEventListener(callback: Function) {
        let listStartButtons = [...document.getElementsByClassName('start-button')];
        listStartButtons.map(elem =>
            elem.addEventListener('click', () => {
                return VisualRepresentation.startButtonEventListener(callback);
            })
        );
    }

    static addKeysEventListener(userPressKey: Function, start: Function) {
        window.addEventListener('keydown', (event) => {
            if (event.preventDefaulted) {
                return; // Do nothing if event already handled
            }
            switch (event.code) {
            case "Enter":
            case "Space":
                VisualRepresentation.startButtonEventListener(start);
                break;
            case "KeyS":
            case "ArrowDown":
                userPressKey('down');
                break;
            case "KeyW":
            case "ArrowUp":
                userPressKey('up');
                break;
            case "KeyA":
            case "ArrowLeft":
                userPressKey('left');
                break;
            case "KeyD":
            case "ArrowRight":
                userPressKey('right');
                break;
            default:
                return null
            }
        });
    }

    static startButtonEventListener(callback: Function) {
        const game = document.getElementById('game');
        let helloPage = game.querySelector('.wrapper-hello');
        let gamePage = game.querySelector('.wrapper-game');
        let resultPage = game.querySelector('.wrapper-result');
        helloPage.setAttribute('style', 'display: none');
        gamePage.setAttribute('style', 'display: block');
        resultPage.setAttribute('style', 'display: none');
        callback();
    }

    static goResultPageEventListener() {
        const game = document.getElementById('game');
        let gamePage = game.querySelector('.wrapper-game');
        let resultPage = game.querySelector('.wrapper-result');
        gamePage.setAttribute('style', 'display: none');
        resultPage.setAttribute('style', 'display: block');
    }

}

export default VisualRepresentation;
