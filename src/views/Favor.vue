<!--
    收藏夹
-->
<template><div class="favor">
    <div class="left">
        <el-input v-model="searchName" placeholder="搜索" @change="getData" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
        <div v-for="script in scriptList" class="script-bar" @click="scriptDetail(script.id)" :key="script.id">
            <div><img class="script-logo" :src="script.logo" alt="logo"/></div>
            <div class="script-info">
                <div class="script-title">{{script.name}}</div>
                <div class="script-desc">{{script.desc}}</div>
            </div>
            <div>
                <el-button type="danger" round class="script-del" @click.stop="unfavor(script.id)">移除</el-button>
            </div>
        </div>
    </div>
    <div ref="content" class="right">
        <script-detail ref="scriptPanel" :script="script"></script-detail>
    </div>
</div></template>

<script>
    import ScriptDetail from './ScriptDetail'

    export default {
        name: 'Favor',
        components: {ScriptDetail},
        data() {
            return {
                scriptList: [],
                script: {},
                searchName: "",
            }
        },
        created() {
            this.getData()
        },
        methods: {
            getData() {
                let ids = this.$store.state.favor
                let params = {id: ids}
                this.searchName && (params.name = this.searchName)
                this.$axios.get(this.$url.scriptList, {
                    params
                }).then(res => {
                    this.scriptList = res.data
                    if(!this.script.id && this.scriptList.length > 0) {
                        this.scriptDetail(this.scriptList[0].id)
                    }
                })
            },
            scriptDetail(id) {
                this.$axios.get(this.$url.scriptDetail, {
                    params: {id: id}
                }).then(res => {
                    if(this.script.id && this.script.id != res.data.id) {
                        this.$refs.scriptPanel.saveConfig()
                    }
                    this.script = res.data
                    this.$refs.scriptPanel.loadConfig()
                })
            },
            unfavor(id) {
                this.$store.commit("changeFavor", {
                    scriptId: id,
                    isAdd: false,
                })
                this.getData()
            }
        },
    }
</script>

<style scoped>
    .favor {
        display: flex;
        height: 100%;
    }
    .left {
        width: 350px;
    }
    .right {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .script-bar {
        padding: 10px;
        cursor: pointer;
        display: flex;
    }
    .script-bar:hover {
        background-color: #E6E6E6;
    }
    .script-logo{
        width: 64px;
        border-radius: 5px;
        margin-right: 10px;
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
    .script-del {
        height: 10px;
        line-height: 3px;
        padding: 7px 10px;
    }


</style>
