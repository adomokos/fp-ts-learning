import { exportNamedDeclaration } from "@babel/types";

const trim = (s: string) => s.trim();
const capitalize = (s: string) => s.toUpperCase();
const ask = (s: string) => `${s}?`;

const trimAndCapitalize = (s: string) => capitalize(trim(s));

const compose = <T>(f: (x: T) => T, g: (x: T) => T) => (x: T) => f(g(x));

const compose3 = <T>(f: (x: T) => T, g: (x: T) => T, h: (x: T) => T) => (x: T) => f(g(h(x)));

const composeMany = <T>(...fs: ((x: T) => T)[]): ((x: T) => T) => {
    return (x: T) => {
        return fs.reduce((acc, f) => f(acc), x);
    }
}

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
});