<template>
    <div class="header">
        <div class="first-line">
            <div class="logo">
                <i class="iconfont icon-robot"></i>
                Robby
            </div>
            <div class="handler">
                <el-button-group>
                    <el-button size="mini" icon="el-icon-minus"></el-button>
                    <el-button size="mini" icon="el-icon-full-screen"></el-button>
                    <el-button size="mini" icon="el-icon-close"></el-button>
                </el-button-group>
            </div>
        </div>

        <div class="second-line">
            <navbar></navbar>
            <div class="header-right">
                <div class="header-user-con">
                    <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{name}} <i class="el-icon-caret-bottom"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item divided  command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import Navbar from './Navbar'
    export default {
        components: { Navbar, },
        data() {
            return {
                name: '我的用户名',
            }
        },
        computed:{
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand (command) {
                if (command == 'logout') {
                    window.location = this.$url.logout;
                }
            },
        },
    }
</script>
<style scoped>
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
    }

    .header-user-con {
        cursor: pointer;
    }

</style>
