<template>
    <div class="PurchaseOrder content_inner">
        <div v-show="FrimShow" >
            <div class="classify"><h4 class="title">采购审核</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <span class="ml20">审核日期 ：</span>
                    <el-date-picker
                        v-model="form.ApproveDate"
                        type="date"
                        size="small"
                        id="StartDate"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        @change="ChangeDate"
                        placeholder="选择日期" style="width:175px;margin-right: 20px" >
                    </el-date-picker>
                    <el-radio-group v-model="Status" @change="ChangeRadio">
                        <el-radio :label="1">已通过</el-radio>
                        <el-radio :label="9">未通过</el-radio>
                        <el-radio :label="2">待处理</el-radio>
                    </el-radio-group>
                    <div style="float:right;margin-bottom:8px;">

                        <span class="ml20">采购类型 ：</span>
                        <el-select  v-model="s_purchase_type" style="width:115px" size="small" @change="GetData">
                            <el-option
                                key="all"
                                label="全部"
                                value="all">
                            </el-option>
                            <el-option
                                key="1"
                                label="日常"
                                value="1">
                            </el-option>
                            <el-option
                                key="2"
                                label="急采"
                                value="2">
                            </el-option>
                            <el-option
                                key="3"
                                label="临时"
                                value="3">
                            </el-option>
                        </el-select>
                        <el-input class="search ml20"  placeholder="编号/名称" v-model="searchInput" size="small" @keyup.native="Search">
                            <el-button slot="append" icon="el-icon-search" size="small" @click="GetData"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table :data="table.TableData"  style="width: 100%;" :height="GridTableHeight" class="GridTable" v-loading="GridLoading" >
                    <el-table-column label="单号" min-width="110" prop="buss_no" sortable>
                    </el-table-column>
                    <el-table-column label="部门" min-width="120" prop="department_name" sortable>
                    </el-table-column>
                    <el-table-column label="申请人" min-width="120" prop="credential_name" sortable>
                    </el-table-column>
                    <el-table-column label="采购类型" min-width="120" prop="purchase_type_name" sortable>
                    </el-table-column>
                    <el-table-column label="备注" min-width="220" prop="purchase_remark" sortable>
                    </el-table-column>
                    <el-table-column label="操作" min-width="80">
                        <template slot-scope="scope">
                            <el-button type="primary"  plain size="mini" @click="handleEdit(scope.$index, scope.row)">编辑审核</el-button>
                        </template>
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
        <div class="Form" v-show="FormShow">
            <div class="classify"><h4 class="title">采购审核</h4>
                <el-row :gutter="1" class="baseinfo" style="margin-bottom: -8px">
                    <el-col :span="5" >
                        <span class="base-label">部门：</span>
                        <el-input readonly="readonly" v-model="form.department_name"  size="small" style="width:110px;"  >
                        </el-input>
                    </el-col>
                    <el-col :span="5" >
                        <span class="base-label">申请人：</span>
                        <el-input readonly="readonly" v-model="form.credential_name"  size="small" style="width:110px;"  >
                        </el-input>
                    </el-col>
                    <el-col :span="5">
                        <span class="base-label">采购类型：</span>
                        <el-select readonly="readonly" v-model="form.purchase_type" style="width:110px" size="small"  id="purchase_type">
                            <el-option
                                key="1"
                                label="日常"
                                value="1">
                            </el-option>
                            <el-option
                                key="2"
                                label="急采"
                                value="2">
                            </el-option>
                            <el-option
                                key="3"
                                label="临时"
                                value="3">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="9">
                        <span class="base-label">备注：</span>
                        <el-input readonly="readonly" v-model="form.purchase_remark" style="width:300px" size="small">
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <el-table ref="multipleTable"
                tooltip-effect="dark"
                :data="tableData"
                style="width: 100%;"
                :height="TableHeight"
                v-loading="GridLoading"
                @select="RowClick"
                @select-all="CheckRowAll">
                <el-table-column type="selection" width="55" >
                </el-table-column>
                <el-table-column label="名称" width="260" prop="name" sortable>
                </el-table-column>
                <el-table-column label="库存余量" min-width="90" prop="actual_retail_num">
                </el-table-column>
                <el-table-column label="采购数量" min-width="90" prop="purchase_num">
                </el-table-column>
                <el-table-column label="采购单位" min-width="90" prop="purchase_unit">
                </el-table-column>
                <el-table-column label="采购预算(元)" min-width="90" prop="purchase_price" sortable>
                </el-table-column>
                <el-table-column label="审批状态" min-width="90" prop="approve_status_name">
                </el-table-column>
                <el-table-column label="审批备注" min-width="300" prop="approve_remark" sortable>
                    <template slot-scope="scope">
                        <el-input size="mini" @blur="SaveRemark(null, scope.row)" v-model="scope.row.approve_remark">
                        </el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div style="float:left;margin:10px;width:50%;">
                <el-input  size="small" v-model="form.order_remark" style="width:100%" placeholder="填写采购单审核批注">
                </el-input>
            </div>
            <div class="category_btn" >
                <el-button  class="add" plain  @click="AuthorityCancel">返回</el-button>
                <el-button type="primary" v-bind:disabled="EditDisable" class="add" @click="SubmitPurchase(1)">通过</el-button>
                <el-button type="danger" v-bind:disabled="EditDisable" plain class="add" @click="SubmitPurchase(2)">不通过</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {CurrentDate} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {StrTrim} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import {tableRequest} from "../../../utilis/common.js";
    import Vue from 'vue';
    let storage = getLocalStorage();
    let departmentList=storage.getItem("departmentList");
    let credential_id=storage.getItem("credential_id");
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "purchase-audit",
        data() {
            return {
                FrimShow:true,
                FormShow:false,
                searchInput:"",
                GridTableHeight:"448",             //表格最大高度
                TableHeight:"455",
                s_purchase_type:"all",
                tableData:[],
                department:[],   //部门数据
                form:{
                    "credential_id":credential_id,
                    "ApproveDate":""
                },
                table:{
                    TableData:[],
                    total_num:0,
                    pagination:"total, sizes, prev, pager, next"
                },
                page_num:1,
                page_size:10,
                GridLoading:false,
                checkAll:0,
                Status:2,
                EditDisable:false

            }
        },
        methods:{
            GetData(){
                let temp;
                temp = this.Status;
                if(this.Status===2){
                    temp=0;
                }
                if(this.Status===2){
                    this.form.ApproveDate="";
                    Vue.set(this.form, 'ApproveDate',undefined);
                }
                //获取表格数据
                let param = {
                    "search":this.searchInput,
                    "s_purchase_type": this.s_purchase_type,
                    "s_approve_status":temp,
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                    "hospital_id":hospital_id,
                    "ApproveDate":this.form.ApproveDate,
                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_purchase_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.table=tableRequest(response.body,this.page_size);
                        if(this.table.TableData)
                            for(let i=0;i<this.table.TableData.length;i++){
                                switch (this.table.TableData[i].purchase_type){
                                    case 1:
                                        this.table.TableData[i].purchase_type_name="日常";
                                        break;
                                    case 2:
                                        this.table.TableData[i].purchase_type_name="急采";
                                        break;
                                    case 3:
                                        this.table.TableData[i].purchase_type_name="临时";
                                        break;
                                    default:
                                        return false;
                                }
                                if(this.table.TableData[i].approve_status!=null)
                                    switch (this.table.TableData[i].approve_status){
                                        case 0:
                                            this.table.TableData[i].approve_status_name="待审批";
                                            break;
                                        case 1:
                                            this.table.TableData[i].approve_status_name="通过";
                                            break;
                                        case 2:
                                            this.table.TableData[i].approve_status_name="打回";
                                            break;
                                        case 3:
                                            this.table.TableData[i].approve_status_name="已收货";
                                            break;
                                        case 4:
                                            this.table.TableData[i].approve_status_name="待提交";
                                            break;
                                        case 9:
                                            this.table.TableData[i].approve_status_name="未通过";
                                            break;
                                        default:
                                            return false;
                                    }
                            }
                    }
                    this.GridLoading = false;
                });
            },
            GetDetailData(){
                //获取表格数据
                let param={
                    "purchase_id":this.form.purchase_id,
                    "hospital_id":hospital_id,
                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_purchase_detail_query",
                    "param":JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.tableData=response.body.data;
                        this.$nextTick(function(){
                            this.checked();//每次更新了数据，触发这个函数即可。
                        });
                        if(this.tableData)
                            for(let i=0;i<this.tableData.length;i++){
                                if(this.tableData[i].approve_status!=null)
                                    switch (this.tableData[i].approve_status){
                                        case 0:
                                            this.tableData[i].approve_status_name="待审批";
                                            break;
                                        case 1:
                                            this.tableData[i].approve_status_name="通过";
                                            break;
                                        case 2:
                                            this.tableData[i].approve_status_name="不通过";
                                            break;
                                        case 3:
                                            this.tableData[i].approve_status_name="已收货";
                                            break;
                                        case 4:
                                            this.tableData[i].approve_status_name="待提交";
                                            break;
                                        default:
                                            return false;
                                    }
                                this.form.purchase_type=this.tableData[0].purchase_type.toString();
                                this.form.department_name=this.tableData[0].department_name;
                                this.form.purchase_remark=this.tableData[0].purchase_remark;
                                this.form.credential_name=this.tableData[0].credential_name;

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
            ChangeRadio(){
                if(this.Status===2){
                    this.form.ApproveDate="";
                    Vue.set(this.form, 'ApproveDate',undefined);
                }
                this.GetData();
            },
            ChangeDate(){
                if(this.Status===2)
                this.Status=1;
                this.GetData();
            },
            checked(){
                this.tableData.forEach(row => {
                    if(row.approve_status===1)
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            },
            handleEdit(index,row){
                this.tableData=[];
                this.FrimShow=false;
                this.FormShow=true;
                this.form.purchase_id=row.purchase_id;
                this.form.approve_status=row.approve_status;
                this.GetDetailData();
                this.disabled(row.approve_status)

            },
            AuthorityCancel(){
                //返回
                this.FrimShow=true;
                this.FormShow=false;
                this.GetData();
            },
            handleSizeChange(val) {
                this.page_size=val;
                this.GetData();
            },
            handleCurrentChange(val) {
                this.page_num=val;
                this.GetData();
            },
            RowClick(selection,row){
            if(this.form.approve_status!==0){
                this.GetDetailData();
                return;
            }
                this.checkAll=2;
             if(row.approve_status===0 || row.approve_status===2){
                 row.approve_status=1
             }else if(row.approve_status===1){
                 row.approve_status=2
             }
                let param={
                    "purchase_id":row.purchase_id,
                    "purchase_detail_id":row.purchase_detail_id,
                    "approve_status":row.approve_status,
                    "approve_credential_id":credential_id,
                    "approve_date":this.form.approve_date,
                    "approve_remark":row.approve_remark,
                    "checkAll":this.checkAll
                };
               // this.GridLoading = true;

                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_purchase_detail_approve_status",
                    "param":JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)){
                       this.GetDetailData();
                    }
                   this.GridLoading = false;
                });
            },
            SaveRemark(selection,row){
                let param={
                    "purchase_id":row.purchase_id,
                    "purchase_detail_id":row.purchase_detail_id,
                    "approve_remark":row.approve_remark,
                    "checkAll":2
                };

                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_purchase_detail_approve_status",
                    "param":JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)){
                       // this.GetDetailData();
                    }
                });
            },
            CheckRowAll(selection) {
                if(this.form.approve_status!==0){
                    this.GetDetailData();
                    return;
                }
                let purchase_approve_status;
                if (selection.length > 0) {
                    this.checkAll = 1;
                    purchase_approve_status=1;
                }else if(selection.length===0){
                    this.checkAll = 0;
                    purchase_approve_status=2;
                }
                this.tableData.forEach(row => {
                    row.approve_status=purchase_approve_status;
                    row.approve_credential_id=credential_id;
                    row.approve_date=this.form.approve_date;
                });

                let param={
                    "purchase_detail":this.tableData

                };
                this.GridLoading = true;

                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_purchase_detail_approve_status",
                    "param":JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this))
                        this.GetDetailData();
                    this.GridLoading = false;
                });
            },
            SubmitPurchase(val){
                let purchase_approve;
                let flag=false;
                let msg;
                if(val===1) {
                    purchase_approve = 1;
                    msg = "审核通过成功！";
                }else{
                    purchase_approve=9;
                    msg="审核不通过成功！";
                }
                this.tableData.forEach(row => {
                   if(row.approve_status===1)
                       flag=true;
                });

                if(flag){
                    let param={
                        "purchase_id":this.form.purchase_id,
                        "approve_status":purchase_approve,
                        "approve_credential_id":credential_id,
                        "approve_date":this.form.approve_date,
                        "order_remark":this.form.order_remark
                    };
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_purchase_approve_status",
                        "param":JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.$alert(msg, '提示', {
                                confirmButtonText: '确定',
                            });
                            this.AuthorityCancel();
                        }
                    });
                }else{
                    this.$alert("请先勾选采购单！", '提示', {
                        confirmButtonText: '确定',
                    });
                }
            },
            disabled(status){
                switch (status){
                    case 0:
                        this.EditDisable=false;
                        break;
                    case 1:
                        this.EditDisable=true;
                        break;
                    case 2:
                        this.EditDisable=true;
                        break;
                    case 3:
                        this.EditDisable=true;
                        break;
                    case 4:
                        this.EditDisable=true;
                        break;
                    case 9:
                        this.EditDisable=true;
                        break;
                    default:
                        return false;
                }
            },

        },
        mounted() {
            Vue.set(this.form, 'approve_date', CurrentDate());
            this.form.receiving_date=CurrentDate();
            this.GetData();
            this.TableHeight=($(window).height())-60-($(".classify").height())-177;
            this.GridTableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
            window.onresize  = () => {
                this.TableHeight=($(window).height())-60-($(".classify").height())-177;
                this.GridTableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
            };
        }
    }
</script>

<style scoped>
    .el-table .success-row {
        background: #f0f9eb;
    }
    .From{
        position:relative;
        height:100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .tab_content{
        padding:8px 10px 0 9px;
    }
    .add{
        width:90px;
        height:30px;
        line-height:0;
    }
    .table{
        border-top:1px solid #ccc;
        margin-top: 10px;
    }
    .baseinfo{
        padding: 10px 0 5px 5px;
    }
    .base-label{
        width: 70px;
        display: inline-block;
        text-align: right;
    }
    .category_btn{
        float:right;
        margin:10px 10px;
        overflow: hidden;
    }
    .search{
        width:215px;
    }
    .ml20{
        margin-left: 20px;
    }
    .GridTable{
        border-top:1px solid #ccc;
        margin-top: 10px;
    }
</style>
