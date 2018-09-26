<template>
    <div class="libraryReport content_inner">
            <div class="classify"><h4 class="title">库存查询</h4></div>
            <div class="tab_content">
                <div id="tools" >
                    <div style="float:right;margin-bottom:10px ">
                        <span class="ml20">库存 ：</span>
                        <el-select  v-model="ZeroInventory" style="width:115px" size="small"  class="state" @change="Inventory">
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
                        <span class="ml20">物品类型：</span>
                        <el-select  v-model="goods_type" style="width:139px" size="small" @change="GetData">
                            <el-option
                                key="all"
                                label="全部"
                                value="all">
                            </el-option>
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
                        <el-input class="search ml20"  placeholder="名称" v-model="searchInput" size="small" @keyup.native="Search">
                            <el-button slot="append" icon="el-icon-search" size="small" @click="GetData"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table :data="GridTable"  style="width: 100%;" :height="GrigTableHeight" class="GridTable" v-loading="GridLoading" >
                    <el-table-column label="名称" min-width="280" prop="goods_name" sortable>
                    </el-table-column>
                    <el-table-column label="物品类型" min-width="150" prop="goods_type_name" sortable>
                    </el-table-column>
                    <el-table-column label="库存余量" min-width="150" prop="library_num" sortable>
                    </el-table-column>
                    <el-table-column label="单位" min-width="110" prop="library_unit" sortable>
                    </el-table-column>
                    <el-table-column label="备注" min-width="260" prop="remark">
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
</template>
<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {StrTrim} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import Vue from 'vue';
    let storage = getLocalStorage();
    let departmentList=storage.getItem("departmentList");
    let credential_id=storage.getItem("credential_id");
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "hospital-storage",
        data() {
            return {
                GrigTableHeight:"448",               //表格最大高度
                GridTable:[],    //首页表格
                searchInput:"",   //首页搜索药品inout
                ZeroDisable:true,                  //库存自定义
                ZeroInventory:"all",    //库存查询条件
                InventoryQuantity:undefined,  //输入库存数量
                goods_type:"all",          //物品类型
                loading:false,
                total_num:0,
                page_num:1,
                page_size:10,
                pagination:"total, sizes, prev, pager, next",
                GridLoading:false,
            }
        },
        methods:{
            GetData(){
                //获取表格数据
                if(this.InventoryQuantity==="")
                    this.InventoryQuantity=undefined;
                    let param = {
                        "search": StrTrim(this.searchInput),
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                        "ZeroInventory":this.ZeroInventory,
                        "InventoryQuantity":this.InventoryQuantity,
                        "hospital_id":hospital_id,
                        "goods_type":this.goods_type
                    };
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_library_report",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){

                            this.GridTable = response.body.data.rows;
                            if(this.GridTable)
                                for(let i=0;i<this.GridTable.length;i++){

                                    switch (this.GridTable[i].goods_type){
                                        case 0:
                                            this.GridTable[i].goods_type_name="西药";
                                            break;
                                        case 1:
                                            this.GridTable[i].goods_type_name="中药";
                                            break;
                                        case 2:
                                            this.GridTable[i].goods_type_name="材料";
                                            break;
                                        default:
                                            return false;
                                    }

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

            handleSizeChange(val) {
                this.page_size=val;
                this.GetData();
            },
            handleCurrentChange(val) {
                this.page_num=val;
                this.GetData();
            },
        },
        mounted() {
            this.GetData();
            this.GrigTableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-120;
             window.onresize  = () => {
                     this.GrigTableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-120;
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
