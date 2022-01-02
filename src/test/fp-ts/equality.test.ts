// Examples from here: https://grossbart.github.io/fp-ts-recipes/#/equality?id=primitive-equality
import { array, boolean, date, number, string, option, either } from "fp-ts";
import { Eq, struct } from "fp-ts/Eq";

type Point = {
    x: number;
    y: number;
}

const eqPoint: Eq<Point> = struct({
    x: number.Eq,
    y: number.Eq,
});

type Vector = {
    from: Point;
    to: Point;
}

const eqVector: Eq<Vector> = struct({
    from: eqPoint,
    to: eqPoint,
});

const eqArrayOfStrings = array.getEq(string.Eq);
const eqArrayOfPoints = array.getEq(eqPoint);

const oE = option.getEq(number.Eq);
const eE = either.getEq(string.Eq, number.Eq);

describe("Equality", () => {
    it("primitive equality", () => {
        expect(boolean.Eq.equals(true, true)).toBeTruthy();
        expect(number.Eq.equals(1, 1)).toBeTruthy();
        expect(string.Eq.equals("one", "one")).toBeTruthy();
        expect(date.Eq.equals(new Date("1984-01-27"), new Date("1984-01-27"))).toBeTruthy();
    });

    it("can compare structures", () => {
        const point1: Point = { x: 1, y: 2 };
        const point2: Point = { x: 1, y: 2 };
        const point3: Point = { x: 3, y: 4 };

        expect(eqPoint.equals(point1, point2)).toBeTruthy();
        expect(eqPoint.equals(point2, point3)).toBeFalsy();
    });

    it("can compare even more complex structures", () => {
        const vector1 = { from: { x: 1, y: 2 }, to: { x: 3, y: 4 } };
        const vector2 = { from: { x: 1, y: 2 }, to: { x: 3, y: 4 } };
        const vector3 = { from: { x: 1, y: 2 }, to: { x: 4, y: 5 } };

        expect(eqVector.equals(vector1, vector2)).toBeTruthy();
        expect(eqVector.equals(vector2, vector3)).toBeFalsy();
    });

    it("can compare arrays", () => {
        const array1 = ["one", "two", "three"];
        const array2 = ["one", "two", "three"];
        const array3 = ["one", "two", "four"];

        expect(eqArrayOfStrings.equals(array1, array2)).toBeTruthy();
        expect(eqArrayOfStrings.equals(array2, array3)).toBeFalsy();

        const point1: Point = { x: 1, y: 2 };
        const point2: Point = { x: 3, y: 4 };
        const point3: Point = { x: 1, y: 2 };
        const point4: Point = { x: 3, y: 4 };

        const pointArray1 = [point1, point2];
        const pointArray2 = [point3, point4];

        expect(eqArrayOfPoints.equals(pointArray1, pointArray2)).toBeTruthy();
    });

    it("works with option", () => {
        const o1 = option.some(1);
        const o2 = option.some(1);
        const o3 = option.some(2);
        const o4 = option.none;

        expect(oE.equals(o1, o2)).toBeTruthy();
        expect(oE.equals(o2, o3)).toBeFalsy();
        expect(oE.equals(o2, o4)).toBeFalsy();        
    });

    it("works with either", () => {
        const e1 = either.right(1);
        const e2 = either.right(1);
        const e3 = either.right(2);
        const e4 = either.left("error");

        expect(eE.equals(e1, e2)).toBeTruthy();
        expect(eE.equals(e2, e3)).toBeFalsy();
        expect(eE.equals(e2, e4)).toBeFalsy();                
    });
});
