<template>
    <div class="header">
        <div class="first-line">
            <div class="logo">
                <i class="iconfont icon-robot"></i>
                Robby
            </div>
            <div class="handler">
                <el-button-group>
                    <el-button size="mini" icon="el-icon-minus" @click="minimum"></el-button>
                    <el-button size="mini" :icon="isMaximum? 'el-icon-copy-document': 'el-icon-full-screen'" @click="maximum"></el-button>
                    <el-button size="mini" icon="el-icon-close" @click="close"></el-button>
                </el-button-group>
            </div>
        </div>

        <div class="second-line">
            <navbar></navbar>
<!--            <div class="header-right">-->
<!--                <div class="header-user-con">-->
<!--                    <el-dropdown class="user-name" trigger="click" @command="handleCommand">-->
<!--                        <span class="el-dropdown-link">-->
<!--                            {{name}} <i class="el-icon-caret-bottom"></i>-->
<!--                        </span>-->
<!--                        <el-dropdown-menu slot="dropdown">-->
<!--                            <el-dropdown-item divided  command="logout">退出登录</el-dropdown-item>-->
<!--                        </el-dropdown-menu>-->
<!--                    </el-dropdown>-->
<!--                </div>-->
<!--            </div>-->
        </div>

    </div>
</template>
<script>
    // let ipcRenderer = {on:function () {}}
    import {ipcRenderer } from 'electron'
    import Navbar from './Navbar'

    export default {
        components: { Navbar, },
        data() {
            return {
                name: '我的用户名',
                isMaximum: false,
            }
        },
        computed:{
        },
        created() {
            //获取最大化状态
            ipcRenderer.on('window-maxed', (event) => {
                this.isMaximum = true
            })
            ipcRenderer.on('window-unmaxed', (event) => {
                this.isMaximum = false
            })
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand (command) {
                if (command == 'logout') {
                    window.location = this.$url.logout
                }
            },
            //最小化
            minimum() {
                ipcRenderer.send('window-min')
            },
            //最大化
            maximum() {
                ipcRenderer.send('window-max')
            },
            //关闭窗口
            close() {
                ipcRenderer.send('window-close')
            }
        },
    }
</script>
<style scoped>
    .first-line {
        -webkit-app-region: drag; /*可拖拽*/
        -webkit-user-select: none; /*文本不可选择*/
    }
    .first-line,.second-line {
        display: flex;
        justify-content : space-between;
        align-items: center;
        width: 100%;
    }

    .logo {
        display: flex;
        align-items: center;
        font-size: 19px;
    }

    .logo i {
        font-size: 48px;
        margin-right: 4px;
    }

    .handler {
        display: flex;
        justify-content: right;
        width: 132px;
        -webkit-app-region: no-drag; /*取消拖拽区，否则无法点击*/
    }

    .header-user-con {
        cursor: pointer;
    }

</style>
