import { curry2, curry3, compose } from "./utils";

function add(a: number, b: number) {
    return a + b;
}

function multiple(a: number, b: number) {
    return a * b;
}

const replace = (f: string, r: string, s: string) => s.split(f).join(r);
const curriedReplace = curry3(replace);

const trim = (s: string) => s.trim();
const capitalize = (s: string) => s.toUpperCase();

const trimAndCapitalize = (s: string) => capitalize(trim(s));

const trimCapitalizeAndReplace = compose(
    trimAndCapitalize,
    curriedReplace("/")("-")
)

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
        const result = curriedReplace("/")( "-")("13/feb/1999");
        expect(result).toBe("13-feb-1999");
    });

    it("can compose multiple functions together", () => {
        const result = trimCapitalizeAndReplace("   13/feb/1999 ");
        expect(result).toBe("13-FEB-1999");

    });
});