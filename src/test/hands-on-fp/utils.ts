export const compose = <T>(f: (x: T) => T, g: (x: T) => T) => (x: T) => f(g(x));

export const compose3 = <T>(f: (x: T) => T, g: (x: T) => T, h: (x: T) => T) => (x: T) => f(g(h(x)));

export const composeMany = <T>(...fs: ((x: T) => T)[]): ((x: T) => T) => {
    return (x: T) => {
        return fs.reduce((acc, f) => f(acc), x);
    }
}

export function curry2<T1, T2, T3>(fn: (a: T1, b: T2) => T3) {
    return (a: T1) => (b: T2) => fn(a, b);
};

export function curry3<T1, T2, T3, T4>(fn: (a: T1, b: T2, c: T3) => T4) {
    return (a: T1) => (b: T2) => (c: T3) => fn(a, b, c);
};