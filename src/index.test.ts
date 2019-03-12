import { Channel } from './index'

function dosthAsync(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}
const chan = new Channel<string>(5)
const num = 20
async function pub() {
    for (let i = 0; i< num; i++) {
        const label = i.toString().padStart(3, '0')
        await chan.add(label)
        await dosthAsync(Math.floor(Math.random() * 40 + 10))
        console.log(`[add] [${label}] to chan.`)
        console.log(`[total] ${chan.size()}/${chan.max_size}.`)
    }
}
async function sub() {
    for (let i = 0; i< num; i++) {
        const label = await chan.get()
        await dosthAsync(Math.floor(Math.random() * 900 + 100))
        console.log(`[get] [${label}] to chan.`)
        console.log(`[total] ${chan.size()}/${chan.max_size}.`)
    }
}

pub()
setTimeout(() => {
    sub()
}, 3000)
