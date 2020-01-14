<template>
    <div class="index">
        <div class="left">
            <el-input v-model="searchName" placeholder="搜索" @change="search" clearable>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
            <el-menu class="sidebar">
                <template v-for="item in tags">
                    <el-menu-item :index="item.key" :key="item.key">
                        <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
        <div class="right container">
            <div class="banner" v-show="!isSearch">
                <a :href="banner.url">
                    <img :src="banner.src" :title="banner.title" alt="首页图"/>
                </a>
            </div>
            <template v-for="item in data">
                <hr v-show="!isSearch"/>
                <div class="script-tag">{{item.tagName}}</div>
                <el-row class="script-row">
                    <el-col class="script-col" :span="12" v-for="script in item.scripts">
                        <img class="script-logo" :src="script.logo" alt="logo"/>
                        <div class="script-info">
                            <div class="script-title">{{script.name}}</div>
                            <div class="script-desc">{{script.desc}}</div>
                        </div>
                        <i class="script-fav el-icon-star-on"></i>
<!--                        <i class="script-fav el-icon-star-off"></i>-->
                    </el-col>
                </el-row>
            </template>
        </div>


    </div>
</template>

<script>
    export default {
        name: 'Index',
        data() {
            return {
                data: [], //[{tag, tagName, scripts}]
                tags: [],
                banner: {},
                searchName: '',
                isSearch: false,
            }
        },
        created() {
            this.getTag();
            this.getTagScript();
            this.getBanner();
        },
        methods:{
            getTagScript() {
                this.$axios.get(this.$url.tagScript
                ).then(res => {
                    this.isSearch = false
                    this.data = res.data
                })
            },
            getTag() {
                this.$axios.get(this.$url.tagList
                ).then(res => {
                    this.tags = res.data
                })
            },
            getBanner() {
                this.$axios.get(this.$url.banner
                ).then(res => {
                    this.banner = res.data
                })
            },
            search() {
                if(this.searchName) {
                    this.$axios.get(this.$url.scriptList, {
                        params: {name: this.searchName}
                    }).then(res => {
                        this.isSearch = true
                        this.data = [{
                            tagName: '搜索',
                            scripts: res.data,
                        }]
                    })
                } else {
                    this.getTagScript()
                }
            }

        }
    }
</script>

<style scoped>
    .index {
        display: flex;
        height: 100%;
    }
    .left {
        width: 300px;
    }
    .right {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .banner {
        text-align: center;
        margin-bottom: 15px;
    }
    .banner img {
        width: 100%;
    }
    .script-tag {
        font-size: 150%;
        margin: 10px;
    }
    .script-row {
        margin-bottom: 60px;
    }
    .script-col {
        padding: 10px;
        cursor: pointer;
    }
    .script-col:hover {
        background-color: #E6E6E6;
    }
    .script-col > *{
        display: inline-block;
        vertical-align: middle;
    }
    .script-logo{
        width: 64px;
        margin-right: 10px;
    }
    .script-fav.el-icon-star-on {
        font-size: 24px;
        color: gold;
    }
    .script-fav.el-icon-star-off {
        font-size: 20px;
        color: darkgray;
    }
    .script-info {
        width: calc(100% - 64px - 10px - 24px);
    }
    .script-desc {
        color: #575758;
        font-size: 80%;
        line-height: 30px;
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .el-menu-item {
        height: 35px;
        line-height: 35px;
    }
</style>
