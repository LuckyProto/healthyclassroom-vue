<template>
    <div class="user-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!--课件列表-->
        <div class="banner-list">
            <!--课件列表标题-->
            <div class="banner-list-title">
                <p class="banner-list-title-p">
                    <span>订单列表</span>
                </p>
            </div>
            <!--课件列表内容-->
            <div class="user-list-table" v-if="tableData">
                <div>
                    <el-table
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%">
                        <el-table-column
                                label="订单ID"
                                width="80">
                            <template slot-scope="scope">{{ scope.row.order_id }}</template>
                        </el-table-column>
                        <el-table-column
                                label="微信订单编号"
                                width="180">
                            <template slot-scope="scope">{{ scope.row.order_no }}</template>
                        </el-table-column>
                        <el-table-column
                                label="UID"
                                width="180">
                            <template slot-scope="scope">{{ scope.row.cname }}</template>
                        </el-table-column>
                        <el-table-column
                                label="购买时间"
                                show-overflow-tooltip>
                            <template slot-scope="scope">{{ scope.row.create_time }}</template>
                        </el-table-column>
                        <el-table-column
                                label="购买途径"
                                show-overflow-tooltip>
                            <template slot-scope="scope">{{ scope.row.pay_source }}</template>
                        </el-table-column>
                        <el-table-column
                                label="价格"
                                show-overflow-tooltip>
                            <template slot-scope="scope">{{ scope.row.price }}</template>
                        </el-table-column>
                    </el-table>
                </div>
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
    import fetch from "../../../utilis/handle_data";
    export default {
        name: "order",
        data(){
            return{
                //请求接口
                url                                 : baseUrl()+'/comm',
                order_query_methodName              :'sp_hc_order_query',
                order_backstage_query_methodName    :'sp_hc_order_backstage_query',

                //表格所需数据
                tableData       : null,

                //分页条所需数据
                page_num        : 1,
                page_size       : 10,
                total_num       :undefined
            }
        },
        methods: {
            //每页显示条目改变时执行的函数
            handlePageSizeChange(val) {
                var self = this;
                this.page_size = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                fetch.fetchData(this, this.url, this.order_backstage_query_methodName, param, function (data) {
                    self.tableData = data.rows;
                    self.total_num = data.total_num;
                });
            },
            //当前页面改变时执行的函数
            handleCurrentPageChange(val) {
                var self = this;
                this.page_num = val;
                var param = {
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                fetch.fetchData(this, this.url, this.order_backstage_query_methodName, param, function (data) {
                    self.tableData = data.rows;
                    self.total_num = data.total_num;
                });
            }
        },
        mounted(){
            var self = this,
                param = {
                "page_num": this.page_num,
                "page_size": this.page_size,
            };
            fetch.fetchData(this, this.url, this.order_backstage_query_methodName, param, function (data) {
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