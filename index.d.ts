export declare enum ChannelState {
    Open = 0,
    Closing = 1,
    CLosed = 2
}
export declare class Channel<T> {
    queue: T[];
    max_size: number;
    private can_add_queue;
    private can_get_queue;
    private _state;
    private closed_handle?;
    readonly state: ChannelState;
    constructor(max_size: number);
    size(): number;
    close(): Promise<void>;
    add(item: T): Promise<void>;
    private _add;
    get(): Promise<T | undefined>;
    private _get;
}
