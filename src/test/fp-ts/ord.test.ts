import { Ord, fromCompare, contramap } from "fp-ts/Ord";

const ordNumber: Ord<number> = {
    equals: (x, y) => x === y,
    compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
}

// Shorter declaration
const ordNumber2: Ord<number> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0))

function min<A>(O: Ord<A>): (x: A, y: A) => A {
    return (x, y) => (O.compare(x, y) === 1 ? y : x)
}

// Sorting complex types
type User = {
    name: string
    age: number
}

const byAge: Ord<User> = fromCompare((x, y) => ordNumber2.compare(x.age, y.age)) 

// Using contramap, this can be shorter
const byAge2: Ord<User> = contramap((user: User) => user.age)(ordNumber2)

// The `min` can be used
const getYounger = min(byAge2)

describe("Orderable", () => {
    it("can calculate order", () => {
        expect(ordNumber.compare(1, 2)).toEqual(-1)
        expect(ordNumber.compare(1, 1)).toEqual(0)
        expect(ordNumber.compare(2, 1)).toEqual(1)

        expect(ordNumber2.compare(1, 1)).toEqual(0)
    })

    it("can find the minimum value in two numbers", () => {
        expect(min(ordNumber2)(23,45)).toEqual(23)
        expect(min(ordNumber2)(45,45)).toEqual(45)
    })

    it("can calculate order for complex types", () => {
        const user1 = { name: "John", age: 41 }
        const user2 = { name: "Paul", age: 39 }
        expect(byAge.compare(user1, user2)).toEqual(1)
        expect(byAge2.compare(user2, user1)).toEqual(-1)

        expect(getYounger(user1, user2)).toEqual(user2)
    })
})