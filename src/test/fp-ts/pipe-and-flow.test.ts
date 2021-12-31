// Examples from here

import { flow, pipe } from "fp-ts/function";

const add5 = (x: number) => x + 5;
const multiplyBy2 = (x: number) => x * 2;

describe("pipe and flow", () => {
    describe("pipe", () => {
        it("can thread through functions", () => {
            const one = multiplyBy2(add5(3));
            expect(one).toEqual(16);

            const two = pipe(3, add5, multiplyBy2);
            expect(one).toEqual(two);
        });
    });

    describe("flow", () => {
        it("can make the code more conscise", () => {
            const runPipe = (x: number) => pipe(x, add5);
            const runFlow = flow(add5);

            expect(runPipe(3)).toEqual(runFlow(3));
        });
    });
});