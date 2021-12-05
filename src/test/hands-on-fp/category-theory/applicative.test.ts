class ContainerA<T> {
    public static of<TVal>(val: TVal) {
        return new ContainerA(val);
    }

    private _value!: T;

    public constructor(val: T) {
        this._value = val;
    }

    public map<TMap>(fn: (val: T) => TMap): ContainerA<TMap> {
        return new ContainerA<TMap>(fn(this._value));
    }

    public ap<TMap>(c: ContainerA<(val: T) => TMap>): ContainerA<TMap> {
        return c.map(fn => this.map(fn)._value);
    }
}

const double = (x: number) => x * 2;
const numberContainer = ContainerA.of(3);
const functionContainer = ContainerA.of(double);

describe("Applicative", () => {
    it("can map a number and a function",  () => {
        const result = numberContainer.map(double);
        expect(result).toEqual(ContainerA.of(6));
    });

    it("can 'ap' a number and a function",  () => {
        const result = numberContainer.ap(functionContainer);
        expect(result).toEqual(ContainerA.of(6));
    });
});