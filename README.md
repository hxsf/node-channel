# node-channel
A channel util for javascript like go-channel

## Example

``` js
import { Channel } from 'node-channel'

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
```
you will get this log

```
[54] [add] [000] to chan.
[65] [total] 1/5.
[121] [add] [001] to chan.
[121] [total] 2/5.
[173] [add] [002] to chan.
[173] [total] 3/5.
[227] [add] [003] to chan.
[227] [total] 4/5.
[282] [add] [004] to chan.
[282] [total] 5/5.
[2057] [add] [005] to chan.
[2057] [total] 5/5.
[2507] [get] [000] to chan.
[2507] [total] 5/5.
[2558] [add] [006] to chan.
[2558] [total] 5/5.
[3009] [get] [001] to chan.
[3009] [total] 5/5.
[3063] [add] [007] to chan.
[3063] [total] 5/5.
[3513] [get] [002] to chan.
[3513] [total] 5/5.
[3566] [add] [008] to chan.
[3567] [total] 5/5.
[4017] [get] [003] to chan.
[4017] [total] 5/5.
[4072] [add] [009] to chan.
[4072] [total] 5/5.
[4522] [get] [004] to chan.
[4522] [total] 5/5.
[4575] [add] [010] to chan.
[4575] [total] 5/5.
[5024] [get] [005] to chan.
[5024] [total] 5/5.
[5075] [add] [011] to chan.
[5075] [total] 5/5.
[5525] [get] [006] to chan.
[5525] [total] 5/5.
[5576] [add] [012] to chan.
[5576] [total] 5/5.
[6030] [get] [007] to chan.
[6030] [total] 5/5.
[6084] [add] [013] to chan.
[6084] [total] 5/5.
[6532] [get] [008] to chan.
[6532] [total] 5/5.
[6583] [add] [014] to chan.
[6583] [total] 5/5.
[7035] [get] [009] to chan.
[7035] [total] 5/5.
[7086] [add] [015] to chan.
[7086] [total] 5/5.
[7538] [get] [010] to chan.
[7539] [total] 5/5.
[7592] [add] [016] to chan.
[7592] [total] 5/5.
[8039] [get] [011] to chan.
[8040] [total] 5/5.
[8095] [add] [017] to chan.
[8095] [total] 5/5.
[8543] [get] [012] to chan.
[8543] [total] 5/5.
[8594] [add] [018] to chan.
[8594] [total] 5/5.
[9043] [get] [013] to chan.
[9043] [total] 5/5.
[9095] [add] [019] to chan.
[9095] [total] 5/5.
[9546] [get] [014] to chan.
[9546] [total] 5/5.
[10047] [get] [015] to chan.
[10047] [total] 4/5.
[10549] [get] [016] to chan.
[10549] [total] 3/5.
[11052] [get] [017] to chan.
[11053] [total] 2/5.
[11557] [get] [018] to chan.
[11557] [total] 1/5.
[12060] [get] [019] to chan.
[12060] [total] 0/5.
```
