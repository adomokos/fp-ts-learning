import { compose, compose3, composeMany } from "./utils";

const trim = (s: string) => s.trim();
const capitalize = (s: string) => s.toUpperCase();
const ask = (s: string) => `${s}?`;

const trimAndCapitalize = (s: string) => capitalize(trim(s));


// Partial application

function add(a: number) {
    return (b: number) => a + b;
}

function add2(a: number, b?: number) {
    return b ? a + b : (b: number) => a + b;
}

const replace = (f: string, r: string) => (s: string) => s.split(f).join(r);

const trimCapitalizeAndReplace = compose(trimAndCapitalize, replace("/", "-"));

describe("FP Techniques", () => {
    describe("Composition", () => {
        it("can call nested functions", () => {
            const result = trimAndCapitalize("  hello world  ");
            expect(result).toBe("HELLO WORLD");
        })

        it("con be composed with functions", () => {
            const result = compose(trim, capitalize)("  hello world  ");
            expect(result).toBe("HELLO WORLD");

            const result2 = compose3(ask, trim, capitalize)("  hello world  ");
            expect(result2).toEqual("HELLO WORLD?");

            const result3 = composeMany(trim, capitalize, ask)("  hello world  ");
            expect(result3).toEqual("HELLO WORLD?");
        });
    })

    describe("Parital Application", () => {
        it("a function can return another unary function", () => {
            const add5 = add(5);
            expect(add5(10)).toBe(15);
        })

        it("can take two numbers or one", () => {
            expect(add2(5, 5)).toBe(10);

            const add5 = add2(5) as (b: number) => number;
            expect(add5(10)).toBe(15);
        });

        it("works well with unary functions", () => {
            const result = trimCapitalizeAndReplace(" 13/feb/1999  ");
            expect(result).toBe("13-FEB-1999");
        });
    });
});