import { StateT1 } from "fp-ts/lib/StateT";
import { TheseT1 } from "fp-ts/lib/TheseT";
import * as R from "ramda";

class APerson {
    public readonly name: string;
    public readonly age: number;

    public constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

class Street {
    public readonly name: string;
    public readonly number: number;

    public constructor(number: number, name: string) {
        this.name = name;
        this.number = number;
    }
}

class Address {
    public readonly city: string;
    public readonly street: Street;

    public constructor(city: string, street: Street) {
        this.city = city;
        this.street = street;
    }
}

class Company {
    public readonly name: string;
    public readonly addresses: Address[];

    public constructor(name: string, addresses: Address[]) {
        this.name = name;
        this.addresses = addresses;
    }    
}

const company1 = new Company(
    "Facebook",
    [
        new Address(
            "London",
            new Street(1, "rathbone street")
        ),
        new Address(
            "Dublin",
            new Street(5, "grand canal street") 
        )
    ]
);

// To create a new copy, we need to copy all properties from
// the original object.
const company2 = new Company(
    company1.name,
    company1.addresses.map(address =>
        new Address(address.city,
                    new Street(
                        address.street.number,
                        R.toUpper(address.street.name))))
);

interface Lens<T1, T2> {
    get(o: T1): T2;
    set(o: T2, v: T1): T1;
}

const streetLens: Lens<Address, Street> = {
    get: (o: Address) => o.street,
    set: (v: Street, o: Address) => new Address(o.city, v)
};

const nameLens: Lens<Street, string> = {
    get: (o: Street) => o.name,
    set: (v: string, o: Street) => new Street(o.number, v)
};

function composeLens<A, B, C>(
    ab: Lens<A, B>,
    bc: Lens<B, C>
): Lens<A, C> {
    return {
        get: (a: A) => bc.get(ab.get(a)),
        set: (c: C, a: A) => ab.set(bc.set(c, ab.get(a)), a)
    };
}

const streetNameLens = composeLens(streetLens, nameLens);

function overLens<S, A>(
    lens: Lens<S, A>,
    func: (a: A) => A,
    s: S
): S {
    return lens.set(func(lens.get(s)), s);
}

// Making lenses more generic
type Prop<T, K extends keyof T> = (o: T) => T[K];
type Assoc<T, K extends keyof T> = (v: T[K], o: T) => T;

const propStreet: Prop<Address, "street"> = (o: Address) => o.street;
const assocStreet: Assoc<Address, "street"> = (v: Address["street"], o: Address) =>
    new Address(o.city, v);

const lens = <T1, K extends keyof T1>(
    getter: Prop<T1, K>,
    setter: Assoc<T1, K>
) : Lens<T1, T1[K]> => {
    return {
        get: (obj: T1) => getter(obj),
        set: (val: T1[K], obj: T1) => setter(val, obj)
    }
}

const streeLens = lens(propStreet, assocStreet);

const view = <T1, T2>(lens: Lens<T1, T2>, obj: T1) => lens.get(obj);

const set = <T1, K extends keyof T1>(
    lens: Lens<T1, T1[K]>,
    val: T1[K],
    obj: T1
) => lens.set(val, obj);

describe("Lens", () => {
    it ("is possible to update immutable objects", () => {
        expect(company2.addresses[0].street.name).toBe("RATHBONE STREET");
    });

    it("can get values with 'get'", () => {
        const address = new Address(
            "London",
            new Street(1, "rathbone street")
        );

        const street = streetLens.get(address);
        expect(street.name).toBe("rathbone street");
    });

    it("can set values with it", () => {
        const address = new Address(
            "London",
            new Street(1, "rathbone street")
        );

        const address2 = streetLens.set(
            new Street(
                address.street.number,
                R.toUpper(address.street.name)
            ),
            address
        )

        expect(address2.street.name).toBe("RATHBONE STREET");
    });

    it("can compose lens together", () => {
        const address = new Address(
            "London",
            new Street(1, "rathbone street")
        );

        const streetName = streetNameLens.get(address);

        expect(streetName).toBe("rathbone street");

        // the composed lens can be used to create new Address
        const address2 = streetNameLens.set(
            R.toUpper(address.street.name), address
        );

        expect(address2.street.name).toBe("RATHBONE STREET");
    });

    it("can update values with 'over'", () => {
        const address = new Address(
            "London",
            new Street(1, "rathbone street")
        );

        const address2 = overLens(
            streetNameLens,
            R.toUpper,
            address
        );

        expect(address2.street.name).toBe("RATHBONE STREET");
    });

    it("can leverage the more generic interface", () => {
        const address = new Address(
            "London",
            new Street(1, "rathbone street")
        );

        const streetName = view(streetNameLens, address);

        expect(streetName).toBe("rathbone street");

        const address2 = set(streetLens, new Street(
            address.street.number,
            R.toUpper(address.street.name)),
            address
        );

        expect(address2.street.name).toBe("RATHBONE STREET");
    })
});