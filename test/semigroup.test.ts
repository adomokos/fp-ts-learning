import { struct, Semigroup } from "fp-ts/Semigroup"
import { min, max } from "fp-ts/Semigroup"
import * as N from "fp-ts/number";
import * as B from "fp-ts/boolean";
import { getSemigroup } from "fp-ts/function"

// number `Semigroup` under multiplication
const semigroupProduct: Semigroup<number> = {
    concat: (x, y) => x * y
}

// number `Semigroup` under addition
const semigroupSum: Semigroup<number> = {
    concat: (x, y) => x + y
}

// can work with strings
const semigroupString: Semigroup<string> = {
    concat: (x, y) => x + y
}

// when type can't be defined
// Always return the first element
function getFirstSemigroup<A = never>(): Semigroup<A> {
    return { concat: (x, _y) => x}
}

// Always return the last element
function getLastSemigroup<A = never>(): Semigroup<A> {
    return { concat: (_x, y) => y}
}

// Deriving from Ord
// Takes the min of two values
const semigroupMin: Semigroup<number> = min(N.Ord)

// Takes the max of two values
const semigroupMax: Semigroup<number> = max(N.Ord)

// Semigroup instances for more complex types
type Point = {
    x: number
    y: number
}

const semigroupPoint: Semigroup<Point> = {
    concat: (p1, p2) => ({
        x: semigroupSum.concat(p1.x, p2.x),
        y: semigroupSum.concat(p1.y, p2.y)
    })
}

// We can use built-in libraries to make this shorter
const semigroupPoint2: Semigroup<Point> = struct<Point>({
        x: N.SemigroupSum,
        y: N.SemigroupSum
    })

// Semigroup for functions
const semigroupPredicate = getSemigroup(
    B.SemigroupAll
)<Point>()

const isPositiveX = (p: Point): boolean => p.x >= 0
const isPositiveY = (p: Point): boolean => p.y >= 0

const isPositivieXY = semigroupPredicate.concat(isPositiveX, isPositiveY)

describe("Semigroup", () => {
    it("can define sum and product for numbers", () => {
        expect(semigroupProduct.concat(3, 5)).toEqual(15)
        expect(semigroupSum.concat(3, 5)).toEqual(8)
    })

    it("can define addition for strings", () => {
        expect(semigroupString.concat("Hello", "World")).toEqual("HelloWorld")
    })

    it("can be used with Ord", () => {
        expect(semigroupMin.concat(3, 2)).toEqual(2)
        expect(semigroupMax.concat(3, 2)).toEqual(3)
    })

    it("works with complex types", () => {
        const p1: Point = { x: 3, y: 5 }
        const p2: Point = { x: 8, y: 12 }
        expect(semigroupPoint.concat(p1, p2)).toEqual({ x: 11, y: 17 })
        expect(semigroupPoint2.concat(p1, p2)).toEqual({ x: 11, y: 17 })
    })

    it("works with predicate functions", () => {
        expect(isPositivieXY({ x: 1, y: 1})).toBeTruthy()
        expect(isPositivieXY({ x: 1, y: -1})).toBeFalsy()
        expect(isPositivieXY({ x: -1, y: 1})).toBeFalsy()
        expect(isPositivieXY({ x: -1, y: -1})).toBeFalsy()
    })
})