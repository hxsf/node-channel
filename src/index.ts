export class Channel<T> {
    queue: T[]
    max_size: number
    private can_add_queue: (() => void)[]
    private can_get_queue: (() => void)[]
    constructor(max_size: number) {
        this.queue = []
        this.max_size = max_size
        this.can_add_queue = []
        this.can_get_queue = []
    }
    size(): number {
        return this.queue.length
    }
    async add(item: T): Promise<void> {
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
    async get(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (this.queue.length) {
                const item = this.queue.shift()
                this._get()
                resolve(item)
                return 
            }
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
