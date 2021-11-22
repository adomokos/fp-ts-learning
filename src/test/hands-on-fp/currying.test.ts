function curry2<T1, T2, T3>(fn: (a: T1, b: T2) => T3) {
    return (a: T1) => (b: T2) => fn(a, b);
};

function curry3<T1, T2, T3, T4>(fn: (a: T1, b: T2, c: T3) => T4) {
    return (a: T1) => (b: T2) => (c: T3) => fn(a, b, c);
};

function add(a: number, b: number) {
    return a + b;
}

function multiple(a: number, b: number) {
    return a * b;
}

const replace = (s: string, f: string, r: string) => s.split(f).join(r);
const curriedReplace = curry3(replace);

describe("currying", () => {
    it("can take a fn with two arguments", () => {
        const curriedAdd = curry2(add);
        const add5 = curriedAdd(5);
        const addResult = add5(5);

        expect(addResult).toBe(10);

        const curriedMultiple = curry2(multiple);
        const multipleBy5 = curriedMultiple(5);
        const multipleResult = multipleBy5(5);

        expect(multipleResult).toBe(25);
    });

    it("works with original compose function", () => {
        const result = curriedReplace("13/feb/1999")("/")( "-");
        expect(result).toBe("13-feb-1999");
    });
});