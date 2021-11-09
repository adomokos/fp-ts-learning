"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Semigroup_1 = require("fp-ts/Semigroup");
var Semigroup_2 = require("fp-ts/Semigroup");
var N = __importStar(require("fp-ts/number"));
var B = __importStar(require("fp-ts/boolean"));
var function_1 = require("fp-ts/function");
var Option_1 = require("fp-ts/Option");
var Semigroup_3 = require("fp-ts/Semigroup");
// number `Semigroup` under multiplication
var semigroupProduct = {
    concat: function (x, y) { return x * y; }
};
// number `Semigroup` under addition
var semigroupSum = {
    concat: function (x, y) { return x + y; }
};
// can work with strings
var semigroupString = {
    concat: function (x, y) { return x + y; }
};
// when type can't be defined
// Always return the first element
function getFirstSemigroup() {
    return { concat: function (x, _y) { return x; } };
}
// Always return the last element
function getLastSemigroup() {
    return { concat: function (_x, y) { return y; } };
}
// Deriving from Ord
// Takes the min of two values
var semigroupMin = Semigroup_2.min(N.Ord);
// Takes the max of two values
var semigroupMax = Semigroup_2.max(N.Ord);
var semigroupPoint = {
    concat: function (p1, p2) { return ({
        x: semigroupSum.concat(p1.x, p2.x),
        y: semigroupSum.concat(p1.y, p2.y)
    }); }
};
// We can use built-in libraries to make this shorter
var semigroupPoint2 = Semigroup_1.struct({
    x: N.SemigroupSum,
    y: N.SemigroupSum
});
// Semigroup for functions
var semigroupPredicate = function_1.getSemigroup(B.SemigroupAll)();
var isPositiveX = function (p) { return p.x >= 0; };
var isPositiveY = function (p) { return p.y >= 0; };
var isPositivieXY = semigroupPredicate.concat(isPositiveX, isPositiveY);
// Concat works with two elements, the `fold` function
// works on a collection
var sum = Semigroup_1.concatAll(semigroupSum);
var product = Semigroup_1.concatAll(semigroupProduct);
// It even works with Option
var S = Option_1.getApplySemigroup(Semigroup_3.semigroupSum);
describe("Semigroup", function () {
    it("can define sum and product for numbers", function () {
        expect(semigroupProduct.concat(3, 5)).toEqual(15);
        expect(semigroupSum.concat(3, 5)).toEqual(8);
    });
    it("can define addition for strings", function () {
        expect(semigroupString.concat("Hello", "World")).toEqual("HelloWorld");
    });
    it("can be used with Ord", function () {
        expect(semigroupMin.concat(3, 2)).toEqual(2);
        expect(semigroupMax.concat(3, 2)).toEqual(3);
    });
    it("works with complex types", function () {
        var p1 = { x: 3, y: 5 };
        var p2 = { x: 8, y: 12 };
        expect(semigroupPoint.concat(p1, p2)).toEqual({ x: 11, y: 17 });
        expect(semigroupPoint2.concat(p1, p2)).toEqual({ x: 11, y: 17 });
    });
    it("works with predicate functions", function () {
        expect(isPositivieXY({ x: 1, y: 1 })).toBeTruthy();
        expect(isPositivieXY({ x: 1, y: -1 })).toBeFalsy();
        expect(isPositivieXY({ x: -1, y: 1 })).toBeFalsy();
        expect(isPositivieXY({ x: -1, y: -1 })).toBeFalsy();
    });
    it("can handle a collection of Semigroup items", function () {
        expect(sum(0)([1, 2, 3, 4])).toEqual(10);
        expect(product(1)([1, 2, 3, 4])).toEqual(24);
    });
    it("works with Option type", function () {
        var result = S.concat(Option_1.some(2), Option_1.some(3));
        expect(result).toEqual(Option_1.some(5));
    });
});
