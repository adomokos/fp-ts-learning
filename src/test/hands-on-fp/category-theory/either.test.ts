type Either<T1, T2> = Nothing<T1> | Just<T2>;

class Nothing<T> {
    public static of<TVal>(val?: TVal) {
        return new Nothing(val);
    }

    private _value: T|undefined;
    public constructor(val?: T) {
        this._value = val;
    }

    public map<TMap>(fn: (val: T) => TMap): Nothing<TMap> {
        if (this._value !== undefined) {
            return new Nothing<TMap>(fn(this._value));
        } else {
            return new Nothing<TMap>(this._value as any);
        }
    }
}

class Just<T> {
    public static of<TVal>(val: TVal) {
        return new Just(val);
    }

    private _value: T;

    public constructor(val: T) {
        this._value = val;
    }

    public map<TMap>(fn: (val: T) => TMap): Just<TMap> {
        return new Just<TMap>(fn(this._value));
    }
}

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

function getUser (id: number): Either<string, User> {
    return Just.of({
        id,
        name: "John",
        email: "john@example.com",
        age: 30
    });
}

function getUserWithError(id: number): Either<string, User> {
    return Nothing.of("error occurred pulling the user from the DB");
}

describe("Either", () => {
    it("can handle the happy path", () => {
        const result = getUser(1);
        if (result instanceof Just) {
            expect(result.map(user => user.name)).toEqual(Just.of("John"));
        } else {
            fail("Shouldn't get here");
        };
    });

    it("can handle the error case", () => {
        const result = getUserWithError(1);
        if (result instanceof Nothing) {
            expect(result.map(error => error)).toEqual(Nothing.of("error occurred pulling the user from the DB"));
        } else {
            fail("Shouldn't get here");
        };
    });
});