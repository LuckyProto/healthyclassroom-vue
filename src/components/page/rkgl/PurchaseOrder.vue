<template>
    <div class="PurchaseOrder content_inner">
        <div v-show="FrimShow" >
            <div class="classify"><h4 class="title">采购申请</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <el-button type="primary" class="add" style="width:113px" @click="AddForm">新增采购单</el-button>
                    <span class="base-label">申请日期：</span>
                    <el-date-picker
                        v-model="form.StartDate"
                        type="date"
                        size="small"
                        id="StartDate"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        @change="GetData"
                        placeholder="选择日期" style="width:175px;" >
                    </el-date-picker>
                    <div style="float:right">
                        <span class="ml20">审批状态 ：</span>
                        <el-select  v-model="s_approve_status" style="width:115px" size="small" @change="GetData">
                            <el-option
                                key="all"
                                label="全部"
                                value="all">
                            </el-option>
                            <el-option
                                key="4"
                                label="待提交"
                                value="4">
                            </el-option>
                            <el-option
                                key="0"
                                label="待审批"
                                value="0">
                            </el-option>
                            <el-option
                                key="1"
                                label="通过"
                                value="1">
                            </el-option>
                            <el-option
                                key="2"
                                label="退回"
                                value="2">
                            </el-option>
                            <el-option
                                key="3"
                                label="已收货"
                                value="3">
                            </el-option>
                            <el-option
                                key="9"
                                label="未通过"
                                value="9">
                            </el-option>
                        </el-select>
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
                    <el-table-column label="部门" min-width="100" prop="department_name" sortable>
                    </el-table-column>
                    <el-table-column label="申请人" min-width="100" prop="credential_name" sortable>
                    </el-table-column>
                    <el-table-column label="采购类型" min-width="100" prop="purchase_type_name" sortable>
                    </el-table-column>
                    <el-table-column label="备注" min-width="90" prop="purchase_remark"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="审批状态" min-width="100" prop="approve_status_name" sortable>
                    </el-table-column>
                    <el-table-column label="审批日期" min-width="100" prop="approve_date" sortable>
                    </el-table-column>
                    <el-table-column label="审批人" min-width="100" prop="approve_credential_name" sortable>
                    </el-table-column>
                    <el-table-column label="审批备注" min-width="130" prop="approve_remark" >
                    </el-table-column>
                    <el-table-column label="操作" min-width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" plain @click="DelPurchase(scope.$index, scope.row)">删除</el-button>
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
            <div class="classify"><h4 class="title">采购单</h4>
                <el-row :gutter="1" class="baseinfo" style="margin-bottom: -8px">
                    <el-col :span="6" >
                        <span class="base-label"><span class="required">* </span>使用部门：</span>
                        <el-select  v-model="form.department_id" filterable size="small" style="width:139px;"  v-bind:disabled="departmentDisable" id="department_id" @focus="InputCss('department_id')">
                            <el-option
                                v-for="item in department"
                                :key="item.department_id"
                                :label="item.department_name"
                                v-bind:disabled="EditDisable"
                                :value="item.department_id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label"><span class="required">* </span>采购类型：</span>
                        <el-select  v-model="form.purchase_type" style="width:139px" size="small" v-bind:disabled="PurchaseTypeDisable" id="purchase_type"  @focus="InputCss('purchase_type')">
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
                    <el-col :span="10">
                        <span class="base-label">备注：</span>
                        <el-input  v-model="form.purchase_remark" style="width:340px" size="small" v-bind:disabled="PurchaseTypeDisable" id="purchase_remark">
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div id="baseinfo" style="border-bottom: 1px solid #dfdfdf;padding-bottom: 5px;">
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="10">
                    <span>采购明细</span><span class="base-label"><span class="required">* </span>物品类型：</span>
                        <el-select  v-model="form.goods_type" style="width:139px" size="small" v-bind:disabled="PurchaseTypeDisable">
                        <el-option
                            key="0"
                            label="西药"
                            value="0">
                        </el-option>
                        <el-option
                            key="1"
                            label="中药"
                            value="1">
                        </el-option>
                        <el-option
                            key="2"
                            label="材料"
                            value="2">
                        </el-option>
                    </el-select>
                    </el-col>
                    <el-col :span="12">
                        <span class="base-label"><span class="required">* </span>名称：</span>
                        <el-autocomplete
                            clearable
                            v-model="form.name"
                            v-bind:disabled="EditDisable"
                            :fetch-suggestions="querySearchDrug"
                            placeholder="请输入内容"
                            @select="GetBase"
                            @focus="InputCss('name')"
                            id="name"
                            size="small" style="width:340px;">
                        </el-autocomplete>
                        <!--<el-select-->
                            <!--v-bind:disabled="EditDisable"-->
                            <!--filterable-->
                            <!--remote reserve-keyword-->
                            <!--placeholder="编码/名称"-->
                            <!--:remote-method="querySearchDrug"-->
                            <!--:loading="SelectLoading"-->
                            <!--id="drug_product_name"-->
                            <!--v-model="form.drug_product_name"-->
                            <!--size="small"-->
                            <!--style="width:340px;"-->
                            <!--@focus="InputCss('drug_product_name')"-->
                            <!--@change="GetBase">-->
                            <!--<el-option-->
                                <!--v-for="item in DrugCatgory"-->
                                <!--:key="item.drug_product_id"-->
                                <!--:label="item.name"-->
                                <!--:value="item.drug_product_id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                        <el-popover
                            placement="right"
                            title="基本属性"
                            width="600"
                            trigger="hover">
                            <el-row :gutter="2" class="baseinfo">
                                <el-col :span="10">
                                    <span class="base-label-cn">商品名称：</span>
                                    <span   style="width:189px;" v-model="form.commodity_name">{{form.commodity_name}}</span>
                                </el-col>
                                <el-col :span="10">
                                    <span class="base-label-cn">药品类型：</span>
                                    <span   style="width:189px;"  v-model="form.drug_product_category_name">{{form.drug_product_category_name}}</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="2" class="baseinfo">
                                <el-col :span="10">
                                    <span class="base-label-cn">规格：</span>
                                    <span   style="width:189px;"  v-model="form.drug_spec_value">{{form.drug_spec_value}}</span>
                                </el-col>
                                <el-col :span="10">
                                    <span class="base-label-cn">剂型：</span>
                                    <span   style="width:189px;"  v-model="form.drug_dosage_name">{{form.drug_dosage_name}}</span>
                                </el-col>
                            </el-row>
                            <!--<el-row :gutter="2" class="baseinfo">-->
                                <!--<el-col :span="10">-->
                                    <!--<span class="base-label-cn">是否拆零：</span>-->
                                    <!--<span   style="width:189px;"  v-model="form.is_open_name">{{form.is_open_name}}</span>-->
                                <!--</el-col>-->
                                <!--<el-col :span="10">-->
                                    <!--<span class="base-label-cn">出售价格：</span>-->
                                    <!--<span style="width:189px;"  v-model="form.out_price">{{form.out_price}}</span>元/-->
                                    <!--<span style="width:189px;"  v-model="form.out_unit">{{form.out_unit}}</span>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                            <el-row :gutter="2" class="baseinfo">
                                <el-col :span="30">
                                    <span class="base-label-cn">厂家：</span>
                                    <span   style="width:189px;"  v-model="form.manufacturer_name">{{form.manufacturer_name}}</span>
                                </el-col>
                            </el-row>
                            <el-button size="mini" slot="reference">详情</el-button>
                        </el-popover>
                    </el-col>

                </el-row>
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="10">
                        <span style="visibility: hidden">采购明细</span><span class="base-label">供应商：</span>
                        <el-select v-bind:disabled="disabled" filterable remote reserve-keyword placeholder="编码/名称" :remote-method="remoteMethod" :loading="SelectLoading" id="org_id" v-model="form.org_id"  size="small" style="width:340px;" @change="GetFactory">
                            <el-option
                                v-for="item in OrgCatgory"
                                :key="item.org_id"
                                :label="item.name"
                                :value="item.org_id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <span class="base-label"><span class="required">* </span>采购数量：</span>
                        <el-input v-bind:disabled="EditDisable" size="small" clearable style="width:115px;" v-model="form.purchase_num" id="purchase_num" @focus="InputCss('purchase_num')">
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <span class="base-label"><span class="required">* </span>采购单位：</span>
                        <el-input v-bind:disabled="disabled" placeholder="最小单位" size="small"  style="width:115px;" v-model="form.purchase_unit" id="purchase_unit" @focus="InputCss('purchase_unit')">
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <span class="base-label">采购预算：</span>
                        <el-input v-bind:disabled="EditDisable"  size="small" clearable style="width:115px;" v-model="form.purchase_price" id="purchase_unit" @focus="InputCss('purchase_unit')">
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="2" class="baseinfo">
                    <el-col :span="16">
                        <span style="visibility: hidden">采购明细</span><span class="base-label">备注：</span>
                        <el-input v-bind:disabled="EditDisable" size="small" clearable style="width:615px;" v-model="form.remark" id="remark" >
                        </el-input>
                    </el-col>
                    <div id="buttons" style="float:right;margin:0 20px 5px 0;">
                        <el-button v-bind:disabled="EditDisable" type="primary" style="width:70px" size="mini"  @click="GetBussNo">保 存</el-button>
                        <el-button type="primary" plain="" style="width:70px" size="mini"  @click="clearDataBaseinfo">清 空</el-button>
                    </div>
                </el-row>
            </div>
            <el-table :data="tableData"  style="width: 100%;"  :height="TableHeight"   v-loading="GridLoading" @row-click="RowClick">
                <el-table-column label="单号" width="140" prop="buss_no" sortable>
                </el-table-column>
                <el-table-column label="名称" width="240" prop="name" sortable>
                </el-table-column>
                <el-table-column label="规格" width="100" prop="drug_spec_value" sortable>
                </el-table-column>
                <el-table-column label="库存余量" width="100" prop="actual_retail_num" sortable>
                </el-table-column>
                <el-table-column label="采购数量" width="100" prop="purchase_num" sortable>
                </el-table-column>
                <el-table-column label="采购单位" width="100" prop="purchase_unit" sortable>
                </el-table-column>
                <el-table-column label="采购预算" width="100" prop="purchase_price" sortable>
                </el-table-column>
                <el-table-column label="审批状态" width="100" prop="approve_status_name" sortable>
                </el-table-column>
                <el-table-column label="审批日期" width="100" prop="approve_date" sortable>
                </el-table-column>
                <el-table-column label="审批人" width="100" prop="approve_credential_name" sortable>
                </el-table-column>
                <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" plain @click="DelPurchaseDetail(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="150" prop="remark"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="审批备注" width="150" prop="approve_remark" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div class="category_btn" >
                <el-button  class="add" plain  @click="AuthorityCancel">返回</el-button>
                <el-button v-bind:disabled="EditDisable" type="primary"  class="add" @click="SubmitPurchase">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {baseUrl} from "../../../utilis/common.js";
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
        name: "purchase-order",
        data(){
            return {
                FrimShow:true,
                FormShow:false,
                GridTableHeight:"448",             //表格最大高度
                TableHeight:"306",
                searchInput:"",
                s_purchase_type:"all",
                s_approve_status:"all",
                tableData:[],                     //采购明细
                OrgCatgory:[],   //供应商数据
                DrugCatgory:[],  //药品数据
                department:[],   //部门数据
                form:{

                    "credential_id":credential_id,
                    "purchase_type":"1",
                    "is_approve_finish":0,
                    "approve_status":4,
                    "goods_type":"0"
                },
                table:{
                    TableData:[],
                    total_num:0,
                    pagination:"total, sizes, prev, pager, next"
                },
                page_num:1,
                page_size:10,
                GridLoading:false,
                PurchaseTypeDisable:false,
                departmentDisable:false,
                EditDisable:false
            }
        },
        methods:{
            GetData(){
                //获取表格数据

                let param = {
                    "search":this.searchInput,
                    "s_purchase_type": this.s_purchase_type,
                    "s_approve_status":this.s_approve_status,
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                    "hospital_id":hospital_id,
                    "StartDate":this.form.StartDate
                };
                if (param.StartDate === "" || param.StartDate === null)
                    delete param.StartDate;
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
                                this.disabled(this.tableData[0].purchase_approve_status);
                                this.form.purchase_type=this.tableData[0].purchase_type.toString();
                                this.form.department_id=this.tableData[0].department_id;
                                this.form.purchase_remark=this.tableData[0].purchase_remark;
                                //this.tableData[i].total=(Number(this.tableData[i].purchase_num)*Number(this.tableData[i].purchase_price)).toFixed(2)
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
            AddForm(){
                this.clearData();
                this.tableData=[];//清空表格
                this.FrimShow=false;
                this.FormShow=true;
                this.EditDisable=false;
                this.departmentDisable=false;
                this.PurchaseTypeDisable=false;
            },
            handleEdit(index,row){
                this.clearData();
                this.FrimShow=false;
                this.FormShow=true;
                this.EditDisable=false;
                this.departmentDisable=false;
                this.PurchaseTypeDisable=false;
                this.form.purchase_id=row.purchase_id;
                this.GetDetailData();
            },
            clearData(){
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
                this.form={
                    "credential_id":credential_id,
                    "is_approve_finish":0,
                    "approve_status":4,
                    "goods_type":"0"
                };

            },
            clearDataBaseinfo(){
                this.clearData();
                if(this.tableData.length!==0){
                    this.form.department_id=this.tableData[0].department_id;
                    this.form.purchase_type=this.tableData[0].purchase_type.toString();
                    this.form.purchase_remark=this.tableData[0].purchase_remark;
                    this.form.purchase_id=this.tableData[0].purchase_id;
                }
            },
            querySearchDrug(query,cb) {
                if(!this.form.goods_type){
                    this.$alert("请选择物品类型！", '提示', {
                        confirmButtonText: '确定',
                    });
                    $("#name").blur();
                    return;
                }

                // 药品远程搜索
                this.loading = false;
                query=StrTrim(query);
                let list = [{}];
                if (query !== '') {
                    let param = {
                        "search": query,
                        "hospital_id":hospital_id,
                        "goods_type":this.form.goods_type
                    };
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "sp_clinic_purchase_goods_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            if(response.body.data!==null)
                            this.DrugCatgory = response.body.data;
                            else{
                                this.DrugCatgory=[];
                            }
                            if(this.DrugCatgory!==null) {
                                for (let i of this.DrugCatgory) {
                                    i.value = i.name;
                                }
                                list = this.DrugCatgory;
                            }else{
                                list=undefined
                            }
                            clearTimeout(this.timeout);
                            this.timeout = setTimeout(() => {
                                cb(list);
                            }, 1000 * Math.random());
                        }
                    });
                } else {
                    this.DrugCatgory = [];
                }
            },
            GetBase(item){
                this.form=$.extend({}, this.form, item);
                if(this.form.goods_type==='0') {

                    // if (item.is_open === 1) {
                    //     this.form.is_open_name = "是";
                    //     this.form.out_price = item.actual_retail_price;    //拆零价格
                    //     this.form.out_unit = item.actual_retail_unit;    //拆零单位
                    // } else {
                    //     this.form.is_open_name = "否";
                    //     this.form.out_price = item.pack_price;    //包装价格
                    //     this.form.out_unit = item.pack_unit;    //包装单位
                    // }
                    this.form.goods_name=item.name;
                    this.form.goods_id=item.drug_product_id;
                    this.form.purchase_unit=item.preparation_name;
                }
            },
            remoteMethod(query,time) {
                //供应商 远程搜索
                if(time===undefined)
                    time=800;
                if (query !== '') {
                    this.SelectLoading = true;
                    setTimeout(() => {
                        let param={
                            "search":query,
                            "manufacturer_category_id":1
                        };
                        this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_org_category_query","param":JSON.stringify(param)}).then((response) => {
                            if(requestSuccess(response.body,this)){
                                this.OrgCatgory=response.body.data;
                            }
                            this.GridLoading = false;
                            this.SelectLoading = false;
                        });
                    }, time);
                } else {
                    this.OrgCatgory = [];
                }
            },
            SaveDrugPurchase(){
                let IDArr;
                IDArr = ["name","department_id","purchase_type", "purchase_num","purchase_unit"];

                if (this.showPoint(IDArr))
                    return;

                //去空格
                this.form.name=StrTrim(this.form.name);
                this.form.approve_status=4;
                this.form.purchase_approve_status=4;

                let param = $.extend(true, {}, this.form);

                if (param.purchase_price === "" || param.purchase_price === null)
                    delete param.purchase_price;
                if (param.purchase_price !== undefined) {
                    param.purchase_price = Number(param.purchase_price).toFixed(2) * 100;
                }
                this.GridLoading=true;


                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_purchase_detail_save","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        let list=$.extend(true,{},this.form);
                        list.approve_status_name="待提交";
                        this.clearData();
                        this.form.purchase_id=response.body.data.purchase_id; //采购ID
                        this.GetDetailData();
                        this.form.purchase_type=list.purchase_type;           //采购类型
                        this.form.department_id=list.department_id;
                        this.form.buss_no=list.buss_no;

                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        });
                    }
                    this.GridLoading=false;
                });

            },
            SubmitPurchase(){
                if(this.tableData.length===0){
                    this.$alert("请先填写数据并保存！", '提示', {
                        confirmButtonText: '确定',
                    });
                    return;
                }
                for(let i=0;i<this.tableData.length;i++){
                    if(!this.tableData[i].purchase_id){
                        this.$alert("请先保存数据！", '提示', {
                            confirmButtonText: '确定',
                        });
                        return;
                    }
                }
                let param={
                    "purchase_id":this.form.purchase_id
                };
                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_purchase_submit","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.$alert("提交成功！", '提示', {
                            confirmButtonText: '确定',
                        });
                        this.AuthorityCancel();
                    }
                    this.GridLoading=false;
                });

            },
            DelPurchase(index,row){
                let _this=this;
                if(this.flag(row,_this)) {
                    let param = {
                        "purchase_id": row.purchase_id,
                    };
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "sp_clinic_purchase_del",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            this.$alert("删除成功！", '提示', {
                                confirmButtonText: '确定',
                            });
                            this.GetData();
                        }
                    });
                }
            },
            DelPurchaseDetail(index,row){
                let _this=this;
                if(this.flag(row,_this)) {
                    let param = {
                        "purchase_detail_id": row.purchase_detail_id,
                    };
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "sp_clinic_purchase_detail_del",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            this.$alert("删除成功！", '提示', {
                                confirmButtonText: '确定',
                            });
                            this.clearDataBaseinfo();
                            this.GetDetailData();
                        }
                    });
                }
            },
            flag(row,_this){
                switch (row.approve_status){
                    case 0:
                        _this.$alert("'"+row.approve_status_name+"'的单据不能删除！", '提示', {
                            confirmButtonText: '确定',
                        });
                        return false;
                        break;
                    case 1:
                        _this.$alert("'"+row.approve_status_name+"'的单据不能删除！", '提示', {
                            confirmButtonText: '确定',
                        });
                        return false;
                        break;
                    case 2:
                        _this.$alert("'"+row.approve_status_name+"'的单据不能删除！", '提示', {
                            confirmButtonText: '确定',
                        });
                        return false;
                        break;
                    case 3:
                        _this.$alert("'"+row.approve_status_name+"'的单据不能删除！", '提示', {
                            confirmButtonText: '确定',
                        });
                        return false;
                        break;
                    case 4:
                        return true;
                        break;
                    case 9:
                        _this.$alert("'"+row.approve_status_name+"'的单据不能删除！", '提示', {
                            confirmButtonText: '确定',
                        });
                        return false;
                        break;
                    default:
                        return false;
                }
            },
            disabled(status){
                switch (status){
                    case 0:
                        this.EditDisable=true;
                        this.departmentDisable=true;
                        this.PurchaseTypeDisable=true;
                        break;
                    case 1:
                        this.EditDisable=true;
                        this.departmentDisable=true;
                        this.PurchaseTypeDisable=true;
                        break;
                    case 2:
                        this.EditDisable=true;
                        this.departmentDisable=true;
                        this.PurchaseTypeDisable=true;
                        break;
                    case 3:
                        this.EditDisable=true;
                        this.departmentDisable=true;
                        this.PurchaseTypeDisable=true;
                        break;
                    case 4:
                        break;
                    case 9:
                        this.EditDisable=true;
                        this.departmentDisable=true;
                        this.PurchaseTypeDisable=true;
                        break;
                    default:
                        return false;
                }
            },
            RowClick(row,event,column){
                this.EditDisable=false;
                this.departmentDisable=false;
                this.PurchaseTypeDisable=false;

                row.purchase_type=row.purchase_type.toString();

                this.disabled(row.purchase_approve_status);


                if(row.goods_type===0) {
                    row.goods_type=row.goods_type.toString();
                    // if (row.is_open === 1) {
                    //     this.form.is_open_name = "是";
                    //     this.form.out_price = row.actual_retail_price;    //拆零价格
                    //     this.form.out_unit = row.actual_retail_unit;    //拆零单位
                    // } else {
                    //     this.form.is_open_name = "否";
                    //     this.form.out_price = row.pack_price;    //包装价格
                    //     this.form.out_unit = row.pack_unit;    //包装单位
                    // }
                }
                this.form.goods_name=row.name;
                this.form=$.extend({}, this.form, row);
              //  this.remoteMethod(row.applyMan,0);
                this.querySearchDrug(row.name,0);
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
            },
            handleSizeChange(val) {
                this.page_size=val;
                this.GetData();
            },
            handleCurrentChange(val) {
                this.page_num=val;
                this.GetData();
            },
            showPoint(IDArray){
                //不能为空的提示
                let flag=false;
                for (let i=0;i<IDArray.length;i++){
                    if(!this.form[IDArray[i]] || this.form[IDArray[i]]==="必填项不能为空"){
                        Vue.set(this.form,IDArray[i],'必填项不能为空');
                        $("#"+IDArray[i]).find("input").css({"color":"red","border-color":"red"});
                        $("#"+IDArray[i]).css({"color":"red","border-color":"red"});
                        flag=true
                    }
                }
                return flag
            },
            InputCss(id){
                if(this.form[id]==="必填项不能为空") {
                    Vue.set(this.form, id, undefined);
                    $("#" + id).find("input").css({"border-color": "#dcdfe6", "color": "#606266"});
                    $("#" + id).css({"border-color": "#dcdfe6", "color": "#606266"});
                }
            },
            AuthorityCancel(){
                //返回
                this.FrimShow=true;
                this.FormShow=false;
                this.GetData();
            },
            GetFactory(val){
                //供应商名称显示
                let obj = {};
                obj = this.OrgCatgory.find((item)=>{
                    return item.org_id === val;
                });

                this.form.applyMan=obj.name;
            },
            GetDepartment(){
                let param={
                    "department_id":departmentList
                };
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_credential_department","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){

                        this.department = response.body.data;
                    }
                });
            },
            GetBussNo() {
                if (!this.form.purchase_id) {
                    let param2 = {};
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "clinic_purchase_no",
                        "param": JSON.stringify(param2)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            this.form.buss_no = response.body.data.no;

                            this.SaveDrugPurchase();
                        }
                    });
                } else {
                    this.SaveDrugPurchase();
                }
            }
        },
        mounted() {
            this.GetData();
            this.GetDepartment();

            this.GridTableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
            this.TableHeight=($(window).height())-60-($(".classify").height())-20-($("#baseinfo").height())-165;
            window.onresize  = () => {
                this.GridTableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
                this.TableHeight=($(window).height())-60-($(".classify").height())-20-($("#baseinfo").height())-165;
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
        width: 90px;
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
