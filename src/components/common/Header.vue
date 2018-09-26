<script src="../../../static/iconfont/iconfont.js"></script>
<template>
    <div class="header">
        <el-row>
            <el-col :xs="16" :sm="18" :md="16" :lg="8" :xl="2">
                <div class="title">健康课后台管理系统</div>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="16" :xl="22">
                <el-menu
                    class="el-menu-demo menuul"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#5D7CC5"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="3-1">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-web-icon-"></use>
                        </svg>
                        <span>系统管理员</span>
                    </el-menu-item>
                    <el-menu-item index="3-3" @click="GoBack">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-icon40"></use>
                        </svg>
                        <span>退出</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {getLocalStorage} from "../../utilis/common.js";
    export default {
        data() {
            return {
                userInfos: [
                    "欢迎你", "修改密码", "退出"
                ]
            };
        },
        methods: {
            handleSelect(key, keyPath) {
            },
            open() {
                let username = this.$store.state.user.username;
                this.$alert(username, '标题名称', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: `action: ${ action }`
                        });
                    }
                });
            },
            GoBack(){
                this.$router.push('/');
            }
        },
        mounted(){
            let storage = getLocalStorage();
            let username = storage.getItem("remUser");
            this.$store.dispatch('setUsernameAsync', {'username': username})
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        width: 100%;
        min-width: 700px;
        overflow: hidden;
        height: 60px;
        padding-right:5%;
        background: #5D7CC5;
        font-size: 14px;
        line-height: 60px;
        color: #fff;
        z-index: 1;
    }
    .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        padding-left: 2%;
    }
    .header .menuul{
        float: right;
    }

    .header .menuul .menuli svg{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
    }

    .header .menuul .menuli span{
        position:absolute;
        bottom: 0;
        width: 100%;
        font-size: 12px;
        line-height:16px;
        color: #fff;
        display: none;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .header .menuul .menuli:hover span{
        display: block;
    }
</style>
