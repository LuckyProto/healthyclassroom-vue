<template>
    <div class="banner-management-wraper" @click="handle_click($event)">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/course' }">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑课程</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="banner-list">
            <div>
                <el-row>
                    <el-col :span="16">
                        <el-form ref="form" :model="form" label-width="100px">
                            <el-form-item label="课程标题">
                                <el-input
                                        placeholder="请输入课程标题"
                                        v-model="form.class_name"
                                        size="small"
                                        :maxlength="maxlength">
                                    <template slot="append"><span v-bind:class="{warnClass : class_name_length >= 18}">已输入{{class_name_length}}字符</span></template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="课程内容">
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
                            <el-form-item label="选择视频">
                                <div>
                                    <div class="capture_btn_wraper">
                                        <input   type="file" class="file-btn" id="files-list" @change="fun_selectImg($event)" />
                                        <button  v-if="videoUrl" type="button" id="upload_qcload_btn" class="video_btn" size="mini">上传视频</button>
                                        <button  v-if="videoUrl" type="button" id="del_video_btn" class="video_btn">删除此视频</button>
                                        <button  v-if="videoUrl" type="button" id="capture_start_btn" class="video_btn" size="mini">截取封面</button>
                                    </div>
                                    <video v-if="videoUrl" id='video' :src='videoUrl' controls crossOrigin='Anonymous' autoplay="autoplay"></video>
                                </div>
                                <div class="fileUpload">
                                    <!--<span class="file-box" @click="fun_selectImg">-->
                                        <!--<input type="file" class="file-btn" id="files-list" @change="handle_input_change($event)"/>-->
                                        <!--选择视频-->
                                    <!--</span>-->

                                    <!--<input type="file" class="file-btn" id="files-list" @change="fun_selectImg($event)" value="选择视频"/>-->

                                    <span id="output"></span>
                                    <!--<span id="progress"></span>-->
                                </div>
                            </el-form-item>
                            <el-form-item label="开始封面">
                                <div class="start_poster_wraper" id="start_poster_wraper">
                                    <div v-if="hasCover">
                                        <img :src="form.attList[1].resources_url" alt="">
                                        <button type="button" id="del_cover_btn" class="del_cover_btn">删除</button>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="封面链接">
                                <el-input
                                        placeholder="请输入封面链接"
                                        v-model="form.attList[1].resources_target"
                                        size="small">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="已选医生">
                                <el-input
                                        v-model="form.doctor_name"
                                        size="small">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="主讲医生">
                                <p class="search_doc_box">
                                    <el-input v-model="form.doctor_name" placeholder="请输入医生姓名" :span="16"></el-input>
                                    <el-button type="primary" id="search_doc_btn" class="search-btn" size="mini">查找</el-button>
                                </p>
                                <el-table
                                        ref="multipleTable"
                                        :data="tableData"
                                        tooltip-effect="dark"
                                        style="width: 100%"
                                        @selection-change="handleSelectionChange">
                                    <el-table-column
                                            type="selection"
                                            width="55">
                                    </el-table-column>
                                    <el-table-column
                                            label="医生电话"
                                            width="120">
                                        <template slot-scope="scope">{{ scope.row.doctor_tel_no }}</template>
                                    </el-table-column>
                                    <el-table-column
                                            label="医生姓名"
                                            width="120">
                                        <template slot-scope="scope">{{ scope.row.person_name }}</template>
                                    </el-table-column>
                                    <el-table-column
                                            label="就职岗位"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">{{ scope.row.occupation }}</template>
                                    </el-table-column>
                                    <el-table-column
                                            label="就职医院"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">{{ scope.row.company }}</template>
                                    </el-table-column>
                                </el-table>
                                <!--课件列表分页条-->
                                <div class="block user-list-panv">
                                    <el-pagination
                                            @size-change="handlePageSizeChange"
                                            @current-change="handleCurrentPageChange"
                                            :page-sizes="[5, 10, 20, 30, 40]"
                                            :page-size="page_size"
                                            :current-page.sync="page_num"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="total">
                                    </el-pagination>
                                </div>
                            </el-form-item>
                            <el-form-item label="操作按钮">
                                <el-row class="submitAndExit">
                                    <el-button type="primary" size="small" class="submitBtn" id="updata_course_btn">下一步</el-button>
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
    import {baseUrl} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    export default {
        name: "update-course",
        data(){
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                tableData: null,
                total:undefined,
                page_num: 1,
                page_size: 10,
                //课程信息
                form: {
                    class_id: '',
                    class_name: '',
                    class_content: '',
                    is_active: undefined,
                    doctor_id: undefined,           //被选中的医生
                    doctor_name: '',           //被选中的医生
                    attList: []
                },
                maxlength: 18,
                class_content_maxlength: 200,
                files: null,
                input: '',
                url: baseUrl()+'/comm',
                methodName: "sp_clinic_doctor_baseinfo_query",
                class_find_methodName: "sp_hc_class_find",
                videoUrl: '',   //需要显示的视频Url
                videoFiles: '', //需要上传的文件
                hasCover: true,
                // hasVideo: true,
                // has_courseVideo : true
            }
        },
        computed: {
            class_name_length: function () {
                return this.form.class_name.length;
            }
        },
        methods: {
            handler_cancleUploadImg(){
                var self = this,
                    progress = document.getElementById('progress'),
                    output = document.getElementById('output');
                self.form.resources_target = '';
                output.innerHTML = '';
                progress.innerHTML = '';
                this.$router.push('/courseware');
            },
            //选择图片
            fun_selectImg($event){
                var self = this,
                    output = document.getElementById('output'),
                    info = '',
                    files = $event.target.files,
                    type = 'dufault',
                    reader = new FileReader(),
                    i = 0,
                    len = files.length;

                //上传用
                self.videoFiles = files[0];
                console.log("selectF", self.videoFiles)
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
                                // html = "<video id='video' width: 200px; height: 150px;' src='" + reader.result + "' controls></video>";
                                self.videoUrl = reader.result;  //显示用
                                console.log("selectU", self.videoUrl)
                                break;
                            case "text":
                                html = reader.result;
                                break;
                        }
                        output.innerHTML = html;
                    }
                    i++;
                }
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
            //每页显示条目改变时执行的函数
            handlePageSizeChange(val) {
                this.page_size = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.fetchData(this.url, this.methodName, param);
            },
            //当前页面改变时执行的函数
            handleCurrentPageChange(val) {
                this.page_num = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.fetchData(this.url, this.methodName, param);
            },
            //获取数据
            fetchData(url, methodName, param){
                var self = this;
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
                                    // self.videos = item.resources_url.substring(40)
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

            //根据id查询条目
            fetchData_with_id(url, methodName, param, callback){
                this.$http.post(url, {"methodName": methodName, "param": JSON.stringify(param)}).then((res) => {
                    if(res.data.code == 0){
                        Vue.http.headers.common['sign'] = res.data.sign;
                        callback(res.data.data);
                    }
                })
            },
            //搜索医生
            // handler_search_input(){
            //     var param = {
            //             "search": this.form.doctor_name,
            //             "page_num": this.page_num,
            //             "page_size": this.page_size,
            //         },
            //         self = this;
            //     this.$http.post("https://his-dev.gusmedsci.cn/hservice/comm", {"methodName": "sp_clinic_doctor_baseinfo_query", "param": JSON.stringify(param)}).then((res) => {
            //         console.log(res)
            //         self.tableData = res.data.data.rows;
            //         self.total = res.data.data.total_num;
            //     })
            // },
            //被选中的表格
            handleSelectionChange(val) {
                console.log(val);
                this.form.doctor_id = val[0].doctor_id;
                this.form.doctor_name = val[0].person_name;
            },
            handle_input_change($event){
                console.log($event)
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
                    Key: 'upload_audio/' + file.name,
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
            //删除腾讯云
            handle_del_qcload(file, callback){
                var cos = new COS({
                    SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                    SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk'
                })

                cos.deleteObject({
                    Bucket: 'wxapplet-1253887111',  /* 必须 */
                    Region: 'ap-beijing-1',         /* 必须 */
                    Key: 'upload_audio/' + file                          /* 必须 */
                }, function(err, data) {
                    callback(data);
                })
            },
            //页面按钮的点击事件,事件委托
            handle_click(event){
                var self = this;
                var target = event.target;
                if(target.nodeName.toLowerCase() == "button"){
                    switch (target.id){
                        case "del_cover_btn":
                            this.hasCover = false;                            //删除已有封面
                            break;
                        case "capture_start_btn":                                    //截取视频封面
                            var $start_poster_wraper = $('#start_poster_wraper'),
                                video = $('#video').get(0),
                                scale = 0.25,    //缩放尺寸
                                wid = video.videoWidth * scale,
                                hei = video.videoHeight * scale,
                                start_poster = document.createElement("div"),
                                image = document.createElement('img'),
                                delBtn = document.createElement("button");
                            delBtn.type = 'button';
                            delBtn.innerText = '删除';

                            var dataURL = self.handler_getBase64(video, wid, hei);
                            image.src = dataURL;
                            self.form.attList[1].resources_url = dataURL;
                            start_poster.appendChild(image);
                            start_poster.appendChild(delBtn);
                            $start_poster_wraper[0].appendChild(start_poster);
                            delBtn.addEventListener('click', function () {
                                delBtn.parentNode.parentNode.removeChild(start_poster);
                                self.form.attList[1].resources_url = '';
                            }, false);
                            break;

                        //上传视频
                        case "upload_qcload_btn":
                            this.handle_upload_qcload(this.videoFiles, function(data){
                                self.form.attList[0].resources_url = 'https' + data.Location.substring(4);
                            })
                            break;

                        //删除已有视频
                        case "del_video_btn":
                            var filesList = document.getElementById('files-list');

                            this.handle_del_qcload(self.form.attList[0].resources_url.substring(71), function (data) {
                                if(data.statusCode == 200 || data.statusCode == 204){
                                    filesList.value = '';
                                    self.form.attList[0].resources_url = '';
                                    self.videoUrl = '';
                                    self.videoFiles = '';
                                    alert('删除成功')
                                }
                            });

                            break;
                        case "search_doc_btn":                                           //搜索医生
                            var param = {
                                    "search": this.form.doctor_name,
                                    "page_num": this.page_num,
                                    "page_size": this.page_size,
                                },
                                self = this;
                            this.$http.post("https://health.gusmedsci.cn/hservice/comm", {"methodName": "sp_clinic_doctor_baseinfo_query", "param": JSON.stringify(param)}).then((res) => {
                                self.tableData = res.data.data.rows;
                                self.total = res.data.data.total_num;
                            })
                            break;

                        //更新课程
                        case "updata_course_btn":
                            var param1 = this.form;
                            self.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_class_update","param":JSON.stringify(param1)}).then((res) => {
                                if(res.data.code===0){
                                    Vue.http.headers.common['sign'] = res.data.sign;
                                    var class_id = res.data.data.class_id;
                                    self.$router.push({ path: '/courseware', query: { 'class_id': class_id } })
                                }
                            });
                            break;
                    }
                }
            }
        },
        mounted(){

            //查询课程
            var self = this,
                param = {
                    class_id: this.$route.query.class_id
                };
                this.fetchData_with_id(this.url, this.class_find_methodName, param, function(data){
                    //这里可以得到值
                    self.form.class_id = data.class_id;
                    self.form.is_active = data.is_active;
                    self.form.class_name = data.class_name;
                    self.form.class_content = data.class_content;
                    self.form.doctor_name = data.doctor_name;
                    self.form.doctor_id = data.doctor_id;
                    data.attList.forEach(function (item, index, array) {
                        if(item.class_resources_type == "cover"){
                            self.form.attList[1] = item;
                        }else if(item.class_resources_type == "video"){
                            self.form.attList[0] = item;
                            if(item.resources_url != ""){
                                self.videoFiles = item.resources_url.substring(71);
                                self.videoUrl = item.resources_url;
                            }
                        }
                    })
                });

            //查询医生
            var docparam = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
            this.$http.post("https://health.gusmedsci.cn/hservice/comm", {"methodName": "sp_clinic_doctor_baseinfo_query", "param": JSON.stringify(docparam)}).then((res) => {
                self.tableData = res.data.data.rows;
                self.total = res.data.data.total_num;
            })
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
        padding: 5px;
        background: #46A0FC;
        border: none;
        border-radius: 3px;
        margin-right: 20px;
        color: #fff;
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
        position: relative;
        z-index: 999;
    }
    .capture_btn_wraper .video_btn{
        padding: 5px;
        background: #46A0FC;
        border: none;
        border-radius: 3px;
        margin-right: 20px;
        color: #fff;
    }
    .del_cover_btn{
        padding: 5px;
        background: #46A0FC;
        border: none;
        border-radius: 3px;
        color: #fff;
    }
    .del_video_btn{
        padding: 5px;
        background: #46A0FC;
        border: none;
        border-radius: 3px;
        color: #fff;
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
</style>