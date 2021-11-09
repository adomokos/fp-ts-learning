"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ord_1 = require("fp-ts/Ord");
var ordNumber = {
    equals: function (x, y) { return x === y; },
    compare: function (x, y) { return (x < y ? -1 : x > y ? 1 : 0); }
};
// Shorter declaration
var ordNumber2 = Ord_1.fromCompare(function (x, y) { return (x < y ? -1 : x > y ? 1 : 0); });
function min(O) {
    return function (x, y) { return (O.compare(x, y) === 1 ? y : x); };
}
var byAge = Ord_1.fromCompare(function (x, y) { return ordNumber2.compare(x.age, y.age); });
// Using contramap, this can be shorter
var byAge2 = Ord_1.contramap(function (user) { return user.age; })(ordNumber2);
// The `min` can be used
var getYounger = min(byAge2);
describe("Orderable", function () {
    it("can calculate order", function () {
        expect(ordNumber.compare(1, 2)).toEqual(-1);
        expect(ordNumber.compare(1, 1)).toEqual(0);
        expect(ordNumber.compare(2, 1)).toEqual(1);
        expect(ordNumber2.compare(1, 1)).toEqual(0);
    });
    it("can find the minimum value in two numbers", function () {
        expect(min(ordNumber2)(23, 45)).toEqual(23);
        expect(min(ordNumber2)(45, 45)).toEqual(45);
    });
    it("can calculate order for complex types", function () {
        var user1 = { name: "John", age: 41 };
        var user2 = { name: "Paul", age: 39 };
        expect(byAge.compare(user1, user2)).toEqual(1);
        expect(byAge2.compare(user2, user1)).toEqual(-1);
        expect(getYounger(user1, user2)).toEqual(user2);
    });
});
