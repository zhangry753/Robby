<template>
    <div id="app">
        <Header></Header>
        <router-view/>
    </div>
</template>

<script>
    import Header from './components/Header.vue'

    export default {
        name: 'app',
        components: { Header, },
    }
</script>

<style>
    @import "./assets/css/main.css";
    @import "./assets/css/theme-light.css";
    @import "http://at.alicdn.com/t/font_1606792_vf5w11rhsuq.css";
    /*@import "./assets/iconfont/iconfont.css";*/
    #app{
        width: 800px;
        height: 600px;
    }
    body{
        overflow: scroll;
    }
</style>
