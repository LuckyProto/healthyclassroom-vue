<template >
    <div class="login-page" >
        <div class="top">
            <img src="../../../static/img/logo.png">
        </div>
        <div class="login-main">
            <div class="login-content">
                <div class="login-win">
                    <div class="user-login">用户登录</div>
                    <div class="error-tip" v-model="tip" >
                        <em v-show="isShow"></em>
                        {{tip}}
                    </div>
                    <div class="name-box">
                        <input type="text"  placeholder="用户名" autocomplete="off" tabindex="1" maxlength="64" style="width: 66%;height:43px;border:none;outline: none" v-model="user.username" @keyup="enterToLogin($event)"/>

                    </div>
                    <div class="code-box">
                        <input type="password"  placeholder="账户密码" autocomplete="off" tabindex="2" maxlength="16" style="width: 66%;height:43px;border:none;outline: none" v-model="user.password" @keyup="enterToLogin($event)"/>
                    </div>
                    <div class="rem-user">
                        <el-checkbox v-model="checked" @change="handleChange">记住用户名</el-checkbox>
                    </div>
                    <el-button type="primary" class="login-btn"  v-loading.fullscreen.lock="fullscreenLoading"  @click="submit" >登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {baseUrl} from "../../utilis/common.js";
    import {getLocalStorage} from "../../utilis/common.js";
    export default {
        name: "login",
        data(){
            return{
                user:{
                    username:"",
                    password:""
                },
                checked: false,
                isShow:false,
                tip:"",
                fullscreenLoading:false
            }
        },
        mounted:function(){
            //this.setIp(returnCitySN["cip"])
            var storage = getLocalStorage();
            var local=storage.getItem("remUser");
            if(local==="0"){
                this.checked=false;
                this.user.username="";
            }else{
                this.checked=true;
                this.user.username=local;
            }
        },
        methods: {
            //获取用户电脑Ip
            setIp: function (userIpStr) {
                if(this.$store.state.user.userIp == 0){
                    var userIpArr = userIpStr.split('.');
                    var userIp = Number(userIpArr[0])*256*256*256 + Number(userIpArr[1])*256*256 + Number(userIpArr[2])*256 + Number(userIpArr[3])
                    this.$store.dispatch('setUserIpAsync', {'userIp': userIp})
                }
            },
            enterToLogin:function (ev){
                if(ev.keyCode===13){
                    this.submit();
                }
            },
            handleChange:function(){
                var storage = getLocalStorage();
                if(this.checked) {
                    storage.setItem("remUser", this.user.username);
                    this.$store.dispatch('setUsernameAsync',{
                        username: this.user.username
                    })
                } else{
                    storage.setItem("remUser","0");
                }
            },
            submit: function() {
                if(this.user.username==="") {
                    this.isShow=true;
                    this.tip = "请输入用户名";
                    return;
                } else if(this.user.password==="") {
                    this.isShow=true;
                    this.tip = "请输入密码";
                    return;
                }else{
                    this.isShow=false;
                    this.tip ="";
                }
                this.handleChange();
                this.fullscreenLoading=true;
                this.$http.post(baseUrl()+'/userLogin', {"cname":this.user.username,"pwd":this.user.password}).then((response) => {
                    if(response.data.code===0){
                        var storage = getLocalStorage();
                        Vue.http.headers.common['sign'] = response.data.sign;
                        console.log(response.data.sign)
                        storage.setItem("sign",response.data.sign);
                        // storage.setItem("credential_id",response.body.data.credential_id);
                        storage.setItem("username",response.body.data.cname);
                        // storage.setItem("hospital_id",response.body.data.hospital_id);
                        // let departmentList=[];
                        // if(response.body.data.departmentList)
                        // for(let i=0;i<response.body.data.departmentList.length;i++){
                        //     departmentList.push(response.body.data.departmentList[i].department_id)
                        // }
                        // storage.setItem("departmentList",departmentList.join());
                        this.$router.push('/bannerManagement');
                    }else{
                        this.$alert(response.body.msg, '提示', {
                            confirmButtonText: '确定',
                        });
                    }
                    this.fullscreenLoading=false;
                }, (error)=>{
                        this.$alert(error, '提示', {
                            confirmButtonText: '确定',
                        });
                        this.fullscreenLoading=false;
                    });
            }
        }
    }
</script>

<style  type="text/css">
    .login-page{
        width: 100%;
        height: 100%;
        background-color: #f7f7f7;
        overflow: hidden;
    }
    .top{
        width: 100%;
        height: 68px;
        line-height:68px;
        margin: 0 auto;

    }
    .top img{
        margin-left: 100px;
        margin-top: 10px;
    }
    .login-main{
        width: 100%;
        height: 636px;
        box-sizing: border-box;
        padding:0 73px;
    }
    .login-content{
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: url("../../../static/img/login-bg.jpg") no-repeat 0 30px;
        background-size:60.6%;
        position:relative;
    }
    .user-login{
        width: 100%;
        position: relative;
        line-height: 1;
        text-align: center;
        font-size: 16px;
        margin-top:55px;
        color: #258FF1;
        font-weight: bolder;
    }
    .login-win{
        width: 32%;
        height: 475px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 60.6%;
        margin: auto;
        margin-top: 50px;
        border-radius: 4px;
        background: #fff;
        box-sizing: border-box;
        box-shadow: 0 0 18px #ccc;
       -o-box-shadow: 0 0 18px #ccc;
        -moz-box-shadow: 0 0 18px #ccc;
        -webkit-box-shadow: 0 0 18px #ccc;
    }
    .name-box{
        padding-left: 44px;
        background: url("../../../static/img/iconfont-user.png") no-repeat 12px center;
        background-size: 19px 20px;
        -o-background-size: 19px 20px;
        -moz-background-size: 19px 20px;
        -webkit-background-size: 19px 20px;
        box-sizing: border-box;
        margin:auto 53px;
    }
    .code-box{
        padding-left: 44px;
        background: url("../../../static/img/iconfont-password.png") no-repeat 14px center;
        background-size: 15px 20px;
        -o-background-size: 15px 20px;
        -moz-background-size: 15px 20px;
        -webkit-background-size: 15px 20px;
        box-sizing: border-box;
        margin:auto 53px;
    }
    .name-box,.code-box{
        width: 79%;
        margin: 0 auto;
        border: 1px solid #ddd;
        font-size: 16px;
        margin-bottom: 35px;
        position: relative;
        border-radius: 4px;
        height:46px;
    }
    .rem-user{
        margin-left: 53px;
    }
    .login-btn {
        width: 62.5%;
        height: 50px;
        margin: 0 auto;
        background: #4C94F3;
        font-size: 18px;
        margin-top: 36px;
        display: block;
        border-radius: 54px;
    }

    .error-tip{
        color: #ff9913;
        font-size: 14px;
        padding:3px 40px;
        height:40px;
        line-height:40px;
    }
    .error-tip em{
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url("../../../static/img/login-tip.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
        top: 2px;
        margin-right: 6px;
    }
</style>
