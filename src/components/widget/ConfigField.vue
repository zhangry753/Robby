<!--
    配置项字段展示控件
    传入一条配置项data，返回value
-->
<template>
    <el-input v-if="data.wtype=='text'" v-model="valueNative" :placeholder="data.placeholder"/>
    <el-input v-else-if="data.wtype=='textarea'" type="textarea" v-model="valueNative" :placeholder="data.placeholder" autosize/>
    <el-radio-group v-else-if="data.wtype=='radio'" v-model="valueNative">
        <el-radio v-for="option in data.optionSet.options" :label="option.value">{{option.label}}</el-radio>
    </el-radio-group>
    <el-checkbox-group v-else-if="data.wtype=='checkbox'" v-model="valueNative">
        <el-checkbox v-for="option in data.optionSet.options" :label="option.value">{{option.label}}</el-checkbox>
    </el-checkbox-group>
    <el-select v-else-if="data.wtype=='select'" v-model="valueNative" value="" :placeholder="data.placeholder">
        <el-option v-for="option in data.optionSet.options" :key="option.value" :label="option.label" :value="option.value"></el-option>
    </el-select>
    <el-date-picker v-else-if="data.wtype=='date'" type="date" v-model="valueNative"
                    :placeholder="data.placeholder? data.placeholder: '请选择日期'"></el-date-picker>
    <div v-else-if="data.wtype=='file'">
        <span v-if="filePathLabel">{{filePathLabel}}</span>
        <el-button type="primary" icon="el-icon-folder-opened"
                   @click="openFileDialog">{{data.placeholder? data.placeholder: 选择文件}}</el-button>
    </div>
</template>

<script>
    export default {
        name: 'ConfigField',
        props: {
            value: {},
            data: {
                type: Object,
                required: true,
            },
        },
        data(){
            return {
                valueNative: null,
                filePathLabel: "",
                isLoading: false,
            }
        },
        watch: {
            valueNative(val) {
                if(this.isLoading) {
                    this.isLoading = false
                } else {
                    this.$emit('input', val)
                }
            }
        },
        created () {
            this.valueNative = this.value
            if(!this.valueNative && this.data.wtype == 'checkbox') {
                this.valueNative = [];
            }
            this.isLoading = true
        },
        methods: {
            openFileDialog() {
                const {dialog} = require('electron').remote;
                dialog.showOpenDialog({properties: ['openFile']}).then(res => {
                    if(!res.canceled) {
                        this.valueNative = res.filePaths[0].replace(/\\/g, "/")
                        let fileName = this.valueNative.substring(this.valueNative.lastIndexOf('/') + 1)
                        console.log(this.valueNative)
                        this.filePathLabel = this.valueNative.length<=20
                          ? this.valueNative
                          : this.valueNative.substring(0, 20) + '.../' + fileName
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
