<template>
    <div class="banner-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/courseware' }">课件管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增课件</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="banner-list">
            <div>
                <el-row>
                    <el-col :span="16">
                        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                            <el-form-item label="课件名称" prop="courseware_name">
                                <el-input
                                        placeholder="请输入课件名称"
                                        v-model="form.courseware_name"
                                        size="small"
                                        :maxlength="maxlength">
                                    <template slot="append"><span v-bind:class="{warnClass : courseware_name_length <= 1}">还可输入{{courseware_name_length}}字符</span></template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="课件类型">
                                <el-select v-model="value4" clearable placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="关联链接" v-if="value4 == 'pic'">
                                <el-input
                                        v-model="form.resources_target"
                                        placeholder="请输入内容"
                                        size="small">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="选择文件">
                                <div class="fileUpload">
                                    <div class="file-box" @click="fun_selectImg">
                                        <input type="file" class="file-btn" id="files-list"/>
                                        选择文件
                                    </div>
                                </div>
                                <div class="banner_wraper">
                                    <div id="output">
                                        <el-button v-if="qcload_file" type="primary" size="small" class="cancleBtn" @click="handle_del_qcload">删除</el-button>
                                        <img v-if="qcload_file" :src="form.resources_url" alt="">
                                    </div>
                                    <div id="progress"></div>
                                    <el-button v-if="files" type="primary" size="small" class="submitBtn" @click="handle_click($event)" id="upload_qcload_btn">上传</el-button>
                                    <el-button v-if="files" type="primary" size="small" class="cancleBtn" @click="handle_click($event)" id="cancle_addban_btn">取消</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="操作按钮">
                                <el-row class="submitAndExit">
                                    <el-button type="primary" size="small" :disabled="is_disabled_submit" @click="handle_click($event)" id="save_banner_btn">保存</el-button>
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
    import {handel_fetchData_query, handle_del_qcload} from "../../../utilis/handle_data.js";

    export default {
        name: "addcourseware",
        data(){
            return {
                //修改时用
                courseware_id                       : '',

                //请求链接
                url                                 : baseUrl() + '/comm',
                courseware_save_methodName          : "sp_hc_courseware_save",
                courseware_update_methodName        : "sp_hc_courseware_update",

                dialogImageUrl: '',
                dialogVisible: false,

                //表单内容
                form: {
                    courseware_name: '',
                    resources_url: '',
                    resources_tip: '',
                    resources_target: ''
                },
                value4: '',             //课件类型
                options: [{
                    value: 'pic',
                    label: '图片'
                }, {
                    value: 'audio',
                    label: '音频'
                }, {
                    value: 'video',
                    label: '视频'
                }],
                files: null,
                qcload_file: false,

                rules: {
                    courseware_name: [
                        {required: true, message: '请输入课件名称', trigger: 'blur'},
                        {min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur'}
                    ],
                    resources_target: [
                        {required: true, message: '请输入课件链接', trigger: 'blur'}
                    ],
                    value4: [
                        {required: true, message: '请选择课件类型', trigger: 'change'}
                    ],
                },
                maxlength: 18,

                is_disabled_submit: false
        }
        },
        computed: {
            courseware_name_length: function () {
                return 18 - this.form.courseware_name.length;
            }
        },
        mounted() {
            if(this.$route.query.courseware_id){
                this.courseware_id = this.$route.query.courseware_id;
                //本地缓存取出课件
                var storage = getLocalStorage(),
                    courseware = JSON.parse(storage.getItem('courseware'));
                this.form = courseware;
                this.value4 = courseware.courseware_resources_type;
                storage.removeItem('courseware');
                this.qcload_file = true;
            }
        },
        methods: {
            fun_cancleUploadImg(){
                var self = this,
                    progress = document.getElementById('progress'),
                    output = document.getElementById('output');
                self.form.resources_target = '';
                output.innerHTML = '';
                progress.innerHTML = '';
                this.$router.push('/courseware');
            },
            fun_selectImg(){
                var self = this;
                var filesList = document.getElementById('files-list');
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
                        }else if(/video/.test(files[i].type)){
                            reader.readAsDataURL(files[i]);
                            type = 'video';
                        }else{
                            reader.readAsText(files[i]);
                            type = "text";
                        }

                        // reader.onprogress = function (event) {
                        //     if(event.lengthComputable){
                        //         progress.innerHTML = event.loaded + '/' + event.total;
                        //     }
                        // }

                        // 读取文件完成
                        reader.onload = function (event) {
                            var html = '';
                            switch(type){
                                case "image":
                                    html = "<img style=\"width: 200px; height: 150px;\" src=\"" + reader.result + "\">";
                                    break;
                                case "video":
                                    html = "<video style='width: 200px; height: 150px;' src='" + reader.result + "'></video>";
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
            },
            handle_click(e){
                var target_id = e.target.id,
                    self = this;
                switch (target_id){
                    //上传到腾讯云
                    case "upload_qcload_btn":
                        this.handle_data.handle_upload_qcload(this, "upload_image", this.files, function (data) {
                            if(data.statusCode == 200){
                                self.form.resources_url = data.Location;
                            }
                        });
                        break;
                    //保存传到后台
                    case "save_banner_btn":
                        if(!this.form.courseware_name){
                            alert('请输入课件名称')
                        }else if(!this.value4){
                            alert('请选择图片类型')
                        }else if(this.form.resources_url == ''){
                            alert('请选择图片')
                        }else{
                            var param = {
                                "courseware_name": this.form.courseware_name,
                                "resources_tip": this.form.resources_tip,
                                "courseware_resources_type": this.value4,
                                "resources_target": this.form.resources_target,
                                "resources_url": this.form.resources_url,
                            };

                            if(!this.courseware_id){
                                this.handle_data.handel_fetchData_query(this, this.url, this.courseware_save_methodName, param, function (data) {
                                    if(data.code===0) {
                                        alert('保存成功')
                                        self.is_disabled_submit = true;
                                        setTimeout(function () {
                                            self.form.courseware_name = '';
                                            self.value4 = '';
                                            self.form.resources_target = '';
                                            self.form.resources_url = '';
                                            self.form.resources_tip = '';
                                            output.innerHTML = '';
                                            progress.innerHTML = '';
                                            self.$router.push('/courseware');
                                        }, 2000)
                                    }
                                })
                            }else{
                                param.courseware_id = this.courseware_id;
                                this.handle_data.handel_fetchData_query(this, this.url, this.courseware_update_methodName, param, function (data) {
                                    if(data.code===0) {
                                        alert('保存成功')
                                        setTimeout(function () {
                                            self.form.courseware_name = '';
                                            self.value4 = '';
                                            self.form.resources_target = '';
                                            self.form.resources_url = '';
                                            self.form.resources_tip = '';
                                            output.innerHTML = '';
                                            progress.innerHTML = '';
                                            self.$router.push('/courseware');
                                        }, 1000)
                                    }
                                })
                            }
                        }
                        break;
                    //不保存图片
                    case "cancle_addban_btn":
                        var src_del = this.form.resources_url.substring('70');
                        this.handle_data.handle_del_qcload('upload_image', src_del, function (data) {
                            if(data.statusCode == 204){
                                alert('删除成功');
                                self.handle_cancle_banner();
                            }
                        })
                        break;
                    //返回
                    case "leave_addban_btn":
                        var _src_del = this.form.resources_url.substring('70');
                        if(_src_del){
                            if(confirm('确认离开吗')){
                                this.handle_data.handle_del_qcload('upload_image', _src_del, function (data) {
                                    if(data.statusCode == 204){
                                        self.handle_cancle_banner();
                                        self.$router.push('/courseware');
                                    }
                                })
                            }
                        }else{
                            if(confirm('确认离开吗?')){
                                this.$router.push('/courseware');
                            }
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
                self.form.resources_url     = '';
                output.innerHTML            = '';
                progress.innerHTML          = '';
            },
            //删除云上图片
            handle_del_qcload(){
                var self = this;
                if(confirm('确认删除图片吗')){
                    var qcload_url = this.form.resources_url.substring('70');
                    this.handle_data.handle_del_qcload('upload_image', qcload_url, function (data) {
                        if(data.statusCode == 204){
                            alert('删除成功');
                            self.qcload_file = false;
                            self.form.resources_url = '';
                        }
                    })
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
    .warnClass{
        color: red;
    }
    .delbox{
        position: relative;
    }
    .delBtn{
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 9999;
    }
</style>