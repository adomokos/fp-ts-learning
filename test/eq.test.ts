import { Eq } from "fp-ts/Eq";
import { getEq } from "fp-ts/lib/Array"
import { tuple } from "fp-ts/Eq";
import * as N from "fp-ts/number";
import { contramap } from "fp-ts/lib/Eq";

const eqNumber: Eq<number> = {
    equals: (x, y) => x === y
}

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
    return (a, as) => as.some(item => E.equals(item, a))
}

type Point = {
    x: number
    y: number
}

const eqPoint: Eq<Point> = {
    equals: (p1, p2) => p1 === p2 || (p1.x === p2.x && p1.y === p2.y)
}

const eqArrayOfPoints: Eq<Array<Point>> = getEq(eqPoint)

const p1: Point = { x: 1, y: 2}
const p2: Point = { x: 1, y: 2}
const p3: Point = { x: 3, y: 4}

type User = {
    userId: number
    name: string
}

const eqUser = contramap((user: User) => user.userId)(eqNumber)

describe("Equatable", () => {
    it("can compare simple values", () => {
        expect(elem(eqNumber)(1, [1,2,3])).toBeTruthy()
        expect(elem(eqNumber)(4, [1,2,3])).toBeFalsy()
    })

    it("can compare more complex types", () => {
        expect(eqPoint.equals(p1, p2)).toBeTruthy()
        expect(eqPoint.equals(p2, p3)).toBeFalsy()
    })

    it("can compare list of complex types", () => {
        expect(eqArrayOfPoints.equals([p1, p2], [p1, p2]))
    })

    it("can work with built-in primitive types", () => {
        const P = tuple(N.Eq, N.Eq)
        expect(P.equals([1,2], [1,2])).toBeTruthy()
    })

    it("can use more complex contramap for equality check", () => {
        const user1: User = {userId: 1, name: "Giulio"}
        const user2: User = {userId: 1, name: "Giulio Canti"}
        const user3: User = {userId: 3, name: "Giulio"}

        expect(eqUser.equals(user1, user2)).toBeTruthy()
        expect(eqUser.equals(user1, user3)).toBeFalsy()
    })
})