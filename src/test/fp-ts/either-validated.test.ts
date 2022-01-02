// Examples from here: https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

import { chain, Either, getApplicativeValidation, left, map, mapLeft, right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { getSemigroup, NonEmptyArray } from 'fp-ts/NonEmptyArray';
import { sequenceT } from 'fp-ts/lib/Apply';

const minLength = (s: string): Either<string, string> =>
    s.length >= 6 ? right(s) : left('at least 6 characters');

const oneCapital = (s: string): Either<string, string> =>
    /[A-Z]/.test(s) ? right(s) : left('at least one capital letter');

const oneNumber = (s: string): Either<string, string> =>
    /[0-9]/.test(s) ? right(s) : left('at least one number');

const validatePassword = (s: string): Either<string, string> =>
    pipe(
        minLength(s),
        chain(oneCapital),
        chain(oneNumber),
    )

function lift<E, A>(check: (a: A) => Either<E, A>):
    (a: A) => Either<NonEmptyArray<E>, A> {
    return a =>
        pipe(
            check(a),
            mapLeft(e => [e])
        )
}

const minLengthV = lift(minLength);
const oneCapitalV = lift(oneCapital);
const oneNumberV = lift(oneNumber);

const myApplicativeValidation = getApplicativeValidation(getSemigroup<string>());

// Use sequenceT helper that takes n actions and
// executes them left-to-right
function validatePassword2(s: string):
    Either<NonEmptyArray<string>, string> {
        return pipe(
            sequenceT(myApplicativeValidation)(
                minLengthV(s),
                oneCapitalV(s),
                oneNumberV(s)
        ),
        map(() => s)
    )
}

// `sequenceT` helper is able to handle actions
// with different types

interface Person {
    name: string;
    age: number;
}

const toPerson = ([name, age]: [string, number]): Person =>
    ({ name, age });

const validateName = (s: string): Either<NonEmptyArray<string>, string> =>
    s.length === 0 ? left(['Invalid name']) : right(s);

const validateAge = (s: string): Either<NonEmptyArray<string>, number> => {
    if (s.length === 0) return left(['Invalid age']);

    return isNaN(+s) ? left(['Invalid age']) : right(+s);
}

function validatePerson(name: string, age: string): Either<NonEmptyArray<string>, Person> {
    return pipe(
        sequenceT(myApplicativeValidation)(
            validateName(name),
            validateAge(age)
        ),
        map(toPerson)
    )
}

describe('Validations', () => {
    describe('with Either', () => {
        it ('fails fast, but returns the error', () => {
            const result = validatePassword('abc');
            expect(result).toEqual(left('at least 6 characters'));

            const result2 = validatePassword('abcdef');
            expect(result2).toEqual(left('at least one capital letter'));

            const result3 = validatePassword('Abcdefgh');
            expect(result3).toEqual(left('at least one number'));

            const result4 = validatePassword('Abcdefgh1');
            expect(result4).toEqual(right('Abcdefgh1'));
        });
    });

    describe('with Validated', () => {
        it ('returns all the errors', () => {
            const result = validatePassword2('abc');
            expect(result).toEqual(left(
                ['at least 6 characters',
                'at least one capital letter',
                'at least one number']
            ));
        });
    })

    describe('sequenceT works with different types', () => {
        it ('validates person inputs', () => {
            const result = validatePerson('', '');
            expect(result).toEqual(left(
                ['Invalid name',
                'Invalid age']
            ));

            const result2 = validatePerson('J', 'X');
            expect(result2).toEqual(left(
                ['Invalid age']
            ));

            const result3 = validatePerson('John', '12');
            expect(result3).toEqual(right({ name: 'John', age: 12 }));  
        });
    });
});
