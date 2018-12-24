type PassFn<T> = (data: T) => void;
type StageFn<IN, OUT> = (data: IN) => Promise<OUT>;

export function defineStage<IN, OUT>(fn: (data: IN, pass: PassFn<OUT>) => void): StageFn<IN, OUT> {
    return (data) => {
        return new Promise((resolve) => {
            fn(data, resolve);
        });
    };
}
