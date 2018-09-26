<template>
    <div class="Firm content_inner">
        <div v-show="FrimShow" >
            <div class="classify"><h4 class="title">厂商管理</h4></div>
            <el-tabs :tab-position="tabPosition"  @tab-click="TabChange"  v-model="activeName">
                <el-tab-pane :label="list.name"  :name="list.manufacturer_category_id" :value="list.manufacturer_category_id" class="tab_content" v-for="list in tabSession" >
                    <div id="tools">
                        <el-button type="primary" class="add" @click="AddForm(list.manufacturer_category_id)">新增</el-button>
                        <div style="float:right">
                            <span class="base-label">产品类型：</span>
                                <el-select  v-model="select_product_category"  size="small" style="width:215px;margin-right:25px;" @change="GetData">
                                    <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                    </el-option>
                                <el-option
                                    v-for="item in ProductsType"
                                    :key="item.product_category_id"
                                    :label="item.name"
                                    :value="item.product_category_id">
                                </el-option>
                            </el-select>
                            <el-input class="search" placeholder="编号/名称" v-model="searchInput" size="small" @keyup.native="Search">
                                <el-button slot="append" icon="el-icon-search" size="small" @click="SearchForm"></el-button>
                            </el-input>
                        </div>
                    </div>
                    <el-table :data="tableData"  style="width: 100%;" :height="TableHeight" class="table" v-loading="loading" :row-class-name="tableRowClassName">
                        <!--<el-table-column label="编号" width="140" prop="org_code" sortable>-->
                        <!--</el-table-column>-->
                        <el-table-column label="名称" width="350" prop="org_name" sortable>
                        </el-table-column>
                        <el-table-column label="产品类型" width="200" prop="product_category_name" sortable>
                        </el-table-column>
                        <el-table-column label="厂家地址" width="420" prop="address" sortable>
                        </el-table-column>
                        <el-table-column label="操作" min-width="150">
                            <template slot-scope="scope">
                                <el-button size="mini" plain @click="handleEdit(scope.$index, scope.row,list.manufacturer_category_id)">编辑</el-button>
                                <el-button size="mini" type="info" plain @click="usable(scope.$index, scope.row)" v-if="scope.row.usable_flag===0" v-model="usable_flag">启用</el-button>
                                <el-button size="mini" type="primary" plain @click="usable(scope.$index, scope.row)" v-else-if="scope.row.usable_flag===1" v-model="usable_flag">停用</el-button>
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
                            :total="total_num"
                            :current-page="page_num">
                        </el-pagination>
                        <!--<el-pagination style="height:15px;margin-top: -12px" v-else="list.manufacturer_category_id===2"-->
                                       <!--@size-change="handleSizeChange2"-->
                                       <!--@current-change="handleCurrentChange2"-->
                                       <!--:page-sizes="[10, 20, 30, 40]"-->
                                       <!--:page-size="page_size2"-->
                                       <!--:layout="pagination2"-->
                                       <!--:total="total_num">-->
                        <!--</el-pagination>-->
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-form v-show="FormShow" class="From" v-loading.fullscreen.lock="loading">
            <div class="classify"><h4 class="title" v-model="FromTitle">{{FromTitle}}</h4></div>
            <el-row :gutter="13" class="baseinfo">
                <el-col :span="25" >
                    <span class="base-label"><span class="required">* </span>名称：</span>
                    <el-autocomplete
                        clearable
                        v-model="form.org_name"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        @select="GetBase"
                        @focus="InputCss('org_name')"
                        id="org_name"
                        size="small" style="width:440px;">
                    </el-autocomplete>
                </el-col>
                <el-col :span="10">
                    <span class="base-label">简称：</span>
                    <el-input v-model="form.short_name"  clearable  size="small" style="width:300px;">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10" >
                    <span class="base-label"><span class="required">* </span>产品类型：</span>
                    <el-select filterable v-model="product" multiple size="small" style="width:300px;" class="ProductType" id="product" @focus="InputCss('product')">
                        <el-option
                            v-for="item in ProductsType"
                            :key="item.product_category_id"
                            :label="item.name"
                            :value="item.product_category_id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="9" :offset="1">
                    <span class="base-label" >检索信息：</span>
                    <el-input   size="small" clearable style="width:300px;"  v-model="form.search" id="search" >
                    </el-input>
                </el-col>
                <el-button type="primary" plain="" size="mini" @click="GetSearch">生成检索</el-button>
                <el-col :span="8"  style="display:none">
                    <span class="base-label">厂商类型：</span>
                    <el-input v-model="FirmType"  size="small" :value="form.manufacturer_category_id" style="width:260px;" readonly="readonly" class="a">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10" >
                    <span class="base-label">营业执照号：</span>
                    <el-input v-model="form.license_code"  clearable  size="small" style="width:300px;">
                    </el-input>
                </el-col>
                <el-col :span="10" :offset="1">
                    <span class="base-label">营业执照照片：</span>
                    <el-input v-model="form.license_photo"  clearable  size="small" style="width:300px;">
                    </el-input>
                </el-col>

                </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10" >
                    <span class="base-label">经营许可证号：</span>
                    <el-input v-model="form.buss_code"  clearable  size="small" style="width:300px;">
                    </el-input>
                </el-col>
                <el-col :span="10" :offset="1">
                    <span class="base-label">注册证号：</span>
                    <el-input v-model="form.registration"  clearable  size="small" style="width:300px;">
                    </el-input>
                </el-col>

            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10" >
                    <span class="base-label">汇款银行：</span>
                    <el-input v-model="form.remi_bank_name"  clearable  size="small" style="width:300px;">
                    </el-input>
                </el-col>
                <el-col :span="10" :offset="1">
                    <span class="base-label">银行账号：</span>
                    <el-input v-model="form.bank_account"  clearable  size="small" style="width:300px;">
                    </el-input>
                </el-col>

            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label" >联系方式：</span>
                    <el-button size="mini" type="primary" plain @click="add_communication">新增一行</el-button>
                </el-col>

            </el-row>
            <el-row :gutter="20" class="baseinfo" style="margin-top: -10px;margin-bottom: -10px;">
                <el-col :span="10">
                    <div v-for="(item,index) in communication_rows" style="margin-bottom: 5px">
                        <span class="base-label" ></span>
                        <el-input placeholder="请输入内容" v-model="item.communication_value"  class="input-with-select"  size="small">
                            <el-select  slot="prepend" v-model="item.communication_category_id" placeholder="请选择" class="input-select">
                                <el-option
                                    v-for="items in communication"
                                    :key="items.communication_category_id"
                                    :label="items.name"
                                    :value="items.communication_category_id">
                                </el-option>
                            </el-select>
                        </el-input>
                        <!--<el-button type="primary" plain size="mini" @click="AddCommunication(index)">保存</el-button>-->
                        <el-button type="danger" size="mini" @click="DeleteCommunication(index)">删除</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label">具体地址：</span>
                    <el-input v-model="form.address"  clearable  size="small" style="width:300px;">
                    </el-input>
                </el-col>

            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10" >
                    <span class="base-label" style="vertical-align: top">营业执照内容：</span>
                    <el-input v-model="form.license_content" type="textarea"  clearable  size="mini" rows=4 style="width:300px;" >
                    </el-input>
                </el-col>
                <el-col :span="10" :offset="1">
                    <span class="base-label" style="vertical-align: top">备注：</span>
                    <el-input type="textarea"  v-model="form.remark" style="width:300px;" size="mini"  rows=4>
                    </el-input>
                </el-col>
            </el-row>
            <div class="category_btn" >
                <el-button plain class="add" @click="cancelForm">取消</el-button>
                <el-button type="primary"  class="add" @click="SaveManufacturer">保存</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {StrTrim} from "../../../utilis/common.js";
    import Vue from 'vue';
    export default {
        name: "firm-management",
        data() {
            return {
                TableHeight:"448",             //表格最大高度
                FrimShow:true,
                FromTitle:"新增",         //新增页面标题
                FormShow:false,
                tabPosition: 'left',
                searchInput:"",          //搜索框
                select_product_category:"all",
                activeName: "",         //默认选中name的tab
                form:{
                    org_id: "",
                    remark: "",
                    address: "",
                    pinying: "",
                    org_code: "",
                    org_name: "",
                    buss_code: "",
                    short_name: "",
                    usable_flag: "",
                    bank_account: "",
                    license_code: "",
                    registration: "",
                    license_photo: "",
                    remi_bank_name: "",
                    license_content: "",
                    product_category_id:"",         //产品类型编码
                    manufacturer_category_id:"",          //厂商类型编码
                    communication:[],       //通讯方式
                    product:[],
                },
                usable_flag:"",                 //停用启用
                FirmType:"",              //厂商类型
                ProductsType:[],         //产品类型数据
                tabSession:[],          //侧边栏数据
                tableData: [],          //表格数据
                communication_rows:[],
                product:[],
                OrgCatgory:[],          //厂商名称
                total_num:0,
                page_num:1,
                page_size:10,
                page_num2:1,
                page_size2:10,
                pagination2:"total, sizes, prev, pager, next",
                pagination:"total, sizes, prev, pager, next",
                loading:false,
                timeout:  null
            };
        },
        methods:{
            TabChange(tab,e){
                this.GetData();
            },
            GetData(){
                //获取表格数据
                let page_num;
                let page_size;
                // if(this.activeName===1){
                //     page_num=this.page_num;
                //     page_size=this.page_size;
                // }else if(this.activeName===2){
                //     page_num=this.page_num2;
                //     page_size=this.page_size2;
                // }
                    page_num=this.page_num;
                    page_size=this.page_size;
                    let param= {
                        "manufacturer_category_id" : this.activeName,
                        "search" :this.searchInput,
                        "page_num" :page_num,
                        "page_size":page_size,
                        "select_product_category":this.select_product_category
                    };
                this.loading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_manufacturer_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                         this.tableData=response.body.data.rows;
                        if(this.tableData)
                        for(let i=0;i<this.tableData.length;i++){
                            let productName=[];
                            if(this.tableData[i].product)
                             for(let j=0;j<this.tableData[i].product.length;j++){
                                 if(this.tableData[i].product[j].product_category_name)
                                 productName.push(this.tableData[i].product[j].product_category_name);
                             }
                            this.tableData[i].product_category_name=productName.join();
                        }
                        this.total_num=response.body.data.total_num;
                        if(this.total_num<=Number(this.page_size)) {
                            this.pagination = "total, sizes";
                        }else{
                            this.pagination = "total, sizes, prev, pager, next";
                        }
                        // if(this.total_num<=Number(this.page_size2)) {
                        //     this.pagination2 = "total, sizes";
                        // }else{
                        //     this.pagination2 = "total, sizes, prev, pager, next";
                        // }
                    }
                    this.loading=false;
                });
            },
            AddForm(id){                   //主页面新增厂商
                if(id===1){
                    this.FromTitle="新增供应商";
                    this.FirmType="供应商";
                    this.activeName=1;
                }else if(id===2){
                    this.FromTitle="新增厂商";
                    this.FirmType="厂商";
                    this.activeName=2;
                }

                this.clearData();         //清空表单
                this.form.usable_flag="1"; //新增厂商 非停用状态
                this.FrimShow=false;
                this.FormShow=true;

            },
            SearchForm(){
                this.GetData();
            },
            Search(){
                if(this.searchInput===""){
                    this.GetData();
                }
            },
            cancelForm(){
                this.GetData();
                this.FrimShow=true;
                this.FormShow=false;
            },
            handleEdit(index,row,id){     //编辑厂商
                this.clearData();
                if(id===1){
                    this.FromTitle="编辑供应商";
                    this.FirmType="供应商";
                }else if(id===2){
                    this.FromTitle="编辑厂商";
                    this.FirmType="厂商";
                }
                this.FrimShow=false;
                this.FormShow=true;
                //获取厂商详情信息
                this.loading=true;
                let param={
                    "org_id":row.org_id,
                    "manu_id":row.manu_id
                };
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_manufacturer_baseinfo_edit","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.form=response.body.data[0];
                        //处理数据
                        let arr=[];
                        if(response.body.data[0].product)
                            for(let i=0;i<response.body.data[0].product.length;i++){     //产品类型
                                arr[i]=response.body.data[0].product[i].product_category_id;
                            }
                        this.product=arr;
                        if(!response.body.data[0].communication_rows)
                            this.form.communication_rows=[];
                        this.communication_rows=response.body.data[0].communication_rows;
                    }
                    this.loading=false;
                });
            },
            usable(index,row){
                if(row.usable_flag===0){
                    this.usable_flag="启用";
                    row.usable_flag=1;
                }else if(row.usable_flag===1){
                    this.usable_flag="停用";
                    row.usable_flag=0;
                }
                let param=JSON.stringify(row);
                this.loading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_manufacturer_modify","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.communication=response.body.data;
                        this.cancelForm();                        //返回主页面 刷新表格信息
                        this.$alert("修改成功！", '提示', {
                            confirmButtonText: '确定',
                        });

                    }
                    this.loading=false;
                });
            },
            tableRowClassName({row, rowIndex}) {
                if (row.usable_flag===0) {
                    return 'success-row';
                }else{
                    return '';
                }
            },
            clearData(){              //清除表单数据
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
                this.form={};
                this.getCommunication();
                this.product=[];
                this.communication_rows=[{"communication_category_id":"","communication_value":""}];
            },
            add_communication(){                         //新增一行通讯方式
                this.communication_rows.push({"communication_category_id":"","communication_value":""});
                //this.getCommunication();                //获取通讯分类
            },
            DeleteCommunication(index){
                this.communication_rows.splice(index,1)
            },
            getCommunication(){   //获取通讯分类
                this.loading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_communication_category_query"}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.communication=response.body.data;
                    }
                    this.loading=false;
                });
            },
            SaveManufacturer(){                         //新增厂商
                let IDArr;
                IDArr = ["org_name","product"];

                if (this.showPoint(IDArr))
                    return;
                this.form.manufacturer_category_id=this.activeName;
                this.form.communication=this.communication_rows;

                //通讯

                let comm=[];
                if(this.communication_rows)
                for(let i=0;i<this.communication_rows.length;i++){
                    if(this.communication_rows[i].communication_category_id!=="" && this.communication_rows[i].communication_category_id!==null) {
                        comm.push(this.communication_rows[i]);
                    }
                }
                    this.form.communication=comm;
                 if(comm.length===0)
                    delete this.form.communication;


                //产品
                let pro=[];
                if(this.product)
                for(let j=0;j<this.product.length;j++){
                    let value={};
                    if(this.product[j]!==null) {
                        value.product_category_id = this.product[j];
                        pro.push(value);
                    }
                }
                this.form.product=pro;
                if(pro.length===0)
                    delete this.form.product;
                //去空格
                this.form.org_name=StrTrim(this.form.org_name);
               // this.form.org_code=StrTrim(this.form.org_code);
                this.form.short_name=StrTrim(this.form.short_name);

                let param=JSON.stringify(this.form);
                this.loading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_manufacturer_modify","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.communication=response.body.data;
                        this.form.manu_id=response.body.data.manu_id;    //返回厂商ID
                            this.cancelForm();                        //返回主页面 刷新表格信息
                            this.$alert("保存成功！", '提示', {
                                confirmButtonText: '确定',
                            });
                    }
                    this.loading=false;
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
            handleSizeChange2(val2) {
                this.page_size2=val2;
                this.GetData();
            },
            handleCurrentChange2(val2) {
                alert("handleCurrentChange2:"+val2)
                if(this.activeName===2) {
                    this.page_num2=val2;
                    this.GetData();
                }
            },
            showPoint(IDArray){
                //不能为空的提示
                let flag=false;
                for (let i=0;i<IDArray.length;i++){
                    this.form.product=this.product;
                    if(!this.form[IDArray[i]] || this.form[IDArray[i]]==="必填项不能为空" || this.form[IDArray[i]].length===0){
                         if(IDArray[i]==="org_name"){
                             $("#"+IDArray[i]).find("input").css({"color":"red","border-color":"red"});
                        }
                        $("#"+IDArray[i]).css({"color":"red","border-color":"red"});
                       if(IDArray[i]!=="product") {
                           Vue.set(this.form, IDArray[i], "必填项不能为空");
                       }else{
                           Vue.set(this.product,0,"必填项不能为空");
                       }
                        flag=true
                    }
                }
                return flag
            },
            InputCss(id){
                if(id!=="product") {
                    if (this.form[id] === "必填项不能为空") {
                        Vue.set(this.form, id, undefined);
                        $("#" + id).css({"border-color": "#dcdfe6", "color": "#606266"});
                        if (id === "org_name") {
                            $("#" + id).find("input").css({"border-color": "#dcdfe6", "color": "#606266"})
                        }
                    }
                }else{
                    if(this.product[0]==="必填项不能为空") {
                        Vue.set(this.product, 0, undefined);
                        this.product=[];
                        $("#product").css({"border-color": "#dcdfe6", "color": "#606266"});
                    }
                }
            },
            querySearchAsync(query,cb) {
                query=StrTrim(query);

                //生产厂商 远程搜索
                this.loading = false;
                var list = [{}];
                if (query !== '') {
                        let param = {
                            "search": query
                        };
                        this.$http.post(baseUrl() + '/comm', {
                            "methodName": "sp_clinic_org_query",
                            "param": JSON.stringify(param)
                        }).then((response) => {
                            if (requestSuccess(response.body, this)) {
                                this.OrgCatgory = response.body.data;
                                if(this.OrgCatgory!==null) {
                                    for (let i of this.OrgCatgory) {
                                        i.value = i.name;
                                    }
                                    list = this.OrgCatgory;
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
                    this.OrgCatgory = [];
                }
            },
            GetBase(item){
               // Vue.set(this.form,"org_code",item.code);
                Vue.set(this.form,"short_name",item.short_name);
                Vue.set(this.form,"license_code",item.license_code);
                Vue.set(this.form,"license_content",item.license_content);
                Vue.set(this.form,"license_photo",item.license_photo);
                Vue.set(this.form,"address",item.address);
                if(item.communication_rows)

                this.communication_rows=item.communication_rows;


            },
            GetSearch(){
                //生产检索
                if(!this.form.org_name)
                    this.form.org_name="";
                if(!this.form.short_name)
                    this.form.short_name="";

                this.$http.post(baseUrl()+'/manufacturerSearch',{"org_name":this.form.org_name,"short_name":this.form.short_name}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        Vue.set(this.form,"search","名称:"+response.body.data.name+",简称:"+response.body.data.short_name);

                        this.form.search="名称:"+response.body.data.name+",简称:"+response.body.data.short_name
                    }
                });
            }
        },
        mounted(){
            this.TableHeight=($(".content_inner").height())*0.775;
            window.onresize  = () => {
                this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-85;
            };
            this.add_communication();
            //侧边栏
            this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_manufacturer_category_query",}).then((response) => {
                if(requestSuccess(response.body,this)){
                    this.tabSession=response.body.data;
                //侧边栏默认选中项
                this.activeName = this.tabSession[0].manufacturer_category_id;
                //获取表格数据
                this.GetData();
            }
        });

            //产品分类
            this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_product_category_query"}).then((response) => {
                if(requestSuccess(response.body,this)){
                    this.ProductsType=response.body.data;
                }
            });
        }
    }
</script>

<style scoped>
    .input-with-select {
        background-color: #ffffff;
        width:300px;

    }
    .input-select{
        width:90px;
    }
    .input-select input{
        border-color:transparent!important;
    }
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
        padding:8px 10px 0 5px;
    }
    .add{
        width:90px;
        height:30px;
        line-height:0;
    }
    .search{
        float:right;
        width:215px;
    }
    .table{
        border-top:1px solid #ccc;
        margin-top: 10px;
    }
    .baseinfo{
        padding: 10px 0 5px 5px;
    }
    .base-label{
        width: 133px;
        display: inline-block;
        text-align: right;
    }
    .category_btn{
        float:right;
        margin:30px 10px;
        overflow: hidden;
    }
</style>
