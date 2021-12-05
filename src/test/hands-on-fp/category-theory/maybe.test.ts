import { string } from "fp-ts";

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
}

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

function getUser (id: number): Maybe<User> {
    return Maybe.of({
        id,
        name: "John",
        email: "john@example.com",
        age: 30
    });
}

function getUserWithError(id: number): Maybe<User> {
    return Maybe.of();
}

describe("Maybe", () => {
    it("can map over its results", () => {
        const result = getUser(1).map(user => user.name);
        expect(result).toEqual(Maybe.of("John"));
    });

    it("can map over its Nothing result", () => {
        const result = getUserWithError(1).map(user => user.name);
        expect(result).toEqual(Maybe.of());
    });
});