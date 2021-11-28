import { curry3 } from "./utils";

const pipe = <T>(...fns: Array<(arg: T) => T>) =>
    (value: T) =>
        fns.reduce((acc, fn) => fn(acc), value);

const trim = (s: string) => s.trim();
const capitalize = (s: string) => s.toUpperCase();
const replace = curry3(
    (f: string, r: string, s: string) => s.split(f).join(r)
);

const trimCapitalizeAndReplace = pipe(trim, capitalize, replace("/")("-"));

describe("pipes", () => {
    it("can create new function by combining others", () => {
        const result = trimCapitalizeAndReplace("  13/feb/1989  ");
        expect(result).toBe("13-FEB-1989");
    });
});