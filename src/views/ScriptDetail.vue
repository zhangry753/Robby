<!--
    脚本详情页面
    接收script为脚本的数据信息
-->
<template><div class="detail-page container">
    <div class="first-line">
        <div><img class="script-logo" :src="data.logo" alt="logo"/></div>
        <div class="script-info">
            <p class="script-title">{{data.name}}</p>
            <p class="script-prop">
                <span>发布时间：{{data.ctimeLabel}}</span>
                <span>更新时间：{{data.mtimeLabel}}</span>
            </p>
            <hr style="margin: 7px 0"/>
            <p class="script-desc">{{data.desc}}</p>
        </div>
        <i v-if="$store.state.favor && $store.state.favor.indexOf(script.id) >= 0"
           class="script-fav el-icon-star-on" @click.stop="unfavor(script.id)"></i>
        <i v-else
           class="script-fav el-icon-star-off" @click.stop="favor(script.id)"></i>
    </div>
    <div class="second-line">
        <el-button v-if="!isRunning" type="success" icon="el-icon-caret-right" @click="start">开始运行</el-button>
        <el-button v-else type="danger" icon="el-icon-error" @click="stop">停止运行</el-button>
        <el-tag v-if="isFinish" type="warning" style="margin-left: 5px;" @click="isFinish=false">运行完毕！</el-tag>
    </div>
    <el-tabs v-model="tabName">
        <el-tab-pane label="配置选项" name="config">
            <el-form ref="rowInfo" :model="configForm" label-width="140px">
                <el-form-item v-for="item of data.configField" :label="item.name">
                    <config-field v-model="configForm[item.key]" :data="item"></config-field>
                </el-form-item>
            </el-form>
        </el-tab-pane>
<!--        <el-tab-pane label="快捷键" name="keyMap">-->
<!--            <el-form label-width="50px" :inline="true">-->
<!--                <el-form-item label="开始"><el-input value="F1"/></el-form-item>-->
<!--                <el-form-item label="结束"><el-input value="F12"/></el-form-item>-->
<!--                <el-button type="primary">保存</el-button>-->
<!--                <el-button>重置</el-button>-->
<!--            </el-form>-->
<!--        </el-tab-pane>-->
        <el-tab-pane label="详情介绍" name="detail">
            <div v-html="data.detail"></div>
        </el-tab-pane>
    </el-tabs>

</div></template>


<script>
    import ConfigField from "@/components/widget/ConfigField"
    import {ipcRenderer} from 'electron'
    import {runScript} from '@/plugins/scriptRunner'

    export default {
        name: 'ScriptDetail',
        components: {ConfigField},
        props: {
            script: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                configForm: {},
                tabName: "config",
                isRunning: false,
                isFinish: false,
            }
        },
        computed: {
            data() {
                let data = this.script
                data.create_time && (data.ctimeLabel = data.create_time.substring(0, 10))
                data.update_time && (data.mtimeLabel = data.update_time.substring(0, 10))
                return data
            },
        },
        methods: {
            start() {
                this.isRunning = true
                this.isFinish = false
                setTimeout(() => {
                    ipcRenderer.send('script-run', this.data.id, this.data.script, {
                        config: this.configForm
                    })
                }, 1000)

            },
            stop() {
                this.isRunning = false
                ipcRenderer.send('script-stop', this.data.id)
            },
            registerScriptHandler() {
                ipcRenderer.on('script-data', (event, res) => {
                    ipcRenderer.send('window-focus')
                    if(res.code === 0) {
                        this.isRunning = false
                        this.isFinish = true
                        this.$alert('执行完毕', "提示", {type: 'success'})
                    } else if(res.code === 1) {
                        this.isRunning = false
                    } else if(res.code) {
                        this.isRunning = false
                        let msg = res.msg ? res.msg: ''
                        if (!msg && res.code in this.$const.scriptExitCode) {
                            msg = this.$const.scriptExitCode[res.code]
                        }
                        this.$alert(`执行错误：${msg}`, "错误", {type: 'error'})
                    }  else {
                        this.$alert(res.data)
                    }
                })
            },
            loadConfig() {
                this.configForm = this.$store.getters.getConfig(this.script.id)
            },
            saveConfig() {
                this.$store.commit("setConfig", {
                    scriptId: this.script.id,
                    config: this.configForm
                })
            },
            favor(id) {
                this.$store.commit("changeFavor", {
                    scriptId: id,
                    isAdd: true,
                })
            },
            unfavor(id) {
                this.$store.commit("changeFavor", {
                    scriptId: id,
                    isAdd: false,
                })
            }
        },
        watch: {
            script() {
                this.loadConfig()
            }
        },
        created () {
            this.loadConfig()
            this.registerScriptHandler()
        },
        destroyed () {
            this.saveConfig()
        }

    }
</script>

<style scoped>
    .detail-page {
        overflow: auto;
        height: 100%;
    }
    .first-line {
        display: flex;
        vertical-align: top;
    }
    .second-line {
        margin: 5px;
    }
    .script-logo {
        width: 96px;
        margin-right: 10px;
        border-radius: 10px;
    }
    .script-info {
        flex: 1;
        overflow: hidden;
    }
    .script-title {
        font-weight: bold;
    }
    .script-prop {
        font-size: 80%;
    }
    .script-prop > span {
        margin-right: 10px;
    }
    .script-desc {
        color: #575758;
        font-size: 80%;
        line-height: 30px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .script-fav {
        cursor: pointer;
    }
    .script-fav.el-icon-star-on {
        font-size: 24px;
        color: gold;
    }
    .script-fav.el-icon-star-off {
        font-size: 20px;
        color: darkgray;
    }

</style>
