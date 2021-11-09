"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("fp-ts/Option");
var Either_1 = require("fp-ts/Either");
function lift(g) {
    return function (fb) { return (Option_1.isNone(fb) ? Option_1.none : Option_1.some(g(fb.value))); };
}
describe("Functors", function () {
    it("can lift a function into the context", function () {
        var result = lift(function (x) { return x * 2; })(Option_1.some(3));
        expect(result).toEqual(Option_1.some(6));
    });
    it("can work with Option's map function", function () {
        var result = Option_1.map(function (x) { return x.toString() + " - oh"; })(Option_1.some(42));
        expect(result).toEqual(Option_1.some('42 - oh'));
        var result2 = Option_1.map(function (x) { return x.toString() + " - oh"; })(Option_1.none);
        expect(result2).toEqual(Option_1.none);
    });
    it("can map Either values", function () {
        var result = Either_1.map(function (x) { return x * 2; })(Either_1.right(4));
        expect(result).toEqual(Either_1.right(8));
        var result2 = Either_1.map(function (x) { return x * 2; })(Either_1.left(Error("I don't like this")));
        expect(result2).toEqual(Either_1.left(Error("I don't like this")));
    });
});
