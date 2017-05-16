// @flow
class Results {
    result: number;
    constructor() {
        this.result = 0;
    }

    static saveResult(resultGame: number) {
        localStorage.setItem('resultGame', resultGame.toString())
    }

    static getResult(): string {
        return localStorage.resultGame;
    }
}
export default Results;
