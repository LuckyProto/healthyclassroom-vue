<template>
    <div class="banner-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/courseware' }">课件管理</el-breadcrumb-item>
                <el-breadcrumb-item>修改课件</el-breadcrumb-item>
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
                                    <template slot="append"><span v-bind:class="{warnClass : courseware_name_length >= 18}">{{courseware_name_length}}</span></template>
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
                            <el-form-item label="关联链接" v-if="value4 == 'pic'" prop="resources_target">
                                <el-input
                                        placeholder="请输入内容"
                                        v-model="form.resources_target"
                                        size="small">
                                </el-input>
                            </el-form-item>
                            <div class="fileUpload">
                                <!--<form id="myform" name="myform" action="your_url" method="post" enctype="multipart/form-data" >-->
                                <!--<div id="sendBefore">-->
                                <!--<p>上传视频</p>-->
                                <!--<input id="videoForm" type="file" name="videos[]" multiple= "multiple" />-->
                                <!--</div>-->
                                <!--</form>-->
                                <span class="file-box" @click="fun_selectImg">
                                    <input type="file" class="file-btn" id="files-list"/>
                                    选择文件
                                </span>
                                <span id="output"></span>
                                <span id="progress"></span>
                            </div>
                            <div class="delbox" v-if="this.value4 == 'video' ">
                                <el-button class="delBtn" type="danger" icon="el-icon-delete" circle @click="fun_del_video"></el-button>
                                <video :src="this.form.resources_url" width="350" height="200" controls>您的浏览器不支持播放该视频！</video>
                            </div>
                            <div class="delbox" v-if="this.value4 == 'pic' ">
                                <el-button class="delBtn" type="danger" icon="el-icon-delete" circle @click="fun_del_video"></el-button>
                                <img :src="this.form.resources_url" width="350" height="200" />
                            </div>
                            <el-row class="submitAndExit">
                                <el-button type="primary" size="small" class="submitBtn" @click="fun_update_courseware">更新</el-button>
                                <el-button type="primary" size="small" @click="fun_cancleUploadImg">取消</el-button>
                            </el-row>
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
    export default {
        name: "update-courseware",
        data(){
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                form: {
                    courseware_name: '',
                    resources_url: '',
                    resources_tip: '',
                    resources_target: ''
                },
                maxlength: 18,
                files: null,
                value4: '',
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
            }
        },
        computed: {
            courseware_name_length: function () {
                return this.form.courseware_name.length;
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
            fun_update_courseware(){
                if(this.files){
                    let self = this;
                    let param = {
                        "courseware_id": this.form.courseware_id,
                        "courseware_name": this.form.courseware_name,
                        "resources_tip": this.form.resources_tip,
                        "courseware_resources_type": this.value4,
                        "resources_target": this.form.resources_target,
                    };
                    var self = this,
                        progress = document.getElementById('progress'),
                        output = document.getElementById('output'),
                        cos = new COS({
                            SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                            SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk',
                        })

                    cos.putObject({
                        Bucket: 'wxapplet-1253887111',
                        Region: 'ap-beijing-1',
                        Key: 'upload_image/' + self.files.name,
                        StorageClass: 'STANDARD',
                        Body: self.files, // 上传文件对象
                        onProgress: function(progressData) {
                            // progress.innerHTML = '上传完成' +  progressData.percent * 100 + '%';
                        }
                    }, function(err, data) {
                        var qcloudImgUrl = data.Location;
                        param.resources_url = qcloudImgUrl;
                        self.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_courseware_update","param":JSON.stringify(param)}).then((response) => {
                            if(response.data.code===0){
                                Vue.http.headers.common['sign'] = response.data.sign;
                                alert('更新成功')
                                self.form.resources_target = '';
                                // setTimeout(function () {
                                //     output.innerHTML = '';
                                //     progress.innerHTML = '';
                                // }, 2000)
                            }
                        });
                    });
                }else{
                    let param = {
                        "courseware_id": this.form.courseware_id,
                        "courseware_name": this.form.courseware_name,
                        "resources_url": this.form.resources_url,
                        "resources_tip": this.form.resources_tip,
                        "courseware_resources_type": this.value4,
                        "resources_target": this.form.resources_target,
                    };
                    this.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_courseware_update","param":JSON.stringify(param)}).then((response) => {
                        if(response.data.code===0){
                            Vue.http.headers.common['sign'] = response.data.sign;
                            alert('更新成功')
                            this.form.resources_target = '';
                            // setTimeout(function () {
                            //     output.innerHTML = '';
                            //     progress.innerHTML = '';
                            // }, 2000)
                        }
                    });
                }
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
                    console.log(files[0]);
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
            fun_del_video(){
                if(confirm('是否删除此资源')){
                    this.value4 = '';
                    this.form.resources_url = '';
                }
            }
        },
        mounted() {
            //本地缓存取出课件
            var storage = getLocalStorage(),
                courseware = JSON.parse(storage.getItem('courseware'));
            this.form = courseware;
            this.value4 = courseware.courseware_resources_type;
            // storage.removeItem('courseware');
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
    .file-box{
        display: inline-block;
        position: relative;
        width: 100px;
        height: 100px;
        padding: 5px;
        border: 5px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
        line-height: 100px;
        color:#666;
        text-align: center;
    }
    .file-btn{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        outline: none;
        background-color: transparent;
        filter:alpha(opacity=0);
        -moz-opacity:0;
        -khtml-opacity: 0;
        opacity: 0;
    }

    .submitAndExit{
        padding-left: 15px;
        margin-bottom: 15px;
    }
    .submitBtn{
        margin-right: 20px;
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