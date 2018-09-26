<template>
    <div  class="TreatmentProject content_inner">
        <div v-show="FrimShow">
            <div class="classify"><h4 class="title" >组合项目</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <el-button type="primary" class="add" @click="AddForm">新增</el-button>
                    <span style="margin-left: 20px">组合类型：</span>
                    <el-select  v-model="selectItem" filterable size="small" id="selectItem"  style="width:215px;" @change="GetData">
                        <el-option
                            key="all"
                            label="全部"
                            value="all">
                        </el-option>
                        <el-option
                            v-for="item in itemTypeCategory"
                            :key="item.item_group_category_id"
                            :label="item.category_name"
                            :value="item.item_group_category_id" >
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
                    <el-table-column min-width="100" property="group_code" label="编号"></el-table-column>
                    <el-table-column min-width="200" property="group_name" label="组合名称"></el-table-column>
                    <el-table-column min-width="100" property="unit_desc" label="单位"></el-table-column>
                    <el-table-column min-width="100" property="group_sale_price" label="组合单价(元)"></el-table-column>
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
            <div class="classify">
                <h4 class="title" v-model="FromTitle">{{FromTitle}}</h4>
                <el-row :gutter="20" class="baseinfo">
                    <el-col :span="7">
                        <span class="base-label"><span class="required">* </span>组合名称：</span>
                        <el-input v-model="form.group_name"  size="small" clearable style="width:240px;" id="group_name" @focus="InputCss('group_name')">
                        </el-input>
                    </el-col>
                    <el-col :span="5">
                        <span class="base-label"><span class="required">* </span>组合编码：</span>
                        <el-input  v-model="form.group_code" size="small" clearable style="width:145px;" id="group_code" @focus="InputCss('group_code')">
                        </el-input>
                    </el-col>
                    <el-col :span="5">
                        <span class="base-label"><span class="required">* </span>组合分类：</span>
                        <el-select  v-model="form.item_group_category_id" filterable size="small" id="item_group_category_id"  style="width:145px;" >
                            <el-option
                                v-for="item in itemTypeCategory"
                                :key="item.item_group_category_id"
                                :label="item.category_name"
                                :value="item.item_group_category_id" >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <span class="base-label"><span class="required">* </span>项目单位：</span>
                        <el-input  v-model="form.unit_desc" size="small" clearable style="width:145px;" id="unit_desc" @focus="InputCss('unit_desc')">
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="baseinfo">
                    <el-col :span="6">
                        <span class="base-label">组合单价：</span>
                        <el-input v-model="form.group_sale_price"  size="small" clearable style="width:145px;" id="group_sale_price" @focus="InputCss('group_sale_price')">
                        </el-input> 元
                    </el-col>
                    <el-col :span="5">
                        <span class="base-label">组合类型：</span>
                        <el-select  v-model="form.item_group_type_id" filterable size="small" id="item_group_type_id"  style="width:145px;"   @change="GetItemGroupDetailType">
                            <el-option
                                v-for="item in itemGroupTypeCategory"
                                :key="item.item_group_type_id"
                                :label="item.type_name"
                                :value="item.item_group_type_id" >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <span class="base-label">类型分类：</span>
                        <el-select  v-model="form.item_group_type_detail_id" filterable size="small" id="item_group_type_detail_id"  style="width:145px;" >
                            <el-option
                                v-for="item in itemGroupDetailType"
                                :key="item.item_group_type_detail_id"
                                :label="item.type_detail_name"
                                :value="item.item_group_type_detail_id" >
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <span class="base-label" >备注：</span>
                        <el-input  v-model="form.remark" size="small" clearable style="width:280px;" >
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div id="baseinfo" style="border-bottom: 1px solid #dfdfdf;padding-bottom: 5px;">
                <el-row :gutter="20" class="baseinfo">
                <el-col :span="7">
                    <span>项目明细</span><span class="base-label"><span class="required">* </span>项目分类：</span>
                    <el-select  v-model="form.element_type" filterable size="small" id="element_type"  style="width:150px;"  @focus="InputCss('element_type')">
                        <el-option
                            key="1"
                            label="诊疗"
                            value="1">
                        </el-option>
                        <el-option
                            key="2"
                            label="材料"
                            value="2" >
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>项目名称：</span>
                    <el-autocomplete
                        clearable
                        v-model="form.element_name"
                        :fetch-suggestions="querySearchDrug"
                        placeholder="名称/编码"
                        @select="GetBase"
                        @focus="InputCss('element_name')"
                        id="element_name"
                        size="small" style="width:250px;">
                    </el-autocomplete>
                </el-col>
                <el-col :span="6">
                    <span class="base-label"><span class="required">* </span>检验地点：</span>
                    <el-select  v-model="form.place" filterable size="small" id="place"  style="width:150px;" @focus="InputCss('place')" >
                        <el-option
                            key="1"
                            label="本单位"
                            value="1">
                        </el-option>
                        <el-option
                            key="0"
                            label="外送"
                            value="0" >
                        </el-option>

                    </el-select>
                </el-col>
            </el-row>
                <el-row :gutter="20" class="baseinfo">
                <el-col :span="7">
                    <span style="visibility: hidden">项目明细</span><span class="base-label">项目成本：</span>
                    <el-input  v-model="form.cost_price" size="small" clearable style="width:150px;" id="cost_price">
                    </el-input> 元
                </el-col>
                <el-col :span="7">
                    <span class="base-label"><span class="required">* </span>项目单价：</span>
                    <el-input  v-model="form.sale_price" size="small" clearable style="width:150px;" id="sale_price" @focus="InputCss('sale_price')">
                    </el-input> 元
                </el-col>
                <el-col :span="6">
                    <span class="base-label"><span class="required">* </span>数量：</span>
                    <el-input  v-model="form.quantity" size="small" clearable style="width:150px;" id="quantity" @focus="InputCss('quantity')">
                    </el-input>
                </el-col>
                <div  style="float:right;margin:0 20px 5px 0;">
                    <el-button v-bind:disabled="EditDisable" type="primary" style="width:70px" size="mini"  @click="addData">添 加</el-button>
                    <el-button type="primary" plain="" style="width:70px" size="mini"  @click="clearDetail">清 空</el-button>
                </div>
            </el-row>
            </div>
                <el-table :data="tableData"  style="width: 100%;"  :height="tableHeight"   v-loading="GridLoading" @row-click="RowClick">
                    <el-table-column label="项目分类" min-width="90" prop="element_type_name" >
                    </el-table-column>
                    <el-table-column label="项目编号" min-width="110" prop="item_code" sortable>
                    </el-table-column>
                    <el-table-column label="项目名称" min-width="240" prop="element_name" sortable>
                    </el-table-column>
                    <el-table-column label="检验地点" min-width="100" prop="place_name" >
                    </el-table-column>
                    <el-table-column label="成本价(元)" min-width="110" prop="cost_price" >
                    </el-table-column>
                    <el-table-column label="项目单价(元)" min-width="130" prop="sale_price" >
                    </el-table-column>
                    <el-table-column label="数量" min-width="100" prop="quantity" >
                    </el-table-column>
                    <el-table-column label="小计" min-width="100" prop="sale_total" sortable>
                    </el-table-column>
                    <el-table-column label="操作" min-width="70">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" plain @click="DelDetail(scope.$index, scope.row,$event)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            <div class="category_btn" style="margin-top: 10px">
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
                tableData:[],          //项目表格
                tableHeight:"300",       //项目表格高度
                form:{
                    is_usable:1,
                    item_type_id:1,    //组合类型
                    quantity:1,         //数量
                    place:"1",           //检验地点
                    element_type:"1",

                },
                FromTitle:"",
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
                itemName:[],
                itemGroupTypeCategory:[],
                itemGroupDetailType:[]


            }
        },
        methods:{
            GetData(){

                var param = {
                    "search": this.searchInput,
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                    "state":Number(this.states),
                    "item_group_category_id":Number(this.selectItem)
                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_item_group_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.table = tableRequest(response.body, this.page_size);


                    }
                    this.GridLoading = false;
                });
            },
            GetDetailData(row){
                var param = {
                    "item_group_id": row.item_group_id,
                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_item_group_detail_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.tableData = response.body.data;
                        if(this.tableData)
                            for(let i=0;i<this.tableData.length;i++){
                                if(this.tableData[i].element_type===1){
                                    this.tableData[i].element_type_name="诊疗"
                                }else if(this.tableData[i].element_type===2){
                                    this.tableData[i].element_type_name="材料"
                                }
                                if(this.tableData[i].place===1){
                                    this.tableData[i].place_name="本单位"
                                }else if(this.tableData[i].place===0){
                                    this.tableData[i].place_name="外送"
                                }

                                this.tableData[i].sale_total=(Number(this.tableData[i].sale_price)*Number(this.tableData[i].quantity)).toFixed(2);
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
            SearchForm(){
                this.GetData();
            },
            GetItemType(){
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_treatment_item_group_type_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.itemTypeCategory = response.body.data;
                    }
                });
            },
            clearData(){
                this.form={
                    is_usable:1,
                    item_type_id:1,    //组合类型
                    quantity:1,         //数量
                    place:"1",           //检验地点
                    element_type:"1",
                };
                this.tableData=[];
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
            },
            AddForm(){

                this.FrimShow=false;
                this.FormShow=true;
                this.clearData();
                if(this.selectItem!=="all"){
                    this.form.item_category_id=this.selectItem;
                }
                this.FromTitle="新增组合项目"
            },
            CancelForm(){
                this.FrimShow=true;
                this.FormShow=false;
                this.GetData();
            },
            handleEdit(index,row){

                this.FrimShow=false;
                this.FormShow=true;
                this.form=row;
                this.form.place="1";
                this.form.element_type="1";
                this.form.quantity=1;
                this.FromTitle="编辑组合项目";

                this.GetDetailData(row);

                this.GetItemGroupDetailType();
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
                IDArr = ["unit_desc","item_group_category_id","group_code","group_name"];
                if (this.showPoint(IDArr))
                    return;

                if (this.form.group_sale_price === "" || this.form.group_sale_price === null)
                    delete this.form.group_sale_price;
                if (this.form.group_sale_price !== undefined)
                    this.form.group_sale_price = Number(this.form.group_sale_price).toFixed(2) * 100;

                let detailList=$.extend(true, [], this.tableData);

                for(let i=0;i<detailList.length;i++){
                    if (detailList[i].cost_price === "" || detailList[i].cost_price === null)
                        delete detailList[i].cost_price;
                    if (detailList[i].cost_price !== undefined)
                        detailList[i].cost_price = Number(detailList[i].cost_price).toFixed(2) * 100;

                    if (detailList[i].sale_price === "" || detailList[i].sale_price === null)
                        delete detailList[i].sale_price;
                    if (detailList[i].sale_price !== undefined)
                        detailList[i].sale_price = Number(detailList[i].sale_price).toFixed(2) * 100;
                }
                this.form.hospital_id=hospital_id;
                this.form.detailList=detailList;
                let param = $.extend(true, {}, this.form);

                if(this.form.item_group_id) {
                   //去空格
                    this.form.group_name=StrTrim(this.form.group_name);

                    //显示模态层 保存数据
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_item_group_update",
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
                    this.form.group_name=StrTrim(this.form.group_name);

                    //显示模态层 保存数据
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_item_group_save",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.CancelForm();
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
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_item_group_update","param":param}).then((response) => {
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
            querySearchDrug(query,cb) {
                if(!this.form.element_type){
                    this.$alert("请选择项目分类！", '提示', {
                        confirmButtonText: '确定',
                    });
                    return;
                }

                // 项目名称远程搜索
                this.loading = false;
                query=StrTrim(query);
                let list = [{}];
                if (query !== '') {
                    let param = {
                        "search": query,
                        "hospital_id":hospital_id,
                        "element_type":this.form.element_type
                    };
                    this.$http.post(baseUrl() + '/comm', {
                        "methodName": "sp_clinic_item_group_name_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if (requestSuccess(response.body, this)) {
                            if(response.body.data!==null)
                                this.itemName = response.body.data;
                            else{
                                this.itemName=[];
                            }
                            if(this.itemName!==null) {
                                for (let i of this.itemName) {
                                    i.value = i.item_name;
                                }
                                list = this.itemName;
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
                    this.itemName = [];
                }
            },
            GetBase(item){
                //this.form=$.extend({}, this.form, item);
                this.form.element_id=item.item_id;
                this.form.element_name=item.item_name;
                this.form.item_code=item.item_code;
                Vue.set(this.form,'sale_price',Number(item.item_price)/100);
                this.form.sale_price=Number(item.item_price)/100;

            },
            addData(){
                let IDArr;
                IDArr = ["unit_desc","item_group_category_id","group_code","group_name","element_type", "element_name","place","sale_price","quantity"];
                if (this.showPoint(IDArr))
                    return;

                let param = $.extend(true, {}, this.form);

                if(param.element_type==="1"){
                    param.element_type_name="诊疗"
                }else if(param.element_type==="2"){
                    param.element_type_name="材料"
                }
                if(param.place==="1"){
                    param.place_name="本单位"
                }else if(param.place==="0"){
                    param.place_name="外送"
                }
                param.sale_total=(Number(param.sale_price)*Number(param.quantity)).toFixed(2);

                if(this.form.item_group_detail_id) {
                    for (let i = 0; i < this.tableData.length; i++) {
                        if(this.tableData[i].item_group_detail_id)
                        if(this.form.item_group_detail_id===this.tableData[i].item_group_detail_id){
                            this.tableData.splice(i,1)
                        }
                    }
                }
                if(!this.tableData){
                    this.tableData=[];
                }
                this.tableData.push(param);

                this.PurchaseTotal();  //计算组合单价
                this.clearDetail();    //清空明细信息

            },
            PurchaseTotal(){
                let temp=0;
                this.tableData.forEach(row => {
                    temp=Number(temp)+Number(row.sale_total);

                });
                Vue.set(this.form, 'group_sale_price', temp.toFixed(2));

            },
            DelDetail(index,row,event){
                //删除

                if(!row.item_group_detail_id){
                    this.tableData.splice(index,1);
                   // this.clearDetail();
                }else{
                    let param={
                        "item_group_detail_id":row.item_group_detail_id
                    };
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_item_group_detail_delete_flag",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.$message({
                                message: '已删除该项！',
                                type: 'success'
                            });
                            this.tableData.splice(index,1);
                          //  this.clearDetail();
                        }
                    });

                }

                this.PurchaseTotal();
                event.cancelBubble = true;
            },
            clearDetail(){
                this.form.cost_price=undefined;
                this.form.element_id=undefined;
                this.form.element_name=undefined;
                this.form.element_type="1";
                this.form.place="1";
                this.form.quantity=1;
                this.form.sale_price=undefined;
                this.form.item_code=undefined;
                this.form.item_group_detail_id=undefined;
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
            RowClick(row,event,column){

                this.form=$.extend({}, this.form, row);
                this.form.place=this.form.place.toString();
                this.form.element_type=this.form.element_type.toString();
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
            },
            GetItemGroupType(){

                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_item_group_type_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.itemGroupTypeCategory = response.body.data;
                        this.GetItemGroupDetailType();
                    }
                });
            },
            GetItemGroupDetailType(){

                let param={
                    "item_group_type_id":this.form.item_group_type_id
                };
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_item_group_type_detail_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.itemGroupDetailType = response.body.data;
                        if(this.itemGroupDetailType){
                            if(this.itemGroupDetailType.length===1){
                                this.form.item_group_type_detail_id=this.itemGroupDetailType[0].item_type_detail_id
                            }
                        }
                    }
                });
            },
        },

        mounted(){
            this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
            this.tableHeight=($(window).height())-60-($(".classify").height())-20-($("#baseinfo").height())-($(".category_btn").height())-190;
            window.onresize  = () => {
                this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-90;
                this.tableHeight=($(window).height())-60-($(".classify").height())-20-($("#baseinfo").height())-($(".category_btn").height())-190;
            };
            this.GetItemType();
            this.GetItemGroupType();
            this.GetData();
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
