import { struct, concatAll, Monoid } from "fp-ts/Monoid"
import { getApplyMonoid, some, none } from "fp-ts/lib/Option"

const monoidSum: Monoid<number> = {
    concat: (x, y) => x + y,
    empty: 0
}

const monoidProduct: Monoid<number> = {
    concat: (x, y) => x * y,
    empty: 1
}

const monoidString: Monoid<string> = {
    concat: (x, y) => x + y,
    empty: ''
}

type Point = {
    x: number
    y: number
}

const monoidPoint: Monoid<Point> = struct({
    x: monoidSum,
    y: monoidSum
})

type Vector = {
    from: Point
    to: Point
}

const monoidVector: Monoid<Vector> = struct({
    from: monoidPoint,
    to: monoidPoint
})

const M = getApplyMonoid(monoidSum)

describe("Monoid", () => {
    it("can sum monoid numbers", () => {
        expect(monoidSum.concat(5, 7)).toEqual(12)
    })

    it("can combine two Points together", () => {
        const p1: Point = { x: 3, y: 5 }
        const p2: Point = { x: 4, y: 7 }
        expect(monoidPoint.concat(p1, p2)).toEqual({ x: 7, y: 12 })
    })

    it("can combine Points of Points as Vector", () => {
        const p1: Point = { x: 3, y: 5 }
        const p2: Point = { x: 4, y: 7 }
        const p3: Point = { x: 0, y: 1 }
        const p4: Point = { x: 1, y: 2 }
        const vector1: Vector = { from: p1, to: p3 }
        const vector2: Vector = { from: p2, to: p4 }
        const resultVector = { from: { x: 7, y: 12}, to: { x: 1, y: 3}}

        expect(monoidVector.concat(vector1, vector2)).toEqual(resultVector)
    })

    it("can combine a list of values", () => {
        expect(concatAll(monoidSum)([1,2,3,4])).toEqual(10)
        expect(concatAll(monoidProduct)([1,2,3,4])).toEqual(24)
        expect(concatAll(monoidString)(['a','b','c','d'])).toEqual('abcd')
    })

    it("works with Option values", () => {
        expect(M.concat(some(1), none)).toEqual(none)
        expect(M.concat(some(1), some(2))).toEqual(some(3))
        expect(M.concat(some(1), M.empty)).toEqual(some(1))
    })
})