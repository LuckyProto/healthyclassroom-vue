<template>
    <div  class="TreatmentProject content_inner">
        <div v-show="FrimShow">
            <div class="classify"><h4 class="title">诊疗项目</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <el-button type="primary" class="add" @click="AddForm">新增</el-button>
                    <span style="margin-left: 20px">项目分类：</span>
                    <el-select  v-model="selectItem" filterable size="small" id="selectItem"  style="width:215px;" @change="GetData">
                        <el-option
                            key="all"
                            label="全部"
                            value="all">
                        </el-option>
                        <el-option
                            v-for="item in itemCategory"
                            :key="item.item_category_id"
                            :label="item.item_category_name"
                            :value="item.item_category_id" >
                        </el-option>
                    </el-select>
                    <div style="float:right">
                        <span class="ml20">状态：</span>
                        <el-select  v-model="states"  size="small"  class="state" @change="GetData">
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
                            <el-button slot="append" icon="el-icon-search" size="small" @click="SearchForm"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table :data="table.TableData"  style="width: 100%;" :height="TableHeight" class="table" v-loading="GridLoading" :row-class-name="tableRowClassName">
                    <el-table-column min-width="100" property="item_code" label="编号"></el-table-column>
                    <el-table-column min-width="150" property="item_name" label="项目名称"></el-table-column>
                    <el-table-column min-width="100" property="unit_desc" label="单位"></el-table-column>
                    <el-table-column min-width="100" property="price" label="单价(元)"></el-table-column>
                    <el-table-column min-width="100" property="type_detail_name" label="标本/部位"></el-table-column>
                    <el-table-column min-width="200" property="remark" label="备注"></el-table-column>
                    <el-table-column label="操作" min-width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="info" plain @click="usableItem(scope.$index, scope.row)" v-if="scope.row.is_usable===0" v-model="is_usable">启用</el-button>
                            <el-button size="mini" type="primary" plain @click="usableItem(scope.$index, scope.row)" v-else-if="scope.row.is_usable===1" v-model="is_usable">停用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination style="height:15px;margin-top: -12px"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="10"
                        :layout="table.pagination"
                        :total="table.total_num">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-show="FormShow">
            <div class="classify"><h4 class="title">项目</h4></div>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>项目编号：</span>
                    <el-input  v-model="form.item_code" size="small" clearable style="width:240px;" id="item_code" @focus="InputCss('item_code')">
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>项目名称：</span>
                    <el-input v-model="form.item_name"  size="small" clearable style="width:240px;" id="item_name" @focus="InputCss('item_name')">
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>项目单价：</span>
                    <el-input v-model="form.price"  size="small" clearable style="width:240px;" id="price" @focus="InputCss('price')">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>项目单位：</span>
                    <el-input  v-model="form.unit_desc" size="small" clearable style="width:240px;" id="unit_desc" @focus="InputCss('unit_desc')">
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>项目分类：</span>
                    <el-select  v-model="form.item_category_id" filterable size="small" id="item_category_id"  style="width:240px;" @focus="InputCss('item_category_id')">
                        <el-option
                            v-for="item in itemCategory"
                            :key="item.item_category_id"
                            :label="item.item_category_name"
                            :value="item.item_category_id" >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>组合类型：</span>
                    <el-select  v-model="form.item_type_id" filterable size="small" id="item_type_id"  style="width:240px;" @focus="InputCss('item_type_id')" @change="GetItemDetailType">
                        <el-option
                            v-for="item in itemTypeCategory"
                            :key="item.item_type_id"
                            :label="item.type_name"
                            :value="item.item_type_id" >
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="8" >
                    <span class="base-label">标本/部位：</span>
                    <el-select  v-model="form.item_type_detail_id" filterable size="small"   style="width:240px;" v-bind:disabled="DetailEdit">
                        <el-option
                            v-for="item in itemDetailType"
                            :key="item.item_type_detail_id"
                            :label="item.type_detail_name"
                            :value="item.item_type_detail_id" >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span class="base-label" style="vertical-align: top">备注：</span>
                    <el-input  v-model="form.remark" size="small" clearable style="width:240px;" type="textarea" rows=3>
                    </el-input>
                </el-col>
            </el-row>
            <div class="category_btn">
                <el-button plain class="add" @click="CancelForm">取消</el-button>
                <el-button type="primary"  class="add" @click="SaveItem">保存</el-button>
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
    import {CurrentDate} from "../../../utilis/common.js";
    import Vue from 'vue';
    let storage = getLocalStorage();
    let departmentList=storage.getItem("departmentList");
    let credential_id=storage.getItem("credential_id");
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "TreatmentProject",
        data() {
            return {
                TableHeight:"448",             //表格最大高度
                searchInput:"",
                table:{
                    TableData:[],
                    total_num:"",
                    pagination:"total, sizes, prev, pager, next"
                },
                form:{
                    is_usable:1,
                    item_type_id:1,    //组合类型

                },
                selectItem:"all",
                states:"2",
                page_num:1,
                page_size:10,
                FrimShow:true,
                FormShow:false,
                GridLoading:false,  //表格加载loading
                itemCategory:[],
                itemTypeCategory:[],
                itemDetailType:[],
                DetailEdit:false

            }
        },
        methods:{
            GetData(){
                var param = {
                    "search": this.searchInput,
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                    "state":Number(this.states),
                    "item_category_id":Number(this.selectItem)
                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_item_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.table = tableRequest(response.body, this.page_size);


                    }
                    this.GridLoading = false;
                });
            },
            Search(){
                if(this.searchInput===""){
                    this.GetData();
                }
            },
            SearchForm(){
                this.GetData();
            },
            GetItem(){

                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_treatment_item_category_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.itemCategory = response.body.data;
                    }
                });
            },
            GetItemType(){

                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_treatment_item_type_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.itemTypeCategory = response.body.data;
                        this.GetItemDetailType();
                    }
                });
            },
            GetItemDetailType(){

                this.itemDetailType=[];
                if(this.form.item_type_id===3){
                    this.DetailEdit=true;
                }else{
                    this.DetailEdit=false;
                    }
                let param={
                    "item_type_id":this.form.item_type_id
                }
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_treatment_item_detail_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.itemDetailType = response.body.data;
                        if(this.itemDetailType){
                            if(this.itemDetailType.length===1){
                                this.form.item_type_detail_id=this.itemDetailType[0].item_type_detail_id
                            }
                        }
                    }
                });
            },
            clearData(){
                this.form={
                    is_usable:1,
                    item_type_id:1    //组合类型
                };
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
            },
            AddForm(){

                this.FrimShow=false;
                this.FormShow=true;
                this.clearData();
                if(this.selectItem!=="all"){
                    this.form.item_category_id=this.selectItem;
                }
            },
            CancelForm(){
                this.FrimShow=true;
                this.FormShow=false;
                this.GetData();
            },
            handleEdit(index,row){
                this.FrimShow=false;
                this.FormShow=true;
                this.clearData();
                this.form=row;
                this.GetItemDetailType()

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
            SaveItem(){
                let IDArr;
                IDArr = ["item_code", "item_name", "price","unit_desc", "item_category_id", "item_type_id","item_type_detail_id"];
                if (this.showPoint(IDArr))
                    return;

                if(this.form.item_id) {
                   //去空格
                    this.form.item_name=StrTrim(this.form.item_name);

                    if(this.form.item_type_id===3){
                        this.form.item_type_detail_id=101   //治疗的detail
                    }

                    let param = $.extend(true, {}, this.form);

                    if (this.form.price === "" || this.form.price === null)
                        delete param.price;
                    if (this.form.price !== undefined)
                        param.price = Number(param.price).toFixed(2) * 100;

                    //显示模态层 保存数据
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_item_update",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.CancelForm();                        //返回主页面 刷新表格信息

                            this.$alert("保存成功！", '提示', {
                                confirmButtonText: '确定',
                            });
                        }
                        this.GridLoading = false;
                    });
                }else{

                    //去空格
                    this.form.item_name=StrTrim(this.form.item_name);

                    let param = $.extend(true, {}, this.form);

                    //显示模态层 保存数据
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_item_save",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.CancelForm();                        //返回主页面 刷新表格信息

                            this.$alert("保存成功！", '提示', {
                                confirmButtonText: '确定',
                            });
                        }
                        this.GridLoading = false;
                    });
                }
            },
            usableItem(index,row){
                //启用 停用
                if(row.is_usable===0){
                    this.is_usable="启用";
                    row.is_usable=1;
                }else if(row.is_usable===1){
                    this.is_usable="停用";
                    row.is_usable=0;
                }
                var param=JSON.stringify(row);
                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_item_update","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this. GetData();                      //返回主页面 刷新表格信息
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                    this.GridLoading=false;
                });
            },
            tableRowClassName({row, rowIndex}) {

                if (row.is_usable===0) {
                    return 'success-row';
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
        mounted(){
            this.GetItem();
            this.GetItemType();
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
        padding:10px 10px 0 10px;
        height:83%
    }
    .category_btn{
        float:right;
        margin:0 10px 10px 10px;
        overflow: hidden;
    }
    .add{
        width:90px;
        height:30px;
        line-height:0;
    }
    .From{
        position:relative;
        height:100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .search{
        float:right;
        width:215px;
        margin-bottom:10px;
    }
    .table{
        border-top:1px solid #ccc;
    }
    .baseinfo{
        padding: 10px 0 5px 5px;
    }
    .base-label{
        width: 90px;
        display: inline-block;
        text-align: right;
    }
</style>
