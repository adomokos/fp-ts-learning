import { Option, isNone, none, some, map } from 'fp-ts/Option'

function  lift<B, C>(g: (b: B) => C): (fb: Option<B>) => Option<C> {
    return fb => (isNone(fb) ? none : some(g(fb.value)))
}

describe("Functors", () => {
    it("can lift a function into the context", () => {
        const result = lift<number, number>(x => x * 2)(some(3))

        expect(result).toEqual(some(6))
    })

    it("can work with Option's map function", () => {
        const result = map<number, string>(x => x.toString() + " - oh")(some(42))
        expect(result).toEqual(some('42 - oh'))

        const result2 = map<number, string>(x => x.toString() + " - oh")(none)
        expect(result2).toEqual(none)
    })
})