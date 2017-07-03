// @flow

class Snake {

    lenght: number;
    headPosition: { x: number, y: number };
    positionEachElement: Array<{ x: number, y: number }>;

    constructor(area: Array<Array<mixed>>) {
        this.lenght = 4;
        this.headPosition = {
            x: Math.floor(area[0].length / 2),
            y: Math.floor(area.length / 2)
        };
        this.positionEachElement = this.generatePosition(this.lenght, this.headPosition);
    }

    generatePosition(lenght: number, headPosition: { x: number, y: number }): Array<{ x: number, y: number }> {
        return ((new Array(lenght)).fill(0)).map((e, i) => {
            return {
                x: headPosition.x - i,
                y: headPosition.y,
            }
        })
    }

    snakeEatFood(foodPos: { x: number, y: number } | null) {
        if (foodPos === null) return false;
        return (foodPos.x === this.headPosition.x && foodPos.y === this.headPosition.y)
    }

    _updatePosSnake(foodPos: { x: number, y: number } | null) {
        this.positionEachElement.unshift({
            x: this.headPosition.x,
            y: this.headPosition.y,
        });
        if (!this.snakeEatFood(foodPos)) {
            this.positionEachElement.pop();
        }
    }

    makeNextStep(area: Array<Array<mixed>>, direction: string, 
        cellNameSnake: string, foodPos: { x: number, y: number } | null) {
        // Rewiew: this method should be optimized
        if ((direction === 'left' && (this.headPosition.x === 0 ||
            area[this.headPosition.y][this.headPosition.x - 1] === cellNameSnake))
            ||
            (direction === 'right' && (this.headPosition.x === area[0].length - 1 ||
            area[this.headPosition.y][this.headPosition.x + 1] === cellNameSnake))
            ||
            (direction === 'up' && (this.headPosition.y === 0 ||
            area[this.headPosition.y - 1][this.headPosition.x] === cellNameSnake))
            ||
            (direction === 'down' && (this.headPosition.y === area.length - 1 ||
            area[this.headPosition.y + 1][this.headPosition.x] === cellNameSnake))
            ) {
            return false
        }

        if (direction === 'left') {
            this.headPosition.x--;
        }
        if (direction === 'right') {
            this.headPosition.x++;
        }
        if (direction === 'up') {
            this.headPosition.y--;
        }
        if (direction === 'down') {
            this.headPosition.y++;
        }

        this._updatePosSnake(foodPos);

        // Rewiew: is it necessary to return this.positionEachElement?
        return this.positionEachElement
    }
}
export default Snake;
