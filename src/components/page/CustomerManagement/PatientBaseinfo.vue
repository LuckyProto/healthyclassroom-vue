<template>
    <div class="PatientBaseinfo content_inner">
        <div >
            <div class="classify"><h4 class="title">客户信息</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <el-button type="primary" class="add" style="width:113px" @click="AddForm">新增客户</el-button>
                    <div style="float:right">
                    <el-input class="search" placeholder="姓名/拼音/手机号" v-model="searchInput" size="small"  @keyup.native="Search">
                        <el-button slot="append" icon="el-icon-search" size="small" @click="GetData"></el-button>
                    </el-input>
                    </div>
                </div>
                <el-table :data="table.TableData"  style="width: 100%;" :height="TableHeight" class="table" v-loading="GridLoading" >
                    <el-table-column min-width="100" property="patient_name" label="姓名"></el-table-column>
                    <el-table-column min-width="80" property="gender_name" label="性别"></el-table-column>
                    <el-table-column min-width="120" property="birthday" label="出生日期"></el-table-column>
                    <el-table-column min-width="120" property="main_tel_no" label="联系方式"></el-table-column>
                    <el-table-column min-width="120" property="tel_no" label="预约电话"></el-table-column>
                    <el-table-column min-width="180" property="identity" label="证件号"></el-table-column>
                    <el-table-column label="操作" min-width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <!--<el-button size="mini" type="danger" plain @click="DelPatient(scope.$index, scope.row)">删除</el-button>-->
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
        <el-dialog title="基本信息"  :visible.sync="dialogFormVisible" width="55%">
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>姓名：</span>
                    <el-popover  placement="bottom" width="400" v-bind:value="DisablePov">
                        <el-table :data="gridData" :height="gridHeight" v-loading="patientLoading" @row-click="PatientGrid">
                            <el-table-column min-width="70" property="patient_name" label="姓名"></el-table-column>
                            <el-table-column min-width="50" property="gender_name" label="性别"></el-table-column>
                            <el-table-column min-width="100" property="birthday" label="出生日期"></el-table-column>
                            <el-table-column min-width="110" property="main_tel_no" label="电话"></el-table-column>
                            <el-table-column min-width="165" property="identity" label="证件号"></el-table-column>
                        </el-table>
                        <div slot="reference" class="name-wrapper" style="width:100px;display:inline-block;cursor: pointer" >
                            <el-input  size="small" placeholder="姓" clearable style="width:100px;" v-model="form.family_name" id="family_name"  @focus="InputCss('family_name')" @keyup.native="GetPatient">
                            </el-input>
                        </div>
                    </el-popover>

                    <el-input placeholder="名" size="small" clearable style="width:100px;" v-model="form.self_name" id="self_name" >
                    </el-input>
                </el-col>
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>患者性别：</span>
                    <el-radio-group v-model="form.gender">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">保密</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label">证件类型：</span>
                    <el-select  v-model="form.identity_category" style="width:205px" size="small" >
                        <el-option
                            key="1"
                            label="身份证"
                            value="1">
                        </el-option>
                        <el-option
                            key="2"
                            label="护照"
                            value="2">
                        </el-option>
                        <el-option
                            key="3"
                            label="驾照"
                            value="3">
                        </el-option>
                        <el-option
                            key="4"
                            label="军官证"
                            value="4">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="12">
                    <span class="base-label">证件号：</span>
                    <el-input style="width:205px" size="small" v-model="form.identity" id="identity" @focus="InputCss('identity')" @blur="GetBase"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label">出生日期：</span>
                    <!--<el-input style="width:205px" size="small" v-model="form.birthday" id="birthday" @focus="InputCss('birthday')" ></el-input>-->
                    <el-date-picker
                        v-model="form.birthday"
                        type="date"
                        size="small"
                        id="birthday"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerBeginDateBefore"
                        placeholder="选择日期" style="width:205px;" @focus="InputCss('birthday')" @change="ChangeBirthday" >
                    </el-date-picker>
                </el-col>
                <el-col :span="12">
                    <span class="base-label" >年龄：</span>
                    <el-input style="width:205px" size="small" disabled="disabled" v-model="form.YearOld"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="12">
                    <span class="base-label"><span class="required">* </span>联系方式：</span>
                    <el-input style="width:205px" size="small" v-model="form.main_tel_no" id="main_tel_no" @focus="InputCss('main_tel_no')"></el-input>
                </el-col>
                <el-col :span="12">
                    <span class="base-label" ><span class="required">* </span>病历号：</span>
                    <el-input style="width:205px" size="small" v-model="form.medical_no" id="medical_no" @focus="InputCss('medical_no')" disabled="disabled"></el-input>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="SavePatient">确 定</el-button>
                <el-button type="primary" plain @click="CancelForm">取 消</el-button>
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
        name: "PatientBaseinfo",
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
                    gender:0,
                    identity_category:"1"
                },
                page_num:1,
                page_size:10,
                GridLoading:false,  //表格加载loading
                dialogFormVisible:false,
                DisablePov:false,
                patientLoading:false,
                gridHeight:"200",
                pickerBeginDateBefore:{
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },
                birthdayEdit:false
            }


        },
        methods: {
            GetData(){
                var param = {
                    "search": this.searchInput,
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                };
                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_patient_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.table = tableRequest(response.body, this.page_size);
                        if(this.table.TableData)
                        for (let i = 0; i < this.table.TableData.length; i++) {
                            if(!this.table.TableData[i].patient_name && (this.table.TableData[i].family_name || this.table.TableData[i].self_name)) {
                                if (this.table.TableData[i].family_name)
                                    this.table.TableData[i].patient_name = this.table.TableData[i].family_name;
                                if (this.table.TableData[i].self_name)
                                    this.table.TableData[i].patient_name = this.table.TableData[i].self_name;
                            }
                            if (this.table.TableData[i].gender === 0)
                                this.table.TableData[i].gender_name = "女";
                            if (this.table.TableData[i].gender === 1)
                                this.table.TableData[i].gender_name = "男";
                            if (this.table.TableData[i].gender === 2)
                                this.table.TableData[i].gender_name = "保密"
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
            handleSizeChange(val) {
                this.page_size=val;
                this.GetData();
            },
            handleCurrentChange(val) {
                    this.page_num=val;
                    this.GetData();
            },
            handleEdit(index,row){
                this.clearDate();
                this.dialogFormVisible=true;
                this.form=row;
                this.form.identity_category=row.identity_category.toString();
                this.GetBase();
            },
            DelPatient(index,row){
                let param = {
                    "patient_id": row.patient_id,
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_patient_del",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.$alert("删除成功！", '提示', {
                            confirmButtonText: '确定',
                        });
                        this.GetData();
                    }
                });
            },
            clearDate(){
                this.form={
                    gender:0,
                    identity_category:"1"
                };
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
                this.birthdayEdit=false;
            },
            AddForm(){
                this.clearDate();
                this.dialogFormVisible=true;
                this.GetMedicel();  //生成病历号
            },
            CancelForm(){
                this.dialogFormVisible=false;
                this.GetData();
            },
            PatientGrid(row, event, column){
                this.DisablePov=false;
                this.form=$.extend({}, this.form, row);
                this.form.identity_category=row.identity_category.toString();

                //年龄
                Vue.set(this.form, 'YearOld', this.GetYearOld(this.form.birthday));
                this.form.YearOld = this.GetYearOld(this.form.birthday);
            },
            SavePatient(){
                let IDArr;
                IDArr = ["main_tel_no","medical_no"];

                if (this.showPoint(IDArr))
                    return;
                this.form.hospital_id=hospital_id;

                if (this.form.patient_id === "" || this.form.patient_id === null)
                    delete this.form.patient_id;

                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_patient_modify",
                    "param": JSON.stringify(this.form)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible=false;
                        this.GetData();

                    }
                });
            },
            GetPatient(){
                //获取患者信息
                this.DisablePov=true;

                if(this.form.family_name===""){
                    this.gridData=[];
                    this.DisablePov=false;
                    return;
                }
                this.patientLoading=true;
                let param={
                    "search":this.form.family_name
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_patient_find",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.gridData = response.body.data;
                        if(this.gridData)
                            for(let i=0;i<this.gridData.length;i++){

                                if(!this.gridData[i].patient_name && (this.gridData[i].family_name || this.gridData[i].self_name)) {
                                    if (this.gridData[i].family_name)
                                        this.gridData[i].patient_name = this.gridData[i].family_name;
                                    if (this.gridData[i].self_name)
                                        this.gridData[i].patient_name = this.gridData[i].self_name;
                                }

                                if(this.gridData[i].gender===0)
                                    this.gridData[i].gender_name="女";
                                if(this.gridData[i].gender===1)
                                    this.gridData[i].gender_name="男";
                                if(this.gridData[i].gender===2)
                                    this.gridData[i].gender_name="保密"
                            }
                            else{

                            this.DisablePov=false;
                        }

                    }
                    this.patientLoading=false;
                });
            },
            GetBase(){
                //证件号失去焦点
                if(this.form.identity_category==="1") {
                    this.birthdayEdit = true;
                    //出生日期
                    Vue.set(this.form, 'birthday', this.GetBirthday(this.form.identity));
                    this.form.birthday = this.GetBirthday(this.form.identity);
                    //年龄
                    Vue.set(this.form, 'YearOld', this.GetYearOld(this.form.birthday));
                    this.form.YearOld = this.GetYearOld(this.form.birthday);
                }
           },
            ChangeBirthday(){
                //出生日期改变
                Vue.set(this.form, 'YearOld', this.GetYearOld(this.form.birthday));
                this.form.YearOld=this.GetYearOld(this.form.birthday);
            },
            GetBirthday(psidno){
                var birthdayno,birthdaytemp;

                if(psidno.length==18){
                    birthdayno=psidno.substring(6,14)
                }else if(psidno.length==15){
                    birthdaytemp=psidno.substring(6,12);
                    birthdayno="19"+birthdaytemp
                }else{
                    this.$message({
                        message: '错误的身份证号码，请核对！',
                        type: 'warning'
                    });

                    return false
                }
                var birthday=birthdayno.substring(0,4)+"-"+birthdayno.substring(4,6)+"-"+birthdayno.substring(6,8)
                return birthday;
            },
            GetYearOld(birthday){
                let a=new Date();
                this.NowTamp=Date.parse(a);
                let NowDate=this.timestampToTime2(this.NowTamp);
                let date1 = NowDate;
                let date2 = birthday;
// 拆分年月日
                date1 = date1.split('-');
// 得到月数
                date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
// 拆分年月日
                date2 = date2.split('-');
// 得到月数
                date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
                let m = Math.abs(date1 - date2);
                if(m%12)
                    return parseInt(m/12)+"岁"+m%12+"个月"
                else{
                    return parseInt(m/12)+"岁"
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
            timestampToTime2(timestamp) {
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear();
                var M =(date.getMonth()+1);
                if(M<10)
                    M='0'+M;
                var D = date.getDate();
                if(D<10)
                    D='0'+D;
                return Y+"-"+M+"-"+D;
            },
            InputCss(id){
                if(this.form[id]==="必填项不能为空") {
                    Vue.set(this.form, id, undefined);
                    $("#" + id).find("input").css({"border-color": "#dcdfe6", "color": "#606266"});
                    $("#" + id).css({"border-color": "#dcdfe6", "color": "#606266"});
                }
            },
            GetMedicel(){
                let param2 = {};
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "clinic_medical_no",
                    "param": JSON.stringify(param2)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        Vue.set(this.form, 'medical_no', response.body.data.no);
                        this.form.medical_no = response.body.data.no;

                    }
                });
            }
        },

        mounted(){
            this.TableHeight=($(window).height())-100-($("#tools").height())-20-($(".pagination").height())-90;
            window.onresize  = () => {
                this.TableHeight=($(window).height())-100-($("#tools").height())-20-($(".pagination").height())-90;
            };
            this.GetData();
        },
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
