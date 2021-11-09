const logs: string[] = [];

function lazyFind<T>(logs: string[], arr: T[], predicate: (x: T) => boolean): T {
    let hero: T | null = null

    const proxy = new Proxy(
        {},
        {
            get: (obj, prop) => {
                logs.push("Filtering...");
                if (!hero) {
                    hero = arr.find(predicate) || null;
                }
                return hero ? (hero as any)[prop] : null;
            }
        }
    );

    return proxy as any;
}

const heroes = [
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

describe("Lazy", () => {
    it("will create a proxy without filtered objects", () => {
        logs.push("A");
        const spiderman = lazyFind(logs, heroes, x => x.name === "Spiderman");
        logs.push("B");
        expect(spiderman.name).toBe("Spiderman");
        logs.push("C");
        expect(logs).toEqual(["A", "B", "Filtering...", "C"]);
    })
});