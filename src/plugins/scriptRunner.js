const vm = require('vm')

// export function runScript (code, {config={}, exports={}, thisObj={}}={}) {
//     const wrapper = `
//         (function(config, exports={}) {
//             return new Promise((resolve, reject) => {
//                 let robot = exports.robot
//                 // let ioHook = exports.ioHook
//                 ${code}
//                 resolve('执行完毕')
//             })
//         })
//     `
//     const script = new vm.Script(wrapper)
//     exports.robot = robot
//     // exports.ioHook = ioHook
//     return new Promise((resolve, reject) => {
//         //延时1秒再返回，防止按键未执行完毕
//         script.runInThisContext().call(thisObj, config, exports)
//           .then(res => {
//               setTimeout(() => {resolve(res)}, 1000)
//           })
//           .catch(res => {
//               setTimeout(() => {reject(res)}, 1000)
//           })
//     })
// }

const scriptMap = {
    //id: worker
}
export function runScript (id, code, {config={}, exports={}, msgHandler=(data)=>{}}={}) {
    const wrapper = `
        const {workerData, parentPort} = require('worker_threads')
        const robot = require('robotjs')
        const ioHook = require('iohook')
        const require = null
        const config = workerData.config
        const exports = workerData.exports
        const $message = (data) => {
            parentPort.postMessage(data)
        }
        const $reject = (data) => {
            throw data
        }
        ${code}
    `
    const worker = new Worker("../", {
        eval: true,
    })
    // const worker = new Worker(wrapper, {
    //     eval: true,
    //     workerData: {config, exports}
    // })
    if(id in scriptMap) {
       scriptMap[id].terminate()
    }
    scriptMap[id] = worker
    return new Promise((resolve, reject) => {
        worker.on('message', msgHandler)
        worker.on('error', (err) => {
            reject({
                code: -1,
                data: err,
            })
        })
        worker.on('close', (err, result) => {
            resolve('close')
        })
        worker.on('exit', (exitCode) => {
            if (exitCode === 0) {
                resolve('succ')
            }
            reject({
                code: exitCode,
                data: {},
            })
        })
    })
}

export function stopScript (id) {
    if(id in scriptMap) {
       return scriptMap[id].terminate()
    }
}



// const {Worker} = require('worker_threads')
// runScript('111',`
//     setTimeout(()=>{
//         process.exit(12)
//     }, 1000)
//     $message({a: 1, b:'12'})
// `, {
//     msgHandler(data){
//         console.log(data)
//     }
// }).then(res => {
//     console.log(`成功：${res}`)
// }).catch(res => {
//     console.log(`出错`)
//     console.log(res)
// })

// stopScript('111').then(code => {
//     console.log(code)
// })
