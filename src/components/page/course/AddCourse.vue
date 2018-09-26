<template>
    <div class="banner-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/course' }">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增课程</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="banner-list">
            <div>
                <el-row>
                    <el-col :span="16">
                        <el-form ref="ruleForm" :model="form"  label-width="100px">
                            <el-form-item label="课程标题" prop="class_name">
                                <el-input
                                        placeholder="请输入课程标题"
                                        v-model="form.class_name"
                                        size="small"
                                        :maxlength="maxlength">
                                    <template slot="append"><span v-bind:class="{warnClass : class_name_length >= 18}">已输入{{class_name_length}}字符</span></template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="课程内容" prop="class_content">
                                <el-input
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请输入课程内容"
                                        v-model="form.class_content"
                                        size="small"
                                        :maxlength="class_content_maxlength">
                                    <template slot="append"><span v-bind:class="{warnClass : class_content_maxlength >= 18}">已输入{{class_content_maxlength}}字符</span></template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="开始封面">
                                <div id="start_poster_wraper" class="start_poster_wraper">
                                    <img     v-if="qcload_cover_url" :src="qcload_cover_url" alt="">
                                    <button  v-if="qcload_cover_url" type="button" @click="handle_del_qcload_cover">删除</button>
                                </div>
                            </el-form-item>
                            <el-form-item
                                    label="封面链接"
                                    prop="attList[0].resources_target"
                            >
                                <el-input
                                        placeholder="请输入开始封面链接"
                                        v-model="form.attList[0].resources_target"
                                        size="small">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="选择视频">
                                <div class="fileUpload">
                                    <div class="file-box" @click="fun_selectImg">
                                        <input type="file" class="file-btn" id="files-list"/>
                                        选择视频
                                    </div>
                                    <div class="banner_wraper">
                                        <el-button type="primary" size="small" class="submitBtn" v-if="files" @click="handle_clear_selected_file">取消</el-button>
                                        <el-button type="primary" size="small" class="submitBtn" v-if="files" @click="handle_upload_qcload">上传</el-button>
                                        <el-button type="primary" size="small" class="submitBtn" v-if="files" @click="handle_del_qcload">删除</el-button>
                                        <el-button type="primary" size="small" class="submitBtn" v-if="qcload_video_url" @click="handle_del_qcload_url">删除</el-button>
                                        <el-button type="primary" disabled size="small" class="submitBtn" v-if="files" id="progress"></el-button>
                                        <div id="output">
                                            <video v-if="qcload_video_url" :src="form.attList[1].resources_url" crossOrigin='Anonymous' controls id="qcload_video"></video>
                                        </div>
                                    </div>
                                </div>
                                <div class="capture_btn_wraper">
                                    <el-button @click='capture_start' type="primary" class="capture_start_btn" size="mini">截取开始封面</el-button>
                                    <!--<el-button @click='capture_end' type="primary" class="capture_end_btn" size="mini">截取结束封面</el-button>-->
                                </div>
                            </el-form-item>
                            <el-form-item
                                    label="课程时间"
                                    prop="length_time"
                            >
                                <el-input
                                        placeholder="请输入课程时间"
                                        v-model="form.length_time"
                                        size="small">
                                </el-input>
                            </el-form-item>
                            <el-form-item
                                    label="是否免费"
                                    prop="is_free"
                            >
                                <el-select v-model="form.is_free" placeholder="请选择">
                                    <el-option label="是" value="是"></el-option>
                                    <el-option label="否" value="否"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="操作按钮">
                                <el-row class="submitAndExit">
                                    <el-button type="primary" size="small" class="submitBtn" @click="submitForm('ruleForm')">下一步</el-button>
                                    <el-button type="primary" size="small" @click="cancle">取消</el-button>
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
    export default {
        name: "addcourseware",
        data(){
            return {
                class_id: undefined,
                //请求链接
                url: baseUrl()+'/comm',
                methodName: "sp_clinic_doctor_baseinfo_query",

                //表单数据
                form: {
                    class_name: '',
                    class_content: '',
                    length_time: '',
                    is_free: '',
                    is_active: 1,
                    attList: [
                        {
                            class_resources_type: 'cover', //封面
                            resources_url: '',
                            resources_tip: '',
                            resources_target: '',
                            sort: '111'
                        },
                        {
                            class_resources_type: 'video', //视频
                            resources_url: '',
                            resources_tip: '',
                            resources_target: '',
                            sort: '111'
                        }
                    ]
                },
                rules: {
                    class_name: [
                        {required: true, message: '请输入课程标题', trigger: 'blur'},
                        {min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur'}
                    ],
                    class_content: [
                        {required: true, message: '请输入课程内容', trigger: 'blur'},
                        {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
                    ],
                    'attList[0].resources_target': [
                        {required: true, message: '请输入封面链接', trigger: 'blur'}
                    ],
                    length_time: [
                        {required: true, message: '请输入课程时间', trigger: 'blur'}
                    ],
                    is_free: [
                        { required: true, message: '请选择是否免费', trigger: 'change' }
                    ],
                },

                files: null,            //选择文件
                tableData: null,        //表格数据
                multipleSelection: [],

                dialogImageUrl: '',
                dialogVisible: false,
                total:undefined,
                page_num: 1,
                page_size: 10,
                maxlength: 18,
                class_content_maxlength: 200,
                input: '',

                qcload_video_url: '',        //云山地址
                qcload_cover_url: ''
            }
        },
        computed: {
            class_name_length: function () {
                return this.form.class_name.length;
            }
        },
        methods: {
            cancle(){
                this.$router.push('/course');
            },
            handle_clear_selected_file(){
                var self = this,
                    video = document.getElementById('video');
                video.parentNode.removeChild(video);
                //     progress = document.getElementById('progress'),
                //     output = document.getElementById('output');
                self.files = null;
                // output.innerHTML = '';
                // progress.innerHTML = '';
            },
            //上传课程
            submitForm(formName){
                let self = this;
                if(!this.form.length_time) {
                    alert('请输入课程时间')
                    return;
                }
                var storage = getLocalStorage();
                var isChange = false;
                if(this.form.attList[0].resources_url != storage.getItem('qcload_cover_url') || this.form.attList[1].resources_url != storage.getItem('qcload_video_url')){
                    isChange = true
                }
                let param = this.form;
                param.is_free = param.is_free == "是" ? 1 : 0;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var storage = getLocalStorage();
                        storage.setItem('course', JSON.stringify(param));
                        self.$router.push({ path: '/doctors', query: { 'class_id': this.class_id, 'isChange': isChange }})
                    } else {
                        return false;
                    }
                });
            },
            //上传视频
            handle_upload_qcload(){
                if(this.files){
                    var self = this;
                    this.handle_data.handle_upload_qcload(this, "upload_audio", this.files, function (data) {
                        if(data.statusCode == 200){
                            self.form.attList[1].resources_url = data.Location;
                        }
                    });
                }else{
                    alert('请选择图片')
                }
            },
            //删除腾讯云
            handle_del_qcload(){
                if(this.files){
                    var self = this;
                    this.handle_data.handle_del_qcload("upload_audio", this.files, function (data) {
                        if(data.statusCode == 204){
                            alert('删除成功')
                            self.form.attList[1].resources_url = '';
                            self.handle_clear_selected_file();
                        }
                    });
                }else{
                    alert('请选择图片')
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

                        //读取文件完成
                        reader.onload = function (event) {
                            var html = '';
                            switch(type){
                                case "image":
                                    html = "<img style=\"width: 200px; height: 150px;\" src=\"" + reader.result + "\">";
                                    break;
                                case "video":
                                    html = "<video id='video' width: 200px; height: 150px;' src='" + reader.result + "' controls></video>";
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
            //截取视频封面
            capture_start() {
                let self = this;
                var $start_poster_wraper = $('#start_poster_wraper'),
                    video;
                    if(document.getElementById('qcload_video')){
                        video = $('#qcload_video').get(0);
                    }else{
                        video = $('#video').get(0)
                    };
                    var scale = 0.25,    //缩放尺寸
                    wid = video.videoWidth * scale,
                    hei = video.videoHeight * scale,
                    start_poster = document.createElement("div"),
                    image = document.createElement('img'),
                    delBtn = document.createElement("button");
                    delBtn.type = 'button';
                    delBtn.innerText = '删除';

                var dataURL = self.handler_getBase64(video, wid, hei);
                image.src = dataURL;
                self.form.attList[0].resources_url = dataURL;
                start_poster.appendChild(image);
                start_poster.appendChild(delBtn);
                $start_poster_wraper[0].appendChild(start_poster)
                delBtn.addEventListener('click', function () {
                    delBtn.parentNode.parentNode.removeChild(start_poster);
                    self.form.attList[0].resources_url = '';
                }, false);
            },
            //转换图片为dataURL
            handler_getBase64(target, width, height){
                var canvas = document.createElement("canvas"),
                    dataURL = '';
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(target, 0, 0, canvas.width, canvas.height);
                dataURL = canvas.toDataURL();
                return dataURL;
            },
            handler_tocourseware(){
                this.$router.push('/courseware');
            },
            //每页显示数量
            handlePageSizeChange(val) {
                var self = this;
                this.page_size = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.$http.post(this.url, {"methodName": "sp_hc_doctor_query", "param": JSON.stringify(param)}).then((res) => {
                    self.tableData = res.data.data.rows;
                    self.total = res.data.data.total_num;
                })
            },
            //第几页
            handleCurrentPageChange(val) {
                var self = this;
                this.page_num = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.$http.post(this.url, {"methodName": "sp_hc_doctor_query", "param": JSON.stringify(param)}).then((res) => {
                    self.tableData = res.data.data.rows;
                    self.total = res.data.data.total_num;
                })
            },
            //获取数据
            fetchData(url, methodName, param){
                this.$http.post(url, {"methodName": methodName, "param": JSON.stringify(param)}).then((response) => {
                    var tableData = [];
                    if(response.data.code===0){
                        Vue.http.headers.common['sign'] = response.data.sign;
                        response.data.data.rows.forEach(function (item, index, Array) {
                            switch (item.courseware_resources_type){
                                case 'pic':
                                    item.courseware_resources_ctype = '图片';
                                    item.is_active = item.is_active ? "true" : "false";
                                    tableData.push(item);
                                    break;
                                case 'video':
                                    item.courseware_resources_ctype = '视频';
                                    item.resources_url = "https" + item.resources_url.substring(4);
                                    item.is_active = item.is_active ? "true" : "false";

                                    tableData.push(item);
                                    break;
                                case 'audio':
                                    item.courseware_resources_ctype = '音频';
                                    item.is_active = item.is_active ? "true" : "false";

                                    tableData.push(item);
                                    break;
                                default:
                                    item.courseware_resources_ctype = '未知';
                                    item.is_active = item.is_active ? "true" : "false";

                                    tableData.push(item);
                                    break;
                            }
                        })
                        this.tableData = tableData;
                        this.courseware_count = response.data.data.total_num;
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
            },
            //搜索医生
            handler_search_input(){
                var param = {
                        "search": this.input,
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                    },
                    self = this;
                this.$http.post(this.url, {"methodName": "sp_hc_doctor_query", "param": JSON.stringify(param)}).then((res) => {
                    if(res.data.data.total_num){
                        self.tableData = res.data.data.rows;
                    }else{
                        this.$http.post(this.url, {"methodName": "sp_clinic_doctor_baseinfo_query", "param": JSON.stringify(param)}).then((res) => {
                            self.total = res.data.data.total_num;
                            self.tableData = res.data.data.rows;
                        })
                    }
                })
            },
            //被选中的表格
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //删除已有封面图片
            handle_del_qcload_cover(){
                console.log('cover')
                this.form.attList[0].resources_url = '';
                this.qcload_cover_url = '';
            },
            //删除云上地址
            handle_del_qcload_url(){
                this.form.attList[1].resources_url = '';
                this.qcload_video_url = '';
            }
        },
        mounted(){
            var self = this;
            this.class_id = this.$route.query.class_id;
            var param = {
                class_id: this.class_id
            }
            if(this.$route.query.class_id){
                var storage = getLocalStorage();
                this.$http.post(this.url, {"methodName": "sp_hc_class_find", "param": JSON.stringify(param)}).then((res) => {
                    if(res.body.code == 0){
                        self.form.class_name = res.body.data.class_name;
                        self.form.class_content = res.body.data.class_content.replace(/[\r\n]/g, '\\n');
                        self.form.length_time = res.body.data.length_time;
                        self.form.is_free = res.body.data.is_free == 1 ? '是': '否';
                        self.form.doctor_id = res.body.data.doctor_id;
                        self.form.doctor_name = res.body.data.doctor_name;
                        if(res.body.data.attList){
                            res.body.data.attList.forEach(function (item, index, array) {
                                if(item.class_resources_type == "cover"){
                                    self.form.attList[0] = item;
                                    storage.setItem('qcload_cover_url', item.resources_url)
                                    if(item.resources_url){
                                        self.qcload_cover_url = item.resources_url;
                                    }
                                }else{
                                    self.form.attList[1] = item;
                                    self.qcload_video_url = item.resources_url;
                                    storage.setItem('qcload_video_url', item.resources_url)
                                }
                            })
                        }
                    }
                })
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
        display: inline-block;
        padding: 15px;
    }


    .submitAndExit{
        padding-left: 15px;
        margin-bottom: 15px;
    }
    .search_doc_box{
        position: relative;
    }
    .submitBtn{
        margin-right: 20px;
    }
    .search-btn{
        position: absolute;
        top: 6px;
        right: 6px;
    }
    .start_poster{
        display: inline-block;
    }
    .capture_btn_wraper{
        float: right;
        display: inline-block;
    }
    .capture_btn_wraper .capture_start_btn{
        position: absolute;
        right: 0;
        top: 40px;
    }
    .capture_btn_wraper .capture_end_btn{
        position: absolute;
        right: 0;
        bottom: 40px;
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
    .banner-list{
        padding-left: 15px;
        padding-right: 15px;
        background: #fff;
        overflow: hidden;
    }
    .banner-list-title{
        padding: 15px 0 15px 0;
    }
    .banner-list-title-p{
        overflow: hidden;
    }
    .banner-list-title-p span{
        line-height: 28px;
    }
    .addBannerBtn{
        float: right;
    }
</style>