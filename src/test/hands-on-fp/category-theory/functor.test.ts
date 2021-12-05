class Container<T> {
    private _value: T;

    public constructor(value: T) {
        this._value = value;
    }

    public map<TMap>(fn: (val: T) => TMap): Container<TMap> {
        return new Container(fn(this._value));
    }
}

describe("Functor", () => {
    it("can be considered as a container", () => {
        const double = (x: number) => x + x;
        const container = new Container(3);
        const result = container.map(double);

        expect(result instanceof Container).toBe(true);
        expect(result).toEqual(new Container(6));
    });
})