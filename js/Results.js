// @flow
class Results {
    result: number;
    constructor() {
        this.result = 0;
    }

    static saveResult(resultGame: number) {
        localStorage.setItem('resultGame', resultGame)
    }

    static getResult(): number {
        return localStorage.resultGame;
    }
}
export default Results;
