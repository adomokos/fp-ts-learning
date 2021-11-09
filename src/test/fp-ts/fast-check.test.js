"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// Property-based testing tool in TS
var fc = __importStar(require("fast-check"));
var S = {
    concat: function (x, y) { return x + '' + y; }
};
var associativity = function (x, y, z) {
    return S.concat(S.concat(x, y), z) === S.concat(x, S.concat(y, z));
};
// Arbitrary is responsible to generate randome values
var arb = fc.string();
// Testing a monoid instance
var M = __assign(__assign({}, S), { empty: '' });
// right associatiity
var rightIdentity = function (x) { return M.concat(x, M.empty) === x; };
var leftIdentity = function (x) { return M.concat(M.empty, x) === x; };
describe("Property-based testing", function () {
    it("validates that semigroup instance is lawful", function () {
        fc.assert(fc.property(arb, arb, arb, associativity));
    });
    it("validates the Monoid instance", function () {
        fc.assert(fc.property(arb, rightIdentity));
        fc.assert(fc.property(arb, leftIdentity));
    });
});
