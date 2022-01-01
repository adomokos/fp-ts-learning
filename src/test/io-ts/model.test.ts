// Exampels from here: https://github.com/gcanti/io-ts/blob/master/Decoder.md
import * as D from "io-ts/Decoder";
import { isRight, right, fold } from "fp-ts/Either";
import { string } from "io-ts";

const Person = D.struct({
    name: D.string,
    age: D.number
});

describe("Model", () => {
    it("can decode strings", () => {
        expect(isRight(string.decode("hello"))).toBeTruthy();
    });

    it("can decode literals", () => {
        const MyLiteral: D.Decoder<unknown, 'a'> = D.literal("a");

        const result = MyLiteral.decode("a");
        expect(result).toEqual(right("a"));

        const wrongResult = MyLiteral.decode("b");
        fold(
            (error: any) => expect(error.value.error).toEqual("\"a\""),
            (_) => fail("This value is left")
        )(wrongResult);
    });

    it("can decode more complex literals", () => {
        const MyLiteral: D.Decoder<unknown, 'a' | 'b'> = D.literal("a", "b");

        const result = MyLiteral.decode("a");
        expect(result).toEqual(right("a"));

        const result2 = MyLiteral.decode("b");
        expect(result2).toEqual(right("b"));

        const wrongResult = MyLiteral.decode("c");
        expect(isRight(wrongResult)).toBeFalsy();
    });

    it("can deocde a struct as well", () => {
        const result = Person.decode({ name: "John", age: 42 });
        fold(
            (_) => fail("It should not be left"),
            (value: Person) => {
                expect(value).toEqual({ name: "John", age: 42 });
            }
        );
    });
});