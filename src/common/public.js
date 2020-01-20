export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}
function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

//控件滚动动画
//传入dom控件，duration为毫秒
export function scrollTo(element, to, duration) {
    if (duration <= 10){
        element.scrollTop = to;
        return;
    }
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;
    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

//图片压缩
//传入img控件(可页面获取也可new一个)，返回Promise，then函数参数为blob
//example：imageCompress(img).then((blob) => {...})
export function imageCompress(img, {maxWidth=1080, maxHeight=1080, quality=0.92, mimeType="image/jpeg"}={}) {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    return new Promise(function (resolve, reject) {
        let work = function () {
            //选需要缩放最少的边，不会拉伸
          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
          canvas.width = img.width * ratio
            canvas.height = img.height * ratio
            context.drawImage(img, 0, 0, canvas.width, canvas.height)
            canvas.toBlob((blob) => {
                resolve(blob)
            }, mimeType, quality)
        }
        //如果img未加载则等待img加载后再压缩
        if(!img.width) {
            let onloadHandler = function (event) {
                img.removeEventListener('load', onloadHandler)
                work()
            }
            img.addEventListener('load', onloadHandler)
        } else {
            work()
        }
    })
}


const NativeModule = require('module')
const vm = require('vm')
const robot = require('robotjs')
export function runScript (code, exports={}, thisObj={}) {
    //转为function(exports, require, module, __filename, __dirname)
    const wrapper = NativeModule.wrap(code)
    const script = new vm.Script(wrapper)
    //加载robotjs和alert提示
    exports.robot = robot
    let model = {exports: exports }
    script.runInThisContext().call(thisObj, model.exports, null, model)
    return model
}
