import { Semigroup } from 'fp-ts/Semigroup'
import { Monoid } from 'fp-ts/Monoid'
// Property-based testing tool in TS
import * as fc from 'fast-check'

const S: Semigroup<string> = {
    concat: (x, y) => x + '' + y
}

const associativity = (x: string, y: string, z: string) => 
    S.concat(S.concat(x, y), z) === S.concat(x, S.concat(y, z))

// Arbitrary is responsible to generate randome values
const arb: fc.Arbitrary<string> = fc.string()

// Testing a monoid instance
const M: Monoid<string> = {
    ...S,
    empty: ''
}

// right associatiity
const rightIdentity = (x: string) => M.concat(x, M.empty) === x
const leftIdentity = (x: string) => M.concat(M.empty, x) === x

describe("Property-based testing", () => {
    it("validates that semigroup instance is lawful", () => {
        fc.assert(fc.property(arb, arb, arb, associativity))
    })

    it("validates the Monoid instance", () => {
        fc.assert(fc.property(arb, rightIdentity))
        fc.assert(fc.property(arb, leftIdentity))
    })
})