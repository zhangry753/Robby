<template>
    <div>
        <el-menu class="sidebar">
            <template v-for="item in items">
                <el-menu-item :index="item.index" :key="item.index">
                    <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </template>
        </el-menu>
        <div class="content">
            <img class="cover-img"/>
            <div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Index',
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: 'index',
                        title: '赛事列表'
                    },
                    {
                        icon: 'el-icon-map-location',
                        index: 'city',
                        title: '分站列表'
                    },
                    {
                        icon: 'el-icon-user',
                        index: 'player',
                        title: '球员列表'
                    },
                    {
                        icon: 'el-icon-medal',
                        index: 'team',
                        title: '球队列表'
                    },
                ],
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        width: 200px;
    }

</style>
