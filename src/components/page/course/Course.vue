<template>
    <div class="user-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="user-search">
            <div class="user-search-title">
                <p>查找课程</p>
            </div>
            <div>
                <span class="userId">课程名称: </span>
                <input v-model="class_name" placeholder="请输入课程名称" class="search-input"></input>
                <input v-model="doctor_name" placeholder="请输入医生名称" class="search-input"></input>
                <el-button @click='handle_search_courseware' type="primary" class="search-btn" size="mini">查找</el-button>
                <el-button @click='handle_clear_courseware'  type="primary" class="search-btn" size="mini">清空</el-button>
            </div>
        </div>
        <div class="banner-list"   v-if="class_group_id">
            <!--课件列表标题-->
            <div class="banner-list-title">
                <p class="banner-list-title-p">
                    <span>已关联 {{multipleSelectionAll.length}} 节课程</span>
                    <el-button  v-if="class_group_id" type="primary" size="mini" class="add-banner-btn" @click='handle_link_course_save'>保存</el-button>
                </p>
            </div>
            <!--课件列表内容-->
            <div class="user-list-table">
                <el-table
                        ref="multipleTables"
                        :data="multipleSelectionAll"
                        border
                        style="width: 100%"
                        @selection-change="_handleSelectionChange">
                    <el-table-column
                            v-if="class_group_id"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="class_id"
                            label="课程编号"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="class_name"
                            label="课程名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="doctor_name"
                            label="主讲医生"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="banner-list">
            <!--课件列表标题-->
            <div class="banner-list-title">
                <p class="banner-list-title-p">
                    <span>课程列表</span>
                    <el-button v-if="!class_group_id" type="primary" size="mini" class="add-banner-btn" @click='handle_add_course'>新增</el-button>
                    <el-button  v-if="class_group_id" type="primary" size="mini" class="add-banner-btn" @click='handle_link_course'>关联</el-button>
                </p>
            </div>
            <!--课件列表内容-->
            <div class="user-list-table">
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        border
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            v-if="class_group_id"
                            type="selection"
                            :selectable="checkSelectable"
                            disabled="true"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="class_id"
                            sortable
                            label="课程编号"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="class_name"
                            label="课程名称"
                            sortable
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="doctor_name"
                            label="主讲医生"
                            sortable
                            width="180">
                    </el-table-column>
                    <!--<el-table-column-->
                            <!--label="图片"-->
                            <!--width="80">-->
                        <!--<template scope="scope">-->
                            <!--<img   v-if="scope.row.courseware_resources_type == 'pic' "     :src="scope.row.resources_url" width="50" height="50"/>-->
                            <!--<video v-if="scope.row.courseware_resources_type == 'video' "   :src="scope.row.resources_url" width="250" height="200" controls>您的浏览器不支持播放该视频！</video>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                            <!--prop="create_time"-->
                            <!--label="上传时间"-->
                            <!--width="180">-->
                    <!--</el-table-column>-->
                    <el-table-column
                            prop="remark"
                            label="操作"
                            width="180">
                        <template slot-scope="scope">
                            <el-button
                                    @click='handle_update_course(scope.$index, tableData)'
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
            <!--课件列表导航条-->
            <div class="block user-list-panv">
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
        name: "course",
        data() {
            return {
                //请求接口
                url                                     : baseUrl()+'/comm',
                class_query_methodName                  : "sp_hc_class_query",
                class_self_update_methodName            : "sp_hc_class_self_update",
                class_group_class_query_methodName      : "sp_hc_class_group_class_query",

                inputVal: '',
                tableData: null,
                class_name: '',
                doctor_name: '',
                courseware_count:undefined,
                page_num: 1,
                page_size: 10,
                page_count: undefined,

                class_group_id: '',
                multipleSelectionAll: [],  //选中的所有课程
                multipleSelection: [],     //选中的课程
                _multipleSelection: [],     //确认选中的课程
                handle_select_change: []
            }
        },
        methods: {
            //增加课件
            handle_add_course(){
                this.$router.push('/addcourse');
            },

            //删除课件
            deleteRow(index, rows) {
                if(confirm("确定删除吗?")){
                    var self = this;
                    let param = {
                        "courseware_id": rows[index].courseware_id
                    };
                    this.$http.post(baseUrl()+'/comm', {"methodName":"sp_hc_banner_update","param": JSON.stringify(param)}).then((response) => {
                        if(response.data.code===0){
                            Vue.http.headers.common['sign'] = response.data.sign;
                            //删除腾讯云视频
                            var cos = new COS({
                                SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                                SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk',
                            })
                            var src_del = rows[index].resources_url.substring('70');
                            cos.deleteObject({
                                Bucket: 'wxapplet-1253887111',   /* 必须 */
                                Region: 'ap-beijing-1',         /* 必须 */
                                Key: src_del                            /* 必须 */
                            }, function(err, data) {
                                if(data.statusCode == 204){
                                    alert('删除成功');
                                }
                            });
                            rows.splice(index, 1);
                        }
                    });
                }
            },
            //编辑课程
            handle_update_course(index, tableData){
                // var storage = getLocalStorage();
                // storage.setItem('row', JSON.stringify(tableData[index]));
                this.$router.push('/addcourse?class_id=' + tableData[index].class_id);
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
            //修改课件
            editRow(index, rows){

            },
            //禁止使用
            changeSwitch(row){
                var param = {
                    "class_id": row.class_id,
                    "is_active": row.is_active == "true" ? 1 : 0
                };
                this.updataData(this.url, this.class_self_update_methodName, param);
            },
            //每页显示条目改变时执行的函数
            handlePageSizeChange(val) {
                this.page_size = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.fetchData(this.url, this.class_query_methodName, param);
            },
            //当前页面改变时执行的函数
            handleCurrentPageChange(val) {
                this.page_num = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.fetchData(this.url, this.class_query_methodName, param);
            },
            //按课件名称搜索时执行的函数
            handle_search_courseware(){
                var param = {
                    "class_name": this.class_name,
                    "doctor_name": this.doctor_name,
                };
                this.fetchData(this.url, this.class_query_methodName, param);
            },
            //清空搜索框执行的函数
            handle_clear_courseware(){
                this.class_name = '';
                this.doctor_name = '';
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            checkSelectable(row) {
                return row.is_active == 'true';
            },
            handle_link_course(){
                //禁用不可关联
                var activeCount = 0;
                this.multipleSelection.forEach(function (item, index, array) {
                    if(item.is_active == 'false'){
                        activeCount++;
                    }
                })

                if(activeCount == 0){
                    this.multipleSelectionAll = this.multipleSelectionAll.concat(this.multipleSelection);
                    this.$refs.multipleTable.clearSelection();
                }else{
                    alert('正在关联禁用课程,请重新选择')
                }
            },
            _handleSelectionChange(val){
                this._multipleSelection = val;
            },
            handle_link_course_save(){
                var self = this,
                    param = {
                    "class_group_id": this.class_group_id,
                    "list": [

                    ]
                };
                if(!this._multipleSelection){
                    alert('请选择需要关联的课程')
                }else if(this._multipleSelection.length > 10){
                    alert('关联课程不能超过10节');
                    return
                }else if(this._multipleSelection.length < 2){
                    alert('关联课程不能少于2节');
                    return;
                }else {
                    this._multipleSelection.forEach(function (item, index, array) {
                        param.list.push({"class_id": item.class_id});
                    })
                    this.$http.post(this.url, {"methodName": "sp_hc_class_group_class_save", "param": JSON.stringify(param)}).then((response) => {
                        if(response.data.code===0){
                            Vue.http.headers.common['sign'] = response.data.sign;
                            alert("添加成功")

                            // self.$router.push('/courses');
                            self.$router.push({ path: '/selecteddoctor', query: { 'class_group_id': self.class_group_id } })
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
            //根据id查询条目
            fetchData_with_id(url, methodName, param, callback){
                this.$http.post(url, {"methodName": methodName, "param": JSON.stringify(param)}).then((res) => {
                    if(res.data.code == 0){
                        Vue.http.headers.common['sign'] = res.data.sign;
                        callback(res.data.data);
                    }
                })
            }
        },
        mounted(){
            var self = this,

                //查询课程
                param = {
                "page_num": this.page_num,
                "page_size": this.page_size,
            };
            handleData.fetchData(this, this.url, this.class_query_methodName, param, function (data) {
                if(data.rows){
                    var tableData = [];
                    data.rows.forEach(function (item, index, Array) {
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
                    self.tableData = tableData;
                    self.courseware_count = data.total_num;
                }
            })

            //编辑时获取关联的课程
            if(this.$route.query.class_group_id){
                var _param = {
                    class_group_id: this.$route.query.class_group_id
                };
                this.class_group_id = this.$route.query.class_group_id;
                //套课关联课程查询
                this.fetchData_with_id(this.url, this.class_group_class_query_methodName, _param, function(data){
                    if(data){
                        self.multipleSelectionAll = data;
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
        padding-bottom: 40px;
        background: #fff;
        overflow: hidden;
    }
    .banner-list-title{
        padding: 15px 0 15px 0;
    }
    .banner-list-title-p{
        overflow: hidden;
    }
    .add-banner-btn{
        float: right;
    }
    .user-list-table{
        margin-bottom: 15px;
    }
    .user-list-panv{
        float: left;
        padding-bottom: 35px;
    }
</style>