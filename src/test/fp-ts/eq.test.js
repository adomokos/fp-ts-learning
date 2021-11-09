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
var Array_1 = require("fp-ts/lib/Array");
var Eq_1 = require("fp-ts/Eq");
var N = __importStar(require("fp-ts/number"));
var Eq_2 = require("fp-ts/lib/Eq");
var eqNumber = {
    equals: function (x, y) { return x === y; }
};
function elem(E) {
    return function (a, as) { return as.some(function (item) { return E.equals(item, a); }); };
}
var eqPoint = {
    equals: function (p1, p2) { return p1 === p2 || (p1.x === p2.x && p1.y === p2.y); }
};
var eqArrayOfPoints = Array_1.getEq(eqPoint);
var p1 = { x: 1, y: 2 };
var p2 = { x: 1, y: 2 };
var p3 = { x: 3, y: 4 };
var eqUser = Eq_2.contramap(function (user) { return user.userId; })(eqNumber);
describe("Equatable", function () {
    it("can compare simple values", function () {
        expect(elem(eqNumber)(1, [1, 2, 3])).toBeTruthy();
        expect(elem(eqNumber)(4, [1, 2, 3])).toBeFalsy();
    });
    it("can compare more complex types", function () {
        expect(eqPoint.equals(p1, p2)).toBeTruthy();
        expect(eqPoint.equals(p2, p3)).toBeFalsy();
    });
    it("can compare list of complex types", function () {
        expect(eqArrayOfPoints.equals([p1, p2], [p1, p2]));
    });
    it("can work with built-in primitive types", function () {
        var P = Eq_1.tuple(N.Eq, N.Eq);
        expect(P.equals([1, 2], [1, 2])).toBeTruthy();
    });
    it("can use more complex contramap for equality check", function () {
        var user1 = { userId: 1, name: "Giulio" };
        var user2 = { userId: 1, name: "Giulio Canti" };
        var user3 = { userId: 3, name: "Giulio" };
        expect(eqUser.equals(user1, user2)).toBeTruthy();
        expect(eqUser.equals(user1, user3)).toBeFalsy();
    });
});
