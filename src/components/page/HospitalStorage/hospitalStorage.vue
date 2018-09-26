<template>
    <div class="HospitalStorage content_inner">
        <div v-show="FrimShow" >
            <div class="classify"><h4 class="title">药房药品管理</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <el-button type="primary" class="add" @click="AddForm">新增</el-button>
                    <span style="margin-left: 5px">机构名称：</span>
                    <!--<el-autocomplete-->
                        <!--clearable-->
                        <!--v-model="searchOrg"-->
                        <!--:fetch-suggestions="querySearchAsync"-->
                        <!--placeholder="请输入内容"-->
                        <!--@select="GetBaseItem"-->
                        <!--size="small" style="width:215px;" id="SearchOrg">-->
                    <!--</el-autocomplete>-->
                    <el-select  v-model="searchOrg" filterable size="small" id="SearchOrg"  style="width:215px;" @change="GetBaseItem">
                        <el-option
                            v-for="item in OrgCatgory"
                            :key="item.mapp_hospital_storage_id"
                            :label="item.show_name"
                            :value="item.mapp_hospital_storage_id" >
                        </el-option>
                    </el-select>
                    <div style="float:right">
                        <span class="ml20">库存 ：</span>
                        <el-select  v-model="ZeroInventory" style="width:90px" size="small"  class="state" @change="Inventory">
                            <el-option
                                key="all"
                                label="全部"
                                value="all">
                            </el-option>
                            <el-option
                                key="0"
                                label="零库存"
                                value="0">
                            </el-option>
                            <el-option
                                key="1"
                                label="负库存"
                                value="1">
                            </el-option>
                            <el-option
                                key="2"
                                label="自定义"
                                value="2">
                            </el-option>
                        </el-select>
                        <span class="ml20">库存<</span>
                        <el-input style="width:80px" size="small" v-bind:disabled="ZeroDisable" v-model="InventoryQuantity" id="InventoryQuantity" @keyup.native="EnterSearch">
                        </el-input>
                        <span class="ml20">拆零：</span>
                        <el-select  v-model="dismantle"  size="small"   @change="GetData" style="width:100px">
                            <el-option
                                key="2"
                                label="全部"
                                value="2">
                            </el-option>
                            <el-option
                                key="1"
                                label="是"
                                value="1">
                            </el-option>
                            <el-option
                                key="0"
                                label="否"
                                value="0">
                            </el-option>
                        </el-select>
                        <span class="ml20">状态：</span>
                        <el-select  v-model="states"  size="small" style="width:100px" class="state" @change="GetData">
                            <el-option
                                key="2"
                                label="全部"
                                value="2">
                            </el-option>
                            <el-option
                                key="1"
                                label="启用"
                                value="1">
                            </el-option>
                            <el-option
                                key="0"
                                label="停用"
                                value="0">
                            </el-option>
                        </el-select>
                        <el-input class="search ml20"  placeholder="编号/名称" v-model="searchInput" size="small" @keyup.native="Search">
                            <el-button slot="append" icon="el-icon-search" size="small" @click="GetData"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table :data="GridTable"  style="width: 100%;" :height="GrigTableHeight" class="GridTable" v-loading="GridLoading" :row-class-name="tableRowClassName">
                    <el-table-column label="名称" min-width="280" prop="name" sortable>
                    </el-table-column>
                    <el-table-column label="商品名称" min-width="150" prop="commodity_name" sortable>
                    </el-table-column>
                    <el-table-column label="规格" min-width="90" prop="drug_spec_value">
                    </el-table-column>
                    <el-table-column label="厂家" min-width="210" prop="manufacturer_name" sortable>
                    </el-table-column>
                    <el-table-column label="拆零价" min-width="65" prop="actual_retail_price">
                    </el-table-column>
                    <el-table-column label="拆零单位" min-width="80" prop="actual_retail_unit">
                    </el-table-column>
                    <el-table-column label="包装价" min-width="65" prop="pack_price">
                    </el-table-column>
                    <el-table-column label="包装单位" min-width="80" prop="pack_unit">
                    </el-table-column>
                    <el-table-column label="库存" min-width="75" prop="quantity" sortable>
                    </el-table-column>
                    <el-table-column label="操作" min-width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="info" plain @click="usable(scope.$index, scope.row)" v-if="scope.row.is_active===0" v-model="is_active">启用</el-button>
                            <el-button size="mini" type="primary" plain @click="usable(scope.$index, scope.row)" v-else-if="scope.row.is_active===1" v-model="is_active">停用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination" >
                    <el-pagination style="height:15px;margin-top: -12px"
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :page-sizes="[10, 20, 30, 40]"
                                   :page-size="page_size"
                                   :layout="pagination"
                                   :total="total_num">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="Form" v-model="loading" v-show="FormShow">
            <div class="classify"><h4 class="title">新增药品</h4></div>
            <div id="drug">
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="11">
                        <span class="base-label"><span class="required">* </span>药房名称：</span>
                        <!--<el-autocomplete-->
                            <!--clearable-->
                            <!--v-model="form.org_name"-->
                            <!--:fetch-suggestions="querySearchAsync"-->
                            <!--placeholder="请输入内容"-->
                            <!--@focus="InputCss('org_name')"-->
                            <!--id="org_name"-->
                            <!--size="small" style="width:340px;">-->
                        <!--</el-autocomplete>-->
                        <el-select  v-model="form.mapp_hospital_storage_id" id="mapp_hospital_storage_id" filterable size="small" style="width:340px;" @focus="InputCss('mapp_hospital_storage_id')">
                            <el-option
                                v-for="item in OrgCatgory"
                                :key="item.mapp_hospital_storage_id"
                                :label="item.show_name"
                                :value="item.mapp_hospital_storage_id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <div id="buttons" style="float:right;margin:0 10px 5px 0;">
                    </div>
                </el-row>
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="30">
                        <span class="base-label"><span class="required">* </span>药品名称：</span>
                        <el-autocomplete
                            clearable
                            v-model="form.drug_product_name"
                            :fetch-suggestions="querySearchDrug"
                            placeholder="请输入内容"
                            @select="GetBase"
                            @focus="InputCss('drug_product_name')"
                            id="drug_product_name"
                            size="small" style="width:340px;">
                        </el-autocomplete>

                        <el-popover
                            placement="right"
                            title="药品基本属性"
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
                            <el-row :gutter="2" class="baseinfo">
                                <el-col :span="30">
                                    <span class="base-label-cn">厂家：</span>
                                    <span   style="width:189px;"  v-model="form.manufacturer_name">{{form.manufacturer_name}}</span>
                                </el-col>
                            </el-row>
                            <el-button size="mini" slot="reference">详情</el-button>
                        </el-popover>
                    </el-col>
                    <el-col :span="6" v-if="form.is_open===0">
                        <span class="base-label">包装价：</span>
                        <el-input  size="small"  style="width:189px;" v-model="form.pack_price" id="pack_price">
                        </el-input>
                    </el-col>
                    <el-col :span="6"  v-else="form.is_open===1">
                        <span class="base-label">包装价：</span>
                        <el-input  size="small"  style="width:189px;" v-model="form.pack_price" id="pack_price" disabled="disabled">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">包装单位：</span>
                        <el-input disabled="disabled" size="small"  style="width:189px;"  v-model="form.pack_unit" id="pack_unit" >
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div id="basein" style="border-bottom: 1px solid #dfdfdf;padding-bottom: 5px;">
                <el-row :gutter="2" class="baseinfo">

                    <el-col :span="6" v-if="form.is_open===1">
                        <span class="base-label" >拆零价：</span>
                        <el-input   size="small"  style="width:189px;" v-model="form.actual_retail_price" id="actual_retail_price">
                        </el-input>
                    </el-col>
                    <el-col :span="6" v-else="form.is_open===0">
                        <span class="base-label">拆零价：</span>
                        <el-input   size="small"  style="width:189px;" v-model="form.actual_retail_price" id="actual_retail_price" disabled="disabled">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">拆零单位：</span>
                        <el-input  disabled="disabled" size="small"  style="width:189px;" v-model="form.actual_retail_unit" id="actual_retail_unit" >
                        </el-input>

                    </el-col>
                    <div  style="float:right;margin:0 20px 5px 0;">
                        <el-button  type="primary"  style="width:70px" size="mini"  @click="SaveDrugProduct">保 存</el-button>
                        <el-button type="primary" plain style="width:70px" size="mini"  @click="AuthorityCancel">返 回</el-button>
                    </div>
                    <el-col :span="8">
                        <span class="base-label">是否拆零：</span>
                        <el-radio-group v-model="form.is_open" >
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>

            </div>
            <el-table :data="tableData"  style="width: 100%;"  :height="TableHeight"   v-loading="GridLoading">
                <el-table-column label="名称" min-width="280" prop="drug_product_name" sortable>
                </el-table-column>
                <el-table-column label="商品名称" min-width="180" prop="commodity_name" sortable>
                </el-table-column>
                <el-table-column label="规格" min-width="100" prop="drug_spec_value" sortable>
                </el-table-column>
                <el-table-column label="厂家" min-width="280" prop="manufacturer_name" sortable>
                </el-table-column>
                <el-table-column label="拆零价" min-width="100" prop="actual_retail_price" sortable>
                </el-table-column>
                <el-table-column label="拆零单位" min-width="100" prop="actual_retail_unit" sortable>
                </el-table-column>
                <el-table-column label="包装价" min-width="100" prop="pack_price" sortable>
                </el-table-column>
                <el-table-column label="包装单位" min-width="100" prop="pack_unit" sortable>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {StrTrim} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import Vue from 'vue';
    let storage = getLocalStorage();
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "hospital-storage",
        data() {
            return {
                GrigTableHeight:"448",               //表格最大高度
                TableHeight:"400",
                OrgCatgory:[],   //机构名称
                DrugCatgory:[],  //药品名称搜索
                DrugDosage:[],   //获取剂型
                ProductCategory:[],   //成药药品类型
                GridTable:[],    //首页表格
                tableData:[],
                searchInput:"",   //首页搜索药品inout
                searchOrg:"",     //首页搜索机构名称
                mapp_hospital_storage_id:"",//首页搜索机构ID
                dismantle:"2",                  //拆零药品搜索
                ZeroDisable:true,                  //库存自定义
                ZeroInventory:"all",    //库存查询条件
                InventoryQuantity:undefined,  //输入库存数量
                FrimShow:true,
                FormShow:false,
                form:{
                    "is_open":0,
                    "is_active":1
                },
                retail_price_unit:"",
                timeout:null,
                loading:false,
                pack_disabled:false,
                open_disabled:"disabled",
                total_num:0,
                page_num:1,
                page_size:10,
                pagination:"total, sizes, prev, pager, next",
                GridLoading:false,
                is_active:"",                 //停用启用
                states:"1"
            }
        },
        methods:{
            GetData(){
                //获取表格数据
                if(!this.mapp_hospital_storage_id) {
                    this.$alert("请选择药房名称！", '提示', {
                        confirmButtonText: '确定',
                    });
                    return;
                }
                if(this.InventoryQuantity==="")
                    this.InventoryQuantity=undefined;
                    var param = {
                        "mapp_hospital_storage_id":this.mapp_hospital_storage_id,
                        "search": this.searchInput,
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                        "is_open":2,
                        "ZeroInventory":this.ZeroInventory,
                        "InventoryQuantity":this.InventoryQuantity,
                        "states":Number(this.states)
                    };
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_hospital_drug_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){

                            this.GridTable = response.body.data.rows;
                            if(this.GridTable)
                            for(let i=0;i<this.GridTable.length;i++){
                                if(this.GridTable[i].actual_retail_price===null)
                                    this.GridTable[i].actual_retail_price="--";
                                if(this.GridTable[i].actual_retail_unit===null)
                                    this.GridTable[i].actual_retail_unit="--";
                                if(this.GridTable[i].pack_unit===null)
                                    this.GridTable[i].pack_unit="--";
                                if(this.GridTable[i].pack_price===null)
                                    this.GridTable[i].pack_price="--";
                                if(this.GridTable[i].actual_retail_price===0 && !this.GridTable[i].is_open)
                                    this.GridTable[i].actual_retail_price="--"
                            }
                            this.total_num = response.body.data.total_num;
                            if (this.total_num <= Number(this.page_size)) {
                                this.pagination = "total, sizes";
                            } else {
                                this.pagination = "total, sizes, prev, pager, next";
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
            Inventory(){
                if(this.ZeroInventory==="2") {
                    this.ZeroDisable = false;
                }else{
                    this.ZeroDisable="disable";
                }
                this.GetData();
            },
            EnterSearch(ev){
                if(ev.keyCode === 13)
                    this.GetData();
            },
            tableRowClassName({row, rowIndex}) {
                if (row.is_open===1) {
                    return 'success-row';
                }else{
                    return '';
                }
            },
            querySearchAsync() {
                //机构名称
                    let param = {
                        "hospital_id": hospital_id,
                    };
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "sp_clinic_hospital_storage_name_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            this.OrgCatgory = response.body.data;
                        }
                    });
            },
            AddForm(){
                //新增
                this.clearData();
                this.tableData=[];
                this.FormShow=true;
                this.FrimShow=false;
                this.form.is_active="1"; //新增 非停用状态
                if(this.searchOrg && this.searchOrg!=="")
                this.form.mapp_hospital_storage_id=this.searchOrg;

            },
            AuthorityCancel(){
                //返回
                this.FormShow=false;
                this.FrimShow=true;

                if(this.form.mapp_hospital_storage_id && this.form.mapp_hospital_storage_id!=="") {
                    this.searchOrg = this.form.mapp_hospital_storage_id;
                    this.mapp_hospital_storage_id=this.searchOrg;
                    this.GetData();
                }
            },
            clearData(){
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
                this.form={
                    "is_open":0,
                    "is_active":1,

                };

            },
            querySearchDrug(query,cb) {
                // 药品远程搜索
                query=StrTrim(query);
                this.loading = false;
                var list = [{}];
                if (query !== '') {
                    let param = {
                        "search": query,
                    };
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "sp_clinic_drug_category_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            this.DrugCatgory = response.body.data;
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
                this.form.manufacturer_category_name=item.drug_product_category_name;
                this.form.pack_unit=item.stock_unit_name;
                this.form.actual_retail_unit=item.preparation_name;

            },
            SaveDrugProduct(){
                let IDArr;
                IDArr = ["mapp_hospital_storage_id", "drug_product_name"];

                if (this.showPoint(IDArr))
                    return;

                //去空格

                this.form.drug_product_name=StrTrim(this.form.drug_product_name);

                let params = $.extend(true, {}, this.form);
                if (params.actual_retail_price === "" || params.actual_retail_price === null)
                    delete params.actual_retail_price;
                if (params.actual_retail_price !== undefined)
                    params.actual_retail_price = Number(this.form.actual_retail_price).toFixed(2) * 100;

                if (params.pack_price === "" || params.pack_price === null)
                    delete params.pack_price;
                if (params.pack_price !== undefined)
                    params.pack_price = Number(this.form.pack_price).toFixed(2) * 100;

                let param=JSON.stringify(params);
                this.loading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_storage_drug_product_save","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        let list=$.extend(true,{},this.form);
                        this.tableData.push(list);
                        this.IsDismantle();
                        this.$alert("保存成功！", '提示', {
                            confirmButtonText: '确定',
                        });
                        this.clearData();
                        this.form.org_name=list.org_name;
                        this.form.mapp_hospital_storage_id=list.mapp_hospital_storage_id;
                    }
                    this.loading=false;
                });

            },
            DelDrugProduct(index,row){

                if(row.quantity){
                    this.$alert("库存有剩余，不能删除！", '提示', {
                        confirmButtonText: '确定',
                    });
                    return;
                }

                let param={
                    "mapp_storage_drug_product_id":row.mapp_storage_drug_product_id,
                     "delete_flag":1
                };
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_storage_drug_product_del","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.$alert("删除成功！", '提示', {
                            confirmButtonText: '确定',
                        });
                        this.GetData();
                    }
                });
            },
            handleSizeChange(val) {
                this.page_size=val;
                this.GetData();
            },
            handleCurrentChange(val) {
                this.page_num=val;
                this.GetData();
            },
            tableRowClassName({row, rowIndex}) {
                if (row.is_active===0) {
                    return 'success-row';
                }
                if (row.is_active===0) {
                    return 'success-row';
                }
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
                    $("#" + id).find("input").css({"border-color": "#dcdfe6", "color": "#606266"})
                    $("#" + id).css({"border-color": "#dcdfe6", "color": "#606266"})
                }
            },
            IsDismantle(){                //是否拆零
                if(this.form.is_open===1){
                    this.open_disabled=false;
                    this.pack_disabled="disabled";
                    this.form.pack_price=undefined;
                    this.form.pack_unit=undefined;

                }else{
                    this.pack_disabled=false;
                    this.open_disabled="disabled";
                    this.form.actual_retail_price=undefined;
                    this.form.actual_retail_unit=undefined;
                    this.form.unit_num=undefined;
                }
            },
            GetBaseItem(){
                this.mapp_hospital_storage_id=this.searchOrg;
                this.GetData();
            },
            usable(index,row){
                //启用 停用
                if(row.is_active===0){
                    this.is_active="启用";
                    row.is_active=1;
                }else if(row.is_active===1){
                    this.is_active="停用";
                    row.is_active=0;
                }

                let param=JSON.stringify(row);


                this.loading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_storage_drug_product_update","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this. GetData();
                    }
                    this.loading=false;
                });
            },
            handleEdit(index,row){
                this.clearData();
                this.tableData=[];
                this.FrimShow=false;
                this.FormShow=true;


                let param={
                    "drug_product_id":row.drug_product_id,
                    "mapp_hospital_storage_id":row.mapp_hospital_storage_id
                };

                //获取明细
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_mapp_storage_drug_detail","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                       this.form=response.body.data[0];
                        if(this.searchOrg && this.searchOrg!=="")
                            this.form.mapp_hospital_storage_id=this.searchOrg;

                    }
                });
            }
        },
        mounted() {

            this.GrigTableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
            this.TableHeight=$(window).height()-110-$("#drug").height()-$("#basein").height()-18;
             window.onresize  = () => {
                 if(this.FormShow)
                     this.TableHeight = $(window).height() - 110 - $("#drug").height() - $("#basein").height() - 17;

                 if(this.FrimShow)
                     this.GrigTableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
             };
             this.querySearchAsync();

        }
    }
</script>

<style scoped>
    .el-table .success-row {
        background: #f0f9eb;
    }
    .Form{
        position:relative;
        height:100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .tab_content{
        padding:8px 10px 0 9px;
    }
    .baseinfo{
        padding: 10px 0 5px 5px;
    }
    .base-label{
        width: 110px;
        display: inline-block;
        text-align: right;
    }
    .base-label-cn{
        width: 80px;
        display: inline-block;
        text-align: right;
    }
    .GridTable{
        border-top:1px solid #ccc;
        margin-top: 10px;
    }
    .add{
        width:70px;
        height:30px;
        line-height:0;
    }
    .ml20{
        margin-left: 20px;
    }
    .search{
        width:180px;
    }
</style>
