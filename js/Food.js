// @flow
class Food {

    static generateFoodPosition(area: Array<Array<mixed>>): { x: number, y: number } | null {
        let randomArr = [];

        // Rewiew: indexes should be renamed
        area.forEach((elem, index) => {
            elem.forEach((childElem, childIndex) => {
                // Rewiew: add method that will check if cell is empty
                if (!childElem) randomArr.push({ x: childIndex, y: index })
            })
        });
        return (randomArr.length > 0) ? randomArr[Math.floor(Math.random() * randomArr.length)] :
            null;
    }

}
export default Food;
