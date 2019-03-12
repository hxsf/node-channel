import { Channel } from '.'

function do_something_async(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

const chan = new Channel<string>(5)
const uptime = Date.now()
const num = 20
async function pub() {
    for (let i = 0; i< num; i++) {
        const label = i.toString().padStart(3, '0')
        await chan.add(label)
        await do_something_async(50)
        console.log(`[${Date.now() - uptime}] [add] [${label}] to chan.`)
        console.log(`[${Date.now() - uptime}] [total] ${chan.size()}/${chan.max_size}.`)
    }
}
async function sub() {
    for (let i = 0; i< num; i++) {
        const label = await chan.get()
        await do_something_async(500)
        console.log(`[${Date.now() - uptime}] [get] [${label}] to chan.`)
        console.log(`[${Date.now() - uptime}] [total] ${chan.size()}/${chan.max_size}.`)
    }
}

pub()
setTimeout(sub, 2000)
