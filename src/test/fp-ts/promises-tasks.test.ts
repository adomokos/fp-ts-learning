// Examples from here: https://grossbart.github.io/fp-ts-recipes/#/async

import { apply, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import { Either, isRight, right } from "fp-ts/Either";
import { access, constants } from "fs";

const deepThought: task.Task<number> = () => Promise.resolve(42);

const fetchGreeting = taskEither.tryCatch<Error, { name: string }>(
    () => new Promise((resolve) => resolve(JSON.parse('{"name": "Carol"}'))),
    (reason) => new Error(String(reason))
)

describe("Promoises and Tasks", () => {
    it("works with task alwasy succeeding", async () => {
       const result = await deepThought(); 
       expect(result).toEqual(42);
    });

    it("works with tasks that may fail", async () => {
        const result: Either<Error, { name: string }> = await fetchGreeting();
        expect(isRight(result)).toBeTruthy();
        expect(result).toEqual(right({ name: "Carol" }));
    });

    it("works with a list of tasks in parallel", async () => {
        const tasks = [task.of(1), task.of(2), task.of(3)];
        const result = await task.sequenceArray(tasks)();

        expect(result).toEqual([1, 2, 3]);
    });

    xit("works with tasks in sequence", async () => {
        const log = (logs: string) =>
            (x: string) => {
                logs = `${logs}: ${x}`
                return x;
            };

        let logs = "";
        const tasks = [
            pipe(task.delay(200)(task.of("first")), task.map(log(logs))),
            pipe(task.delay(100)(task.of("second")), task.map(log(logs))),
        ]        

        const result = await task.sequenceArray(tasks)();
        const result2 = await task.sequenceSeqArray(tasks)();
        // expect(result2).toEqual(["second", "first"]);
    });

    it("works with different task types", async() => {
        const result = await apply.sequenceT(task.ApplyPar)(task.of(1), task.of("hello"))();
        expect(result).toEqual([1, "hello"]);

        const result2 = await apply.sequenceS(task.ApplyPar)({a: task.of(1), b: task.of("hello")})();
        expect(result2).toEqual({a: 1, b: "hello"});
    });

    it("works with a list of dependent tasks", async() => {
        const result = await pipe(
            task.of(2),
            task.chain((result) => task.of(result + 3)),
            task.chain((result) => task.of(result + 4))
        )();

        expect(result).toEqual(9);
    });

    it("can traverse over results", async() => {
        const checkPathExists = (path: string) => () =>
            new Promise((resolve) => {
                access(path,
                       constants.F_OK,
                       (err: unknown) => resolve({ path, exists: !err }));
            })

        const items = ["/bin", "/no/real/path"];

        const result = await task.sequenceArray(items.map(checkPathExists))()
        expect(result).toEqual(
            [
                { path: "/bin", exists: true },
                { path: "/no/real/path", exists: false },
            ]
        )

        // this example did not work
        // const result = task.traverseArray(items, checkPathExists)();
    });
});