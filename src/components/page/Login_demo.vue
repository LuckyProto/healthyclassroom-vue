<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <h1>数字呢: {{this.$store.state.user.count}}</h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {getLocalStorage} from "../../utilis/common.js";
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        computed : {
            count (){
                return this.$store.state.count;
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                var storage = getLocalStorage();
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        storage.setItem("username" , this.ruleForm.username)
                        storage.setItem("password" , this.ruleForm.password)
                        self.$router.push('/readme');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                this.$store.commit('add')
            }
        },
        mounted: function () {
            var storage = getLocalStorage();
            if(storage.getItem("username")){
                var username = storage.getItem("username");
                this.ruleForm.username = username;
            }
            if(storage.getItem("password")){
                var password = storage.getItem("password");
                this.ruleForm.password = password;
            }
            // this.$router.push('/readme');
        }
    }
</script>

<style scoped>
    .icon {
         width: 1em; height: 1em;
         vertical-align: -0.15em;
         fill: currentColor;
         overflow: hidden;
         color: #fff;
      }
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>