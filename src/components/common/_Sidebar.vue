<template>
    <div class="sidebar">
        <el-row class="tac" v-bind:style="{height: this.documentH + 'px'}">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        background-color="#5D7CC5"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                    <el-menu-item index="1">
                        <span slot="title" @click="toBannerManagement">banner管理</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <span slot="title" @click="tocourses">套课管理</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <span slot="title" @click="tocourse">课程管理</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <span slot="title" @click="tocourseware">课件管理</span>
                    </el-menu-item>
                    <el-menu-item index="5" @click="toUserManagement">
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="6" @click="toorder">
                        <span slot="title">订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="7">
                        <span slot="title">权限管理</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                documentH: undefined,
            }
        },
        methods: {
            toUserManagement () {
                this.$router.push('/userManagement');
            },
            toBannerManagement () {
                this.$router.push('/bannerManagement');
            },
            tocourseware () {
                this.$router.push('/courseware');
            },
            tocourse () {
                this.$router.push('/course');
            },
            tocourses(){
                this.$router.push('/courses');
            },
            toorder(){
                this.$router.push('/order');
            }
        },
        mounted() {
            var self = this;
            this.documentH = $(document).height();
            window.onresize = () => {
                return (() => {
                    self.documentH = $(document).height()
                })()
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        width: 111px;
        background: #5D7CC5;
    }
</style>
