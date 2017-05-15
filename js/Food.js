// @flow
class Food {

    static generateFoodPosition(area: Array<Array<mixed>>): { x: number, y: number } | null {
        let randomArr = [];
        area.forEach((elem, index) => {
            elem.forEach((childElem, childIndex) => {
                if (!childElem) randomArr.push({ x: childIndex, y: index })
            })
        });
        return (randomArr.length > 0) ? randomArr[Math.floor(Math.random() * randomArr.length)] :
            null;
    }

}
export default Food;
