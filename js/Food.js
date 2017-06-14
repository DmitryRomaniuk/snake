// @flow

class Food {

    static generateFoodPosition(area: Array<Array<mixed>>): { x: number, y: number } | null {
        let randomArr = [];
        area.forEach((elem, row) => {
            elem.forEach((childElem, column) => {
                if (!childElem) randomArr.push({ x: column, y: row })
            })
        });
        return (randomArr.length > 0) ? randomArr[Math.floor(Math.random() * randomArr.length)] :
            null;
    }

}
export default Food;
