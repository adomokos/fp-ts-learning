"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Monoid_1 = require("fp-ts/Monoid");
var Semigroup_1 = require("fp-ts/Semigroup");
var Option_1 = require("fp-ts/lib/Option");
var monoidSum = {
    concat: function (x, y) { return x + y; },
    empty: 0
};
var monoidProduct = {
    concat: function (x, y) { return x * y; },
    empty: 1
};
var monoidString = {
    concat: function (x, y) { return x + y; },
    empty: ''
};
var monoidPoint = Monoid_1.struct({
    x: monoidSum,
    y: monoidSum
});
var monoidVector = Monoid_1.struct({
    from: monoidPoint,
    to: monoidPoint
});
var M = Option_1.getApplyMonoid(monoidSum);
var monoidSettings = Monoid_1.struct({
    fontFamily: Option_1.getMonoid(Semigroup_1.last()),
    fontSize: Option_1.getMonoid(Semigroup_1.last()),
    maxColumn: Option_1.getMonoid(Semigroup_1.last())
});
var workspaceSettings = {
    fontFamily: Option_1.some('Courier'),
    fontSize: Option_1.none,
    maxColumn: Option_1.some(80)
};
var userSettings = {
    fontFamily: Option_1.some('Fira Code'),
    fontSize: Option_1.some(12),
    maxColumn: Option_1.some(80)
};
describe("Monoid", function () {
    it("can sum monoid numbers", function () {
        expect(monoidSum.concat(5, 7)).toEqual(12);
    });
    it("can combine two Points together", function () {
        var p1 = { x: 3, y: 5 };
        var p2 = { x: 4, y: 7 };
        expect(monoidPoint.concat(p1, p2)).toEqual({ x: 7, y: 12 });
    });
    it("can combine Points of Points as Vector", function () {
        var p1 = { x: 3, y: 5 };
        var p2 = { x: 4, y: 7 };
        var p3 = { x: 0, y: 1 };
        var p4 = { x: 1, y: 2 };
        var vector1 = { from: p1, to: p3 };
        var vector2 = { from: p2, to: p4 };
        var resultVector = { from: { x: 7, y: 12 }, to: { x: 1, y: 3 } };
        expect(monoidVector.concat(vector1, vector2)).toEqual(resultVector);
    });
    it("can combine a list of values", function () {
        expect(Monoid_1.concatAll(monoidSum)([1, 2, 3, 4])).toEqual(10);
        expect(Monoid_1.concatAll(monoidProduct)([1, 2, 3, 4])).toEqual(24);
        expect(Monoid_1.concatAll(monoidString)(['a', 'b', 'c', 'd'])).toEqual('abcd');
    });
    it("works with Option values", function () {
        expect(M.concat(Option_1.some(1), Option_1.none)).toEqual(Option_1.none);
        expect(M.concat(Option_1.some(1), Option_1.some(2))).toEqual(Option_1.some(3));
        expect(M.concat(Option_1.some(1), M.empty)).toEqual(Option_1.some(1));
    });
    it("can use the last Monoid", function () {
        var result = monoidSettings.concat(workspaceSettings, userSettings);
        var expectedSettings = {
            fontFamily: Option_1.some("Fira Code"),
            fontSize: Option_1.some(12),
            maxColumn: Option_1.some(80)
        };
        expect(result).toEqual(expectedSettings);
    });
});
