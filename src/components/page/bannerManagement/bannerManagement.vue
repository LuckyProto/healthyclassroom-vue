<template>
    <div class="banner-management-wraper">
        <div class="breakCrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                <el-breadcrumb-item>banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="banner-list">
            <!--用户列表标题-->
            <div class="banner-list-title">
                <p class="banner-list-title-p">
                    <span>banner列表</span>
                    <el-button type="primary" size="mini" class="addBannerBtn" @click='handle_click($event)' id="add_banner_btn">新增</el-button>
                </p>
            </div>
            <!--轮播图内容-->
            <div class="banner-list-table">
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="banner_id"
                            label="编号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            label="图片"
                            width="180">
                        <template scope="scope">
                            <img :src="scope.row.resources_url" width="50" height="50"/>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="target"
                            label="关联链接"
                            width="180">
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
                                @click.native.prevent="deleteRow(scope.$index, tableData)"
                                type="text"
                                size="small">
                            移除
                        </el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--用户列表导航条-->
            <!--<div class="block banner-list-panv">-->
                <!--<el-pagination-->
                        <!--@size-change="handleSizeChange"-->
                        <!--@current-change="handleCurrentChange"-->
                        <!--:page-sizes="[10, 20, 30, 40]"-->
                        <!--:page-size="page_size"-->
                        <!--layout="total, sizes, prev, pager, next, jumper"-->
                        <!--:total="bannerCount">-->
                <!--</el-pagination>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {baseUrl} from "../../../utilis/common.js";
    import {getLocalStorage}        from "../../../utilis/common.js";
    import {handel_fetchData_query, handle_del_qcload} from "../../../utilis/handle_data.js";

    export default {
        name: "banner-management",
        data() {
            return {
                /*请求接口*/
                url: baseUrl() + '/comm',
                banner_query_methodName: 'sp_hc_banner_query',
                banner_update_methodName: 'sp_hc_banner_update',

                /*初次请求及分页条参数*/
                page_num: 1,
                page_size: 10,

                /*表格数据*/
                tableData: null,
                bannerCount:undefined
            }
        },
        computed: {
            returnDis: function () {
                // `this` 指向 vm 实例
                if(this.bannerCount >= 5){
                    return true;
                }else{
                    return false;
                }
            }
        },
        mounted(){
            var self = this,
                storage = getLocalStorage(),
                param = {
                    "page_num"   : this.page_num,
                    "page_size"  : this.page_size,
                };
            /*查询所有数据*/
            this.handle_data.fetchData(this, this.url, this.banner_query_methodName, param, function (data) {
                self.tableData = data.rows;
                self.bannerCount = data.total_num;
                storage.setItem("total_num", data.total_num);
            })
        },
        methods: {
            handle_click(e){
                var btn_id = e.target.id;
                switch (btn_id){
                    /*增加banner图*/
                    case "add_banner_btn":
                        if(this.bannerCount >= 5) {
                            alert('最多选择5张图片')
                            return;
                        }
                        this.$router.push('/addBannerManagement');
                        break;
                    default:
                        break;
                }
            },
            deleteRow(index, rows) {
                if(confirm("确定删除吗?")){
                    var self = this;
                    var storage = getLocalStorage();
                    let param = {
                        "banner_id": rows[index].banner_id,
                        "delete_flag": 1,
                    };
                    this.handle_data.deleteData(this, this.url, this.banner_update_methodName, param, function (data) {
                        var src_del = rows[index].resources_url.substring('70');
                        self.handle_data.deleteQcload('upload_image', src_del, function (data) {
                            rows.splice(index, 1);
                            self.bannerCount = self.bannerCount - 1;
                            storage.setItem("total_num", self.bannerCount);
                            alert('删除成功');
                        })
                    })
                }
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
</style>