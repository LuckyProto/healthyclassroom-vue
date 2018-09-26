<template>
    <div class="user-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="user-search">
            <div class="user-search-title">
                <p>用户查找</p>
            </div>
            <div>
                <span class="userId">用户姓名: </span>
                <input v-model="inputVal" placeholder="请输入用户姓名" class="search-input"></input>
                <el-button @click='handleSearch'    type="primary" class="search-btn" size="mini">查找</el-button>
                <el-button @click='handleClearBtn'  type="primary" class="search-btn" size="mini">清空</el-button>
            </div>
        </div>
        <div class="user-list">
            <!--用户列表标题-->
            <div class="user-list-title">
                <p>用户列表</p>
            </div>
            <!--用户列表内容-->
            <div class="user-list-table">
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="credential_id"
                            label="用户ID"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="cname"
                            label="UID"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="csource"
                            label="登录方式"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="create_time"
                            label="登录时间"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="说明"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
            <!--用户列表导航条-->
            <div class="block user-list-panv">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="page_size"
                    :current-page.sync="page_num"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total_num">
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
        name: "user-management",
        data() {
            return {
                //请求接口
                url             : baseUrl()+'/comm',
                credential_query_methodName   :'sp_hc_credential_query',    //用户

                //搜索用
                inputVal        : '',

                //表格数据
                tableData       : null,

                //分页条数据
                page_num        : 1,
                page_size       : 10,
                total_num       :undefined
            }
        },
        methods: {
            handleSizeChange(val) {
                var self = this;
                this.page_size = val;
                let param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                handleData.fetchData(this, this.url, this.credential_query_methodName, param, function (data) {
                    self.tableData = data.rows;
                    self.total_num = data.total_num;
                });
            },
            handleCurrentChange(val) {
                let self = this;
                this.page_num = val;
                let param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                handleData.fetchData(this, this.url, this.credential_query_methodName, param, function (data) {
                    self.tableData = data.rows;
                    self.total_num = data.total_num;
                });
            },
            handleSearch(){
                var self = this,
                    param = {
                    search: this.inputVal
                }
                handleData.fetchData(this, this.url, this.credential_query_methodName, param, function (data) {
                    self.tableData = data.rows;
                    self.total_num = data.total_num;
                });
            },
            handleClearBtn(){
                this.inputVal = '';
            }
        },
        mounted(){
            var self = this,
                param = {
                "page_num": this.page_num,
                "page_size": this.page_size,
            };
            handleData.fetchData(this, this.url, this.credential_query_methodName, param, function (data) {
                self.tableData = data.rows;
                self.total_num = data.total_num;
            });
        }
    }
</script>

<style scoped>
    .user-management-wraper{
        width: 100%;
    }
    .breakCrumb{
        height: 20px;
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
    .user-list{
        padding-left: 15px;
        background: #fff;
        overflow: hidden;
    }
    .user-list-title{
        padding: 15px 0 15px 0;
    }
    .user-list-table{
        margin-bottom: 15px;
    }
    .user-list-panv{
        float: left;
        padding-bottom: 35px;
    }
</style>