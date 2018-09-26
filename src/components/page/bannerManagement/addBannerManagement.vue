<template>
    <div class="banner-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/bannerManagement' }">banner管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增banner</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="banner-list">
            <div>
                <el-row>
                    <el-col :span="16">
                        <el-form ref="form" :model="form" label-width="80px">
                            <!--<el-form-item label="关联链接">-->
                                <!--<el-input-->
                                        <!--v-model="form.target"-->
                                        <!--size="small">-->
                                <!--</el-input>-->
                            <!--</el-form-item>-->
                            <el-form-item label="选择图片">
                                <div class="fileUpload">
                                    <div class="file-box" @click="fun_selectImg">
                                        <input :disabled="returnDis" type="file" class="file-btn" id="file-selector"/>
                                        选择文件
                                    </div>
                                </div>
                                <div class="banner_wraper">
                                    <div id="output"></div>
                                    <div id="progress"></div>
                                    <el-button v-if="files" type="primary" size="small" class="submitBtn" @click="handle_click($event)" id="upload_qcload_btn">上传</el-button>
                                    <el-button v-if="files" type="primary" size="small" class="cancleBtn" @click="handle_click($event)" id="cancle_addban_btn">取消</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="操作按钮">
                                <el-row class="submitAndExit">
                                    <el-button type="primary" size="small" :disabled="is_disabled" @click="handle_click($event)" id="save_banner_btn">保存</el-button>
                                    <el-button type="primary" size="small" @click="handle_click($event)" id="leave_addban_btn">离开</el-button>
                                </el-row>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {baseUrl} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import {handle_upload_qcload} from "../../../utilis/handle_data";
    export default {
        name: "add-banner-management",
        data(){
            return {
                //请求接口
                url                         : baseUrl() + '/comm',
                banner_save_methodName      : "sp_hc_banner_save",

                bannerCount                 : undefined,                //已有图片数目
                form: {
                    target                  : undefined,                       //图片链接
                    resources_url           : undefined,                       //云上链接
                    resources_tip           : undefined                        //说明
                },
                files                       : null,                     //选择的文件
                dialogImageUrl              : undefined,
                dialogVisible               : false,

                rules: {
                    target: [
                        {required: true, message: '请输入关联链接', trigger: 'blur'}
                    ]
                },

                is_disabled: false
            }
        },
        computed: {
            returnDis: function () {
                // `this` 指向 vm 实例
                if(this.bannerCount >= 5){
                    return true;
                }else{
                    return false;
                }
            }
        },
        mounted(){
            //已有图片数目
            var storage = getLocalStorage();
            this.bannerCount = storage.getItem("total_num");
        },
        methods: {
            /*按钮的点击事件*/
            handle_click(e){
                  var target_id = e.target.id,
                      self = this;
                  switch (target_id){
                      //上传到腾讯云
                      case "upload_qcload_btn":
                          this.handle_data.uploadQcload(this, "upload_image", this.files, function (data) {
                              if(data.statusCode == 200){
                                  self.form.resources_url = data.Location;
                              }
                          });
                          break;
                      //保存传到后台
                      case "save_banner_btn":
                          if(this.form.resources_url == undefined){
                              alert('请选择图片')
                          }else{
                              var storage = getLocalStorage(),
                                  param = this.form;
                              this.handle_data.fetchData(this, this.url, this.banner_save_methodName, param, function (data) {
                                  alert('保存成功')
                                  self.is_disabled = true;
                                  storage.setItem("total_num", Number(self.bannerCount) + 1);
                                  self.bannerCount = Number(self.bannerCount) + 1;
                                  self.$router.push('/bannerManagement');
                              })
                          }
                          break;
                      //不保存图片
                      case "cancle_addban_btn":
                          this.handle_cancle_banner();
                          break;
                      //返回banner列表页
                      case "leave_addban_btn":
                          if(confirm('确认离开吗?')){
                              this.$router.push('/bannerManagement');
                          }
                          break;
                      default:
                          break;
                  }
            },
            handle_cancle_banner(){
                var self = this,
                    progress = document.getElementById('progress'),
                    output = document.getElementById('output');
                self.form.target            = undefined;
                self.form.resources_url     = undefined;
                output.innerHTML            = '';
                progress.innerHTML          = '';
            },
            fun_selectImg(){
                var self = this;
                if(self.bannerCount >= 5) {
                    alert('图片数量已达上限, 不能继续选择');
                    return;
                }else{
                    var filesList = document.getElementById('file-selector');
                    filesList.onchange = function (event) {
                        var info = '',
                            output = document.getElementById('output'),
                            files = event.target.files,
                            type = 'dufault',
                            reader = new FileReader(),
                            i = 0,
                            len = files.length;
                        self.files = files[0];
                        while(i < len){
                            if(/image/.test(files[i].type)){
                                reader.readAsDataURL(files[i]);
                                type = 'image';
                            }else{
                                reader.readAsText(files[i]);
                                type = 'text';
                            }

                            // reader.onprogress = function (event) {
                            //     if(event.lengthComputable){
                            //         progress.innerHTML = event.loaded + '/' + event.total;
                            //     }
                            // }

                            //读取文件完成
                            reader.onload = function (event) {
                                var html = '';
                                switch(type){
                                    case "image":
                                        html = "<img style=\"width: 200px; height: 150px;\" src=\"" + reader.result + "\">";
                                        break;
                                    case "text":
                                        html = reader.result;
                                        break;
                                }
                                output.innerHTML = html;
                            }
                            i++;
                        }
                        filesList.value = '';
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .banner-list{
        padding-top: 15px;
        padding-left: 15px;
        padding-right: 15px;
        background: #fff;
    }
    .fileUpload{
        padding: 15px;
    }
    .submitAndExit{
        padding-left: 15px;
        margin-bottom: 15px;
    }
    /*上传图片*/
    .banner_wraper{
        position: relative;
        overflow: hidden;
    }
    .banner_wraper .submitBtn{
        position: absolute;
        top: 10px;
        right: 0;
    }
    .banner_wraper .cancleBtn{
        position: absolute;
        bottom: 30px;
        right: 0;
    }
</style>