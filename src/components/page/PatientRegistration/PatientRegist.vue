<template>
    <div  class="PatientRegist content_inner">
        <div class="classify"><h4 class="title">患者登记</h4></div>
        <div>
            <el-container >
                <el-aside width="75%" style="position: relative">
                    <div class="tool" style="margin:5px 0 0 10px;">
                        <el-popover  v-bind:value="ReservePov"
                            placement="right"
                            width="600"
                            trigger="click">
                            <span>预约日期：</span>
                            <el-date-picker
                                v-model="form.BookingDate"
                                type="date"
                                size="small"
                                id="StartDate"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                @change="GetData"
                                placeholder="选择日期" style="width:175px;" >
                            </el-date-picker>
                            <el-table :data="reserveData" height="370" @row-click="ReserveDataClick" v-loading="patientLoading">
                                <el-table-column width="90" property="patient_name" label="姓名"></el-table-column>
                                <el-table-column width="50" property="gender_name" label="性别"></el-table-column>
                                <el-table-column width="100" property="YearOld" label="年龄"></el-table-column>
                                <el-table-column width="110" property="main_tel_no" label="联系方式"></el-table-column>
                                <el-table-column width="110" property="tel_no" label="预约电话"></el-table-column>
                                <el-table-column width="90" property="doctor_name" label="预约医生"></el-table-column>
                                <el-table-column width="150" property="r_remark" label="备注" show-overflow-tooltip></el-table-column>
                            </el-table>
                            <el-button  slot="reference" type="primary" plain class="add" @click="GetRegiste" size="mini">预约待登记</el-button>
                        </el-popover>

                    </div>

                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="10">
                                <span class="base-label">患者姓名：</span>
                                <el-popover  placement="bottom" width="550" v-bind:value="DisablePov">
                                    <el-table :data="gridData" :height="gridHeight" v-loading="patientLoading" @row-click="PatientGrid">
                                        <el-table-column min-width="70" property="patient_name" label="姓名"></el-table-column>
                                        <el-table-column min-width="50" property="gender_name" label="性别"></el-table-column>
                                        <el-table-column min-width="100" property="birthday" label="出生日期"></el-table-column>
                                        <el-table-column min-width="110" property="main_tel_no" label="联系方式"></el-table-column>
                                        <el-table-column min-width="165" property="identity" label="证件号"></el-table-column>
                                    </el-table>
                                    <div slot="reference" class="name-wrapper" style="width:200px;display:inline-block;cursor: pointer" >
                                        <!--<div size="medium">-->
                                        <el-input  size="small" clearable style="width:240px;" @keyup.native="GetPatient" v-model="SearchPatient" >
                                        </el-input>
                                        <!--</div>-->
                                    </div>
                                </el-popover>
                            </el-col>
                            <el-col :span="8">
                                <span class="base-label" style="vertical-align: middle"><span class="required">* </span>患者性别：</span>
                                <el-radio-group v-model="form.gender" v-bind:disabled="EditPatientName">
                                    <el-radio :label="0">女</el-radio>
                                    <el-radio :label="1">男</el-radio>
                                    <el-radio :label="2">保密</el-radio>
                                </el-radio-group>
                            </el-col>

                        </el-row>
                    <el-row :gutter="1" class="baseinfo">
                        <el-col :span="10">
                            <span class="base-label" ><span class="required">* </span>来源：</span>
                            <el-select  v-model="form.reserve_source_category_id" filterable size="small" id="reserve_source_category_id"  style="width:240px;" @focus="InputCss('reserve_source_category_id')">
                                <el-option
                                    v-for="item in reserveSource"
                                    :key="item.category_id"
                                    :label="item.category_name"
                                    :value="item.category_id" >
                                </el-option>
                            </el-select>
                        </el-col>
                        <!--<el-col :span="10">-->
                            <!--<span class="base-label"><span class="required">* </span>姓名：</span>-->
                            <!--<el-input  size="small" v-bind:disabled="EditPatientName" clearable style="width:115px;" v-model="form.family_name" id="family_name" @focus="InputCss('family_name')" placeholder="姓">-->
                            <!--</el-input>-->
                            <!--<el-input  size="small" v-bind:disabled="EditPatientName" clearable style="width:115px;" v-model="form.self_name" id="self_name" @focus="InputCss('self_name')" placeholder="名">-->
                            <!--</el-input>-->
                        <!--</el-col>-->
                        <el-col :span="8">
                            <span class="base-label">出生日期：</span>
                            <el-input  style="width:180px" size="small" v-model="form.birthday" v-bind:disabled="EditPatientName"></el-input>
                        </el-col>


                    </el-row>
                    <el-row :gutter="1" class="baseinfo">
                        <el-col :span="7">
                            <span class="base-label">年龄：</span>
                            <el-input size="small" style="width: 180px;" disabled="disabled" v-model="form.YearOld"></el-input>
                        </el-col>
                        <el-col :span="7">
                            <span class="base-label">手机号：</span>
                            <el-input size="small" style="width: 180px;"  v-model="form.main_tel_no" id="main_tel_no" @focus="InputCss('main_tel_no')" v-bind:disabled="EditPatientName"></el-input>
                        </el-col>
                        <el-col :span="7">
                            <span class="base-label">病历号：</span>
                            <el-input size="small" v-model="form.medical_no" v-bind:disabled="EditPatientName" style="width: 180px;" id="medical_no" @focus="InputCss('medical_no')"></el-input>
                        </el-col>
                    </el-row>

                    <div class="classify"><h4 class="title">诊前信息</h4></div>
                    <el-row :gutter="1" class="baseinfo">
                        <el-col :span="10">
                            <span class="base-label">过敏史：</span>
                            <el-select
                                v-model="form.allergy"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选择或输入" style="width: 280px;" size="small">
                                <el-option
                                    v-for="item in allergyCategory"
                                    :key="item.allergy_name"
                                    :label="item.allergy_name"
                                    :value="item.allergy_name">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10">
                            <span class="base-label">既往史：</span>
                            <el-select
                                v-model="form.disease"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选择或输入" style="width: 280px;" size="small">
                                <el-option
                                    v-for="item in diseaseCategory"
                                    :key="item.disease_name"
                                    :label="item.disease_name"
                                    :value="item.disease_name">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>

                    <div class="classify"><h4 class="title">就诊信息</h4></div>
                    <el-row :gutter="1" class="baseinfo">
                        <el-col >
                            <span class="base-label" style="vertical-align: middle">就诊类型：</span>
                            <el-radio-group v-model="form.is_first">
                                <el-radio :label="0">初诊</el-radio>
                                <el-radio :label="1">复诊</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <div  style="position: absolute;left:10px;bottom:5px;">
                        <el-button  size="mini" type="primary" plain @click="ClearPatient">清空</el-button>
                    </div>
                    <div  style="position: absolute;right:10px;bottom:5px;">

                        <el-button type="primary" size="mini" @click="SaveRegist" v-bind:disabled="CompliteSaveEdit">完 成 登 记</el-button>
                    </div>
                </el-aside>
                <el-main style="border-left: 1px solid #dfdfdf;">
                    <el-row :gutter="1" class="baseinfo">
                        <el-col >
                            <span class="base-label">预约班次：</span>
                            <el-select filterable v-model="form.time_category"  size="mini" style="width:140px;" @change="GetDoctorData">
                                <el-option
                                    key="am"
                                    label="上午"
                                    value="am">
                                </el-option>
                                <el-option
                                    key="pm"
                                    label="下午"
                                    value="pm">
                                </el-option>
                                <el-option
                                    key="nm"
                                    label="晚班"
                                    value="nm">
                                </el-option>
                            </el-select>

                        </el-col>
                    </el-row>
                    <el-row :gutter="1" class="baseinfo">
                        <el-col >
                            <span class="base-label" style="vertical-align: middle">就诊科室：</span>
                            <el-select  v-model="form.department_id" filterable size="mini"  style="width:140px;" @change="GetDoctor">
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
                        </el-col>
                    </el-row>
                    <el-row :gutter="1" class="baseinfo">
                        <el-col >
                            <span class="base-label" style="vertical-align: middle">就诊医生：</span>
                            <el-select  v-model="form.doctor_id" filterable size="mini"  style="width:140px;" @change="GetDoctorData">
                                <el-option
                                    v-for="item in doctorList"
                                    :key="item.doctor_id"
                                    :label="item.doctor_name"
                                    :value="item.doctor_id" >
                                </el-option>
                            </el-select>
                            <el-button  type="primary"  size="mini"  @click="SavePatientReserve">保 存</el-button>
                        </el-col>

                    </el-row>

                    <el-table :data="TimeGridData"
                              :height="TimeGridHeight"
                              border
                              ref="multipleTable"
                              :cell-class-name="CellStyle"
                              v-loading="TimeGridLoading">
                        <el-table-column
                            type="index"
                            label="时间段"
                            width="130"
                            :index="indexMethod">
                        </el-table-column>
                        <el-table-column min-width="80"   label="">
                            <template slot-scope="scope" >
                                <span v-if="scope.row.patient_id && !scope.row.reserveEdit">{{scope.row.patient_name}}</span>
                                <!--<el-checkbox style="width:100%" label="可接诊" v-model="scope.row.check" border @change="BookingCheck(scope.row)" v-if="!scope.row.patient_id && scope.row.attendance_id && !reservePatient" class="elCheckbox"></el-checkbox>-->
                                <!--<el-checkbox style="width:100%" :label="scope.row.patient_name" v-model="scope.row.check" border @change="BookingCheck(scope.row)" v-else-if="scope.row.patient_id && scope.row.reserveEdit && scope.row.attendance_id" v-bind:checked="EditCheck"></el-checkbox>-->

                                <el-checkbox style="width:100%" label="问诊" v-model="scope.row.check" border @change="BookingCheck(scope.row)" v-if="!scope.row.patient_id && scope.row.attendance_id" class="elCheckbox"></el-checkbox>
                                <el-checkbox style="width:100%" :label="scope.row.patient_name" v-model="scope.row.check" border @change="BookingCheck(scope.row)" v-else-if="scope.row.patient_id && scope.row.reserveEdit && scope.row.attendance_id" v-bind:checked="EditCheck"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
            </el-container>
        </div>
   </div>
</template>

<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import {CurrentDate} from "../../../utilis/common.js";
    import Vue from 'vue';
    let storage = getLocalStorage();
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "PatientRegist",
        data() {
            return {
                form:{
                    allergy:[],
                    disease:[],
                    department_id:"10000",
                    time_category:"am",
                    is_first:0,
                    gender:0
                },
                TimeGridData:[],
                TimeGridHeight:"419",
                patientLoading:false,
                DisablePov:false,   //患者查询 下拉框
                SearchPatient:"",   //患者信息关键字
                gridHeight:"350",
                gridData:[],
                EditPatientName:false,
                Time:[],
                reserveSource:[],  //患者来源
                allergyCategory:[],  //过敏史
                diseaseCategory:[],  //既往史
                departmentCategory:[], //部门数据
                doctorList:[],       //医生下拉数据
                TimeGridLoading:false,
                reserveData:[],    //待预约患者
                ReservePov:false,   //待预约患者popver
                reservePatient:false,  //是不是待预约患者
                CompliteSaveEdit:false  //完成登记按钮

            }
        },
        methods:{
            GetData(){
                this.reserveData=[];
                this.patientLoading=true;
                let param = {
                    "template_category_id":this.template_category_id,
                    "attendance_date":this.form.BookingDate
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_reserver",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        let result=response.body.data;

                        let patient_id=[];
                        for(let i=0;i<result.length;i++){
                            if(result[i].patient_id && (result[i].reserve_statue===1 || result[i].reserve_statue===5)){
                               // console.log(result[i])
                                if(result[i].birthday)
                                result[i].YearOld = this.GetYearOld(result[i].birthday);

                                    this.reserveData.push(result[i]);
                                    patient_id.push(result[i].patient_id)

                            }
                        }
                        let temp={};
                        let arr=[];
                        for(let j=0;j<this.reserveData.length;j++){
                            if(temp[this.reserveData[j].patient_id]===undefined){
                                temp[this.reserveData[j].patient_id]=j
                            }else{
                                // if(j!==0 && this.reserveData[j-1].patient_id===this.reserveData[j].patient_id && this.reserveData[j-1].time_category===this.reserveData[j].time_category) {
                                    this.reserveData[temp[this.reserveData[j].patient_id]].reserve_id += "," + this.reserveData[j].reserve_id;
                                    arr.push(j)
                              //  }
                            }
                        }
                        for(let k=arr.length-1;k>=0;k--){
                           this.reserveData.splice(arr[k],1)
                        }
                    //    console.log(this.reserveData)
                        this.patientLoading=false;
                    }
                });
            },
            GetPatient(){
                //获取患者信息
                this.DisablePov=true;

                if(this.SearchPatient===""){
                    this.gridData=[];

                    return;
                }
                this.patientLoading=true;
                let param={
                    "search":this.SearchPatient
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_patient_find",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.gridData = response.body.data;

                        if(this.gridData) {
                            for (let i = 0; i < this.gridData.length; i++) {
                                if(!this.gridData[i].patient_name && (this.gridData[i].family_name || this.gridData[i].self_name)) {
                                    if (this.gridData[i].family_name)
                                        this.gridData[i].patient_name = this.gridData[i].family_name;
                                    if (this.gridData[i].self_name)
                                        this.gridData[i].patient_name = this.gridData[i].self_name;
                                }

                                if (this.gridData[i].gender === 0)
                                    this.gridData[i].gender_name = "女";
                                if (this.gridData[i].gender === 1)
                                    this.gridData[i].gender_name = "男";
                                if (this.gridData[i].gender === 2)
                                    this.gridData[i].gender_name = "保密"
                            }
                        }else{
                            this.gridData=[];
                            this.DisablePov=false;
                        }

                    }
                    this.patientLoading=false;
                });
            },
            PatientGrid(row, event, column){
                this.ClearPatient();

                this.DisablePov=false;

                this.EditPatientName=true;
               // let list=$.extend(true,{},this.form);

                this.SearchPatient=row.patient_name;
                if(row.is_first===undefined)
                    row.is_first=0;
                this.form=$.extend({}, this.form, row);

                if(row.birthday) {


                    //年龄
                    Vue.set(this.form, 'YearOld', this.GetYearOld(row.birthday));
                    this.form.YearOld = this.GetYearOld(row.birthday);
                }


                this.gridData=[];
                this.reservePatient=false;  //不是预约待登记患者
            },
            ReserveDataClick(row, event, column){
                this.ClearPatient();
                this.ReservePov=false;
                this.EditPatientName=true;
                this.SearchPatient=row.patient_name;

                this.form=$.extend({}, this.form, row);

                if(row.birthday) {

                    //年龄
                    Vue.set(this.form, 'YearOld', this.GetYearOld(row.birthday));
                    this.form.YearOld = this.GetYearOld(row.birthday)
                }
                this.GetDoctorData();
                this.reservePatient=true;   //是预约待登记的数据
                this.form.reserveEdit=row.reserve_id
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
            GetModelTime(){
                //this.TimeVal=[];
                this.clearCheck();
                let param = {
                    "template_category_id":this.template_category_id,
                    "time_category":this.form.time_category
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_time_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.Time = response.body.data;
                    }
                });
            },
            indexMethod(index) {
                return this.Time[index].time_interval
            },
            GetTemplateCategory(){
                //获取时间模板
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_template_default"
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.template_category_id=response.body.data.template_category_id;
                        this.GetModelTime();
                        this.GetData();
                    }
                });
            },
            GetReserveSource(){
                //患者来源
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_reserve_source_category_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.reserveSource = response.body.data;

                    }
                });
            },
            ClearPatient(){
                //清空
                this.form={
                    allergy:[],
                    disease:[],
                    department_id:"10000",
                    is_first:0,
                    gender:0,
                    time_category:"am",
                };
                this.SearchPatient=undefined;
                this.DisablePov=false;
                this.EditPatientName=false;

                this.TimeGridData=this.Time;

                this.form.attendance_date=CurrentDate(); //日期
                this.form.BookingDate=CurrentDate(); //日期


                $("input").css({"border-color": "#dcdfe6", "color": "#606266"});
            },
            GetAllergyCategory(){
                //过敏史 下拉数据
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_allergy_category_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.allergyCategory = response.body.data;

                    }
                });
            },
            GetDiseaseCategory(){
                //既往史 下拉数据
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_disease_category_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.diseaseCategory = response.body.data;

                    }
                });
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
            GetDoctorData(){
                this.GetModelTime();
                let param = {
                    "template_category_id":this.template_category_id,
                    "attendance_date":this.form.attendance_date,
                    "doctor_id":this.form.doctor_id,
                    "time_category":this.form.time_category
                }
                this.TimeGridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_doct_attendance_reserver","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        let result=response.body.data;
                        let list=$.extend(true,[],this.Time);
                        this.TimeGridData=list;
                        if(result)
                        for(let i=0;i<result.length;i++){
                            for(let j=0;j<this.TimeGridData.length;j++){
                                if(this.TimeGridData[j].template_id===result[i].template_id){
                                    this.TimeGridData[j].buss_no=result[i].buss_no;
                                    this.TimeGridData[j].doctor_id=result[i].doctor_id;
                                    this.TimeGridData[j].patient_id=result[i].patient_id;
                                    this.TimeGridData[j].patient_name=result[i].patient_name;
                                    this.TimeGridData[j].reserve_id=result[i].reserve_id;
                                    this.TimeGridData[j].result_status=result[i].result_status;
                                    this.TimeGridData[j].attendance_id=result[i].attendance_id;
                                    this.TimeGridData[j].reserve_statue=result[i].reserve_statue;
                                    this.TimeGridData[j].template_category_id=result[i].template_category_id;
                                    this.TimeGridData[j].r_remark=result[i].r_remark;
                                    this.TimeGridData[j].tel_no=result[i].tel_no;
                                    this.TimeGridData[j].main_tel_no=result[i].main_tel_no;
                                    this.TimeGridData[j].reserve_source_category_id=result[i].reserve_source_category_id;
                                    this.TimeGridData[j].select=0;
                                    this.TimeGridData[j].reserveEdit=false;
                                }

                                if(this.TimeGridData[j].patient_id ) {
                                    if(this.form.reserveEdit!==undefined)
                                    if (typeof this.form.reserveEdit === "string"){
                                        this.form.reserveEdit = this.form.reserveEdit.split(",");
                                    }
                                    if(this.form.reserveEdit!==undefined)
                                    if(this.form.reserveEdit.length!==undefined){
                                        for(let k=0;k<this.form.reserveEdit.length;k++){
                                            if(this.TimeGridData[j].reserve_id===Number(this.form.reserveEdit[k])){
                                                this.TimeGridData[j].reserveEdit=true;

                                                this.TimeGridData[j].select=1;
                                                this.EditCheck=true;

                                            }
                                        }
                                    }else{
                                        if(this.TimeGridData[j].reserve_id===Number(this.form.reserveEdit)){
                                            this.TimeGridData[j].reserveEdit=true;

                                            this.TimeGridData[j].select=1;
                                            this.EditCheck=true;

                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.TimeGridLoading=false;
                });
            },
            CellStyle({row, column, rowIndex, columnIndex}){
                if(columnIndex===1){
                    if(!this.TimeGridData[rowIndex].attendance_id)
                        return "success-row"

                    if(this.TimeGridData[rowIndex].patient_id && !this.TimeGridData[rowIndex].reserveEdit) {

                        return 'success-row'
                    }
                }
            },
            GetRegiste(){
                //预约待登记按钮
                this.ReservePov=true;
            },
            SaveRegist(){
                let IDArr;
                IDArr = ["reserve_source_category_id","medical_no"];

                if (this.showPoint(IDArr))
                    return;

                if(!this.form.reserve_id){
                    this.$message({
                        message: '请选择并保存问诊时间！',
                        type: 'warning'
                    });
                    return;
                }

                let selectReserve=[];
                for (let i = 0; i < this.TimeGridData.length; i++) {
                    if (this.TimeGridData[i].select === 1 && !this.TimeGridData[i].reserve_id) {
                        this.$message({
                            message: '请先保存初诊时间！',
                            type: 'warning'
                        });
                        return;

                    } else if (this.TimeGridData[i].select === 1 && this.TimeGridData[i].reserve_id) {
                        selectReserve.push(this.TimeGridData[i].reserve_id)

                    }

                    this.form.reserve_id=selectReserve.join();
                }
                    var arr = [];
                    if (typeof this.form.reserve_id === "string"){
                        let result = this.form.reserve_id.split(",");


                        for (let i = 0; i < result.length; i++) {
                            arr.push({"reserve_id": result[i]})
                        }
                    }else{
                        arr.push({"reserve_id": this.form.reserve_id})
                    }

                this.form.allergy=this.form.allergy.join();
                this.form.disease=this.form.disease.join();
                this.form.record_status=10;   //状态
                this.form.reserve_statue=10;  //完成登记
                this.form.reserveList=arr;

                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_patient_register_modify","param":JSON.stringify(this.form)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.$alert( '已登记！', '提示', {
                            confirmButtonText: '确定',
                        });
                        this.ClearPatient();
                        this.GetData();    //更新预约待登记数据
                    }
                });
            },
            SavePatientReserve(){
                let IDArr;
                IDArr = ["reserve_source_category_id"];

                if (this.showPoint(IDArr))
                    return;

                if(!this.form.patient_id){
                    this.$message({
                        message: '请选择患者！',
                        type: 'warning'
                    });
                    return;
                }



                if(!this.form.tel_no)
                    this.form.tel_no=this.form.main_tel_no;

                this.form.attendanceList=[];
                for(let i=0;i<this.TimeGridData.length;i++){
                    if(this.TimeGridData[i].patient_id && this.TimeGridData[i].patient_id===this.form.patient_id && !this.TimeGridData[i].reserveEdit && (this.TimeGridData[i].reserve_statue===1 || this.TimeGridData[i].reserve_statue===5)){
                        this.form.attendanceList.push(this.TimeGridData[i]);
                    }

                    if(this.TimeGridData[i].select===1 && (this.TimeGridData[i].reserve_statue===1 || this.TimeGridData[i].reserve_statue===5)){
                        this.form.attendanceList.push(this.TimeGridData[i]);
                    }
                }
              //  console.log(this.form)

                this.form.hospital_id=hospital_id;

                this.form.template_category_id=this.template_category_id;
                this.TimeGridLoading=true;
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_reception_reserve_modify",
                    "param": JSON.stringify(this.form)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        });
                        this.GetDoctorData();
                        this.form.reserve_id=response.body.data;
                        this.form.reserveEdit=this.form.reserve_id;
                        this.CompliteSaveEdit=false;
                    }
                    this.TimeGridLoading=false;
                });
            },
            BookingCheck(row){
                if(row.reserve_id && !row.reserveEdit){
                    this.$message({
                        message: '该时间段已有预约！',
                        type: 'warning'
                    });
                    return;
                }
                if(!row.result_status){
                    this.$message({
                        message: '该时间段医生未排班！',
                        type: 'warning'
                    });
                    return;
                }
                if(row.select===0){
                    row.select=1;   //预约
                    row.check=true;
                    row.reserve_statue=1;
                    this.form.template_category_id=row.template_category_id;


                }else if(row.select===1){
                    row.select=0;  //取消预约
                    row.check=false;
                    row.reserve_statue=undefined;

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
            InputCss(id){
                if(this.form[id]==="必填项不能为空") {
                    Vue.set(this.form, id, undefined);
                    $("#" + id).find("input").css({"border-color": "#dcdfe6", "color": "#606266"});
                    $("#" + id).css({"border-color": "#dcdfe6", "color": "#606266"});
                }
            },
            clearCheck(){
                this.TimeGridData=[];

                for(let i=0;i<this.TimeGridData.length;i++){
                    let value={}
                    value.check=false;
                    this.TimeGridData.push(value)
                }
            },

        },
        mounted(){
            Vue.set(this.form, 'attendance_date', CurrentDate());
            this.form.attendance_date=CurrentDate();
            Vue.set(this.form, 'BookingDate', CurrentDate());
            this.form.BookingDate=CurrentDate();

            this.GetTemplateCategory();
            this.GetReserveSource();
            this.GetAllergyCategory();
            this.GetDiseaseCategory();
            this.GetDepartment();
            this.GetDoctor(this.form.department_id);
        }
    }
</script>

<style scoped>
    .el-checkbox.is-bordered{
        padding: 5px 20px 5px 10px;
        height: 30px;
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
        width: 80px;
        display: inline-block;
        text-align: right;
    }
    .el-dialog__body{
        padding:10px 20px;
    }

    .el-tooltip__popper .is-dark{
        width:300px!important;
    }
    .el-main{
        padding:0 10px;
    }
    .el-dialog__body{
        padding:0;
    }
    .el-col-18{
        width:100%
    }
</style>
