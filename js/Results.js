// @flow
class Results {
    result: number;
    constructor() {
        this.result = 0;
    }

    static saveResult(resultGame: number) {
        window.localStorage.setItem('resultGame', resultGame.toString())
    }

    static getResult(): string {
        return window.localStorage.resultGame;
    }
}
export default Results;
