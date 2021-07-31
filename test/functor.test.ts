import { Option, isNone, none, some } from 'fp-ts/Option'

function  lift<B, C>(g: (b: B) => C): (fb: Option<B>) => Option<C> {
    return fb => (isNone(fb) ? none : some(g(fb.value)))
}

describe("Functors", () => {
    it("can lift a function into the context", () => {
        const o1 = some(23)
        const result = lift<number, number>(x => x * 2)(some(3))

        expect(result).toEqual(some(6))
    })
})