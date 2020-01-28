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
    const Worker = require('worker_threads').Worker
    const worker = new Worker(wrapper, {
        eval: true,
        workerData: {config, exports, code}
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

export function sendMsg (id, value) {
    if(id in scriptMap) {
       scriptMap[id].postMessage(value)
    }

}

function getScriptCode(script) {
    //todo 解密 | JSON.parse | 验证signature
    //return script.code
    return `
        $on('message', value=>{
            $message(value)
        })
        setTimeout(()=>{
            process.exit(0)
        }, 2000)
        // try {
        //     var sheets = excel.parse(config.filepath)
        //     for(let sheet of sheets) {
        //         for(let row of sheet['data']) {
        //             for(let cell of row) {
        //                 $typeString(cell)
        //                 robot.keyTap("tab")
        //             }
        //             robot.keyTap("enter")
        //         }
        //     }
        // } catch (err) {
        //     console.log(err)
        //     throw err
        // }
    `
}

const wrapper = `
    //加载模块
    const vm = require('vm')
    const {workerData, parentPort} = require('worker_threads')
    const clipboardy = require('clipboardy')
    const robot = require('robotjs')
    // const ioHook = require('iohook')
    const excel = require('node-xlsx')

    //创建context
    const context = Object.assign(global, {
        robot: robot,
        // ioHook: ioHook,
        excel: excel,
        clipboardy: clipboardy,
        //接收config和exports
        config: workerData.config,
        ext: workerData.exports,
        //传递消息函数
        $message(data) {
            parentPort.postMessage(data)
        },
        //处理消息函数
        $on(event, func) {
            parentPort.on(event, func)
        },
        //抛出错误函数
        $reject(data) {
            throw data
        },
        //打字函数，支持中文
        $typeString(str) {
            clipboardy.writeSync(str.toString())
            robot.keyTap("v", "control")
        },
    })

    //执行code
    vm.runInNewContext(workerData.code, context)
`