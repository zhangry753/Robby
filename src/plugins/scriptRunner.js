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
export function runScript (id, script, {config={}, exports={}, msgHandler=(data)=>{}}={}) {
    let code = getScriptCode(script)
    const wrapper = `
        const {workerData, parentPort} = require('worker_threads')
        const robot = require('robotjs')
        // const ioHook = require('iohook')
        const excel = require('node-xlsx')
        const { clipboard } = require('electron')
        const config = workerData.config
        const exports = workerData.exports
        const $message = (data) => {
            parentPort.postMessage(data)
        }
        const $reject = (data) => {
            throw data
        }
        const $typeString = (str) => {
            clipboard.writeText(str, 'selection')
            robot.keyTap("v", "control")
        }
        ${code}
    `
    const Worker = require('worker_threads').Worker
    const worker = new Worker(wrapper, {
        eval: true,
        workerData: {config, exports}
    })
    if(id in scriptMap) {
       scriptMap[id].terminate()
    }
    scriptMap[id] = worker
    return new Promise((resolve, reject) => {
        worker.on('message', (data) => {
            msgHandler({
                id: id,
                data: data,
            })
        })
        worker.on('error', (err) => {
            reject({
                code: -1,
                id: id,
                msg: err.message? err.message: err,
            })
        })
        worker.on('close', (err, result) => {
        })
        worker.on('exit', (exitCode) => {
            if (exitCode === 0) {
                resolve({
                    code: 0,
                    id: id,
                    msg: '执行完毕'
                })
            }
            reject({
                code: exitCode,
                id: id,
            })
        })
    })
}

export function stopScript (id) {
    if(id in scriptMap) {
       return scriptMap[id].terminate()
    }
}

function getScriptCode(script) {
    //todo 解密 | JSON.parse | 验证signature
    //return script.code
    return `
        try {
            var sheets = excel.parse(config.filepath)
        } catch (err) {
            throw '打开excel失败'
        }
        for(let sheet of sheets) {
            for(let row of sheet['data']) {
                for(let cell of row) {
                    $typeString(cell)
                    robot.keyTap("tab")
                }
                robot.keyTap("enter")
            }
        }
    `
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
