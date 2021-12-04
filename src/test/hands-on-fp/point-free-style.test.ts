interface Person {
    age: number;
    birthCountry: string;
    naturalizationDate: Date;
}

const OUR_COUNTRY = "Ireland";
const wasBornInOurCountry = (person: Person) => person.birthCountry === OUR_COUNTRY;
const wasNaturalized = (person: Person) => Boolean(person.naturalizationDate);
const isOver18 = (person: Person) => person.age >= 18;
const isCitizen = (person: Person) => wasBornInOurCountry(person) || wasNaturalized(person);
const isEligibleToVote = (person: Person) => isOver18(person) && isCitizen(person);

const either = <T1>(
    funcA: (a: T1) => boolean,
    funcB: (a: T1) => boolean
) => (arg: T1) => funcA(arg) || funcB(arg);

const both = <T1>(
    funcA: (a: T1) => boolean,
    funcB: (a: T1) => boolean
) => (arg: T1) => funcA(arg) && funcB(arg);

// Point-free style
const isCitizen2 = either(wasBornInOurCountry, wasNaturalized);
const isEligibleToVote2 = both(isOver18, isCitizen2);

const person: Person = {
    age: 21,
    birthCountry: "Ireland",
    naturalizationDate: new Date()
};

describe("Point-free style", () => {
    it("old style of check", () => {
        const result = isEligibleToVote(person);
        
        expect(result).toBe(true);
    });

    it("works with point-free style", () => {
        const result = isEligibleToVote2(person);

        expect(result).toBe(true);
    });
});