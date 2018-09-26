<template>
    <div class="workforce content_inner">
        <div class="classify"><h4 class="title">预约管理</h4></div>
        <div class="tab_content">
            <div style="margin-bottom:10px;" id="tools">
                <el-button type="primary" size="small" @click="prevDay">前一天</el-button>
                <el-date-picker
                    v-model="form.BookingDate"
                    type="date"
                    size="small"
                    id="StartDate"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    @change="ChangeDate"
                    placeholder="选择日期" style="width:175px;" >
                </el-date-picker>
                <el-button type="primary" size="small" @click="nextDay">后一天</el-button>
            </div>
            <el-table
               :data="tableData"
                style="width: 100%;"
                border
               :cell-class-name="style"
                :height="TableHeight"
               :span-method="objectSpanMethod"
               @cell-click="CellClick"
               v-loading="GridLoading">
                <el-table-column
                    label="班次"
                    width="150"
                    type="index"
                    :index="indexClass">
                </el-table-column>
                <el-table-column
                    type="index"
                    label="时间段"
                    width="150"
                    :index="indexMethod">
                </el-table-column>
                <el-table-column
                    v-for="(col,index) in docName"
                    :prop="col.prop" :label="col.label"
                    width="180">
                    <template slot-scope="scope" >
                            <el-popover trigger="click" placement="right" width="300" v-if="scope.row[col.prop]" v-bind:value="PopoverDisabled">
                                <div class="top">
                                    <div style="margin-bottom: 10px;height:20px;">
                                        <span style="width:70px;display:inline-block">{{(scope.row[col.prop]).patient_name}}</span>
                                        <span style="width:70px;display:inline-block">{{(scope.row[col.prop]).gender_name}}</span>
                                        <span style="width:70px;display:inline-block">{{(scope.row[col.prop]).yearsOld}}岁</span>
                                        <div style="position:absolute;right:10px;top:10px;">
                                            <el-button type="info" icon="el-icon-message" round size="mini" @click="ShowMessage(scope.row[col.prop],col.label)"></el-button>
                                        </div>

                                   </div>
                                    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom: 10px;height:20px;">
                                        <span>{{(scope.row[col.prop]).tel_no}}</span>
                                    </div>
                                    <div style="padding:6px;height:20px;">
                                        <span>预约时间：</span><span>{{(scope.row[col.prop]).time_interval}}</span>
                                    </div>
                                    <div style="padding:6px;height:20px;">
                                        <span>预约医生：</span><span>{{col.label}}</span>
                                    </div>
                                    <div style="padding:6px;border-bottom: 1px solid #e9e9e9;height:20px;">
                                        <span>预约备注：</span>
                                        <el-tooltip placement="bottom" style="width:100px;">
                                            <div slot="content">{{(scope.row[col.prop]).r_remark}}</div>
                                            <span style="display:inline-block;width: 90%;box-sizing: border-box;text-align: left;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: bottom;">{{(scope.row[col.prop]).r_remark}}</span>
                                        </el-tooltip>

                                    </div>
                                    <div style="float:left;margin:5px 10px 0 0;">
                                        <el-button type="primary" plain="" @click="CancelReserve(scope.row[col.prop])" size="mini" >取消预约</el-button>
                                        <el-button type="primary" v-if="scope.row[col.prop].reserve_statue===5" disabled size="mini" @click="SureDialog(scope.row[col.prop])">确认预约</el-button>
                                        <el-button type="primary" v-if="scope.row[col.prop].reserve_statue!==5"  size="mini" @click="SureDialog(scope.row[col.prop])">确认预约</el-button>
                                    </div>
                                    <div style="float:right;margin:5px 10px 0 0;">
                                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditDialog(scope.row[col.prop])" v-if="scope.row[col.prop].reserve_statue!==5"></el-button>
                                    </div>
                                </div>
                                <div slot="reference" class="name-wrapper" style="width:150px;cursor: pointer" >
                                    <div size="medium">
                                        {{(scope.row[col.prop]).patient_name}}
                                        <span v-if="scope.row[col.prop].patient_name">({{(scope.row[col.prop]).time_interval}})</span>
                                    </div>
                                </div>
                            </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                   label="暂无医生排班"
                    min-width="150">
                </el-table-column>
            </el-table>
            <el-dialog :title="DialogTitle"  :visible.sync="dialogFormVisible" width="73%">
                <el-container>
                    <el-aside width="44%" >
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                        <span class="base-label">患者查找：</span>
                        <!--<el-autocomplete-->
                            <!--clearable-->
                            <!--v-model="form.goods_name"-->
                            <!--size="small" style="width:240px;">-->
                        <!--</el-autocomplete>-->
                                <el-popover  placement="bottom" width="550" v-bind:value="DisablePov">
                                    <el-table :data="gridData" :height="gridHeight" v-loading="patientLoading" @row-click="PatientGrid">
                                        <el-table-column min-width="70" property="patient_name" label="姓名"></el-table-column>
                                        <el-table-column min-width="50" property="gender_name" label="性别"></el-table-column>
                                        <el-table-column min-width="100" property="birthday" label="出生日期"></el-table-column>
                                        <el-table-column min-width="110" property="main_tel_no" label="联系方式"></el-table-column>
                                        <el-table-column min-width="165" property="identity" label="证件号"></el-table-column>
                                    </el-table>
                                    <div slot="reference" class="name-wrapper" style="width:200px;display:inline-block;cursor: pointer" >
                                            <el-input  size="small" clearable style="width:240px;" @keyup.native="GetPatient" v-model="SearchPatient" v-bind:disabled="EditPatientName" >
                                            </el-input>
                                    </div>
                                </el-popover>
                            </el-col>
                        </el-row>
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                                <span class="base-label"><span class="required">* </span>姓名：</span>
                                <el-input  size="small" v-bind:disabled="EditPatientName" clearable style="width:115px;" v-model="form.family_name" id="family_name" @focus="InputCss('family_name')" placeholder="姓">
                                </el-input>
                                <el-input  size="small" v-bind:disabled="EditPatientName" clearable style="width:115px;" v-model="form.self_name" id="self_name" @focus="InputCss('self_name')" placeholder="名">
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                                <span class="base-label"><span class="required">* </span>患者性别：</span>
                                <el-radio-group v-model="form.gender" v-bind:disabled="EditPatientName">
                                    <el-radio :label="0">女</el-radio>
                                    <el-radio :label="1">男</el-radio>
                                    <el-radio :label="2">保密</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                                <span class="base-label"><span class="required">* </span>联系方式：</span>
                                <el-input  size="small" clearable style="width:240px;" v-model="form.main_tel_no" id="main_tel_no" @focus="InputCss('main_tel_no')" v-bind:disabled="EditPatientName">
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                                <span class="base-label"><span class="required">* </span>预约电话：</span>
                                <el-input  size="small" clearable style="width:240px;" v-model="tel_no" id="tel_no" @focus="InputCss('tel_no')">
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                                <span class="base-label" ><span class="required">* </span>患者来源：</span>
                                <el-select  v-model="form.reserve_source_category_id" filterable size="small" id="reserve_source_category_id"  style="width:240px;" @focus="InputCss('reserve_source_category_id')">
                                    <el-option
                                        v-for="item in reserveSource"
                                        :key="item.category_id"
                                        :label="item.category_name"
                                        :value="item.category_id" >
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                                <span class="base-label"><span class="required">* </span>发送短信：</span>
                                <el-radio-group v-model="form.is_tel_mess">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                                <el-button type="primary" plain=""  size="mini"  @click="dialogMessage=true" style="margin-left: 45px;">编辑模板</el-button>
                            </el-col>
                        </el-row>
                        <!--<el-row :gutter="1" class="baseinfo">-->
                            <!--<el-col :span="18">-->
                                <!--<span class="base-label"><span class="required">* </span>就诊类型：</span>-->
                                <!--<el-radio-group >-->
                                    <!--<el-radio :label="0">初诊</el-radio>-->
                                    <!--<el-radio :label="1">复诊</el-radio>-->
                                <!--</el-radio-group>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row :gutter="1" class="baseinfo">-->
                            <!--<el-col :span="18">-->
                                <!--<span class="base-label" style="vertical-align: top">预约事项：</span>-->
                                <!--<el-input type="textarea"  v-model="form.remark" style="width:240px;" size="mini"  rows=5>-->
                                <!--</el-input>-->
                            <!--</el-col>-->
                        <!--</el-row>-->

                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                                <span class="base-label" style="vertical-align: top">备注：</span>
                                <el-input type="textarea"  v-model="r_remark" style="width:240px;" size="mini"  rows=2>
                                </el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="18">
                                <el-button v-bind:disabled="ClearDisabled" size="mini" type="primary" plain @click="ClearPatient">清空</el-button>
                            </el-col>
                        </el-row>
                    </el-aside>
                    <el-main >
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="12">
                                <span class="base-label">预约医生：</span>
                                <el-select filterable v-model="form.doctor_id"  size="small" style="width:150px;" @change="GetDialogTime()" id="doctor_id">
                                    <el-option
                                        v-for="item in docName"
                                        :key="item.doctor_id"
                                        :label="item.doctor_name"
                                        :value="item.doctor_id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="12">
                                <span class="base-label">预约时间：</span>
                                <!--<el-date-picker-->
                                    <!--v-model="form.attendance_time"-->
                                    <!--type="date"-->
                                    <!--size="small"-->
                                    <!--format="yyyy 年 MM 月 dd 日"-->
                                    <!--value-format="yyyy-MM-dd"-->
                                    <!--placeholder="选择日期" style="width:150px;" >-->
                                <!--</el-date-picker>-->
                                <el-input v-model="form.attendance_date" size="small" style="width:150px;" disabled="disabled">
                                </el-input>
                            </el-col>

                        </el-row>
                        <el-row :gutter="1" class="baseinfo">
                            <el-col :span="12">
                                <span class="base-label">预约班次：</span>
                                <el-select filterable v-model="form.time_category"  size="small" style="width:150px;" @change="GetDialogTime()">
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
                        <div>
                            <el-table :data="TimeGridData"
                                      :height="TimeGridHeight"
                                      border
                                      ref="multipleTable"
                                      :cell-class-name="DialogCellStyle"
                                      :span-method="DialogSpanMethod"
                                      v-loading="TimeGridLoading">
                                <el-table-column min-width="50"  property="time_interval" label="时间段"></el-table-column>
                                <el-table-column min-width="80"   label="预约">
                                    <template slot-scope="scope" >
                                        <span v-if="scope.row.patient_id && !scope.row.reserveEdit">{{scope.row.patient_name}}</span>


                                        <!--<el-checkbox style="width:100%" v-if="!scope.row.patient_id && scope.row.attendance_id && scope.row.check" label="预约" v-model="scope.row.check" border @change="BookingCheck(scope.row)" checked="checked" ></el-checkbox>-->
                                        <!--<el-checkbox style="width:100%" v-else-if="!scope.row.patient_id && scope.row.attendance_id && !scope.row.check" label="预约" v-model="scope.row.check" border @change="BookingCheck(scope.row)" ></el-checkbox>-->
                                        <el-checkbox style="width:100%" label="预约" v-model="scope.row.check" border @change="BookingCheck(scope.row)" v-if="!scope.row.patient_id && scope.row.attendance_id" class="elCheckbox"></el-checkbox>
                                        <el-checkbox style="width:100%" :label="scope.row.patient_name" v-model="scope.row.check" border @change="BookingCheck(scope.row)" v-else-if="scope.row.patient_id && scope.row.reserveEdit && scope.row.attendance_id" v-bind:checked="EditCheck"></el-checkbox>


                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div id="buttons" style="float:right;margin:10px 20px 0 0;">
                            <el-button type="primary" plain=""  size="mini"  @click="CancelDialog">取消</el-button>
                            <el-button type="primary" size="mini" @click="SaveReserve">保存</el-button>
                        </div>
                    </el-main>
                </el-container>
            </el-dialog>
            <el-dialog title="短信模板"  :visible.sync="dialogMessage" width="47%">
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="12">
                        <span class="base-label">姓名：</span>
                        <span >{{form.family_name+form.self_name}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="base-label">预约电话：</span>
                        <span >{{tel_no}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="1" class="baseinfo" style="margin-bottom: 20px;">
                    <el-col :span="20">
                        <span class="base-label" style="vertical-align: top"><span class="required">* </span>短信内容：</span>
                        <el-input type="textarea"  v-model="form.text" style="width:75%" size="mini"  rows=5>
                        </el-input>
                    </el-col>
                </el-row>
                <div  style="margin:10px 10px 0 0;position: absolute;right:10px;bottom:15px;">
                    <!--<el-button type="primary" plain=""  size="mini"  @click="dialogMessage=false">取消</el-button>-->
                    <!--<el-button type="primary" size="mini" @click="SendMessage">发送</el-button>-->
                    <el-button type="primary" size="mini" @click="dialogMessage=false">关闭</el-button>
                </div>
            </el-dialog>
            <el-dialog title="短信模板"  :visible.sync="dialogMessagePo" width="47%">
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="12">
                        <span class="base-label">姓名：</span>
                        <span >{{form.family_name+form.self_name}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="base-label">预约电话：</span>
                        <span >{{tel_no}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="1" class="baseinfo" style="margin-bottom: 20px;">
                    <el-col :span="20">
                        <span class="base-label" style="vertical-align: top"><span class="required">* </span>短信内容：</span>
                        <el-input type="textarea"  v-model="form.text" style="width:75%" size="mini"  rows=5>
                        </el-input>
                    </el-col>
                </el-row>
                <div  style="margin:10px 10px 0 0;position: absolute;right:10px;bottom:15px;">
                    <el-button type="primary" plain=""  size="mini"  @click="dialogMessagePo=false">取消</el-button>
                    <el-button type="primary" size="mini" @click="SendMsg">发送</el-button>
                    <!--<el-button type="primary" size="mini" @click="dialogMessage=false">关闭</el-button>-->
                </div>
            </el-dialog>
            <el-dialog title="取消预约"  :visible.sync="dialogCancelReserve" width="47%">
                <el-row :gutter="1" class="baseinfo">
                    <el-col :span="6">
                        <span class="base-label">姓名：</span>
                        <span >{{form.patient_name}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">性别：</span>
                        <span >{{form.gender_name}}</span>
                    </el-col>
                    <el-col :span="6">
                        <span class="base-label">预约电话：</span>
                        <span >{{tel_no}}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="1" class="baseinfo">
                    <span class="base-label"><span class="required">* </span>原因类别：</span>
                    <el-select  v-model="form.category_id" filterable size="small" id="category_id"  style="width:250px;" @focus="InputCss('category_id')" >
                        <el-option
                            v-for="item in reserveLogCategory"
                            :key="item.category_id"
                            :label="item.category_name"
                            :value="item.category_id" >
                        </el-option>
                    </el-select>
                </el-row>
                <el-row :gutter="1" class="baseinfo">
                    <span class="base-label" style="vertical-align: top"><span class="required">* </span>取消原因：</span>
                    <el-input type="textarea" id="reserve_remark"  v-model="form.reserve_remark" style="width:250px;" size="mini"  rows=5 @focus="InputCss('reserve_remark')">
                    </el-input>
                </el-row>
                <div  style="margin:10px 10px 0 0;position: absolute;right:10px;bottom:15px;">
                    <el-button type="primary" plain=""  size="mini"  @click="dialogCancelReserve=false">取消</el-button>
                    <el-button type="primary" size="mini" @click="CancelReserveSure">保存</el-button>
                    <!--<el-button type="primary" size="mini" @click="dialogMessage=false">关闭</el-button>-->
                </div>
            </el-dialog>
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
        name: "BookingDoc",
        data() {
            return{
                TableHeight:"465",
                tableData:[],
                docName: [],
                Time:[],
                TimeVal:[],
                form:{
                    gender:0,   //性别
                    is_tel_mess:1,   //发送短信
                    attendanceList:[],  //预约时间 备注 状态
                },
                GridLoading:false,
                dialogFormVisible:false,
                gridHeight:"350",
                gridData:[],
                patientLoading:false,
                DisablePov:false,   //患者查询 下拉框
                SearchPatient:"",   //患者信息关键字
                TimeGridHeight:"300",  //时间段表格
                TimeGridData:[],
                ModelTime:[],
                TimeGridLoading:false,
                EditPatientName:false,   //是否可编辑患者名字电话等
                ClearDisabled:false,     //清空按钮是否禁用
                DialogTitle:"",         //预约标题
                PopoverDisabled:false,  //患者预约 确认预约popover
                DialogEdit:false,      //是否是编辑预约
                DefaultTime:"",        //编辑 默认时间
                EditCheck:false,      //编辑 勾选预约患者
                dialogMessage:false,   //发送短信模板 预约form
                dialogMessagePo:false,  //发送短信模板 首页
                dialogCancelReserve:false,  //取消预约 弹出
                reserveLogCategory:[],        //取消预约原因类型
                reserveSource:[]        //患者来源


            }
        },
        methods:{
            GetData(){
                this.GridLoading=true;
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
                        this.tableData=new Array(this.Time.length);
                        for(let i=0;i<this.Time.length;i++){
                            this.tableData[i]={};
                        }
                        for(let j=0;j<result.length;j++){
                            if(result[j].doctor_id) {
                                result[j].doctor_id = (result[j].doctor_id).toString();
                                let index = this.time2index(result[j]['time_interval']);
                                let value={};

                                if (!this.tableData[index][result[j].doctor_id]) {
                                    this.tableData[index][result[j].doctor_id] = [];
                                }
                                value.doctor_id=result[j].doctor_id;
                                value.patient_id=result[j].patient_id;
                                value.person_id=result[j].person_id;
                                value.patient_name=result[j].patient_name;
                                value.family_name=result[j].family_name;
                                value.self_name=result[j].self_name;
                                value.template_id=result[j].template_id;
                                value.result_status=result[j].result_status;
                                value.reserve_id=result[j].reserve_id;
                                value.reserve_statue=result[j].reserve_statue;
                                value.time_interval=result[j].time_interval;
                                value.time_category=result[j].time_category;
                                value.template_category_id=result[j].template_category_id;
                                value.gender_name=result[j].gender_name;
                                value.gender=result[j].gender;
                                value.tel_no=result[j].tel_no;
                                value.reserve_source_category_id=result[j].reserve_source_category_id;
                                value.main_tel_no=result[j].main_tel_no;
                                value.r_remark=result[j].r_remark;
                                if(result[j].birthday) {
                                    value.yearsOld = this.jsGetAge(result[j].birthday);
                                }else{
                                    value.yearsOld='--'
                                }
                                this.tableData[index][result[j].doctor_id]=value

                            }
                        }
                   //  console.log(JSON.stringify(this.tableData))
                        this.GridLoading=false;
                    }
                });
            },
            style({row, column, rowIndex, columnIndex}){
               if(columnIndex!==0 && columnIndex!==1){
                 if(!row[column.property]) {

                       return "success-row"
                   }
                   if(row[column.property].reserve_statue===5){
                       return "green-row"
                   }
                   if(row[column.property].reserve_statue===1){
                       return "blue-row"
                   }
               }
            },
            time2index(time){

                for(let i=0;i<this.Time.length;i++){
                    if(this.Time[i].time_interval===time)
                        return i;
                }
            },
            indexMethod(index) {
                return this.Time[index].time_interval
            },
            indexClass(index){
                if(this.Time[index].time_category==="am")
                    return "上午";
                if(this.Time[index].time_category==="pm")
                    return "下午";
                if(this.Time[index].time_category==="nm")
                    return "夜班";
            },
            ChangeDate(){
                this.GetModelTime();
                this.GetAttendanceDoctor();
            },
            GetModelTime(){
                //this.TimeVal=[];
                let param = {
                    "template_category_id":this.template_category_id,
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_booking_time_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {

                        this.Time = response.body.data;

                        this.GetData();

                    }
                });
            },
            GetAttendanceDoctor(){
                let param = {
                    "template_category_id":this.template_category_id,
                    "attendance_date":this.form.BookingDate

                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_doctor",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.docName = response.body.data;
                        if(this.docName){
                            for(let i=0;i<this.docName.length;i++){
                                this.docName[i].label=this.docName[i].doctor_name;
                                this.docName[i].prop=(this.docName[i].doctor_id).toString()
                            }

                        }

                    }
                });
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }){
                if(columnIndex===0){
                    var time_category=this.Time[rowIndex]["time_category"];
                    var rowspan=1;
                    if(rowIndex!=this.Time.length-1 && (rowIndex==0 || time_category!=this.Time[rowIndex-1]['time_category'])) {
                        for(var i=rowIndex+1;i<this.Time.length;i++){
                            if(this.Time[i]["time_category"]===time_category)
                                rowspan++;
                            else
                                break;
                        }
                    }

                    if (rowspan>1) {
                        return [rowspan,1]
                    } else {
                        return [0,0]
                    }
                } else if(columnIndex!==0 && columnIndex!==1){
                if(column.label!=="暂无医生排班" && this.tableData[rowIndex][column.property]) {
                            if (this.tableData[rowIndex][column.property].patient_name && ((rowIndex!==0 && (this.tableData[rowIndex-1][column.property] && this.tableData[rowIndex-1][column.property].patient_id)) || (this.tableData[rowIndex+1][column.property]!==undefined && this.tableData[rowIndex+1][column.property].patient_id!==undefined))) {
                                var rowspan = 1;
                                var flag=false;
                                let name = this.tableData[rowIndex][column.property].patient_id;
                                let status = this.tableData[rowIndex][column.property].reserve_statue;

                                let starTime=this.tableData[rowIndex][column.property].time_interval.substring(0,this.tableData[rowIndex][column.property].time_interval.indexOf("-"));

                                let endTime;
                                if (rowIndex !== this.tableData.length - 1  &&  (rowIndex===0 || this.tableData[rowIndex-1][column.property]===undefined || (this.tableData[rowIndex-1][column.property] && (name!==this.tableData[rowIndex-1][column.property].patient_id || (name===this.tableData[rowIndex-1][column.property].patient_id && status!==this.tableData[rowIndex-1][column.property].reserve_statue))))){
                                    for (let i = rowIndex + 1; i < this.tableData.length; i++) {
                                        if(this.tableData[i][column.property] && this.tableData[i][column.property].patient_id!==undefined) {

                                            if (this.tableData[i][column.property].patient_id === name && this.tableData[i][column.property].reserve_statue === status) {
                                                this.tableData[rowIndex][column.property].reserve_id = this.tableData[rowIndex][column.property].reserve_id + "," + this.tableData[i][column.property].reserve_id;
                                                rowspan++;
                                                endTime = this.tableData[i][column.property].time_interval.substring(this.tableData[rowIndex][column.property].time_interval.indexOf("-"))
                                            } else {
                                                if (rowIndex === 0 || (this.tableData[rowIndex - 1][column.property] && (this.tableData[rowIndex - 1][column.property].patient_id !== this.tableData[rowIndex][column.property].patient_id || (this.tableData[rowIndex - 1][column.property].patient_id === this.tableData[rowIndex][column.property].patient_id && this.tableData[rowIndex - 1][column.property].reserve_statue !== this.tableData[rowIndex][column.property].reserve_statue))) || !this.tableData[rowIndex - 1][column.property]) {
                                                    flag = true;
                                                }
                                                break;
                                            }
                                        }else{
                                            if(i===rowIndex + 1){
                                                flag = true;
                                            }
                                        }
                                    }

                                }
                              //  console.log(rowspan+","+flag)
                                if (rowspan >1) {
                                    this.tableData[rowIndex][column.property].time_interval=starTime+"-"+endTime;
                                    return [rowspan, 1];

                                }
                                if(rowspan===1 && flag){
                                    return [1, 1]
                                }
                                if(rowspan===1 && !flag){
                                    return [0, 0]
                                }
                            }
                    }
                }
            },
            CellClick(row, column, cell, event){
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
                this.ClearPatient();
                this.gridData=[];

                this.DialogEdit=false; //不是编辑

                this.EditCheck=false;

                this.form.patient_id=undefined;
                this.SearchPatient=undefined;
                this.form.gender_name=undefined;
                this.form.family_name=undefined;
                this.form.self_name=undefined;
                this.r_remark=undefined;
                this.tel_no=undefined;
                this.form.patient_name=undefined;
                this.form.gender_name=undefined;
                //this.form.reserve_source_category_id=undefined;

                this.DialogTitle="新增预约";
                this.EditPatientName=false;
                this.ClearDisabled=false;

                if(row[column.property].result_status===2){
                    return;
                }
                if(row[column.property]===undefined){
                    this.$message({
                        message: '该医生在此时间段未排班',
                        type: 'warning'
                    });
                    return;
                }else {
                    let list = $.extend(true, {}, this.form);
                    //日期
                    this.form.attendance_date = list.BookingDate;
                    //医生
                    this.form.doctor_id = Number(row[column.property].doctor_id);
                    //班次
                    this.form.time_category = row[column.property].time_category;
                    //获取时间列
                    this.form.main_tel_no=row[column.property].main_tel_no;  //主要联系方式

                    this.form.attendanceList=[];

                    //点击单元格的时间
                    if(row[column.property])
                    this.DefaultTime=row[column.property].template_id;
                   //打开弹出框
                    this.dialogFormVisible = true;


                    this.GetDialogTime();

                }
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
                    "search":this.SearchPatient,

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
            GetDialogTime(){
                this.clearCheck();  //清空所有已勾选的
                let param = {
                    "template_category_id":this.template_category_id,
                    "time_category":this.form.time_category
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_time_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.ModelTime = response.body.data;
                        this.GetDialogData();
                    }
                });
            },
            GetDialogData(){

                let param = {
                    "template_category_id":this.template_category_id,
                    "attendance_date":this.form.attendance_date,
                    "doctor_id":this.form.doctor_id,
                    "time_category":this.form.time_category

                };
                this.TimeGridLoading=true;
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_reserver",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        let result=response.body.data;
                        this.TimeGridData=this.ModelTime;
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
                                   // this.TimeGridData[j].check=false;

                                }


                                if(this.TimeGridData[j].patient_id && this.DialogEdit) {
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
                                                this.r_remark=this.TimeGridData[j].r_remark;
                                                this.tel_no=this.TimeGridData[j].tel_no;
                                            }
                                        }
                                    }else{
                                        if(this.TimeGridData[j].reserve_id===Number(this.form.reserveEdit)){
                                            this.TimeGridData[j].reserveEdit=true;

                                            this.TimeGridData[j].select=1;
                                            this.EditCheck=true;
                                            this.r_remark=this.TimeGridData[j].r_remark;
                                            this.tel_no=this.TimeGridData[j].tel_no;
                                        }
                                    }
                                }
                            }
                        }

                    }
                   // console.log(this.TimeGridData)
                    this.TimeGridLoading=false;
                    this.dialogMes();  //短信内容
                });
            },
            DialogCellStyle({row, column, rowIndex, columnIndex}){
                if(columnIndex===0){
                    if(this.TimeGridData[rowIndex].template_id===this.DefaultTime){
                        return 'blue-row'
                    }
                }
                if(columnIndex===1){

                    if(!this.TimeGridData[rowIndex].attendance_id)
                        return "success-row"

                    if(this.TimeGridData[rowIndex].patient_id && !this.TimeGridData[rowIndex].reserveEdit) {

                        return 'success-row'
                    }

                    if(this.TimeGridData[rowIndex].template_id===this.DefaultTime) {
                        this.TimeGridData[rowIndex].check=true;
                        // this.checkboxModel=true;
                        this.TimeGridData[rowIndex].select=1;
                        this.TimeGridData[rowIndex].r_remark=this.r_remark;
                        this.TimeGridData[rowIndex].tel_no=this.tel_no;
                        if(!this.DialogEdit) {
                            this.TimeGridData[rowIndex].reserve_statue = 1; //预约状态 待确认
                        }

                        this.form.template_category_id=this.TimeGridData[rowIndex].template_category_id;
                    }


               }
            },
            DialogSpanMethod({ row, column, rowIndex, columnIndex }){
                //合并
                if(columnIndex!==0){
                        if(this.TimeGridData[rowIndex] && this.TimeGridData[rowIndex].patient_name && !this.TimeGridData[rowIndex].reserveEdit) {
                            let name = this.TimeGridData[rowIndex].patient_id;
                            let status = this.TimeGridData[rowIndex].reserve_statue;
                            let rowspan = 1;
                            if (rowIndex !== this.TimeGridData.length - 1) {
                                for (let i = rowIndex + 1; i < this.TimeGridData.length; i++) {
                                    if (this.TimeGridData[i].patient_id === name && this.TimeGridData[i].reserve_statue === status)
                                        rowspan++;
                                    else
                                        break;
                                }
                            }
                            if (rowspan > 1) {
                                return [rowspan, 1]
                            } else {
                                return [1, 1]
                            }
                        }
                }
            },
            PatientGrid(row, event, column){
                this.ClearPatient();
                this.DisablePov=false;
                this.EditPatientName=true;
                let list=$.extend(true,{},this.form);
                if(!this.tel_no)
                    this.tel_no=list.main_tel_no;
                this.SearchPatient=row.patient_name;
                this.form=$.extend({}, this.form, row);
                this.dialogMes();  //短信内容
            },
            ClearPatient(){
               //清空
                Vue.set(this.form, 'birthday', undefined);
                Vue.set(this.form, 'gender', 0);
                Vue.set(this.form, 'gender_name', undefined);
             //   Vue.set(this.form, 'tel_no', undefined);
                Vue.set(this.form, 'main_tel_no', undefined);
                Vue.set(this.form, 'patient_id', undefined);
                Vue.set(this.form, 'patient_name', undefined);
                Vue.set(this.form, 'person_id', undefined);
                Vue.set(this.form, 'family_name', undefined);
                Vue.set(this.form, 'self_name', undefined);
               // Vue.set(this.form, 'r_remark', undefined);
                this.tel_no=undefined;
                this.r_remark="";

                this.SearchPatient=undefined;
                this.DisablePov=false;
                this.EditPatientName=false;
                this.form.attendanceList=[];

                $("input").css({"border-color": "#dcdfe6", "color": "#606266"});
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
                    this.form.template_category_id=row.template_category_id;
                    row.reserve_statue=1;
                    row.r_remark=this.r_remark;
                    row.tel_no=this.tel_no;
                    // 如果是编辑 递归改变时间连续时预约状态
                    // if(this.DialogEdit) {
                    //   //  console.log("11")
                    //     let index = this.findIndex(row);
                    //
                    //     if ((index - 1) >= 0 && ((this.TimeGridData[index - 1].patient_id!==undefined && this.TimeGridData[index - 1].patient_id===this.form.patient_id) || (this.TimeGridData[index - 1].patient_id===null && this.TimeGridData[index - 1].select===1)) && this.TimeGridData[index - 1].reserve_statue === 5) {
                    //         this.find(row,index, 1)
                    //     }
                    //
                    //     else if ((index + 1) <= (this.TimeGridData.length - 1) && this.TimeGridData[index + 1].reserve_statue === 5 && ((this.TimeGridData[index + 1].patient_id!==undefined && this.TimeGridData[index + 1].patient_id===this.form.patient_id) || (this.TimeGridData[index + 1].patient_id===null && this.TimeGridData[index + 1].select===1))) {
                    //         this.find(row,index, -1)
                    //     }
                    // }

                }else if(row.select===1){

                    row.select=0;  //取消预约
                    row.check=false;
                    row.reserve_statue=undefined;
                }

                this.dialogMes();  //短信内容
            },
            SaveReserve(){
               //保存预约

                let list=$.extend(true,{},this.form);
                if(!this.tel_no)
                    this.tel_no=list.main_tel_no;
                if(!this.tel_no){
                    this.$message({
                        message: '请填写预约电话！',
                        type: 'warning'
                    });
                    return;
                }
                let IDArr;
                IDArr = ["family_name","self_name","main_tel_no","reserve_source_category_id"];

                if (this.showPoint(IDArr))
                    return;


                this.form.attendanceList=[];
                for(let i=0;i<this.TimeGridData.length;i++){
                    if(this.TimeGridData[i].patient_id && this.TimeGridData[i].patient_id===this.form.patient_id && !this.TimeGridData[i].reserveEdit && this.TimeGridData[i].reserve_statue===1){
                        this.form.attendanceList.push(this.TimeGridData[i]);
                    }
                    if(this.TimeGridData[i].select===1 && this.TimeGridData[i].reserve_statue===1){
                        this.TimeGridData[i].r_remark=this.r_remark;
                        if(!this.TimeGridData[i].r_remark)
                            this.TimeGridData[i].r_remark="";
                        this.TimeGridData[i].tel_no=this.tel_no;
                        this.form.attendanceList.push(this.TimeGridData[i]);

                    }
                }

                if (this.form.patient_id === "" || this.form.patient_id === null)
                    delete this.form.patient_id;

                this.form.hospital_id=hospital_id;

                this.form.template_category_id=this.template_category_id;

                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_reserve_modify",
                    "param": JSON.stringify(this.form)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.$message({
                            message: '预约成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible=false;
                        this.GetData();
                        this.DialogEdit=false;  //是否是编辑
                        if(this.form.is_tel_mess)
                        this.SendMsg()          //发送短信
                    }
                });
            },
            CancelDialog(){
                //取消
               this.SearchPatient=undefined;
                this.dialogFormVisible=false;
             //   this.GetDialogData();
            },
            jsGetAge(strBirthday){

            let returnAge;
                let strBirthdayArr=strBirthday.split("-");
                let birthYear = strBirthdayArr[0];
                let birthMonth = strBirthdayArr[1];
                let birthDay = strBirthdayArr[2];

            let d = new Date();
                let nowYear = d.getFullYear();
                let nowMonth = d.getMonth() + 1;
                let nowDay = d.getDate();

            if(nowYear == birthYear){
                returnAge = 0;//同年 则为0岁
            }
            else{
                let ageDiff = nowYear - birthYear ; //年之差
                if(ageDiff > 0){
                    if(nowMonth == birthMonth) {
                        let dayDiff = nowDay - birthDay;//日之差
                        if(dayDiff < 0)
                        {
                            returnAge = ageDiff - 1;
                        }
                        else
                        {
                            returnAge = ageDiff ;
                        }
                    }
                    else
                    {
                        let monthDiff = nowMonth - birthMonth;//月之差
                        if(monthDiff < 0)
                        {
                            returnAge = ageDiff - 1;
                        }
                        else
                        {
                            returnAge = ageDiff ;
                        }
                    }
                }
                else
                {
                    returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
                }
            }

            return returnAge;//返回周岁年龄


    },
            EditDialog(row){
                //编辑预约

                $("input").css({"color":"#606266","border-color":"#dcdfe6"});
                this.DefaultTime=undefined;  //默认时间清空
                this.DialogEdit=true;    //是否是编辑
                this.EditCheck=true;    //编辑的数据打钩

                this.dialogFormVisible = true;

                this.DialogTitle="编辑预约";
                this.ClearDisabled=true;
                this.EditPatientName=true;
                let list = $.extend(true, {}, this.form);

                this.form.person_id=row.person_id;
                this.form.patient_id=row.patient_id;
                this.SearchPatient=row.patient_name;
                this.form.gender=row.gender;
                this.form.family_name=row.family_name;
                this.form.self_name=row.self_name;
                this.form.reserve_source_category_id=row.reserve_source_category_id;
               // this.form.tel_no=row.tel_no;
              //  this.form.r_remark=row.r_remark;
                this.form.main_tel_no=row.main_tel_no;  //主要联系方式
               // this.form.reserve_statue=row.reserve_statue;
                //日期
                this.form.attendance_date = list.BookingDate;
                //医生
                this.form.doctor_id = Number(row.doctor_id);
                //班次
                this.form.time_category = row.time_category;
                this.form.template_category_id = row.template_category_id;
                //获取时间列

                this.GetDialogTime();
                this.form.attendanceList=[];
               //预约ID的获取
                this.form.reserveEdit=row.reserve_id
            },
            SureDialog(row) {

                var arr = [];
                if (typeof row.reserve_id === "string"){
                    let result = row.reserve_id.split(",");


                for (let i = 0; i < result.length; i++) {
                    arr.push({"reserve_id": result[i]})
                }
            }else{
                    arr.push({"reserve_id": row.reserve_id})
                }

                let param={
                    "reserve_statue":5,
                    "reserveList":arr
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_reserver_status",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.$alert( '预约已确认！', '提示', {
                            confirmButtonText: '确定',
                        });
                        // this.$message({
                        //     message: '预约已确认！',
                        //     type: 'success'
                        // });
                        this.PopoverDisabled=false;
                        this.GetData();
                    }
                });

            },
            CancelReserve(row) {
                $("input").css({"border-color": "#dcdfe6", "color": "#606266"});
                this.dialogCancelReserve = true;
                this.form.patient_name=row.patient_name;
                this.form.gender_name=row.gender_name;
                this.tel_no=row.tel_no;
                this.GetLogCategory();
                this.form.reserve_id=row.reserve_id;

            },
            CancelReserveSure(){
                let IDArr;
                IDArr = ["category_id","reserve_remark"];

                if (this.showPoint(IDArr))
                    return;

                var arr = [];
                if (typeof this.form.reserve_id === "string"){
                    let result = this.form.reserve_id.split(",");


                    for (let i = 0; i < result.length; i++) {
                        arr.push({"reserve_id": result[i]})
                    }
                }else{
                    arr.push({"reserve_id": this.form.reserve_id})
                }

                let param={
                    "category_id":this.form.category_id,
                    "reserve_remark":this.form.reserve_remark,
                    "reserveList":arr
                };

                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_reserver_delete",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.$alert( '预约已取消！', '提示', {
                            confirmButtonText: '确定',
                        });
                        this.dialogCancelReserve = false
                        ;
                        this.PopoverDisabled=false;
                        this.GetData();

                    }
                });
            },
            find(row,index,forward){
                this.TimeGridData[index].reserve_statue=5;
                index+=forward;
                if(index>=0 && index<=(this.TimeGridData.length-1) && this.TimeGridData[index].reserve_statue===1 && this.TimeGridData[index].patient_id===null){
                    this.find(row,index,forward)
                }
             },
            findIndex(row){
                 // for(let i=0;i<this.TimeGridData.length;i++){
                 //     if(this.TimeGridData[i].attendance_id)
                 //         if(this.TimeGridData[i].attendance_id===row.attendance_id)
                 //             console.log(i);
                 // }
                if(this.TimeGridData.indexOf(row)!==-1) {
                    return this.TimeGridData.indexOf(row)
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
            IsInputCss(){
                let IDArr = ["family_name","self_name","tel_no"];
                for(let i=0;i<IDArr.length;i++){
                    if(this.form[IDArr[i]]==="必填项不能为空") {
                        Vue.set(this.form, IDArr[i], undefined);
                        $("#" + IDArr[i]).css({"border-color": "#dcdfe6", "color": "#606266"});
                    }
                }

            },
            dialogMes(){
                //编辑模板 预约时间
                let patientTimeMess="";
                for(let i=0;i<this.TimeGridData.length;i++){
                    if(this.TimeGridData[i].patient_id && this.TimeGridData[i].patient_id===this.form.patient_id && !this.TimeGridData[i].reserveEdit){
                        patientTimeMess=patientTimeMess+this.TimeGridData[i].time_interval+"，"
                    }
                    if(this.TimeGridData[i].select===1){
                        patientTimeMess=patientTimeMess+this.TimeGridData[i].time_interval+"，"
                    }
                }

                    this.form.text=this.form.family_name+this.form.self_name+"女士/先生，您好！您于"+this.form.BookingDate+"日预约了"+$("#doctor_id").val()+"医生。预约时间为："+patientTimeMess+"如有疑问，请致电400-6136309，北京顾氏珺康诊所"

            },
            clearCheck(){
                this.TimeGridData=[];

                for(let i=0;i<this.TimeGridData.length;i++){
                    let value={}
                    value.check=false;
                    this.TimeGridData.push(value)
                }
            },
            prevDay(){
                this.form.BookingDate=Date.parse(this.form.BookingDate)-(24*60*60*1000);
                this.form.BookingDate=new Date(this.form.BookingDate);
                this.form.BookingDate=this.timestampToTime2(this.form.BookingDate);
                this.ChangeDate();
            },
            nextDay(){
                this.form.BookingDate=Date.parse(this.form.BookingDate)+(24*60*60*1000);
                this.form.BookingDate=new Date(this.form.BookingDate);
                this.form.BookingDate=this.timestampToTime2(this.form.BookingDate);
                this.ChangeDate();
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
            GetTemplateCategory(){
                //获取时间模板
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_template_default"
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.template_category_id=response.body.data.template_category_id
                        this.ChangeDate();
                    }
                });
            },
            ShowMessage(row,doctor){
                this.dialogMessagePo=true;
                this.form=$.extend({}, this.form, row);
                this.tel_no=row.tel_no;

                //发送短信弹出
                this.form.text=this.form.family_name+this.form.self_name+"女士/先生，您好！您于"+this.form.BookingDate+"日预约了"+doctor+"医生。预约时间为："+row.time_interval+"，如有疑问，请致电400-6136309，北京顾氏珺康诊所"
            },
            SendMsg(){

                this.GridLoading=true;
                this.$http.post(baseUrl()+'/sendTelMess',{"tel":this.tel_no,"text":this.form.text,"type":"reserve"}).then((response) => {
                    if(requestSuccess(response.body,this)){

                        this.$message({
                            message: '短信已发送',
                            type: 'success'
                        });
                        this.dialogFormVisible=false;
                        this.dialogMessagePo=false;
                    }
                    this.GridLoading=false;
                });
            },
            GetLogCategory(){
              //取消预约原因类型
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_patient_reserve_log_category"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.reserveLogCategory = response.body.data;

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
        },
        mounted(){

            Vue.set(this.form, 'BookingDate', CurrentDate());
            this.form.BookingDate=CurrentDate();
            this.GetTemplateCategory();
            this.GetReserveSource();
            this.TableHeight=($(window).height())-60-($("#tools").height())-20-90;

            window.onresize  = () => {
                this.TableHeight=($(window).height())-60-($("#tools").height())-20-90;

            };

        }
    }
</script>

<style scoped>
    .el-table--enable-row-hover .el-table__body tr:hover>td{background:none!important;}
    .el-table--enable-row-hover .el-table__body tr:hover td{background:none!important;}
    .el-table--enable-row-hover .el-table__body td:hover{
        background:none!important;
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
    .tab_content{
        padding:8px 10px 0 10px;
    }
    .baseinfo{
        padding: 10px 0 5px 5px;
    }
    .base-label{
        width: 80px;
        display: inline-block;
        text-align: right;
    }
</style>
