<template>
    <div class="UserPermission content_inner">
        <div v-show="FrimShow" >
            <div class="classify"><h4 class="title">用户管理</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <el-input class="search" placeholder="编号/名称" v-model="searchInput" size="small"  @keyup.native="Search">
                        <el-button slot="append" icon="el-icon-search" size="small" @click="GetUserData"></el-button>
                    </el-input>
                </div>
                <el-table :data="table.TableData"  style="width: 100%;" :height="TableHeight" class="table" v-loading="GridLoading" :row-class-name="tableRowClassName">
                    <el-table-column label="编号" width="180" prop="credential_id">
                    </el-table-column>
                    <el-table-column label="姓名" width="260" prop="username">
                    </el-table-column>
                    <el-table-column label="权限" min-width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" plain @click="AuthorityEdit(scope.$index, scope.row)">编辑</el-button>
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

        <div v-show="FormShow1" class="From">
            <div class="classify"><h4 class="title">权限管理</h4></div>
            <div class="tab_content">
                <div style="width:51%;margin:0 auto;height:100%">
                    <div class="el-transfer-panel" titles="" buttontexts="" filterplaceholder="请输入" leftdefaultchecked="" rightdefaultchecked="" value="" >
                        <p class="el-transfer-panel__header">
                            <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="IsCheckAll1">未有权限</el-checkbox>
                        </p>
                        <div class="el-transfer-panel__body" >
                            <el-input v-model="filterText1"  clearable  size="small" placeholder="请输入" class="el-transfer-panel__filter">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                            <!--<div class="el-transfer-panel__filter el-input el-input&#45;&#45;small el-input&#45;&#45;prefix">-->
                            <!--<input autocomplete="off" placeholder="请输入" v-model="filterText1" size="small" type="text" rows="2" validateevent="true" class="el-input__inner">-->
                            <!--<span class="el-input__prefix"><i class="el-input__icon el-icon-search"></i></span>-->
                            <!--</div>-->
                            <el-tree
                                ref="tree1"
                                :data="list1"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                :filter-node-method="filterNode1"
                                @check-change="handleChange1" v-loading="GridLoading" style="height:85%;overflow-y:auto;">
                            </el-tree>
                            <p class="el-transfer-panel__empty" style="display: none;">无匹配数据</p><p style="display: none;" class="el-transfer-panel__empty">无数据</p>
                        </div>
                    </div>
                    <div class="el-transfer__buttons">
                        <button disabled="disabled" type="button" class="el-button el-button--primary is-disabled el-transfer__button" id="left" @click="leftBtn">
                            <span><i class="el-icon-arrow-left"></i></span>
                        </button>
                        <button disabled="disabled" style="display:block" type="button" class="el-button el-button--primary is-disabled el-transfer__button" id="right" @click="rightBtn">
                    <span>
                        <i class="el-icon-arrow-right"></i>
                    </span>
                        </button>
                    </div>
                    <div class="el-transfer-panel" titles="" buttontexts="" filterplaceholder="请输入" leftdefaultchecked="" rightdefaultchecked="" value="">
                        <p class="el-transfer-panel__header">
                            <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="IsCheckAll2">已有权限</el-checkbox>
                        </p>
                        <div class="el-transfer-panel__body">
                            <el-input v-model="filterText2"  clearable  size="small" placeholder="请输入" class="el-transfer-panel__filter">
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                            <el-tree
                                ref="tree2"
                                :data="list2"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                :filter-node-method="filterNode2"
                                @check-change="handleChange2" v-loading="GridLoading"  style="height:80%;overflow-y:auto;">
                            </el-tree>
                            <p class="el-transfer-panel__empty" style="display: none;">无匹配数据</p><p style="display: none;" class="el-transfer-panel__empty">无数据</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="category_btn" >
                <el-button type="primary"  class="add" @click="AuthorityCancel" v-loading.fullscreen.lock="loading">返回</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {tableRequest} from "../../../utilis/common.js";
    export default {
        name: "user-permission",
        watch: {
            filterText1(val) {
                this.$refs.tree1.filter(val);
            },
            filterText2(val) {
                this.$refs.tree2.filter(val);
            }
        },
        data() {
            return {
                TableHeight:"448",             //表格最大高度
                FormShow1:false,
                FrimShow:true,
                searchInput:"",
                table:{
                    TableData:[],
                    total_num:"",
                    pagination:"total, sizes, prev, pager, next"
                },
               // TableData:[],        //表格数据
                //total_num:"",
                page_num:1,
                page_size:10,
                //pagination:"total, sizes, prev, pager, next",
                GridLoading:false,  //表格加载loading
                credentialID:"",
                filterText1:"",
                filterText2:"",
                list1: [],           //未有权限 处理后
                list2:[],            //已有权限 处理后
                un_list: [],           //未有权限 处理前
                en_list:[],            //已有权限 处理前
                loading:false,
                checkAll1:"",
                isIndeterminate1: false,
                isIndeterminate2: false,
                checkAll2:""
                }
        },
        mounted(){
            this.TableHeight=($(window).height())-100-($("#tools").height())-20-($(".pagination").height())-90;
            $(".el-transfer-panel__body").css("height",(($(window).height())-220)+"px")
            window.onresize  = () => {
                this.TableHeight=($(window).height())-100-($("#tools").height())-20-($(".pagination").height())-90;
                $(".el-transfer-panel__body").css("height",(($(window).height())-220)+"px")
            };
            this.GetUserData();
            $(".el-transfer-panel__body").css("height",($(".content_inner").height())*0.77)
        },
        methods: {
            GetUserData(){
                    var param = {
                        "search": this.searchInput,
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                    };
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_credential_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.table=tableRequest(response.body,this.page_size)
                        }
                        this.GridLoading = false;
                    });
            },
            Search(){
                if(this.searchInput===""){
                    this.GetUserData();
                }
            },
            AuthorityEdit(index,row){    //权限管理按钮
                this.FrimShow=false;
                this.FormShow1=true;
                this.credentialID=row.credential_id;
                this.HasMenuData();
                this.NoMenuData();
            },
            HasMenuData(){
                let param={
                    "credential_id":this.credentialID
                };
                //获取已有权限
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_menu_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.en_list=response.body.data;
                        let obj2 = response.body.data;
                        let newData2=[];
                        //循环json数组
                        if(obj2!==null) {
                            for (let i = 0; i < obj2.length; i++) {
                                let temp2 = {};
                                temp2.id = obj2[i].menu_id;
                                temp2.label = obj2[i].name;
                                temp2.parent_id = obj2[i].parent_id;
                                temp2.children = [];
                                if (obj2[i].parent_id === 0) {
                                    newData2.push(temp2)
                                }
                            }
                            for (let i = 0; i < obj2.length; i++) {
                                var temp2 = {};
                                temp2.id = obj2[i].menu_id;
                                temp2.label = obj2[i].name;
                                temp2.parent_id = obj2[i].parent_id;
                                temp2.children = [];
                                if (obj2[i].parent_id !== 0) {
                                    this.findParentAndAdd(newData2, obj2[i].parent_id, temp2)
                                }
                            }
                        }
                        this.list2=newData2;
                    }
                });

            },
            NoMenuData(){
                let param={
                    "credential_id":this.credentialID
                };
                //获取未有权限
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_menu_un_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.un_list=response.body.data;
                        let obj = response.body.data;
                        let newData=[];
                        //循环json数组
                        if(obj!==null) {
                            for (let i = 0; i < obj.length; i++) {
                                var temp = {};
                                temp.id = obj[i].menu_id;
                                temp.label = obj[i].name;
                                temp.parent_id = obj[i].parent_id;
                                temp.children = [];
                                if (obj[i].parent_id === 0) {
                                    //是parent
                                    newData.push(temp)
                                }
                            }
                            for (let i = 0; i < obj.length; i++) {
                                var temp = {};
                                temp.id = obj[i].menu_id;
                                temp.label = obj[i].name;
                                temp.parent_id = obj[i].parent_id;
                                temp.children = [];
                                if (obj[i].parent_id !== 0) {
                                    this.findParentAndAdd(newData, obj[i].parent_id, temp)
                                }
                            }
                        }
                        this.list1=newData;
                    }
                });
            },
            findParentAndAdd(newData,parent_id,temp){
                for(let j = 0; j < newData.length; j++){
                    //找到它的parent了
                    if(newData[j].id===parent_id){
                        newData[j].children.push(temp);
                        return
                    }
                    //在children里面找它的parent
                    this.findParentAndAdd(newData[j].children,parent_id,temp)
                }
            },
            handleChange1() {
                let $right=$('#right');
                if(this.$refs.tree1.getCheckedNodes().length!==0){
                    $right.removeAttr("disabled");
                    $right.removeClass("is-disabled");

                    if(this.$refs.tree1.getCheckedNodes().length<this.un_list.length){
                        this.isIndeterminate1 = true;
                    }else if(this.$refs.tree1.getCheckedNodes().length=this.un_list.length){
                        this.isIndeterminate1 = false;
                        this.checkAll1=true;
                    }

                }else{
                    $right.attr("disabled","disabled");
                    $right.addClass("is-disabled");
                    this.isIndeterminate1=false;
                    this.checkAll1=false;
                }
            },
            handleChange2() {
                let $left=$('#left');
                if(this.$refs.tree2.getCheckedNodes().length!==0){
                    $left.removeAttr("disabled");
                    $left.removeClass("is-disabled");

                    if(this.$refs.tree2.getCheckedNodes().length<this.en_list.length){
                        this.isIndeterminate2 = true;
                    }else if(this.$refs.tree2.getCheckedNodes().length=this.en_list.length){
                        this.isIndeterminate2 = false;
                        this.checkAll2=true;
                    }
                }else{
                    $left.attr("disabled","disabled");
                    $left.addClass("is-disabled");

                    this.isIndeterminate2=false;
                    this.checkAll2=false;
                }
            },
            leftBtn(){
                let getChecked=this.$refs.tree2.getCheckedNodes(true);
                let getID=[];
                for(let i=0;i<getChecked.length;i++){
                    getID.push(getChecked[i].id);
                    if(getID.indexOf(getChecked[i].parent_id)===-1 && getChecked[i].parent_id!==0){
                        getID.push(getChecked[i].parent_id)
                    }
                }

                for(let k=0;k<getID.length;k++){
                    let param={
                        "credential_id":this.credentialID,
                        "menu_id":getID[k]
                    };
                    this.GridLoading=true;
                    this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_menu_del","param":JSON.stringify(param)}).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.HasMenuData();
                            this.NoMenuData();
                            //按钮置灰
                            let $right=$('#right');
                            $right.attr("disabled","disabled");
                            $right.addClass("is-disabled");
                            let $left=$('#left');
                            $left.attr("disabled","disabled");
                            $left.addClass("is-disabled");
                            this.isIndeterminate1 = false;
                            this.checkAll1=false;
                            this.isIndeterminate2 = false;
                            this.checkAll2=false;
                        }
                        this.GridLoading=false;
                    });

                }
                },
            rightBtn(){
                let getChecked=this.$refs.tree1.getCheckedNodes(true);
                let getID=[];
                for(let i=0;i<getChecked.length;i++){
                    getID.push(getChecked[i].id);

                    if(getID.indexOf(getChecked[i].parent_id)===-1 && getChecked[i].parent_id!==0){
                        getID.push(getChecked[i].parent_id)
                    }
                }
                for(let k=0;k<getID.length;k++){
                    let param={
                        "credential_id":this.credentialID,
                        "menu_id":getID[k]
                    };
                    this.GridLoading=true;
                    this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_menu_save","param":JSON.stringify(param)}).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.HasMenuData();
                            this.NoMenuData();
                            //按钮置灰
                            let $right=$('#right');
                            $right.attr("disabled","disabled");
                            $right.addClass("is-disabled");
                            let $left=$('#left');
                            $left.attr("disabled","disabled");
                            $left.addClass("is-disabled");
                            this.isIndeterminate1 = false;
                            this.checkAll1=false;
                            this.isIndeterminate2 = false;
                            this.checkAll2=false;
                        }
                        this.GridLoading=false;
                    });

                }
            },
            IsCheckAll1(){
                if(this.checkAll1===true){
                    this.$refs.tree1.setCheckedNodes(this.list1)

                }else{
                    this.$refs.tree1.setCheckedNodes([]);
                }
            },
            IsCheckAll2(){
                if(this.checkAll2===true){
                    this.$refs.tree2.setCheckedNodes(this.list2)
                }else{
                    this.$refs.tree2.setCheckedNodes([]);
                }
            },
            filterNode1(value, data) {
                if (!value) return true;
                    return data.label.indexOf(value) !== -1;
            },
            filterNode2(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            AuthorityCancel(){           //权限返回按钮
                this.FrimShow=true;
                this.FormShow1=false;
            },
            handleSizeChange(val) {
                this.page_size=val;
                this.GetUserData();
            },
            handleCurrentChange(val) {
                this.page_num=val;
                this.GetUserData();
            },

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
</style>
