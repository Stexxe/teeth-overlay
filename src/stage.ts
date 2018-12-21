type PassFn<T> = (data: T) => void;
type FailFn = (err: any) => void;
type StageFn<IN, OUT> = (data: IN) => Promise<OUT>;

export function defineStage<IN, OUT>(fn: (data: IN, pass: PassFn<OUT>, fail: FailFn) => void): StageFn<IN, OUT> {
    return (data) => {
        return new Promise((resolve, reject) => {
            fn(data, resolve, reject);
        });
    };
}
