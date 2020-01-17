<!--
    脚本详情页面
    接收script为脚本的数据信息
-->
<template><div class="container">
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
        <i class="script-fav el-icon-star-on"></i>
    </div>

    <el-tabs v-model="tabName">
        <el-tab-pane label="配置选项" name="config">
            <el-button v-if="!isRunning" type="success" icon="el-icon-caret-right" @click="start">开始运行</el-button>
            <el-button v-else type="danger" icon="el-icon-error" @click="stop">停止运行</el-button>
            <el-tag v-if="isFinish" type="warning" style="margin-left: 5px;" @click="isFinish=false">运行完毕！</el-tag>
            <hr style="margin: 10px 0"/>
            <el-form ref="rowInfo" :model="configForm" label-width="140px">
                <el-form-item v-for="item of data.config" :label="item.name">
                    <config-field v-model="configForm[item.key]" :data="item"></config-field>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="详情介绍" name="detail">
            <div v-html="data.detail"></div>
        </el-tab-pane>
    </el-tabs>

</div></template>


<script>
    import ConfigField from "@/components/widget/ConfigField"
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
                setTimeout(()=>{
                    this.isRunning = false
                    this.isFinish = true
                }, 1000)
            },
            stop() {
                this.isRunning = false
            },
        },
        watch: {
            script() {
                this.configForm = this.$store.getters.getConfig(this.script.id)
            }
        },
        created () {
            setInterval(()=>{
                // this.$store.commit("setConfig", this.script.id, this.configForm)
                this.$store.commit("setConfig", {
                    id: this.script.id,
                    config: this.configForm
                })
            }, 5000)
        }
    }
</script>

<style scoped>
    .first-line {
        display: flex;
        vertical-align: top;
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
    .script-fav.el-icon-star-on {
        font-size: 24px;
        color: gold;
    }
    .script-fav.el-icon-star-off {
        font-size: 20px;
        color: darkgray;
    }

</style>
