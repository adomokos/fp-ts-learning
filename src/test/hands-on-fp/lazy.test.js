"use strict";
var logs = [];
function lazyFind(logs, arr, predicate) {
    var hero = null;
    var proxy = new Proxy({}, {
        get: function (obj, prop) {
            logs.push("Filtering...");
            if (!hero) {
                hero = arr.find(predicate) || null;
            }
            return hero ? hero[prop] : null;
        }
    });
    return proxy;
}
var heroes = [
    {
        name: "Spiderman",
        powers: [
            "wall-crawling",
            "enhanced strength",
            "enhanced speed",
            "spider-Sense"
        ]
    },
    {
        name: "Superman",
        powers: [
            "flight",
            "superhuman strength",
            "x-ray vision",
            "super-speed"
        ]
    }
];
describe("Lazy", function () {
    it("will create a proxy without filtered objects", function () {
        logs.push("A");
        var spiderman = lazyFind(logs, heroes, function (x) { return x.name === "Spiderman"; });
        logs.push("B");
        expect(spiderman.name).toBe("Spiderman");
        logs.push("C");
        expect(logs).toEqual(["A", "B", "Filtering...", "C"]);
    });
});
