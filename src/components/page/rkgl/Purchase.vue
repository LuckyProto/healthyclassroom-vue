<template>
    <div class="Purchase content_inner">
        <div >
            <div class="classify"><h4 class="title">采购入库</h4></div>
            <div class="tab_content">
                <div id="tools">
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
                    <el-table-column label="收货日期" min-width="100" prop="receiving_date" sortable>
                    </el-table-column>
                    <el-table-column label="备注" min-width="140" prop="remark"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" min-width="80">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">入库</el-button>
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
        <el-dialog title="入库信息" :visible.sync="dialogFormVisible">
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>有效日期：</span>
                    <el-date-picker
                        v-model="form.term_of_validity"
                        type="date"
                        size="small"
                        id="term_of_validity"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerBeginDateBefore"
                        placeholder="选择日期" style="width:189px;" @focus="InputCss('term_of_validity')">
                    </el-date-picker>
                </el-col>
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>药品批号：</span>
                    <el-input  size="small" clearable style="width:189px;" v-model="form.batch" id="batch" @focus="InputCss('batch')">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label">
                        入库单价：</span>
                    <el-input disabled="disabled" size="small" clearable style="width:189px;" v-model="form.price" id="price">
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <span class="base-label">入库单位：</span>
                    <el-input disabled="disabled" size="small" clearable style="width:189px;" placeholder="请输入最小单位" v-model="form.receiving_unit" id="receiving_unit" @focus="InputCss('receiving_unit')">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>入库数量：</span>
                    <el-input  size="small" clearable style="width:189px;" v-model="form.library_num" id="library_num" @focus="InputCss('library_num')" @keyup.native="total">
                    </el-input>
                </el-col>
                <!--<el-col :span="12">-->
                    <!--<span class="base-label">购入金额：</span>-->
                    <!--<el-input disabled size="small"  style="width:189px;"  v-model="form.input_total" id="input_total">-->
                    <!--</el-input>-->
                <!--</el-col>-->
            </el-row>
            <el-row :gutter="2" class="baseinfo">
                <el-col :span="30">
                    <span class="base-label">备注：</span>
                    <el-input  size="small" clearable style="width:520px;" v-model="form.p_remark" id="remark" >
                    </el-input>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="GetBussNo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {StrTrim} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import {tableRequest} from "../../../utilis/common.js";
    import {CurrentDate} from "../../../utilis/common.js";
    import Vue from 'vue';
    let storage = getLocalStorage();
    let departmentList=storage.getItem("departmentList");
    let credential_id=storage.getItem("credential_id");
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "purchase",
        data() {
            return {
                TableHeight:"448",               //表格最大高度
                searchInput:"",
                table:{
                    TableData:[],
                    total_num:0,
                    pagination:"total, sizes, prev, pager, next"
                },
                form:{
                    "l_buss_type":"in1",
                    "credential_id":credential_id,
                    "is_back":0
                },
                GridLoading:false,
                dialogFormVisible:false,
                pickerBeginDateBefore:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                page_num:1,
                page_size:10,

            }
        },
        methods:{
            GetData(){


                //获取表格数据
                let param = {
                    "search":this.searchInput,
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                    "hospital_id":hospital_id,
                    "status":0

                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_receiving_report",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.table=tableRequest(response.body,this.page_size);

                    }
                    this.GridLoading = false;
                });
            },
            clearData(){
              this.form={
                  "l_buss_type":"in1",
                  "credential_id":credential_id,
                  "is_back":0
              };
            },
            Search(){
                if(this.searchInput===""){
                    this.GetData();
                }
            },
            SaveDrugProduct(){
                let IDArr;
                //IDArr = ["drug_product_name", "library_date","drug_date","library_num"];
                IDArr = ["library_num","term_of_validity","batch"];
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
                //this.price_total=this.price_total+Number(this.form.input_total);    //购入总金额
                let params = $.extend(true, {}, this.form);
                if (params.price === "" || params.price === null)
                    delete params.price;
                if (params.price !== undefined)
                    params.price = Number(this.form.price)* 100;

                params.record_num=params.library_num;
                params.record_unit=params.library_unit;
                params.hospital_id=hospital_id;
                let param=JSON.stringify(params);

                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_library_save","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.clearData();
                        this.dialogFormVisible=false;

                        this.$message({
                            message: '采购入库成功',
                            type: 'success'
                        });
                        this.GetData();
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
                        $("#"+IDArray[i]).css({"color":"red","border-color":"red"});
                        flag=true
                    }
                }
                return flag
            },
            InputCss(id){
                if(this.form[id]==="必填项不能为空") {
                    Vue.set(this.form, id, undefined);
                    $("#" + id).css({"border-color": "#dcdfe6", "color": "#606266"})
                }
            },
            handleEdit(index,row){
                this.clearData();
                this.dialogFormVisible=true;
                let item=$.extend(true,[], row);
                this.form=$.extend({}, this.form, row);
                this.form.library_num=item.actual_num;
                this.form.library_unit=item.receiving_unit;
                this.form.price=Number(item.receiving_price)/Number(item.actual_num).toFixed(2);

            },
            GetBussNo() {
                    let param2 = {};
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "clinic_receiving_no",
                        "param": JSON.stringify(param2)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            this.form.buss_no = response.body.data.no;
                            this.SaveDrugProduct();
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
            total(value){

                this.form.price=Number(this.form.price).toFixed(2);
                this.form.input_total=Number(this.form.library_num*this.form.price).toFixed(2);
               // alert(this.form.input_total)
              //  alert(value)
                Vue.set(this.form, 'input_total', this.form.input_total);
            }
        },
        mounted() {
            this.GetData();
            Vue.set(this.form, 'library_date', CurrentDate());
            this.form.library_date=CurrentDate();

            this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-120;
            window.onresize  = () => {
                this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-120;
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
