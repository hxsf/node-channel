export declare class Channel<T> {
    queue: T[];
    max_size: number;
    private can_add_queue;
    private can_get_queue;
    constructor(max_size: number);
    size(): number;
    add(item: T): Promise<void>;
    private _add;
    get(): Promise<T>;
    private _get;
}
