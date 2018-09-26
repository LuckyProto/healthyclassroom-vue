<template>
    <div class="PatientTriage content_inner">
        <div v-show="FrimShow">
            <div class="classify"><h4 class="title">分诊列表</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <div style="float:right">
                        <span class="ml20">分诊类型：</span>
                        <el-select  v-model="states"  size="small"  class="state" @change="GetData">
                            <el-option
                                key="10000"
                                label="全部"
                                value="10000">
                            </el-option>
                            <el-option
                                key="10"
                                label="已登记"
                                value="10">
                            </el-option>
                            <el-option
                                key="20"
                                label="已分诊"
                                value="20">
                            </el-option>
                            <el-option
                                key="30"
                                label="已就诊"
                                value="30">
                            </el-option>
                            <el-option
                                key="40"
                                label="已结诊"
                                value="40">
                            </el-option>
                            <el-option
                                key="50"
                                label="已结清"
                                value="50">
                            </el-option>
                        </el-select>
                        <span class="ml20">就诊科室：</span>
                        <el-select  v-model="form.department_id" filterable size="small" @change="GetDoctor">
                            <el-option
                                key="10000"
                                label="全部"
                                value="10000">
                            </el-option>
                            <el-option
                                v-for="item in departmentCategory"
                                :key="item.department_id"
                                :label="item.department_name"
                                :value="item.department_id" >
                            </el-option>
                        </el-select>
                        <span class="ml20">就诊医生：</span>
                        <el-select  v-model="form.doctor_id" filterable size="small"   @change="GetData">
                            <el-option
                                v-for="item in doctorList"
                                :key="item.doctor_id"
                                :label="item.doctor_name"
                                :value="item.doctor_id" >
                            </el-option>
                        </el-select>
                        <el-input class="search ml20"  placeholder="编号/名称" v-model="searchInput" size="small" @keyup.native="Search">
                            <el-button slot="append" icon="el-icon-search" size="small" @click="SearchForm"></el-button>
                        </el-input>
                    </div>
                </div>
                <el-table :data="table.TableData"  style="width: 100%;" :height="TableHeight" class="table" v-loading="GridLoading">
                    <el-table-column min-width="130" property="patient_name" label="姓名"></el-table-column>
                    <el-table-column min-width="100" property="gender_name" label="性别"></el-table-column>
                    <el-table-column min-width="100" property="YearOld" label="年龄"></el-table-column>
                    <el-table-column min-width="130" property="doctor_name" label="接诊医生"></el-table-column>
                    <el-table-column min-width="130" property="tel_no" label="手机号码"></el-table-column>
                    <el-table-column min-width="100" property="record_status_name" label="状态"></el-table-column>
                    <el-table-column min-width="200" property="remark" label="备注"></el-table-column>
                    <el-table-column label="操作" min-width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">诊前检查</el-button>
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
            <div class="classify"><h4 class="title">分诊室</h4></div>
            <el-row  class="baseinfo">
                <el-col :span="6">
                    <span class="base-label">诊室：</span>
                    <el-input v-model="form.room_no"  size="small" clearable style="width:180px">
                    </el-input>
                </el-col>
                <!--<el-col :span="6">-->
                    <!--<span class="base-label">诊断：</span>-->
                    <!--<el-input v-model="form.diagnosed"  size="small" clearable style="width:180px">-->
                    <!--</el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="6">-->
                    <!--<span class="base-label">辅助检查：</span>-->
                    <!--<el-input v-model="form.assist_check"  size="small" clearable style="width:180px">-->
                    <!--</el-input>-->
                <!--</el-col>-->

                <!--<el-col :span="6">-->
                    <!--<span class="base-label">其他检查：</span>-->
                    <!--<el-input v-model="form.other_check"  size="small" clearable style="width:180px">-->
                    <!--</el-input>-->
                <!--</el-col>-->
            </el-row>
            <!--<el-row  class="baseinfo">-->
                <!--<span class="base-label" >处理意见：</span>-->
                <!--<el-input v-model="form.opinion"  size="small" clearable style="width:620px">-->
                <!--</el-input>-->
            <!--</el-row>-->
            <div class="classify"><h4 class="title">体征测量</h4></div>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="8">
                    <span class="base-label">体温类型：</span>
                    <el-select  v-model="form.temperature_type" size="small"  class="state" style="width:180px">
                        <el-option
                            key="1"
                            label="口温"
                            value="1">
                        </el-option>
                        <el-option
                            key="2"
                            label="腋温"
                            value="2">
                        </el-option>
                        <el-option
                            key="3"
                            label="耳温"
                            value="3">
                        </el-option>
                        <el-option
                            key="4"
                            label="肛温"
                            value="4">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <span class="base-label">体温(℃)：</span>
                    <el-input v-model="form.temperature_value"  size="small" clearable style="width:180px">
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <span class="base-label">呼吸(次/分钟)：</span>
                    <el-input v-model="form.breathing"  size="small" clearable style="width:180px">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="8">
                    <span class="base-label">脉搏(次/分钟)：</span>
                    <el-input v-model="form.pulse"  size="small" clearable style="width:180px">
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <span class="base-label">血压(mm Hg)：</span>
                    <el-input v-model="form.blood_pressure_floor"  size="small" clearable placeholder="收缩压" style="width:80px">
                    </el-input> —
                    <el-input v-model="form.blood_pressure_ceiling"  size="small" clearable placeholder="舒张压" style="width:80px">
                    </el-input>
                </el-col>
            </el-row>
            <div class="classify"><h4 class="title">基本信息</h4></div>
            <el-row  class="baseinfo">
                <el-col :span="5">
                    <span class="base-label">身高(cm)：</span>
                    <el-input v-model="form.height"  size="small" clearable style="width:120px">
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <span class="base-label">体重(kg)：</span>
                    <el-input v-model="form.ws"  size="small" clearable style="width:120px">
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <span class="base-label">BMI指数：</span>
                    <el-input v-model="form.bmi"  size="small" clearable style="width:120px">
                    </el-input>
                </el-col>

                <el-col :span="5">
                    <span class="base-label">血型：</span>
                    <el-select  v-model="form.blood_type" size="small"  class="state" style="width:120px">
                        <el-option
                            key="A"
                            label="A型"
                            value="A">
                        </el-option>
                        <el-option
                            key="B"
                            label="B型"
                            value="B">
                        </el-option>
                        <el-option
                            key="O"
                            label="O型"
                            value="O">
                        </el-option>
                        <el-option
                            key="AB"
                            label="AB型"
                            value="AB">
                        </el-option>
                        <el-option
                            key="N"
                            label="不详"
                            value="N">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <span class="base-label">RH血型：</span>
                    <el-select  v-model="form.blood_rh" size="small"  class="state" style="width:120px">
                        <el-option
                            key="0"
                            label="RH阴性"
                            value="0">
                        </el-option>
                        <el-option
                            key="1"
                            label="RH阳性"
                            value="1">
                        </el-option>
                        <el-option
                            key="2"
                            label="不详"
                            value="2">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <div class="classify"><h4 class="title">病历信息</h4></div>
            <el-row :gutter="2" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label">过敏史：</span>
                    <el-input v-model="form.allergy"  size="small" clearable style="width:350px">
                    </el-input>
                </el-col>
                <el-col :span="10">
                    <span class="base-label">既往史：</span>
                    <el-input v-model="form.disease"  size="small" clearable style="width:350px">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="2" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label">家族史：</span>
                    <el-input v-model="form.family"  size="small" clearable style="width:350px">
                    </el-input>
                </el-col>
                <el-col :span="10">
                    <span class="base-label">预防接种史：</span>
                    <el-input v-model="form.vaccinate"  size="small" clearable style="width:350px">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col>
                    <span class="base-label">其他历史：</span>
                    <el-input v-model="form.history"  size="small" clearable style="width:620px">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo" v-show="MandemShow">
                <el-col>
                    <span class="base-label">月经史：</span>
                    初潮：<el-input v-model="form.menarche"  size="small" clearable style="width:80px;">
                </el-input><span style="margin-right: 15px">岁</span>
                    经期：<el-input v-model="form.period_floor"  size="small" clearable style="width:80px;">
                </el-input>  —
                    <el-input v-model="form.period_ceiling"  size="small" clearable style="width:80px;">
                    </el-input><span style="margin-right: 15px">天</span>
                    周期：<el-input v-model="form.period_cycle_floor"  size="small" clearable style="width:80px">
                </el-input> —
                    <el-input v-model="form.period_cycle_ceiling"  size="small" clearable style="width:80px;">
                    </el-input><span style="margin-right: 15px;">天</span>
                    末次月经：
                    <el-date-picker
                        v-model="form.period_last"
                        type="date"
                        size="small"
                        id="StartDate"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期" style="width:175px;" >
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo" v-show="MandemShow">
                <el-col>
                    <span class="base-label">生育史：</span>
                    <el-input v-model="form.family"  size="small" clearable style="width:620px">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col>
                    <span class="base-label" style="vertical-align: top">备注：</span>
                    <el-input v-model="form.remark" type="textarea"  size="small" clearable style="width:620px">
                    </el-input>
                </el-col>
            </el-row>
            <div class="category_btn">
                <el-button plain class="add" @click="CancelForm">取消</el-button>
                <el-button type="primary"  class="add" @click="SaveForm">保存</el-button>
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
    let storage = getLocalStorage();

    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "PatientTriage",
        data() {
            return {
                FormShow:false,
                FrimShow:true,
                form:{

                    department_id:"10000",


                },
                departmentCategory:[],  //部门
                doctorList:[],         //医生
                TableHeight:"448",             //表格最大高度
                searchInput:"",
                table:{
                    TableData:[],
                    total_num:"",
                    pagination:"total, sizes, prev, pager, next"
                },
                page_num:1,
                page_size:10,
                GridLoading:false,
                states:"10000",
                MandemShow:false
            }
        },
        methods:{
            GetData(){
                let param={
                    "page_num": this.page_num,
                    "page_size": this.page_size,
                    "search":this.searchInput,
                    "states":Number(this.states),
                    "doctor":this.form.doctor_id,
                    "BookingDate":this.form.BookingDate
                };
                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_reserve_medical_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {

                        this.table = tableRequest(response.body, this.page_size);
                        if(this.table.TableData)
                            for(let i=0;i<this.table.TableData.length;i++){
                                this.table.TableData[i].record_status_name=this.GetGridStatus(this.table.TableData[i].record_status);

                                if(!this.table.TableData[i].patient_name && (this.table.TableData[i].family_name || this.table.TableData[i].self_name)) {
                                    if (this.table.TableData[i].family_name)
                                        this.table.TableData[i].patient_name = this.table.TableData[i].family_name;
                                    if (this.table.TableData[i].self_name)
                                        this.table.TableData[i].patient_name = this.table.TableData[i].self_name;
                                }

                                if(this.table.TableData[i].gender===0)
                                    this.table.TableData[i].gender_name="女";
                                if(this.table.TableData[i].gender===1)
                                    this.table.TableData[i].gender_name="男";
                                if(this.table.TableData[i].gender===2)
                                    this.table.TableData[i].gender_name="保密";

                                this.table.TableData[i].YearOld = this.GetYearOld(this.table.TableData[i].birthday);
                            }


                    }
                    this.GridLoading=false;
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
            clearData(){
                this.form={
                    department_id:"10000",

                };
                this.form.BookingDate=CurrentDate();
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
            },
            handleEdit(index,row){
                this.FrimShow=false;
                this.FormShow=true;
                this.clearData();
                if(row.gender===0)
                    this.MandemShow=true;
                else{
                    this.MandemShow=false;
                }
                let param={
                    "medical_record_id": row.medical_record_id,
                    "medical_id": row.medical_id,

                };

                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_reserve_medical_edit","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        if(response.body.data)
                       this.form=response.body.data[0]

                        if(this.form.temperature_type)
                            this.form.temperature_type=this.form.temperature_type.toString();
                        if(this.form.blood_rh)
                            this.form.blood_rh=this.form.blood_rh.toString();

                    }

                });
            },
            CancelForm(){
                this.FrimShow=true;
                this.FormShow=false;
                this.clearData();
                this.form.doctor_id=undefined;

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
            GetDepartment(){
                //部门下拉数据
                let param={
                    "hospital_id":hospital_id,
                    "is_reserve":1
                };
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_department_category_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.departmentCategory = response.body.data;

                    }
                });
            },
            GetDoctor(val){
                let param={
                    "department_id":val
                };
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_department_category_doctor_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.doctorList = response.body.data;
                    }
                });
            },
            GetGridStatus(status) {
                switch (status) {
                    case 10:
                        return "已登记";
                        break;
                    case 20:
                        return "已分诊";
                        break;
                    case 30:
                        return "已就诊";
                        break;
                    case 40:
                        return "已结诊";
                        break;
                    case 50:
                        return "已结清";
                        break;
                }
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
            SaveForm(){
                let param = $.extend(true, {}, this.form);

                if (this.form.temperature_value === "" || this.form.temperature_value === null)
                    delete param.temperature_value;
                if (this.form.temperature_value !== undefined)
                    param.temperature_value = Number(param.temperature_value).toFixed(1) * 10;

                if (this.form.bmi === "" || this.form.bmi === null)
                    delete param.bmi;
                if (this.form.bmi !== undefined)
                    param.bmi = Number(param.bmi).toFixed(1) * 10;


                this.GridLoading = true;
                this.$http.post(baseUrl()+'/comm', {
                    "methodName": "sp_clinic_patient_hospital_medical_modify",
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
        mounted(){

            this.form.BookingDate=CurrentDate();
            this.GetDepartment();
            this.GetDoctor(this.form.department_id);
            this.GetData();
        }
    }
</script>

<style scoped>
    .el-col-5 {
        width: 19.83333%;
    }
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
        width: 110px;
        display: inline-block;
        text-align: right;
    }
</style>
