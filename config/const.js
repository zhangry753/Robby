const const_ = {
    //配置项值类型
    configVType: {
        "string": "文本",
        "int": "整数",
        "float": "小数",
    },
    //配置项控件类型
    configWType: {
        "text": "输入框",
        "radio": "单选",
        "checkbox": "多选",
        "select": "下拉框",
        "date": "日期选择",
        "textarea": "文本域",
        "file": "文件",
    },
    //脚本退出时的错误代码
    scriptExitCode: {
        '0': '执行成功',
        '1': '已停止',
        '-1': '错误',
    }
};
export default const_;
