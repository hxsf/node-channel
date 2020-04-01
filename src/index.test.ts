import { Channel, ChannelState } from '.'

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
        await do_something_async(10)
        console.log(`[${Date.now() - uptime}] [add] [${label}] to chan.`)
        console.log(`[${Date.now() - uptime}] [total] ${chan.size()}/${chan.max_size}.`)
    }
    chan.close()
}
async function sub() {
    while (1) {
        const label = await chan.get()
        await do_something_async(500)
        console.log(`[${Date.now() - uptime}] [get] [${label}] to chan.`)
        console.log(`[${Date.now() - uptime}] [total] ${chan.size()}/${chan.max_size}.`)
        if (chan.state === ChannelState.CLosed) break
    }
}

pub()
setTimeout(sub, 2000)
setTimeout(sub, 2000)
setTimeout(sub, 2000)
setTimeout(sub, 2000)
setTimeout(sub, 2000)
