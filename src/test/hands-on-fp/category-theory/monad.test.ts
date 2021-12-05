class Maybe<T> {
    public static of<TVal>(val?: TVal) {
        return new Maybe(val);
    }

    private _value!: T;

    public constructor(val?: T) {
        if (val) {
            this._value = val;
        }
    }

    public isNothing() {
        return (this._value === undefined || this._value === null);
    }

    public map<TMap>(fn: (val: T) => TMap) {
        if (this.isNothing()) {
            return new Maybe<TMap>();
        }
        return Maybe.of(fn(this._value));
    }

    public ap<TMap>(c: Maybe<(val: T) => TMap>) {
        return c.map(fn => this.map(fn)._value);
    }

    public join(): T | Nothing<T> {
        return this.isNothing() ? Nothing.of(this._value) : this._value;
    }

    public chain<TMap>(fn: (val: T) => TMap) { 
        return this.map(fn).join();
    }
}

const maybeOfNumber = Maybe.of(5);
const maybeOfMaybeOfNumber = Maybe.of(Maybe.of(5));

describe("Maybe", () => {
    it("can map functions", () => {
        const result =
            maybeOfNumber.map((x: number) => x + 1).map((x: number) => x * 2);

        expect(result).toEqual(Maybe.of(12));
    });

    it("can join values", () => {
        const result = maybeOfNumber.map((x: number) => x + 1).join();

        expect(result).toEqual(6);
    });

    it("can chain functions", () => {
        const result = maybeOfNumber.chain((x: number) => x + 1);
        expect(result).toEqual(6);
    });

    it("can operate with nested Maybe values", () => {
        const result = maybeOfMaybeOfNumber.map(x => x.map(y => y + 1));
        expect(result).toEqual(Maybe.of(Maybe.of(6)));
        expect(result.join()).toEqual(Maybe.of(6));

        const result2 = maybeOfMaybeOfNumber.chain((a) => a.map(v => v * 2));
        expect(result2).toEqual(Maybe.of(10));
    });
});