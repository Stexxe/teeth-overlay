type PassFn<T> = (data: T) => void;
type StageFn<IN, OUT> = (data: IN) => Promise<OUT>;

export function defineStage<InT, OutT>(fn: (data: InT, pass: PassFn<OutT>) => void): StageFn<InT, OutT> {
    return (data) => {
        return new Promise((resolve) => {
            fn(data, resolve);
        });
    };
}
