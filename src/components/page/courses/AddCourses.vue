<template>
    <div class="banner-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/courses' }">套课管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增套课</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="banner-list">
            <div>
                <el-row>
                    <el-col :span="16">
                        <el-form ref="form" :model="form" label-width="100px">
                            <el-form-item label="套课标题">
                                <el-input
                                        placeholder="请输入套课标题"
                                        v-model="form.title"
                                        size="small"
                                        :maxlength="maxlength">
                                    <template slot="append"><span v-bind:class="{warnClass : class_grope_title_length >= 18}">已输入{{class_grope_title_length}}字符</span></template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="套课价格">
                                <el-input
                                        placeholder="默认精确到分 例如 50.00"
                                        v-model="form.price"
                                        size="small">
                                    <template slot="prepend"><span>¥</span></template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="套课介绍">
                                <el-input
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请输入套课介绍"
                                        v-model="form.introduce"
                                        :maxlength="class_grope_introduce_maxlength">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="套课介绍长度">
                                <el-input
                                        type="text"
                                        :rows="4"
                                        readonly
                                        v-model="class_grope_introduce_length">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="购买须知">
                                <el-input
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请输入购买须知"
                                        v-model="form.notes"
                                        :maxlength="class_grope_notes_maxlength">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="购买须知长度">
                                <el-input
                                        type="text"
                                        :rows="4"
                                        readonly
                                        v-model="class_grope_notes_length">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="适合人群">
                                <el-input
                                        type="textarea"
                                        :rows="4"
                                        placeholder="请输入适合人群"
                                        v-model="form.suitable"
                                        :maxlength="class_grope_suitable_maxlength">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="适合人群长度">
                                <el-input
                                        type="text"
                                        :rows="4"
                                        readonly
                                        v-model="class_grope_suitable_length">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="套课封面">
                                <div class="fileUpload" v-if="!obj_cover.resources_url">
                                    <span class="file-box" @click="fun_selectImg">
                                        <input type="file" class="file-btn" id="group_cover"/>
                                        选择文件
                                    </span>
                                    <span id="coveroutput">
                                    </span>
                                    <!--<span id="progress"></span>-->
                                    <div class="capture_btn_wraper">
                                        <el-button v-if="coverFiles" @click="handle_upload_cover" type="primary" class="capture_start_btn" size="mini">上传</el-button>
                                        <el-button v-if="coverFiles" @click="handle_del_cover" type="primary" class="capture_del_btn" size="mini">删除</el-button>
                                    </div>
                                </div>
                                <div>
                                    <img :src="obj_cover.resources_url" alt="">
                                </div>
                                <div class="capture_btn_wraper">
                                    <el-button v-if="obj_cover.resources_url" @click="handle_del_course_cover" type="primary" class="capture_del_btn" size="mini">删除</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="套课主图">
                                <div class="fileUpload" v-if="!obj_mpic.resources_url">
                                    <span class="file-box" @click="fun_select_mpic">
                                        <input type="file" class="file-btn" id="group_mpic"/>
                                        选择文件
                                    </span>
                                    <span id="mpicoutput">
                                    </span>
                                    <!--<span id="progress"></span>-->
                                    <div class="capture_btn_wraper">
                                        <el-button v-if="mpicFiles" @click="handle_upload_mpic" type="primary" class="capture_start_btn" size="mini">上传</el-button>
                                        <el-button v-if="mpicFiles" @click="handle_del_mpic" type="primary" class="capture_del_btn" size="mini">删除</el-button>
                                    </div>
                                </div>
                                <div>
                                    <img :src="obj_mpic.resources_url" alt="">
                                </div>
                                <div class="capture_btn_wraper">
                                    <el-button v-if="obj_mpic.resources_url" @click="handle_del_course_mpic" type="primary" class="capture_del_btn" size="mini">删除</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="发布时间">
                                <el-date-picker
                                        v-model="form.release_start_time"
                                        type="datetime"
                                        placeholder="选择发布日期时间"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        align="right"
                                        @change="data_change">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束时间">
                                <el-date-picker
                                        v-model="form.release_finish_time"
                                        type="datetime"
                                        placeholder="选择结束日期时间"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        align="right"
                                        @change="_data_change">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="操作按钮">
                                <el-row class="submitAndExit">
                                    <el-button type="primary" size="small" class="submitBtn" @click="handle_upload_courses">下一步</el-button>
                                    <el-button type="primary" size="small" @click="handler_cancleUploadImg">取消</el-button>
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
    import {baseUrl}         from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    export default {
        name: "add-courses",
        data(){
            return {
                url                         : baseUrl()+'/comm',
                class_group_save            : "sp_hc_class_group_save",
                class_group_query_method    : "sp_hc_class_group_query",
                class_group_find_method     : "sp_hc_class_group_find",
                class_group_update_method     : "sp_hc_class_group_update",
                class_group_self_update_method     : "sp_hc_class_group_self_update",
                class_group_id              : undefined,
                form: {
                    title: '',          //标题
                    price: '',          //价格
                    introduce: '',      //课程介绍
                    notes: '',          //购买须知
                    suitable: '',        //适合人群
                    attList: [

                    ],
                    release_start_time: '',  //发布时间
                    release_finish_time: ''  //结束时间
                },
                maxlength: 18,
                class_grope_introduce_maxlength: 300,
                class_grope_notes_maxlength: 120,
                class_grope_suitable_maxlength: 120,
                /**
                 * 需要上传的文件
                 */
                coverFiles: undefined,       //封面文件
                obj_cover: {
                    resources_url: '',
                    resources_tip: '',
                    resources_target: '',
                    group_resources_type: 'cover',
                    sort: 1
                },
                mpicFiles: undefined,       //主图文件
                obj_mpic: {
                    resources_url: '',
                    resources_tip: '',
                    resources_target: '',
                    group_resources_type: 'mpic',
                    sort: 1
                }
            }
        },
        computed: {
            class_grope_title_length: function () {
                return this.form.title.length;
            },
            class_grope_introduce_length: function () {
                return this.form.introduce.length;
            },
            class_grope_notes_length: function () {
                return this.form.notes.length;
            },
            class_grope_suitable_length: function () {
                return this.form.suitable.length;
            }
        },
        methods: {
            handle_upload_courses(){
                var self = this;
                this.form.price = this.form.price * 100;
                var param = this.form;
                if(!this.class_group_id){
                    if(!this.form.release_start_time){
                        alert('请填写发布时间')
                    }else if(!this.form.release_finish_time){
                        alert('请填写结束时间')
                    }else{
                        self.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_class_group_save","param":JSON.stringify(param)}).then((res) => {
                            if(res.data.code===0){
                                Vue.http.headers.common['sign'] = res.data.sign;
                                self.$router.push({ path: '/course', query: { 'class_group_id': res.data.data.class_group_id } })
                            }else{
                                alert('套课介绍，购买须知，或适合人群中可能存在手动换行')
                                self.form.price = self.form.price / 100;
                            }
                        });
                    }
                }else{
                    self.form.class_group_id = self.class_group_id;
                    self.form.attList[0] = self.obj_cover;
                    self.form.attList[1] = self.obj_mpic;
                    var _param = self.form;
                    var storage = getLocalStorage();
                    var isChange = false;
                    if(self.obj_cover.resources_url != storage.getItem('cover_url') || self.obj_mpic.resources_url != storage.getItem('mpic_url')){
                        self.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_class_group_update","param":JSON.stringify(param)}).then((res) => {
                            if(res.data.code===0){
                                Vue.http.headers.common['sign'] = res.data.sign;
                                self.$router.push({ path: '/course', query: { 'class_group_id': res.data.data.class_group_id } })
                            }else{
                                alert('套课介绍，购买须知，或适合人群中可能存在手动换行')
                                self.form.price = self.form.price / 100;
                            }
                        });
                    }else{
                        self.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_class_group_self_update","param":JSON.stringify(param)}).then((res) => {
                            if(res.data.code===0){
                                Vue.http.headers.common['sign'] = res.data.sign;
                                self.$router.push({ path: '/course', query: { 'class_group_id': res.data.data.class_group_id } })
                            }else{
                                alert('套课介绍，购买须知，或适合人群中可能存在手动换行')
                                self.form.price = self.form.price / 100;
                            }
                        });
                    }

                }
            },
            handler_cancleUploadImg(){
                this.$router.push('/courses');
            },
            fun_selectImg(){
                var self = this;
                var filesList = document.getElementById('group_cover');
                filesList.onchange = function (event) {
                    var info = '',
                        coveroutput = document.getElementById('coveroutput'),
                        files = event.target.files,
                        type = 'dufault',
                        reader = new FileReader(),
                        i = 0,
                        len = files.length;
                    self.coverFiles = files[0];
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
                            coveroutput.innerHTML = html;
                        }
                        i++;
                    }
                    filesList.value = '';
                }
            },
            handle_upload_cover(){
                var self = this;
                this.handle_upload_qcload(self.coverFiles, function (data) {
                    self.obj_cover.resources_url = data.Location;
                    self.form.attList[0] = self.obj_cover;
                })
            },
            handle_del_cover(){
                this.coverFiles = '';
                this.obj_cover.resources_url = '';
                var coveroutput = document.getElementById('coveroutput');
                coveroutput.innerHTML = '';
            },
            //上传到腾讯云
            handle_upload_qcload(file, callback){
                var cos = new COS({
                    SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                    SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk'
                })

                cos.putObject({
                    Bucket: 'wxapplet-1253887111',
                    Region: 'ap-beijing-1',
                    Key: 'upload_image/' + file.name,
                    StorageClass: 'STANDARD',
                    Body: file, // 上传文件对象
                    onProgress: function(progressData) {
                        progress.innerHTML = '上传完成' +  progressData.percent * 100 + '%';
                        // if(progressData.loaded == progressData.total){
                        //     alert('上传成功')
                        // }
                    }
                }, function(err, data) {
                    alert('上传成功')
                    callback(data)
                });
            },
            fun_select_mpic(){
                var self = this;
                var filesList = document.getElementById('group_mpic');
                filesList.onchange = function (event) {
                    var info = '',
                        mpicoutput = document.getElementById('mpicoutput'),
                        files = event.target.files,
                        type = 'dufault',
                        reader = new FileReader(),
                        i = 0,
                        len = files.length;
                    self.mpicFiles = files[0];
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
                            mpicoutput.innerHTML = html;
                        }
                        i++;
                    }
                    filesList.value = '';
                }
            },
            handle_upload_mpic(){
                var self = this;
                this.handle_upload_qcload(self.mpicFiles, function (data) {
                    self.obj_mpic.resources_url = data.Location;
                    self.form.attList[1] = self.obj_mpic;
                })
            },
            handle_del_mpic(){
                this.mpicFiles = '';
                this.obj_mpic.resources_url = '';
                var mpicoutput = document.getElementById('mpicoutput');
                mpicoutput.innerHTML = '';
            },
            //根据id查询条目
            fetchData_with_id(url, methodName, param, callback){
                this.$http.post(url, {"methodName": methodName, "param": JSON.stringify(param)}).then((res) => {
                    if(res.data.code == 0){
                        Vue.http.headers.common['sign'] = res.data.sign;
                        callback(res.data.data);
                    }
                })
            },
            //删除原来的封面
            handle_del_course_cover(){
                this.obj_cover.resources_url = '';
            },
            handle_del_course_mpic(){
                this.obj_mpic.resources_url = '';
            },
            data_change(){
                if(Date.parse(this.form.release_start_time) < Date.now()){
                    alert('不能选择以前的时间,请重新选择')
                    this.form.release_start_time = '';
                }else if(Date.parse(this.form.release_finish_time) < Date.parse(this.form.release_start_time)){
                    alert('开始时间不能大于结束始时间')
                    this.form.release_start_time = '';
                }
            },
            _data_change(){
                if(Date.parse(this.form.release_finish_time) < Date.now()){
                    alert('不能选择以前的时间,请重新选择')
                    this.form.release_finish_time = '';
                }else if(Date.parse(this.form.release_finish_time) < Date.parse(this.form.release_start_time)){
                    alert('结束时间不能小于开始时间')
                    this.form.release_finish_time = '';
                }

            }
        },
        mounted(){
            if(this.$route.query.class_group_id){
                var self = this,
                    param = {
                        class_group_id: this.$route.query.class_group_id
                    };
                var storage = getLocalStorage();
                this.class_group_id = this.$route.query.class_group_id;
                this.fetchData_with_id(this.url, this.class_group_find_method, param, function(data){
                    //这里可以得到值
                    self.form.class_group_id = data.class_group_id;
                    self.form.is_active = data.is_active;
                    self.form.title = data.title;
                    self.form.price = data.price / 100;
                    console.log(data.introduce)
                    self.form.introduce     = data.introduce.replace(/[\r\n]/g, '\\n');
                    self.form.notes         = data.notes.replace(/[\r\n]/g, '\\n');
                    self.form.suitable      = data.suitable.replace(/[\r\n]/g, '\\n');
                    self.form.release_start_time = data.release_start_time;
                    self.form.release_finish_time = data.release_finish_time;
                    if(data.attList){
                        data.attList.forEach(function (item, index, array) {
                            if(item.group_resources_type == "cover"){
                                self.obj_cover = item;
                                storage.setItem('cover_url', item.resources_url)
                            }else if(item.group_resources_type == "mpic"){
                                self.obj_mpic  = item;
                                storage.setItem('mpic_url', item.resources_url)
                                // if(item.resources_url != ""){
                                //     self.videoFiles = item.resources_url.substring(71);
                                //     self.videoUrl = item.resources_url;
                                // }
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .breakCrumb{
        margin-bottom: 10px;
    }
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
    .capture_btn_wraper .capture_del_btn{
        position: absolute;
        right: 0;
        bottom: 40px;
    }
    .class_grout_introduce_len{
        color: #333;
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