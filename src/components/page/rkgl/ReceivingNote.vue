<template>
    <div class="ReceivingNote content_inner">
        <div class="Form">
            <div class="classify"><h4 class="title">收货查询</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <span class="base-label">收货日期：</span>
                    <el-date-picker
                        v-model="SearchDate"
                        type="daterange"
                        align="left"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        end-placeholder="结束日期" size="small" @change="GetData">
                    </el-date-picker>
                    <span class="base-label">状态：</span>
                    <el-select  v-model="status" style="width:115px" size="small" @change="GetData">
                        <el-option
                            key="all"
                            label="全部"
                            value="all">
                        </el-option>
                        <el-option
                            key="0"
                            label="已收货"
                            value="0">
                        </el-option>
                        <el-option
                            key="1"
                            label="已入库"
                            value="1">
                        </el-option>

                    </el-select>
                    <div style="float:right;margin-bottom: 8px;">
                        <el-input class="search ml20"  placeholder="收货单号" v-model="searchInput" size="small" @keyup.native="Search">
                            <el-button slot="append" icon="el-icon-search" size="small" @click="GetData"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table  :data="table.TableData"  style="width: 100%;" :height="TableHeight" class="GridTable" v-loading="GridLoading" >
                    <el-table-column label="收货单号" min-width="160" prop="buss_no" sortable>
                    </el-table-column>
                    <el-table-column label="名称" min-width="240" prop="goods_name" sortable>
                    </el-table-column>
                    <el-table-column label="收货数量" min-width="100" prop="actual_num" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="进货价格" min-width="100" prop="receiving_price" sortable>
                    </el-table-column>
                    <el-table-column label="收货单位" min-width="100" prop="receiving_unit" sortable>
                    </el-table-column>
                    <el-table-column label="发票号" min-width="100" prop="invoice" sortable>
                    </el-table-column>
                    <el-table-column label="收货人" min-width="100" prop="receiving_credential_name" sortable>
                    </el-table-column>
                    <el-table-column label="收货日期" min-width="110" prop="receiving_date" sortable>
                    </el-table-column>
                    <el-table-column label="状态" min-width="80" prop="status_name" sortable>
                    </el-table-column>
                    <el-table-column label="备注" min-width="240" prop="remark" sortable show-overflow-tooltip>
                    </el-table-column>
                </el-table>
                <div class="pagination" >
                    <el-pagination style="height:15px;margin-top: -12px"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :page-sizes="[10, 20, 30, 40]"
                                   :page-size="page_size"
                                   :layout="table.pagination"
                                   :total="table.total_num">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {tableRequest} from "../../../utilis/common.js";
    import {StrTrim} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import {CurrentDate} from "../../../utilis/common.js";

    import Vue from 'vue';
    let storage = getLocalStorage();
    let departmentList=storage.getItem("departmentList");
    let credential_id=storage.getItem("credential_id");
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "receiving-note",
        data() {
            return {
                TableHeight:"448",               //表格最大高度
                searchInput:"",
                table:{
                    TableData:[],
                    total_num:0,
                    pagination:"total, sizes, prev, pager, next"
                },
                GridLoading:false,
                SearchDate:"",
                StartDate:undefined,
                EndDate:undefined,
                page_num:1,
                page_size:10,
                status:"all"

            }
        },
        methods:{
            GetData(){
               if(this.SearchDate) {
                   this.StartDate = this.SearchDate[0];
                   this.EndDate = this.SearchDate[1];
               }else{
                   this.StartDate=undefined;
                   this.EndDate = undefined
               }
                //获取表格数据
                let param = {
                    "search":this.searchInput,
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                    "hospital_id":hospital_id,
                    "StartDate":this.StartDate,
                    "EndDate":this.EndDate,
                    "status":this.status
                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_receiving_report",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.table=tableRequest(response.body,this.page_size);
                        if(this.table.TableData){
                            for(let i=0;i<this.table.TableData.length;i++){
                                switch (this.table.TableData[i].receiving_status){
                                    case 0:
                                        this.table.TableData[i].status_name="已收货";
                                        break;
                                    case 1:
                                        this.table.TableData[i].status_name="已入库";
                                        break;

                                    default:
                                        return false;
                                }

                            }
                        }

                    }
                    this.GridLoading = false;
                });
            },
            Search(){
                if(this.searchInput===""){
                    this.GetData();
                }
            },
            handleSizeChange(val) {
                this.page_size=val;
                this.GetData();
            },
            handleCurrentChange(val) {
                this.page_num=val;
                this.GetData();
            },
        },
        mounted() {
            this.GetData();
            this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
            window.onresize  = () => {
                this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
            };
        }
    }
</script>

<style scoped>
    .tab_content{
        padding:8px 10px 0 9px;
    }
    .baseinfo{
        padding: 10px 0 5px 5px;
    }
    .base-label{
        width: 90px;
        display: inline-block;
        text-align: right;
    }
    .base-label-cn{
        width: 80px;
        display: inline-block;
        text-align: right;
    }

    .add{
        width:90px;
        height:30px;
        line-height:0;
    }
    .ml20{
        margin-left: 20px;
    }
    .search{
        width:215px;
    }
    .category_btn{
        float:right;
        margin:10px 10px;
        overflow: hidden;
    }
    .GridTable{
        border-top:1px solid #ccc;
        margin-top: 10px;
    }
</style>
