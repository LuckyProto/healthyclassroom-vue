<template>
    <div class="user-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/course' }">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/addcourse' }">新增课程</el-breadcrumb-item>
                <el-breadcrumb-item>关联医生</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="user-search">
            <div class="user-search-title">
                <p>查找医生</p>
            </div>
            <div>
                <span class="userId">医生姓名: </span>
                <input v-model="input" placeholder="请输入医生姓名" class="search-input"></input>
                <el-button @click='handle_search_doc' type="primary" class="search-btn" size="mini">查找</el-button>
                <el-button @click='handleClearCoursewareBtn'  type="primary" class="search-btn" size="mini">清空</el-button>
            </div>
        </div>

        <div class="banner-list">
            <!--课件列表标题-->
            <div class="banner-list-title">
                <p class="banner-list-title-p">
                    <span>已选医生</span>
                    <el-button v-if="!doctor_id" type="primary" size="mini" class="addBannerBtn"  @click='handleLinkCourseware'>关联</el-button>
                    <el-button v-if="doctor_id" type="primary" size="mini" class="addBannerBtn"  @click='_handleLinkCourseware'>下一步</el-button>
                </p>
            </div>
            <div>
                <el-table
                        ref="multipleTable"
                        :data="multipleSelection"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            label="医生ID"
                            width="80">
                        <template slot-scope="scope">{{ scope.row.doctor_id }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="doctor_name"
                            label="姓名"
                            width="120">
                        <template slot-scope="scope">{{ scope.row.doctor_name || scope.row.person_name}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="医院"
                            show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.hospital_name }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="科室"
                            show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.dept_name }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="专业"
                            show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.specialty }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="职位"
                            show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.rank }}</template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="banner-list">
            <!--课件列表标题-->
            <div class="banner-list-title">
                <p class="banner-list-title-p">
                    <span>医生列表</span>
                </p>
            </div>
            <div>
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
                            label="医生ID"
                            width="80">
                        <template slot-scope="scope">{{ scope.row.doctor_id }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="doctor_name"
                            label="姓名"
                            width="120">
                        <template slot-scope="scope">{{ scope.row.doctor_name || scope.row.person_name}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="医院"
                            show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.hospital_name }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="科室"
                            show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.dept_name }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="专业"
                            show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.specialty }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="职位"
                            show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.rank }}</template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button
                                    @click='handle_update_doc(scope.$index, tableData)'
                                    type="text"
                                    size="small">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block user-list-panv">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page_num"
                        :page-sizes="[5, 15, 20, 30]"
                        :page-size="page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {baseUrl} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    export default {
        name: "courseware",
        data() {
            return {
                class_id: '',
                doctor_id: '',
                isChange: false,    //是否改变课程图片地址状态参数
                //请求接口
                url: baseUrl()+'/comm',
                doctor_query_methodName: "sp_hc_doctor_query",
                courseware_update_methodName: "sp_hc_courseware_update",
                class_courseware_save_methodName:'sp_hc_class_courseware_save',
                class_courseware_query_methodName:'sp_hc_class_courseware_query',
                doctor_baseinfo_query_methodName:'sp_clinic_doctor_baseinfo_query',
                class_save_methodName:'sp_hc_class_save',
                class_update_methodName:'sp_hc_class_update',
                class_self_update_methodName:'sp_hc_class_self_update',     //修改课程基本信息

                //表格所需数据
                tableData: null,
                //分页条所需数据
                input: '',
                total:undefined,
                page_num: 1,
                page_size: 5,
                page_count: undefined,

                //课程添加课件字段
                multipleSelectionAll: [],      //所有选中的数据包含跨页数据
                multipleSelection: [],         //本页选中的数据
                _multipleSelection: []         //确认需要关联的课件
            }
        },
        methods: {
            /*查询课件*/
            fetchData(url, methodName, param){
                var self = this;
                this.$http.post(url, {"methodName": methodName, "param": JSON.stringify(param)}).then((response) => {
                    var tableData = [];
                    if(response.data.code===0){
                        Vue.http.headers.common['sign'] = response.data.sign;
                        if(response.data.data.rows){
                            self.tableData = response.data.data.rows;
                            self.courseware_count = response.data.data.total_num;
                        }
                    }else{
                        self.$alert(response.body.msg, '提示', {
                            confirmButtonText: '确定',
                        });
                    }
                    self.fullscreenLoading=false;
                }, (error)=>{
                    self.$alert(error, '提示', {
                        confirmButtonText: '确定',
                    });
                    self.fullscreenLoading=false;
                });
            },
            //每页显示条目改变时执行的函数
            handleSizeChange(val) {
                this.page_size = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.fetchData(this.url, this.doctor_query_methodName, param);
            },
            //当前页面改变时执行的函数
            handleCurrentChange(val) {
                this.page_num = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.fetchData(this.url, this.doctor_query_methodName, param);
            },
            //搜索医生
            handle_search_doc(){
                var param = {
                        "search": this.input,
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                    },
                    self = this;
                this.$http.post(this.url, {"methodName": "sp_hc_doctor_query", "param": JSON.stringify(param)}).then((res) => {
                    //如果本地存在
                    if(res.data.data.total_num){
                        self.tableData = res.data.data.rows;
                    }else{
                        //如果本地不存在到远程搜索
                        this.$http.post("https://health.gusmedsci.cn/hservice/comm", {"methodName": "sp_clinic_doctor_baseinfo_query", "param": JSON.stringify(param)}).then((res) => {
                            self.total = res.data.data.total_num;
                            self.tableData = res.data.data.rows;
                        })
                    }
                })
            },
            //清空搜索框执行的函数
            handleClearCoursewareBtn(){
                this.input = '';
            },

            //关联医生
            handleSelectionChange(val) {

                this.multipleSelection = val;

            },
            handleLinkCourseware(){
                if(this.multipleSelection.length != 1){
                    alert('只能选择一个医生')
                    return;
                }
                var self = this;
                var doctor_id = this.multipleSelection[0].doctor_id;
                var storage = getLocalStorage();
                var course = JSON.parse(storage.getItem('course'));
                // storage.removeItem('course');
                course.doctor_id = doctor_id;
                this.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_class_save","param":JSON.stringify(course)}).then((res) => {
                    if(res.data.code===0){
                        Vue.http.headers.common['sign'] = res.data.sign;
                        var class_id = res.data.data.class_id;
                        self.$router.push({ path: '/courseware', query: { 'class_id': class_id } })
                    }
                });
            },
            //修改时关联医生
            _handleLinkCourseware(){
                if(this.multipleSelection.length == 1){
                    var self = this;
                    var doctor_id = this.multipleSelection[0].doctor_id;
                    var doctor_name = this.multipleSelection[0].doctor_name;
                    var storage = getLocalStorage();
                    var course = JSON.parse(storage.getItem('course'));
                    course.doctor_id = doctor_id;
                    course.is_free = course.is_free ? 1 : 0;
                    course.class_id = self.class_id;
                    course.doctor_name = doctor_name;
                    if(this.isChange){
                        this.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_class_update","param":JSON.stringify(course)}).then((res) => {
                            if(res.data.code===0){
                                Vue.http.headers.common['sign'] = res.data.sign;
                                self.$router.push({ path: '/courseware', query: { 'class_id': self.class_id } })
                                storage.removeItem('qcload_cover_url');
                                storage.removeItem('qcload_video_url');
                            }
                        });
                    }else{
                        this.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_class_self_update","param":JSON.stringify(course)}).then((res) => {
                            if(res.data.code===0){
                                Vue.http.headers.common['sign'] = res.data.sign;
                                self.$router.push({ path: '/courseware', query: { 'class_id': self.class_id } })
                                storage.removeItem('qcload_cover_url');
                                storage.removeItem('qcload_video_url');
                            }
                        });
                    }
                }else{
                    alert('只能选择一个医生，请重新选择')
                }
            },
            handle_link_change(val){
                this._multipleSelection = val;
            },
            handle_link_courseware_save(){
                var param = {
                    "class_id": this.class_id,
                    "list": [

                    ]
                }
                if(this._multipleSelection.length == 0){
                    alert('请选择需要保存的课件');
                }else{
                    this._multipleSelection.forEach(function (item, index, array) {
                        param.list.push({"courseware_id": item.courseware_id});
                    })
                    this.$http.post(this.url, {"methodName": "sp_hc_class_courseware_save", "param": JSON.stringify(param)}).then((response) => {
                        if(response.data.code===0){
                            Vue.http.headers.common['sign'] = response.data.sign;
                            alert("课件保存成功")
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
            //编辑医生
            handle_update_doc(index, tableData){
                var storage = getLocalStorage();
                tableData[index].doctor_name = tableData[index].person_name || tableData[index].doctor_name;
                storage.setItem('doctor', JSON.stringify(tableData[index]))
                if(!this.class_id){
                    this.$router.push({ path: '/doctor'})
                }else{
                    this.$router.push({ path: '/doctor', query: { 'class_id': this.class_id}})
                }
            }
        },
        mounted(){
            var self = this,
                param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
            //搜索医生
            this.$http.post(this.url, {"methodName": this.doctor_query_methodName, "param": JSON.stringify(param)}).then((res) => {
                self.tableData = res.data.data.rows;
                self.total = res.data.data.total_num;
            })

            //编辑时根据class_id获取已选医生
            if(this.$route.query.class_id){
                this.class_id =  this.$route.query.class_id;
                this.isChange =  this.$route.query.isChange;
                var storage = getLocalStorage();
                var course = JSON.parse(storage.getItem('course'));
                var doctor_name = course.doctor_name;
                self.doctor_id = course.doctor_id;
                var _param = {
                    "search"    :   doctor_name,
                    "page_num"  : this.page_num,
                    "page_size" : this.page_size,
                }
                this.$http.post(this.url, {"methodName": this.doctor_query_methodName, "param": JSON.stringify(_param)}).then((res) => {
                    self.multipleSelection = res.data.data.rows;
                })
            }
        }
    }
</script>

<style scoped>
    .user-management-wraper{
        width: 100%;
    }
    .user-search{
        width: 100%;
        height: 80px;
        padding: 15px 0 15px 15px;
        box-sizing: border-box;
        background: #fff;
        margin-bottom: 20px;
    }
    .user-search-title{
        margin-bottom: 10px;
    }
    .userId{
        margin-right: 8px;
    }
    .search-input{
        height: 24px;
        margin-right: 10px;
    }
    .clear-btn{
        margin-right: 10px;
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
    .user-list-table{
        margin-bottom: 15px;
    }
    .user-list-panv{
        float: left;
        padding-bottom: 20px;
        margin-top: 30px;
    }
    .save_link_btn{
        position: relative;
        right: -460px;
        top: -30px;
    }
</style>