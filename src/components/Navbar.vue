<template>
    <div class="navbar">
        <el-menu class="navbar-el-menu" mode="horizontal" :default-active="onRoutes" unique-opened router
                 active-text-color="#20a0ff">
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collapse: false,
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
                    { icon: 'el-icon-user',
                        index: 'player',
                        title: '球员列表'
                    },
                    { icon: 'el-icon-medal',
                        index: 'team',
                        title: '球队列表'
                    },
                ],
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
        }
    }
</script>

<style scoped>

</style>
