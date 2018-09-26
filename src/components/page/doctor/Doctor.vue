<template>
    <div class="banner-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item>医生信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="banner-list padding-top">
            <div>
                <el-row>
                    <el-col :span="16">
                        <el-form ref="ruleForm" :model="form"  label-width="100px">
                            <el-form-item label="医生ID">
                                <el-input v-model="form.doctor_id"></el-input>
                            </el-form-item>
                            <el-form-item label="医生姓名">
                                <el-input v-model="form.doctor_name"></el-input>
                            </el-form-item>
                            <el-form-item label="医院名称">
                                <el-input v-model="form.hospital_name"></el-input>
                            </el-form-item>
                            <el-form-item label="科室">
                                <el-input v-model="form.dept_name"></el-input>
                            </el-form-item>
                            <el-form-item label="头衔">
                                <el-input v-model="form.rank"></el-input>
                            </el-form-item>
                            <el-form-item label="擅长">
                                <el-input type="textarea" v-model="form.specialty"></el-input>
                            </el-form-item>
                            <el-form-item label="选择图片">
                                <div class="fileUpload">
                                    <div class="file-box" @click="fun_selectImg">
                                        <input type="file" class="file-btn" id="file-selector"/>
                                        选择文件
                                    </div>
                                </div>
                                <div class="banner_wraper">
                                    <div id="output">
                                        <el-button v-if="qcload_files" type="primary" size="small" class="delbtn" @click="handle_del_banner">删除</el-button>
                                        <img v-if="qcload_files" :src="form.doctor_image" alt="">
                                    </div>
                                    <div id="progress"></div>
                                    <el-button v-if="files" type="primary" size="small" class="submitBtn" @click="handle_upload">上传</el-button>
                                    <el-button v-if="files" type="primary" size="small" class="cancleBtn" @click="handle_cancle_banner">取消</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="医师描述">
                                <el-checkbox-group
                                        class="save-label"
                                        v-model="checkedList">
                                    <el-checkbox v-for="item in checkList" :label="item.label_type_code" :key="item.label_type_code">{{item.label_type_name}}</el-checkbox>
                                </el-checkbox-group>
                                <el-button type="primary" size="mini" class="save-label" @click="handle_save_label">确定</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
                                <el-button size="small" @click="onCancle">取消</el-button>
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
    import {handel_fetchData_query} from "../../../utilis/handle_data";
    export default {
        name: "doctor",
        data(){
            return {
                //请求接口
                url: baseUrl()+'/comm',
                doctor_query_methodName: "sp_hc_doctor_query",
                doctor_update_methodName: "sp_hc_doctor_update",
                label_type_query_methodName: "sp_hc_doctor_label_type_query",
                label_save_methodName: "sp_hc_doctor_label_save",
                doctor_find_methodName: "sp_hc_doctor_find",

                class_id                    : undefined,
                files                       : null,                     //选择的文件
                qcload_files                : '',                       //云山文件
                form: {                     //表单数据
                    doctor_id: '',
                    doctor_name: '',
                    hospital_name: '',
                    dept_name: '',
                    rank: '',
                    specialty: '',
                    doctor_image: ''
                },
                checkList: [],          //标签数组
                checkedList: [],

                page_num : 1,
                page_size: 500,
            }
        },
        watch: {
            checkedList: function () {
                
            }
        },
        methods: {
            onSubmit() {
                this.handle_search_doc();
                // this.$http.post(baseUrl()+'/comm', {"methodName": this.doctor_update_methodName, "param":JSON.stringify(this.form)}).then((res) => {
                //     if(res.data.code===0){
                //         Vue.http.headers.common['sign'] = res.data.sign;
                //         alert('更新成功')
                //     }
                // });
            },
            onCancle(){
                this.$router.push({ path: '/doctors'})
            },
            //搜索医生
            handle_search_doc(){
                var self = this,
                    param = {
                        "search"        : this.form.doctor_name,
                        "page_num"      : this.page_num,
                        "page_size"     : this.page_size,
                    };
                this.$http.post("https://health.gusmedsci.cn/hservice/comm", {"methodName": "sp_hc_doctor_query", "param": JSON.stringify(param)}).then((res) => {
                    //本地存在直接更新
                    if(res.data.data.total_num){
                        self.$http.post(self.url, {"methodName": "sp_hc_doctor_update", "param": JSON.stringify(self.form)}).then((res) => {
                            if(res.data.code == 0){
                                alert('修改成功');
                                if(this.class_id){
                                    self.$router.push({ path: '/doctors', query: { 'class_id': this.class_id}})
                                }else{
                                    self.$router.push({ path: '/doctors'})
                                }
                            }
                        })
                    }else{
                        //不存在此医生保存到本地
                        self.$http.post(self.url, {"methodName": "sp_hc_doctor_save", "param": JSON.stringify(self.form)}).then((res) => {
                            if(res.data.code == 0){
                                alert('保存成功');
                                if(this.class_id){
                                    self.$router.push({ path: '/doctors', query: { 'class_id': this.class_id}})
                                }else{
                                    self.$router.push({ path: '/doctors'})
                                }
                            }
                        })
                    }
                })
            },
            fun_selectImg(){
                var self = this;
                if(self.bannerCount == 5) {
                    alert('图片数量已达上限, 不能继续选择');
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
            },
            handle_upload(){
                var self = this;
                this.handle_data.handle_upload_qcload(this, "upload_image", this.files, function (data) {
                    if(data.statusCode == 200){
                        self.form.doctor_image = data.Location;
                    }
                });
            },
            handle_cancle_banner(){
                var self = this,
                    progress = document.getElementById('progress'),
                    output = document.getElementById('output');
                self.form.doctor_image     = undefined;
                output.innerHTML            = '';
                progress.innerHTML          = '';
                this.files = '';
            },
            handle_del_banner(){
                this.qcload_files = '';
                this.form.doctor_image = '';
            },
            handle_save_label(){
                var param = {
                    doctor_id: this.form.doctor_id,
                    labelList: []
                }
                this.checkedList.forEach(function (item, index, array) {
                    param.labelList.push({'label_type_code': item})
                })
                this.handle_data.handel_fetchData_query(this, this.url, this.label_save_methodName, param, function (data) {
                    if(data.code == 0){
                        alert('创建标签成功')
                    }
                })
            }
        },
        mounted(){
            var self = this;
            var storage = getLocalStorage();
            var doctor = JSON.parse(storage.getItem('doctor'));
            console.log(doctor.doctor_id)
            this.form.doctor_id = doctor.doctor_id;
            this.form.doctor_name = doctor.doctor_name;
            this.form.hospital_name = doctor.hospital_name;
            this.form.dept_name = doctor.dept_name;
            this.form.rank = doctor.rank;
            this.form.specialty = doctor.specialty;
            this.form.doctor_image = doctor.doctor_image;
            this.qcload_files = doctor.doctor_image ? 1 : 0;
            var param = {
                page_num : 1,
                page_size: 500
            };
            this.handle_data.handel_fetchData_query(this, this.url, this.label_type_query_methodName, param, function (data) {
                self.checkList = data.data.rows;
            })
            var _param = {
                doctor_id: this.form.doctor_id
            }
            this.handle_data.handel_fetchData_query(this, this.url, this.doctor_find_methodName, _param, function (data) {
                console.log(data.data.label_list)
                data.data.label_list.forEach(function (item, index, array) {
                    self.checkedList.push(item.label_type_code)
                })
            })
            if(this.$route.query.class_id){
                this.class_id =  this.$route.query.class_id;
            }
        }
    }
</script>

<style scoped>
    .banner-management-wraper{
        width: 100%;
    }
    .banner-list{
        padding-left: 15px;
        padding-right: 15px;
        padding-bottom: 40px;
        background: #fff;
        overflow: hidden;
    }
    .padding-top{
        padding-top: 15px;
    }
    .banner-list-title{
        padding: 15px 0 15px 0;
    }
    .banner-list-title-p{
        overflow: hidden;
    }
    .addBannerBtn{
        float: right;
    }
    .banner-list{
        padding-left: 15px;
        background: #fff;
        overflow: hidden;
    }
    .banner-list-title{
        padding: 15px 0 15px 0;
    }
    .banner-list-table{
        margin-bottom: 15px;
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
    .delbtn{
        display: block;
        margin-bottom: 4px;
    }
    .save-label{
        display: inline-block;
        margin-right: 10px;
    }
</style>