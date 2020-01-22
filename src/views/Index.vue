<!--
    首面，脚本列表
-->
<template><div class="index">
    <div class="left">
        <el-input v-model="searchName" placeholder="搜索" @change="search" clearable>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-menu class="sidebar">
            <template v-for="item in tags">
                <el-menu-item :index="item.key" :key="item.key" @click="scrollToTag(item.key)">
                    <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
    <div ref="content" class="right container">
        <div class="banner" v-show="!isSearch">
            <a :href="banner.url">
                <img :src="banner.src" :title="banner.title" alt="首页图"/>
            </a>
        </div>
        <template v-for="item in data">
            <hr v-show="!isSearch"/>
            <div :ref="'tag_'+item.tag" class="script-tag">{{item.tagName}}</div>
            <el-row class="script-row">
                <el-col :span="12" v-for="script in item.scripts">
                    <div class="script-col" @click="scriptDetail(script.id)">
                        <div><img class="script-logo" :src="script.logo" alt="logo"/></div>
                        <div class="script-info">
                            <div class="script-title">{{script.name}}</div>
                            <div class="script-desc">{{script.desc}}</div>
                        </div>
                        <i v-if="$store.state.favor && $store.state.favor.indexOf(script.id) >= 0"
                           class="script-fav el-icon-star-on" @click.stop="unfavor(script.id)"></i>
                        <i v-else
                           class="script-fav el-icon-star-off" @click.stop="favor(script.id)"></i>
                    </div>
                </el-col>
            </el-row>
        </template>
    </div>

    <!-- 详情侧拉框 -->
    <el-drawer title="详情" :visible.sync="detailVisible" direction="rtl" size="80%" destroy-on-close>
        <script-detail :script="script"></script-detail>
    </el-drawer>

</div></template>


<script>
    import ScriptDetail from './ScriptDetail'
    import {scrollTo} from '@/common/public'

    export default {
        name: 'Index',
        components: {ScriptDetail},
        data() {
            return {
                data: [], //[{tag, tagName, scripts}]
                tags: [],
                banner: {},
                searchName: '',
                isSearch: false,
                detailVisible: false,
                script: {},
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
            },
            scriptDetail(id) {
                this.$axios.get(this.$url.scriptDetail, {
                        params: {id: id}
                }).then(res => {
                    this.script = res.data
                    this.detailVisible = true
                })
            },
            scrollToTag(tag) {
                let tagEl = this.$refs['tag_'+tag][0]
                let contentEl = this.$refs['content']
                scrollTo(contentEl, tagEl.offsetTop - contentEl.offsetTop, 300)
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
        display: flex;
    }
    .script-col:hover {
        background-color: #E6E6E6;
    }
    .script-logo{
        width: 64px;
        border-radius: 5px;
        margin-right: 10px;
    }
    .script-fav.el-icon-star-on {
        font-size: 24px;
        line-height: 48px;
        color: gold;
    }
    .script-fav.el-icon-star-off {
        font-size: 20px;
        line-height: 48px;
        color: darkgray;
    }
    .script-info {
        flex: 1;
        overflow: hidden;
    }
    .script-desc {
        color: #575758;
        font-size: 80%;
        line-height: 30px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .el-menu-item {
        height: 35px;
        line-height: 35px;
    }
</style>
<style>
    .el-drawer__header > span:focus{
        outline: 0 !important;
    }
    .el-drawer__body{
        height: 0;
    }
</style>
