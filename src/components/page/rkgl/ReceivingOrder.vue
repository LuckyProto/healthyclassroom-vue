<template>
    <div class="ReceivingNote content_inner">
        <div >
            <div class="classify"><h4 class="title">收货管理</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <div style="float:right;margin-bottom: 8px;">
                        <el-input class="search ml20"  placeholder="采购单号" v-model="searchInput" size="small" @keyup.native="Search">
                            <el-button slot="append" icon="el-icon-search" size="small" @click="GetData"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table  :data="table.TableData"  style="width: 100%;" :height="TableHeight" class="GridTable" v-loading="GridLoading" >
                    <el-table-column label="单号" min-width="160" prop="buss_no" sortable>
                    </el-table-column>
                    <el-table-column label="名称" min-width="240" prop="goods_name" sortable>
                    </el-table-column>
                    <el-table-column label="类型" min-width="110" prop="goods_type_name" sortable>
                    </el-table-column>
                    <el-table-column label="采购数量" min-width="110" prop="purchase_num" sortable show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="采购预算" min-width="110" prop="purchase_price" sortable>
                    </el-table-column>
                    <el-table-column label="采购单位" min-width="110" prop="purchase_unit" sortable>
                    </el-table-column>
                    <el-table-column label="备注" min-width="240" prop="remark" sortable>
                    </el-table-column>
                    <el-table-column label="操作" min-width="150">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)">收货</el-button>
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
        <el-dialog title="收货信息" :visible.sync="dialogFormVisible">
            <el-row :gutter="20" class="baseinfo" style="margin-top: -30px" >
                <el-col :span="24">
                    <span class="base-label">收货名称：</span>
                    <span >{{form.goods_name}}</span>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>收货数量：</span>
                    <el-input  size="small" clearable style="width:189px;" v-model="form.actual_num" id="actual_num" @focus="InputCss('actual_num')">
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <span class="base-label">发票号：</span>
                    <el-input  size="small"  style="width:189px;"  v-model="form.invoice" id="invoice">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>
                        进货总额：</span>
                    <el-input  size="small"  style="width:189px;"  v-model="form.receiving_price" id="receiving_price" @focus="InputCss('receiving_price')">
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>收货单位：</span>
                    <el-input disabled="disabled" size="small" clearable style="width:189px;" placeholder="请输入最小单位" v-model="form.receiving_unit" id="receiving_unit" @focus="InputCss('receiving_unit')">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="2" class="baseinfo">
                <el-col :span="30">
                    <span class="base-label">备注：</span>
                    <el-input  size="small" clearable style="width:520px;" v-model="form.receiving_remark" id="remark" >
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
        name: "receiving-note",
        data() {
            return {
                TableHeight:"448",               //表格最大高度
                table:{
                    TableData:[],
                    total_num:0,
                    pagination:"total, sizes, prev, pager, next"
                },
                form:{},
                GridLoading:false,
                dialogFormVisible:false,
                list:{}
            }
        },
        methods:{
            GetData(){
                //获取表格数据
                let param = {
                    "search":this.searchInput,
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                    "hospital_id":hospital_id
                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_purchase_detail_order_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.table=tableRequest(response.body,this.page_size);
                        if(this.table.TableData)
                            for(let i=0;i<this.table.TableData.length;i++){
                                switch (this.table.TableData[i].goods_type){
                                    case 0:
                                        this.table.TableData[i].goods_type_name="西药";
                                        break;
                                    case 1:
                                        this.table.TableData[i].goods_type_name="中药";
                                        break;
                                    case 2:
                                        this.table.TableData[i].goods_type_name="材料";
                                        break;
                                    default:
                                        return false;
                                }
                            }
                    }
                    this.GridLoading = false;
                });
            },
            clearData(){
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
              this.form={};
            },
            Search(){
                if(this.searchInput===""){
                    this.GetData();
                }
            },
            SaveDrugProduct(){
                let IDArr;
                IDArr = ["receiving_price", "actual_num","receiving_unit"];

                if (this.showPoint(IDArr))
                    return;

                //去空格
                this.form.receiving_unit=StrTrim(this.form.receiving_unit);


                this.form.receiving_status=0;  //收货状态 已收货

                this.form.hospital_id=hospital_id;
                let param = $.extend(true, {}, this.form);
                if (param.receiving_price === "" || param.receiving_price === null)
                    delete param.receiving_price;
                if (param.receiving_price !== undefined) {
                    param.receiving_price = Number(param.receiving_price).toFixed(2) * 100;
                }
                this.loading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_receiving_save","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.dialogFormVisible=false;

                        this.GetData();
                        this.$message({
                            message: '收货成功',
                            type: 'success'
                        });
                        this.list=$.extend(true,{},this.form);

                    }
                    this.loading=false;
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
                this.form.receiving_unit=item.purchase_unit;//收货单位默认为采购单位
                this.form.receiving_num=row.purchase_num;  //申请进货数量
                this.form.actual_num=item.purchase_num;  //进货数量数量
                Vue.set(this.form, 'receiving_date', CurrentDate());
                this.form.receiving_date=CurrentDate();
                this.form.invoice=this.list.invoice
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
            }
        },
        mounted() {
            this.GetData();
            Vue.set(this.form, 'receiving_date', CurrentDate());
            this.form.receiving_date=CurrentDate();

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
