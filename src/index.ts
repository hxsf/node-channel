export enum ChannelState {
    Open,
    Closing,
    CLosed,
}
export class Channel<T> {
    queue: T[]
    max_size: number
    private can_add_queue: (() => void)[]
    private can_get_queue: (() => void)[]
    private _state: ChannelState = ChannelState.Open;
    private closed_handle?: (() => void)
    public get state(): ChannelState {
        return this._state;
    }
    constructor(max_size: number) {
        this.queue = []
        this.max_size = max_size
        this.can_add_queue = []
        this.can_get_queue = []
    }
    size(): number {
        return this.queue.length
    }
    async close(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._state = ChannelState.Closing
            if (this.can_add_queue.length + this.queue.length === 0) {
                this._state = ChannelState.CLosed
                resolve()
            } else {
                this.closed_handle = () => {
                    this._state = ChannelState.CLosed
                    resolve()
                }
            }
        })
    }
    async add(item: T): Promise<void> {
        if (this._state !== ChannelState.Open) {
            throw new Error('cannot add item into a closed channel')
        }
        return new Promise<void>((resolve, reject) => {
            if (this.queue.length < this.max_size) {
                this.queue.push(item)
                this._add()
                return resolve()
            }
            this.can_add_queue.push(() => {
                this.queue.push(item)
                this._add()
                return resolve()
            })
        })
    }
    private _add() {
        const fn = this.can_get_queue.shift()
        if (fn) {
            fn()
        }
    }
    async get(): Promise<T | undefined> {
        if (this._state === ChannelState.CLosed) {
            throw new Error('cannot get item from a closed channel')
        }
        if (this.queue.length) {
            const item = this.queue.shift()
            this._get()
            return Promise.resolve(item)
        }
        if (this._state === ChannelState.Closing) {
            while(this.can_get_queue.length) {
                const fn = this.can_add_queue.shift()
                await fn()
            }
            this._state = ChannelState.CLosed
            return Promise.resolve(undefined)
        }
        return new Promise<T>((resolve) => {
            this.can_get_queue.push(() => {
                const item = this.queue.shift()
                this._get()
                resolve(item)
            })
        })
    }
    private _get() {
        const fn = this.can_add_queue.shift()
        if (fn) {
            fn()
        }
    }
}
