<template>
    <div class="DepSalesDrug content_inner">
        <div class="Form">
            <div class="classify"><h4 class="title">科室售药{{this.org_name}}</h4></div>
            <div id="baseinfo" style="border-bottom: 1px solid #dfdfdf;padding-bottom: 5px;">
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="11">
                        <span class="base-label"><span class="required">* </span>药品名称：</span>
                        <el-autocomplete
                            clearable
                            v-model="form.name"
                            :fetch-suggestions="querySearchDrug"
                            placeholder="请输入内容"
                            @select="GetBase"
                            @focus="InputCss('name')"
                            id="name"
                            size="small" style="width:340px;">
                        </el-autocomplete>
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
                            <el-row :gutter="2" class="baseinfo">
                                <el-col :span="10">
                                    <span class="base-label-cn">是否拆零：</span>
                                    <span   style="width:189px;"  v-model="form.is_open_name">{{form.is_open_name}}</span>
                                </el-col>
                                <el-col :span="10">
                                    <span class="base-label-cn">出售价格：</span>
                                    <span style="width:189px;"  v-model="form.out_price">{{form.out_price}}</span>
                                    <span style="width:189px;"  v-model="form.out_unit">{{form.out_unit}}</span>
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
                    <el-col :span="7">
                        <span class="base-label"><span class="required">* </span>药品批次：</span>
                        <el-select filterable v-model="form.batch"  size="small" style="width:220px;" class="batch" id="batch" @focus="InputCss('batch')" @change="GetRest">
                            <el-option
                                v-for="item in bantchData"
                                :key="item.batch"
                                :label="item.batch"
                                :value="item.batch">
                                <span style="float: left">{{ item.batch }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.term_of_validity }}</span>
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">有效期：</span>
                        <el-input disabled="disabled" size="small" clearable style="width:159px;" v-model="form.term_of_validity">
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="6">
                        <span class="base-label">批次余量：</span>
                        <el-input disabled="disabled" size="small" clearable style="width:159px;" v-model="form.rest_num">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label"><span class="required">* </span>售出数量：</span>
                        <el-input  size="small" clearable style="width:159px;" v-model="form.record_num" id="record_num" @focus="InputCss('record_num')">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">售出单位：</span>
                        <el-input disabled="disabled" size="small" placeholder="最小单位" clearable style="width:159px;" v-model="form.record_unit" id="record_unit" @focus="InputCss('record_unit')">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">售出价格：</span>
                        <el-input disabled="disabled" size="small"  style="width:159px;"  v-model="form.record_price" id="record_price" @focus="InputCss('record_price')">
                        </el-input>
                        <span style="width:189px;"  v-model="form.out_unit">{{form.out_unit}}</span>
                    </el-col>

                </el-row>
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="12">
                        <span class="base-label">备注：</span>
                        <el-input  size="small" clearable style="width:485px;" v-model="form.remark" id="remark" >
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">总额：</span>
                        <el-input disabled size="small"  style="width:169px;"  v-model="price_total" id="price_total">
                        </el-input>
                    </el-col>
                    <div id="buttons" style="float:right;margin:0 20px 5px 0;">
                        <el-button type="primary" style="width:70px" size="mini"  @click="GetBussNo">售 药</el-button>
                    </div>
                </el-row>

            </div>
            <el-table :data="tableData"  style="width: 100%;"  :height="TableHeight"   v-loading="GridLoading">
                <el-table-column label="名称" min-width="260" prop="name" sortable>
                </el-table-column>
                <el-table-column label="药房余量" min-width="120" prop="actual_retail_num" sortable>
                </el-table-column>
                <el-table-column label="售出数量" min-width="120" prop="record_num" sortable>
                </el-table-column>
                <el-table-column label="售出单位" min-width="120" prop="record_unit" sortable>
                </el-table-column>
                <el-table-column label="售出价格(元)" min-width="120" prop="record_price" sortable>
                </el-table-column>
                <el-table-column label="售出总额(元)" min-width="120" prop="input_total">
                </el-table-column>
                <el-table-column label="备注" min-width="280" prop="remark" sortable>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="机构药房" :visible.sync="dialogFormVisible" :close-on-click-modal="show_close" :show-close="show_close">
            <el-row :gutter="20" class="baseinfo">
                <span style="margin-left: 20px">机构名称：</span>
                <!--<el-autocomplete-->
                    <!--clearable-->
                    <!--v-model="searchOrg"-->
                    <!--:fetch-suggestions="querySearchAsync"-->
                    <!--placeholder="请输入编码/名称"-->
                    <!--@select="GetBaseItem"-->
                    <!--size="small" style="width:315px;" id="SearchOrg">-->
                <!--</el-autocomplete>-->
                <el-select  v-model="searchOrg" id="SearchOrg" filterable size="small" style="width:315px;" @change="GetBaseItem">
                    <el-option
                        v-for="item in OrgCatgory"
                        :key="item.mapp_hospital_storage_id"
                        :label="item.show_name"
                        :value="item.mapp_hospital_storage_id">
                    </el-option>
                </el-select>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectStore">确 定</el-button>
                <el-button type="primary" plain @click="dialogFormVisible=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {StrTrim} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import {CurrentDate} from "../../../utilis/common.js";
    import Vue from 'vue';
    let storage = getLocalStorage();
    let departmentList=storage.getItem("departmentList");
    let credential_id=storage.getItem("credential_id");
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "dep-sales-drug",
        data() {
            return {
                TableHeight:"397",     //查询表格
                DrugCatgory:[],  //药品数据
                form:{
                    "buss_type":"ou2",
                    "credential_id":credential_id,
                    "is_back":0
                },
                tableData:[],
                price_total:0,  //购入总额
                total_num:0,
                page_num:1,
                page_size:10,
                pagination:"total, sizes, prev, pager, next",
                GridLoading:false,
                ShowUnit:false,
                searchOrg:"",
                dialogFormVisible:true,
                org_name:"",
                show_close:false,
                bantchData:[],
                OrgCatgory:[]


            }
        },
        methods:{
            clearData(){
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
                this.form={
                    "buss_type":"ou2",
                    "credential_id":credential_id,
                    "is_back":0
                };
                this.ShowUnit=false;
            },
            querySearchDrug(query,cb) {
                // 药品远程搜索
                this.loading = false;
                query=StrTrim(query);
                let list = [{}];
                if (query !== '') {
                    let param = {
                        "search": query,
                        "mapp_hospital_storage_id":this.mapp_hospital_storage_id,
                        "goods_type":0
                    };
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "sp_clinic_storage_goods_query",
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
                let list=$.extend(true,[], item);
                this.form=$.extend({}, this.form, item);

                    if (item.is_open === 1) {
                        this.form.is_open_name = "是";
                        this.form.out_price = item.actual_retail_price;    //拆零价格
                        this.form.out_unit = "元/"+item.actual_retail_unit;    //拆零单位
                    } else {
                        this.form.is_open_name = "否";
                        this.form.out_price = item.pack_price;    //包装价格
                        this.form.out_unit = "元/"+item.pack_unit;    //包装单位
                    }
                    this.form.goods_name=item.name;
                    this.form.goods_id=item.drug_product_id;
                    this.form.record_unit=item.actual_retail_unit;
                    this.form.record_price=this.form.out_price;
                    this.GetBatch(item.drug_product_id);
            },
            SaveDrugProduct(){
                let IDArr;

                IDArr = ["name","batch","record_num"];
                if (this.showPoint(IDArr))
                    return;

                //判断库存是否是负的
                if(this.form.library_num<0){
                    this.$confirm('库存为负，请选择要冲掉的数据！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.dialogTableVisible=true;
                        //点击确定 查找采购入库数据
                        this.GetData();

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                    return;
                }

                //去空格
                if(this.form.rest_num<this.form.record_num){
                    this.$alert("余量不足！", '提示', {
                        confirmButtonText: '确定',
                    });
                    return;
                }


                this.form.record_price=Number(this.form.record_price).toFixed(2);
                this.form.input_total=Number(this.form.record_num*this.form.record_price).toFixed(2); //进货总额
                this.price_total=this.price_total+Number(this.form.input_total);    //购入总金额
                let params = $.extend(true, {}, this.form);
                if (params.record_price === "" || params.record_price === null)
                    delete params.record_price;
                if (params.record_price !== undefined)
                    params.record_price = Number(this.form.record_price)* 100;

                params.buss_no=this.form.buss_no;
                let param=JSON.stringify(params);

                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_storage_drug_record_save","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.form.mapp_storage_drug_product_record_id=response.body.data.mapp_storage_drug_product_record_id;
                        this.GetNum();

                        this.$alert("保存成功！", '提示', {
                            confirmButtonText: '确定',
                        });
                    }
                    this.GridLoading=false;
                });

            },
            GetBussNo() {
                if (!this.form.buss_no) {
                    let param2 = {};
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "clinic_storage_drug_no",
                        "param": JSON.stringify(param2)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {

                            this.form.buss_no = response.body.data.no;

                            this.SaveDrugProduct();
                        }
                    });
                }else{
                    this.SaveDrugProduct();
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
                    $("#" + id).find("input").css({"border-color": "#dcdfe6", "color": "#606266"});
                    $("#" + id).css({"border-color": "#dcdfe6", "color": "#606266"});
                }
            },
            GetNum(){
                let param={
                    "mapp_storage_drug_product_id":this.form.mapp_storage_drug_product_id
                };
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_storage_drug_product_num_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.form.actual_retail_num=response.body.data[0].actual_retail_num;

                        let list=$.extend(true,{},this.form);
                        this.tableData.push(list);
                        this.clearData();
                        this.form.buss_no=list.buss_no;
                    }

                });
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
            GetBaseItem(val){
                this.mapp_hospital_storage_id=this.searchOrg;
                let obj = {};
                obj = this.OrgCatgory.find((item)=>{
                    return item.mapp_hospital_storage_id === val;
                });

                this.org_name='_'+obj.show_name;
                this.dialogFormVisible=false;
            },
            selectStore(){
                if(!this.searchOrg){
                    this.$message({

                        message: '请选择药房！',
                        type: 'warning'
                    });

                    return;
                }
                this.dialogFormVisible=false;
            },
            GetBatch(drug_product_id){
                let param={
                    "hospital_storage_id":this.mapp_hospital_storage_id,
                    "drug_product_id":drug_product_id
                };
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_storage_drug_product_rest","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.bantchData = response.body.data;
                       // this.form.term_of_validity=this.bantchData[0].term_of_validity;
                      //  this.form.rest_num=this.bantchData[0].rest_num;
                     //   this.form.batch=this.bantchData[0].batch;
                        Vue.set(this.form, 'term_of_validity', this.bantchData[0].term_of_validity);
                        Vue.set(this.form, 'rest_num',this.bantchData[0].rest_num);
                        Vue.set(this.form, 'batch', this.bantchData[0].batch);

                    }
                });
            },
            GetRest(val){

                let obj = {};
                obj = this.bantchData.find((item)=>{
                    return item.batch === val;
                });
                this.form.term_of_validity=obj.term_of_validity;
                this.form.rest_num=obj.rest_num;
                Vue.set(this.form, 'term_of_validity', obj.term_of_validity);
                Vue.set(this.form, 'rest_num', obj.rest_num);
            }
        },
        mounted() {
            this.clearData();
            this.querySearchAsync();
            Vue.set(this.form, 'record_date', CurrentDate());
            this.form.record_date=CurrentDate();

            this.TableHeight=$(window).height()-125-$("#baseinfo").height();
            window.onresize  = () => {
                this.TableHeight = $(window).height()-125-$("#baseinfo").height();
            };
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
        width: 100px;
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
</style>
