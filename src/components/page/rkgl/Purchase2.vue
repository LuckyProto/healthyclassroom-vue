<template>
    <div class="Purchase content_inner">
        <div class="Form">
            <div class="classify"><h4 class="title">采购入库</h4></div>
            <div id="baseinfo" style="border-bottom: 1px solid #dfdfdf;padding-bottom: 5px;">
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="12">
                        <span class="base-label"><span class="required">* </span>收货单：</span>
                        <el-autocomplete
                            clearable
                            v-model="form.goods_name"
                            :fetch-suggestions="querySearchDrug"
                            placeholder="请输入单号/货品名称"
                            @select="GetBase"
                            @focus="InputCss('goods_name')"
                            id="goods_name"
                            size="small" style="width:240px;">
                        </el-autocomplete>
                        <el-popover
                            placement="right"
                            title="收货单明细"
                            width="600"
                            trigger="hover">
                            <el-row :gutter="2" class="baseinfo">
                                <el-col :span="10">
                                    <span class="base-label-cn">收货日期：</span>
                                    <span   style="width:189px;"  v-model="form.receiving_date">{{form.receiving_date}}</span>
                                </el-col>
                                <el-col :span="10">
                                    <span class="base-label-cn">收货数量：</span>
                                    <span   style="width:189px;"  v-model="form.actual_num">{{form.actual_num}}</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="2" class="baseinfo">
                                <el-col :span="10">
                                    <span class="base-label-cn">收货单价：</span>
                                    <span   style="width:189px;"  v-model="form.receiving_price">{{form.receiving_price}}</span>
                                </el-col>
                                <el-col :span="10">
                                    <span class="base-label-cn">收货单位：</span>
                                    <span   style="width:189px;"  v-model="form.receiving_unit">{{form.receiving_unit}}</span>
                                </el-col>
                            </el-row>
                            <el-row :gutter="2" class="baseinfo">
                                <el-col :span="30">
                                    <span class="base-label-cn">发票号：</span>
                                    <span   style="width:189px;"  v-model="form.invoice">{{form.invoice}}</span>
                                </el-col>
                            </el-row>
                            <el-button size="mini" slot="reference">详情</el-button>
                        </el-popover>
                    </el-col>
                    <el-col :span="12">
                        <span class="base-label">备注：</span>
                        <el-input  size="small" clearable style="width:485px;" v-model="form.remark" id="remark" >
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="6">
                        <span class="base-label"><span class="required">* </span>入库数量：</span>
                        <el-input  size="small" clearable style="width:169px;" v-model="form.library_num" id="library_num" @focus="InputCss('library_num')">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label"><span class="required">* </span>入库单位：</span>
                        <el-input  size="small" clearable style="width:169px;" v-model="form.library_unit" id="library_unit" @focus="InputCss('library_unit')">
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label"><span class="required">* </span>有效日期：</span>
                        <el-date-picker
                            v-model="form.term_of_validity"
                            type="date"
                            size="small"
                            id="term_of_validity"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerBeginDateBefore"
                            placeholder="选择日期" style="width:175px;" @focus="InputCss('term_of_validity')">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label"><span class="required">* </span>药品批号：</span>
                        <el-input  size="small" clearable style="width:169px;" v-model="form.batch" id="batch" @focus="InputCss('batch')">
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="6">
                        <span class="base-label">进货单价：</span>
                        <el-input readonly="readonly" size="small" clearable style="width:169px;" v-model="form.price" id="price">
                        </el-input>
                        <span v-show="ShowUnit" v-model="form.library_unit">元/{{form.library_unit}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">购入总额：</span>
                        <el-input disabled size="small"  style="width:169px;"  v-model="price_total" id="price_total">
                        </el-input>
                    </el-col>
                    <div id="buttons" style="float:right;margin:0 20px 5px 0;">
                        <el-button type="primary" style="width:70px" size="mini"  @click="SaveDrugProduct">保 存</el-button>
                    </div>
                </el-row>

            </div>
            <el-table :data="tableData"  style="width: 100%;"  :height="TableHeight"   v-loading="GridLoading">
                <el-table-column label="名称" width="220" prop="goods_name" sortable>
                </el-table-column>
                <el-table-column label="入库数量" width="120" prop="library_num" sortable>
                </el-table-column>
                <el-table-column label="入库单位" width="120" prop="library_unit" sortable>
                </el-table-column>
                <el-table-column label="进货价(元)" width="120" prop="price" sortable>
                </el-table-column>
                <el-table-column label="进货总额(元)" width="120" prop="input_total">
                </el-table-column>
                <el-table-column label="批号" width="150" prop="batch" sortable>
                </el-table-column>
                <el-table-column label="有效期" width="120" prop="term_of_validity" sortable>
                </el-table-column>
                <el-table-column label="供应商" width="280" prop="applyMan" sortable>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="采购入库" :visible.sync="dialogTableVisible" width="75%">
                <span >入库日期：</span>
                <el-date-picker
                v-model="form.s_library_date"
                type="date"
                size="small"
                id="library_date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                placeholder="选择日期" style="width:180px;" @click="GetData">
                </el-date-picker>
                <span class="base-label">发票号：</span>
                <el-input  size="small" clearable style="width:189px;" v-model="form.invoice" id="invoice">
                </el-input>
                <span class="base-label">药品名称：</span>
                <el-autocomplete
                        clearable
                        v-model="form.drug_product_name"
                        :fetch-suggestions="querySearchDrug"
                        placeholder="请输入内容"
                        @select="GetData"
                        size="small" style="width:180px;">
                    </el-autocomplete>
            <el-button  type="primary" plain size="small" @click="GetData">搜索</el-button>
            <el-button  type="primary"  size="small" >确定</el-button>
            <el-table :data="gridData" :height="TableHeight"
                      v-loading="loading"
                      highlight-current-row
                      @current-change="handleCurrentChange">
                <el-table-column label="入库日期" width="120" prop="d_library_date" sortable>
                </el-table-column>
                <el-table-column label="名称" width="200" prop="name" sortable>
                </el-table-column>
                <el-table-column label="规格" width="100" prop="drug_spec_value" sortable>
                </el-table-column>
                <el-table-column label="入库数量" width="100" prop="library_num" sortable>
                </el-table-column>
                <el-table-column label="单位" width="100" prop="library_unit" sortable>
                </el-table-column>
                <el-table-column label="进货价(元)" width="100" prop="price">
                </el-table-column>
                <el-table-column label="进货总额(元)" width="100" prop="input_total">
                </el-table-column>
                <el-table-column label="批号" width="120" prop="batch" sortable>
                </el-table-column>
                <el-table-column label="有效期" width="120" prop="drug_date" sortable>
                </el-table-column>
                <el-table-column label="发票号" width="120" prop="invoice" sortable>
                </el-table-column>
                <el-table-column label="供应商" min-width="220" prop="manufacturer_name" sortable>
                </el-table-column>
            </el-table>
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
        name: "purchase2",
        data() {
            return {
                TableHeight:"397",     //查询表格
                OrgCatgory:[],   //供应商数据
                DrugCatgory:[],  //药品数据
                form:{
                    "buss_type":"in1",
                    "credential_id":credential_id,
                    "is_back":0
                },
                tableData:[],
                gridData:[],
                price_total:0,  //购入总额
                total_num:0,
                page_num:1,
                page_size:10,
                pagination:"total, sizes, prev, pager, next",
                GridLoading:false,
                ShowUnit:false,
                dialogTableVisible:false,
                pickerBeginDateBefore:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                }

            }
        },
        methods:{
            GetData(){
                //获取表格数据
                let param = {
                    "s_library_date":this.form.s_library_date,
                    "invoice": this.form.invoice,
                    "buss_type":"in1",
                    "mapp_storage_drug_product_id":this.form.mapp_storage_drug_product_id,
                    "drug_product_name":this.form.drug_product_name,
                    "credential_id":credential_id
                };
                this.loading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_storage_drug_product_record_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.gridData = response.body.data;
                        if(this.gridData)
                        for(let i=0;i<this.gridData.length;i++){
                            this.gridData.input_total= Number(this.gridData.library_num*this.gridData.price).toFixed(2);
                        }
                    }
                    this.loading = false;
                });
            },
            tableRowClassName({row, rowIndex}) {
                if (row.is_open===1) {
                    return 'success-row';
                }else{
                    return '';
                }
            },
            clearData(){
                this.form={
                    "buss_type":"in1",
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
                        "hospital_id":hospital_id
                    };
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "sp_clinic_receiving_order_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            this.DrugCatgory = response.body.data;
                            if(this.DrugCatgory!==null) {
                                for (let i of this.DrugCatgory) {
                                    i.value = i.goods_name;
                                }
                                list = this.DrugCatgory;
                            }else{
                                list=undefined
                            }
                            clearTimeout(this.timeout);
                            this.timeout = setTimeout(() => {
                                cb(list);
                            }, 800);
                        }
                    });
                } else {
                    this.DrugCatgory = [];
                }
            },
            GetBase(item){
                let list=$.extend(true,[], item);
                this.form=$.extend({}, this.form, item);
                this.form.library_num=list.actual_num;
                this.form.library_unit=list.receiving_unit;
                this.form.price=list.receiving_price;
            },
            SaveDrugProduct(){
                let IDArr;
                //IDArr = ["drug_product_name", "library_date","drug_date","library_num"];
                IDArr = ["goods_name","library_num", "library_unit","term_of_validity","batch"];
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


                this.form.price=Number(this.form.price).toFixed(2);
                this.form.input_total=Number(this.form.library_num*this.form.price).toFixed(2); //进货总额
                this.price_total=this.price_total+Number(this.form.input_total);    //购入总金额
                let params = $.extend(true, {}, this.form);
                if (params.price === "" || params.price === null)
                    delete params.price;
                if (params.price !== undefined)
                    params.price = Number(this.form.price)* 100;

                let param=JSON.stringify(params);

                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_library_save","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        //this.form.mapp_storage_drug_product_record_id=response.body.data.mapp_storage_drug_product_record_id;
                        let list=$.extend(true,{},this.form);
                        this.tableData.push(list);
                        this.clearData();
                        this.form.library_date=list.library_date; //入库日期
                        //this.form.invoice=list.invoice;
                        this.$alert("保存成功！", '提示', {
                            confirmButtonText: '确定',
                        });
                    }
                    this.GridLoading=false;
                });

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
            handleCurrentChange(val){
                //选择一行入库数据
               val.credential_id=credential_id;
               val.library_date=CurrentDate();
               val.relation_p_id=val.mapp_storage_drug_product_record_id;

                this.form = $.extend({}, this.form, val);
            },

        },
        mounted() {
            this.clearData();
            Vue.set(this.form, 'library_date', CurrentDate());
            this.form.library_date=CurrentDate();

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
