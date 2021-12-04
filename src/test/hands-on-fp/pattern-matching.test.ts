import { sequenceT } from "fp-ts/lib/Apply";
import { DefaultSerializer } from "v8";

const enum ShapeKind {
    circle = "Cicrcle",
    square = "Square",
    rectangle = "Rectangle",
}

type Circle = { kind: ShapeKind.circle, radius: number };
type Square = { kind: ShapeKind.square, size: number };
type Rectangle = { kind: ShapeKind.rectangle, w: number, h: number};
type Shape = Circle | Square | Rectangle;

function area(shape: Shape): number {
    switch (shape.kind) {
        case ShapeKind.circle:
            return Math.PI * shape.radius ** 2;
        case ShapeKind.square:
            return shape.size ** 2;
        case ShapeKind.rectangle:
            return shape.w * shape.h;
        default:
            throw new Error("Invalid shape!");
    }
}

describe("Pattern matching", () => {
    it("can dispatch on kind info", () => {
        const circleArea = area({ kind: ShapeKind.circle, radius: 2 });
        expect(circleArea.toFixed(2)).toEqual("12.57");

        const squareArea = area({ kind: ShapeKind.square, size: 2 });
        expect(squareArea).toEqual(4);

        const rectangleArea = area({ kind: ShapeKind.rectangle, w: 2, h: 3 });
        expect(rectangleArea).toEqual(6);
    });
});