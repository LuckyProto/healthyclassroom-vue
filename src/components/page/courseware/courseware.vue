<template>
    <div class="user-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item>课件管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="user-search">
            <div class="user-search-title">
                <p>查找课件</p>
            </div>
            <div>
                <span class="userId">课件名称: </span>
                <input v-model="inputVal" placeholder="请输入课件名称" class="search-input"></input>
                <el-button @click='handleSearchCourseware' type="primary" class="search-btn" size="mini">查找</el-button>
                <el-button @click='handleClearCourseware'  type="primary" class="search-btn" size="mini">清空</el-button>
            </div>
        </div>

        <div class="banner-list" v-if="multipleSelectionAll">
            <!--课件列表标题-->
            <div class="banner-list-title" v-if="class_id">
                <p class="banner-list-title-p">
                    <span>已选课件</span>
                    <el-button  type="primary" size="mini" class="addBannerBtn"  @click='handle_link_courseware_save'>保存</el-button>
                </p>
            </div>
            <!--课件列表内容-->
            <div class="user-list-table" v-if="class_id">
                <el-table
                        ref="multipleTables"
                        :data="multipleSelectionAll"
                        border
                        style="width: 100%"
                        @selection-change="handle_link_change">
                    <el-table-column
                            v-if="class_id"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="courseware_id"
                            sortable
                            label="课件编号"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="courseware_name"
                            label="课件名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="courseware_resources_ctype"
                            label="课件类型"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            label="图片"
                            width="380">
                        <template scope="scope">
                            <img   v-if="scope.row.courseware_resources_type == 'pic' "     :src="scope.row.resources_url" width="50" height="50"/>
                            <video v-if="scope.row.courseware_resources_type == 'video' "   :src="scope.row.resources_url" width="250" height="200" controls>您的浏览器不支持播放该视频！</video>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!--课件列表-->
        <div class="banner-list">
            <!--课件列表标题-->
            <div class="banner-list-title">
                <p class="banner-list-title-p">
                    <span>课件列表</span>
                    <el-button v-if="!class_id" type="primary" size="mini" class="addBannerBtn" @click='handleAddCourseware'>新增</el-button>
                    <el-button v-if="class_id" type="primary" size="mini" class="addBannerBtn"  @click='handleLinkCourseware'>关联</el-button>
                </p>
            </div>
            <!--课件列表内容-->
            <div class="user-list-table" v-if="tableData">
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        border
                        style="width: 100%"
                        @select="handleSelectionChange"
                        @select-all="selectAll">
                    <el-table-column
                            v-if="class_id"
                            type="selection"
                            :selectable="checkSelectable"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="courseware_id"
                            sortable
                            label="课件编号"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="courseware_name"
                            label="课件名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="courseware_resources_ctype"
                            label="课件类型"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            label="图片"
                            width="380">
                        <template scope="scope">
                            <img   v-if="scope.row.courseware_resources_type == 'pic' "     :src="scope.row.resources_url" width="50" height="50"/>
                            <video v-if="scope.row.courseware_resources_type == 'video' "   :src="scope.row.resources_url" width="250" height="200" controls>您的浏览器不支持播放该视频！</video>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="create_time"
                            label="上传时间"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="操作"
                            width="180">
                        <template slot-scope="scope">
                            <el-button
                                    @click='updateCourseware(scope.$index, tableData)'
                                    type="text"
                                    size="small">
                                编辑
                            </el-button>
                            <el-switch
                                    style="display: block"
                                    v-model="scope.row.is_active"
                                    active-color="#13ce66"
                                    active-text="启用"
                                    active-value="true"
                                    inactive-color="#ff4949"
                                    inactive-text="禁用"
                                    inactive-value="false"
                                    @change="changeSwitch(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--课件列表分页条-->
            <div class="block user-list-panv" v-if="tableData">
                <el-pagination
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange"
                        :page-sizes="[5, 10, 20, 30, 40]"
                        :page-size="page_size"
                        :current-page.sync="page_num"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="courseware_count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {baseUrl} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import handleData from "../../../utilis/handle_data";
    export default {
        name: "courseware",
        data() {
            return {
                class_id: '',
                //请求接口
                url: baseUrl()+'/comm',
                courseware_query_methodName: "sp_hc_courseware_query",
                courseware_update_methodName: "sp_hc_courseware_update",
                class_courseware_save_methodName:'sp_hc_class_courseware_save',
                class_courseware_query_methodName:'sp_hc_class_courseware_query',

                //表格所需数据
                tableData: null,
                //分页条所需数据
                inputVal: '',
                courseware_count:undefined,
                page_num: 1,
                page_size: 10,
                page_count: undefined,

                //课程添加课件字段
                multipleSelectionAll: [],      //所有选中的数据包含跨页数据
                multipleSelection: [],         //本页选中的数据
                _multipleSelection: []         //确认需要关联的课件
            }
        },
        methods: {
            //增加课件
            handleAddCourseware(){
                this.$router.push('/addcourseware');
            },

            //修改课程，与增加课程公用一个页面
            updateCourseware(index, tableData){
                var storage = getLocalStorage();
                storage.setItem('courseware', JSON.stringify(tableData[index]));
                this.$router.push({ path: '/addcourseware', query: { 'courseware_id': tableData[index].courseware_id} })
            },

            //禁止使用
            changeSwitch(row){
                var param = {
                    "courseware_id": row.courseware_id,
                    "courseware_name": row.courseware_name,
                    "resources_tip": row.resources_tip,
                    "courseware_resources_type": row.courseware_resources_type,
                    "is_active": row.is_active == "true" ? 1 : 0
                };
                if(row.courseware_resources_type == 'pic'){
                    param.resources_url = 'http' + row.resources_url.substring(4);
                }else if(row.courseware_resources_type == 'video'){
                    param.resources_url = 'http' + row.resources_url.substring(5);
                }
                this.updataData(this.url, this.courseware_update_methodName, param);
            },
            /*查询课件*/
            fetchData(url, methodName, param){
                this.$http.post(url, {"methodName": methodName, "param": JSON.stringify(param)}).then((response) => {
                    var tableData = [];
                    if(response.data.code===0){
                        Vue.http.headers.common['sign'] = response.data.sign;
                        if(response.data.data.rows){
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
                        }
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
            //每页显示条目改变时执行的函数
            handlePageSizeChange(val) {
                this.page_size = val;
                var param = {
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                    };
                this.fetchData(this.url, this.courseware_query_methodName, param);
            },
            //当前页面改变时执行的函数
            handleCurrentPageChange(val) {
                this.page_num = val;
                var param = {
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                    };
                this.fetchData(this.url, this.courseware_query_methodName, param);
            },
            //按课件名称搜索时执行的函数
            handleSearchCourseware(){
                var param = {
                        "courseware_name": this.inputVal,
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                    };
                this.fetchData(this.url, this.courseware_query_methodName, param);
            },
            //清空搜索框执行的函数
            handleClearCourseware(){
                this.inputVal = '';
            },
            //修改方法
            updataData(url, methodName, param){
                this.$http.post(url, {"methodName": methodName, "param": JSON.stringify(param)}).then((response) => {
                    var tableData = [];
                    if(response.data.code===0){
                        Vue.http.headers.common['sign'] = response.data.sign;
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
            //关联课件
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
            },
            selectAll(val) {
                this.multipleSelection = val;
                console.log(val)
            },
            handleLinkCourseware(){
                //禁用不可关联
                var activeCount = 0;
                this.multipleSelection.forEach(function (item, index, array) {
                    if(item.is_active == 'false'){
                        activeCount++;
                        console.log(activeCount)
                    }
                })

                if(activeCount == 0){
                    this.multipleSelectionAll = this.multipleSelectionAll.concat(this.multipleSelection);
                    this.$refs.multipleTable.clearSelection();
                }else{
                    alert('正在关联禁用课件,请重新选择')
                }
                // this.tableData = null;
                // this.tableData = this.tableData.concat(this.multipleSelectionAll);
                // this.multipleSelectionAll = this.multipleSelectionAll.concat(this.multipleSelection);
            },
            handle_link_change(val){
                this._multipleSelection = val;
            },
            handle_link_courseware_save(){
                var self = this,
                    param = {
                        "class_id": this.class_id,
                        "list": [

                        ]
                };
                // if(!this._multipleSelection) {
                //     alert('请选择课件')
                //     return;
                // };
                if(!this._multipleSelection || this._multipleSelection.length == 0){
                    this.$http.post(this.url, {"methodName": "sp_hc_class_courseware_save", "param": JSON.stringify(param)}).then((response) => {
                        if(response.data.code===0){
                            Vue.http.headers.common['sign'] = response.data.sign;
                            alert("课件保存成功")
                            self.$router.push({ path: '/course'})
                        }else{
                            this.$alert('不能选择相同的课件', '提示', {
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
                }else{
                    this._multipleSelection.forEach(function (item, index, array) {
                        param.list.push({"courseware_id": item.courseware_id});
                    })
                    this.$http.post(this.url, {"methodName": "sp_hc_class_courseware_save", "param": JSON.stringify(param)}).then((response) => {
                        if(response.data.code===0){
                            Vue.http.headers.common['sign'] = response.data.sign;
                            alert("课件保存成功")
                            self.$router.push({ path: '/course'})
                        }else{
                            this.$alert('不能选择相同的课件', '提示', {
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
            checkSelectable (row, index) {
                return row.is_active == 'true';
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
        },
        mounted(){
            var self = this;
            var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
            this.fetchData(this.url, this.courseware_query_methodName, param);

            //修改--拉取课程所关联的课件
            if(this.$route.query.class_id){
                this.class_id = this.$route.query.class_id;
                var param1 = {
                    "class_id": this.class_id
                };
                self.fetchData_with_id(this.url, this.class_courseware_query_methodName, param1, function (data) {
                    var multipleSelectionAll = [];
                    if(data){
                        data.forEach(function (item, index, Array) {
                            switch (item.courseware_resources_type){
                                case 'pic':
                                    item.courseware_resources_ctype = '图片';
                                    item.is_active = item.is_active ? "true" : "false";
                                    multipleSelectionAll.push(item);
                                    break;
                                case 'video':
                                    item.courseware_resources_ctype = '视频';
                                    item.resources_url = "https" + item.resources_url.substring(4);
                                    item.is_active = item.is_active ? "true" : "false";

                                    multipleSelectionAll.push(item);
                                    break;
                                case 'audio':
                                    item.courseware_resources_ctype = '音频';
                                    item.is_active = item.is_active ? "true" : "false";

                                    tableData.push(item);
                                    break;
                                default:
                                    item.courseware_resources_ctype = '未知';
                                    item.is_active = item.is_active ? "true" : "false";

                                    multipleSelectionAll.push(item);
                                    break;
                            }
                        })
                        self.multipleSelectionAll = multipleSelectionAll;
                    }
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
        padding-bottom: 35px;
    }
    .save_link_btn{
        position: relative;
        right: -460px;
        top: -30px;
    }
</style>