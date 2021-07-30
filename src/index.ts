import { Eq } from "fp-ts/Eq";
import { tuple } from "fp-ts/Eq";
import * as N from "fp-ts/number";
import { getEq } from "fp-ts/lib/Array"
import { contramap } from "fp-ts/lib/Eq";

const eqNumber: Eq<number> = {
    equals: (x, y) => x === y
}

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
    return (a, as) => as.some(item => E.equals(item, a))
}

console.log(elem(eqNumber)(1, [1,2,3]));
console.log(elem(eqNumber)(4, [1,2,3]));

type Point = {
    x: number
    y: number
}

const eqPoint: Eq<Point> = {
    equals: (p1, p2) => p1 === p2 || (p1.x === p2.x && p1.y === p2.y)
}

const p1: Point = { x: 1, y: 2}
const p2: Point = { x: 1, y: 2}
const p3: Point = { x: 3, y: 4}

console.log(eqPoint.equals(p1, p2))
console.log(eqPoint.equals(p2, p3))

const P = tuple(N.Eq, N.Eq)
console.log(P.equals([1,2], [1,2]))

const eqArrayOfPoints: Eq<Array<Point>> = getEq(eqPoint)

console.log(eqArrayOfPoints.equals([p1, p2], [p1, p2]))

type User = {
    userId: number
    name: string
}

// Two users are equal if their `userId` field is equal
const eqUser = contramap((user: User) => user.userId)(eqNumber)

console.log(eqUser.equals({userId: 1, name: "Giulio"}, {userId: 1, name: "Giulio Canti"}))
console.log(eqUser.equals({userId: 1, name: "Giulio"}, {userId: 2, name: "Giulio"}))