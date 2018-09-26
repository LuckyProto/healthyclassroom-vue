<template>
    <div class="workforce content_inner">
        <div class="classify"><h4 class="title">排班管理</h4></div>
        <div class="tab_content">
            <el-button type="primary"  size="small" @click="prevWeek">上一周</el-button>
            <el-date-picker
                v-model="BookingDate"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                @change="ChangeDate"
                size="small">
            </el-date-picker>
            <el-button type="primary"  size="small" @click="nextWeek">下一周</el-button>
            <el-table
                id="grid"
                ref="multipleTable"
                :cell-class-name="style"
                :data="tableData"
                style="width: 100%;"
                border
                :height="TableHeight"
                @cell-click="CellClick"
                @cell-mouse-enter="CellMoseEnter"
                :header-cell-class-name="headerStyle">
                <el-table-column
                    type="index"
                    label="时段"
                    width="150"
                    :index="indexMethod">
                </el-table-column>
                <el-table-column
                    :prop="WeekDay[0].prop" :label="WeekDay[0].label" >
                        <template slot-scope="scope" >
                            <div v-for="(item,index) in scope.row.index0" >
                            <el-popover trigger="hover" placement="right" width="600" >
                                <h1 style="height:30px;line-height: 30px;font-weight: bolder">排班明细</h1>
                                <div style="height:30px;line-height: 30px;">
                                    <span style="margin-right: 15px;"> 姓名：<span >{{ item.doctor_name }}</span></span>
                                    <span> 日期：<span >{{ item.attendance_date }}</span></span>
                                </div>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" >全选</el-checkbox>
                                <el-checkbox-group v-model="checkedTime" @change="handleCheckedCitiesChange" >
                                    <span v-for="(tamp,index) in Time" style="display:inline-block;margin-bottom: 2px;">
                                        <el-checkbox v-if="tamp.reserver_checked===1" :label="tamp.template_id" :key="tamp.template_id" disabled >{{tamp.time_interval}}</el-checkbox>
                                        <el-checkbox v-else-if="tamp.reserver_checked===0" :label="tamp.template_id" :key="tamp.template_id"  @change="SaveDetail(item,tamp)">{{tamp.time_interval}}</el-checkbox>
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 0;"  @click="rowChecked(item,index,tamp)">选择</el-button >
                                        <el-button size="mini" v-if="index%4===3"  style="margin-left: 3px;" @click="rowUnChecked(item,index,tamp)">取消</el-button >
                                    </span>
                                </el-checkbox-group>
                                <div  style="float:right;margin:0 5px 5px 0;">
                                    <el-button type="danger" plain style="width:70px" size="mini" @click="AttendanceDelete(item)" v-bind:disabled="EditDisable">删 除</el-button>
                                    <!--<el-button type="primary"  style="width:70px" size="mini" @click="AttendanceSave(item)" >保 存</el-button>-->
                                </div>
                                <div slot="reference" class="name-wrapper" style="width:80px;cursor: pointer" @mouseenter="getTimeList(item)" >
                                    <div size="medium">{{ item.doctor_name }}</div>
                                </div>
                            </el-popover>
                            </div>
                        </template>
                </el-table-column>
                <el-table-column
                    :prop="WeekDay[1].prop" :label="WeekDay[1].label" >
                    <template slot-scope="scope" >
                        <div v-for="(item,index) in scope.row.index1" >
                            <el-popover trigger="hover" placement="right" width="600">
                                <h1 style="height:30px;line-height: 30px;font-weight: bolder">排班明细</h1>
                                <div style="height:30px;line-height: 30px;">
                                    <span style="margin-right: 15px;"> 姓名：<span >{{ item.doctor_name }}</span></span>
                                    <span> 日期：<span >{{ item.attendance_date }}</span></span>
                                </div>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" >全选</el-checkbox>
                                <el-checkbox-group v-model="checkedTime" @change="handleCheckedCitiesChange" >
                                    <span v-for="(tamp,index) in Time" style="display:inline-block;margin-bottom: 2px;">
                                        <el-checkbox v-if="tamp.reserver_checked===1" :label="tamp.template_id" :key="tamp.template_id" disabled >{{tamp.time_interval}}</el-checkbox>
                                        <el-checkbox v-else-if="tamp.reserver_checked===0" :label="tamp.template_id" :key="tamp.template_id"  @change="SaveDetail(item,tamp)">{{tamp.time_interval}}</el-checkbox>
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 0;"  @click="rowChecked(item,index,tamp)">选择</el-button >
                                        <el-button size="mini" v-if="index%4===3"  style="margin-left: 3px;" @click="rowUnChecked(item,index,tamp)">取消</el-button >
                                    </span>
                                </el-checkbox-group>
                                <div  style="float:right;margin:0 5px 5px 0;">
                                    <el-button type="danger" plain style="width:70px" size="mini" @click="AttendanceDelete(item)" v-bind:disabled="EditDisable">删 除</el-button>
                                    <!--<el-button type="primary"  style="width:70px" size="mini" @click="AttendanceSave(item)" >保 存</el-button>-->
                                </div>
                                <div slot="reference" class="name-wrapper" style="width:80px;cursor: pointer" @mouseenter="getTimeList(item)" >
                                    <div size="medium">{{ item.doctor_name }}</div>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :prop="WeekDay[2].prop" :label="WeekDay[2].label" >
                    <template slot-scope="scope" >
                        <div v-for="(item,index) in scope.row.index2" >
                            <el-popover trigger="hover" placement="right" width="600" >
                                <h1 style="height:30px;line-height: 30px;font-weight: bolder">排班明细</h1>
                                <div style="height:30px;line-height: 30px;">
                                    <span style="margin-right: 15px;"> 姓名：<span >{{ item.doctor_name }}</span></span>
                                    <span> 日期：<span >{{ item.attendance_date }}</span></span>
                                </div>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedTime" @change="handleCheckedCitiesChange" >
                                    <span v-for="(tamp,index) in Time" style="display:inline-block;margin-bottom: 2px;">
                                        <el-checkbox v-if="tamp.reserver_checked===1" :label="tamp.template_id" :key="tamp.template_id" disabled >{{tamp.time_interval}}</el-checkbox>
                                        <el-checkbox v-else-if="tamp.reserver_checked===0" :label="tamp.template_id" :key="tamp.template_id"  @change="SaveDetail(item,tamp)">{{tamp.time_interval}}</el-checkbox>
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 0;"  @click="rowChecked(item,index,tamp)">选择</el-button >
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 3px;"  @click="rowUnChecked(item,index,tamp)">取消</el-button >
                                        <!--<el-checkbox v-if="index%4===3" style="margin-left: 0;" :label="tamp.time_interval" :key="tamp.time_interval" @change="rowChecked(item,index)">勾选一行{{index}}</el-checkbox>-->
                                    </span>
                                </el-checkbox-group>
                                <div  style="float:right;margin:0 5px 5px 0;">
                                    <el-button type="danger" plain style="width:70px" size="mini" @click="AttendanceDelete(item)" v-bind:disabled="EditDisable">删 除</el-button>
                                    <!--<el-button type="primary"  style="width:70px" size="mini" @click="AttendanceSave(item)" >保 存</el-button>-->
                                </div>
                                <div slot="reference" class="name-wrapper" style="width:80px;cursor: pointer" @mouseenter="getTimeList(item)" >
                                    <div size="medium">{{ item.doctor_name }}</div>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :prop="WeekDay[3].prop" :label="WeekDay[3].label" >
                    <template slot-scope="scope" >
                        <div v-for="(item,index) in scope.row.index3" >
                            <el-popover trigger="hover" placement="right" width="600" >
                                <h1 style="height:30px;line-height: 30px;font-weight: bolder">排班明细</h1>
                                <div style="height:30px;line-height: 30px;">
                                    <span style="margin-right: 15px;"> 姓名：<span >{{ item.doctor_name }}</span></span>
                                    <span> 日期：<span >{{ item.attendance_date }}</span></span>
                                </div>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedTime" @change="handleCheckedCitiesChange" >
                                    <span v-for="(tamp,index) in Time" style="display:inline-block;margin-bottom: 2px;">
                                        <el-checkbox v-if="tamp.reserver_checked===1" :label="tamp.template_id" :key="tamp.template_id" disabled >{{tamp.time_interval}}</el-checkbox>
                                        <el-checkbox v-else-if="tamp.reserver_checked===0" :label="tamp.template_id" :key="tamp.template_id"  @change="SaveDetail(item,tamp)">{{tamp.time_interval}}</el-checkbox>
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 0;"  @click="rowChecked(item,index,tamp)">选择</el-button >
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 3px;"  @click="rowUnChecked(item,index,tamp)">取消</el-button >
                                        <!--<el-checkbox v-if="index%4===3" style="margin-left: 0;" :label="tamp.time_interval" :key="tamp.time_interval" @change="rowChecked(item,index)">勾选一行{{index}}</el-checkbox>-->
                                    </span>
                                </el-checkbox-group>
                                <div  style="float:right;margin:0 5px 5px 0;">
                                    <el-button type="danger" plain style="width:70px" size="mini" @click="AttendanceDelete(item)" v-bind:disabled="EditDisable">删 除</el-button>
                                    <!--<el-button type="primary"  style="width:70px" size="mini" @click="AttendanceSave(item)" >保 存</el-button>-->
                                </div>
                                <div slot="reference" class="name-wrapper" style="width:80px;cursor: pointer" @mouseenter="getTimeList(item)" >
                                    <div size="medium">{{ item.doctor_name }}</div>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :prop="WeekDay[4].prop" :label="WeekDay[4].label" >
                    <template slot-scope="scope" >
                        <div v-for="(item,index) in scope.row.index4" >
                            <el-popover trigger="hover" placement="right" width="600" >
                                <h1 style="height:30px;line-height: 30px;font-weight: bolder">排班明细</h1>
                                <div style="height:30px;line-height: 30px;">
                                    <span style="margin-right: 15px;"> 姓名：<span >{{ item.doctor_name }}</span></span>
                                    <span> 日期：<span >{{ item.attendance_date }}</span></span>
                                </div>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedTime" @change="handleCheckedCitiesChange" >
                                    <span v-for="(tamp,index) in Time" style="display:inline-block;margin-bottom: 2px;">
                                        <el-checkbox v-if="tamp.reserver_checked===1" :label="tamp.template_id" :key="tamp.template_id" disabled >{{tamp.time_interval}}</el-checkbox>
                                        <el-checkbox v-else-if="tamp.reserver_checked===0" :label="tamp.template_id" :key="tamp.template_id"  @change="SaveDetail(item,tamp)">{{tamp.time_interval}}</el-checkbox>
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 0;"  @click="rowChecked(item,index,tamp)">选择</el-button >
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 3px;"  @click="rowUnChecked(item,index,tamp)">取消</el-button >
                                        <!--<el-checkbox v-if="index%4===3" style="margin-left: 0;" :label="tamp.time_interval" :key="tamp.time_interval" @change="rowChecked(item,index)">勾选一行{{index}}</el-checkbox>-->
                                    </span>
                                </el-checkbox-group>
                                <div  style="float:right;margin:0 5px 5px 0;">
                                    <el-button type="danger" plain style="width:70px" size="mini" @click="AttendanceDelete(item)" v-bind:disabled="EditDisable">删 除</el-button>
                                    <!--<el-button type="primary"  style="width:70px" size="mini"  @click="AttendanceSave(item)">保 存</el-button>-->
                                </div>
                                <div slot="reference" class="name-wrapper" style="width:80px;cursor: pointer" @mouseenter="getTimeList(item)" >
                                    <div size="medium">{{ item.doctor_name }}</div>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :prop="WeekDay[5].prop" :label="WeekDay[5].label" >
                    <template slot-scope="scope" >
                        <div v-for="(item,index) in scope.row.index5" >
                            <el-popover trigger="hover" placement="right" width="600" >
                                <h1 style="height:30px;line-height: 30px;font-weight: bolder">排班明细</h1>
                                <div style="height:30px;line-height: 30px;">
                                    <span style="margin-right: 15px;"> 姓名：<span >{{ item.doctor_name }}</span></span>
                                    <span> 日期：<span >{{ item.attendance_date }}</span></span>
                                </div>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedTime" @change="handleCheckedCitiesChange" >
                                    <span v-for="(tamp,index) in Time" style="display:inline-block;margin-bottom: 2px;">
                                        <el-checkbox v-if="tamp.reserver_checked===1" :label="tamp.template_id" :key="tamp.template_id" disabled >{{tamp.time_interval}}</el-checkbox>
                                        <el-checkbox v-else-if="tamp.reserver_checked===0" :label="tamp.template_id" :key="tamp.template_id"  @change="SaveDetail(item,tamp)">{{tamp.time_interval}}</el-checkbox>
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 0;"  @click="rowChecked(item,index,tamp)">选择</el-button >
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 3px;"  @click="rowUnChecked(item,index,tamp)">取消</el-button >
                                        <!--<el-checkbox v-if="index%4===3" style="margin-left: 0;" :label="tamp.time_interval" :key="tamp.time_interval" @change="rowChecked(item,index)">勾选一行{{index}}</el-checkbox>-->
                                    </span>
                                </el-checkbox-group>
                                <div  style="float:right;margin:0 5px 5px 0;">
                                    <el-button type="danger" plain style="width:70px" size="mini" @click="AttendanceDelete(item)" v-bind:disabled="EditDisable">删 除</el-button>
                                    <!--<el-button type="primary"  style="width:70px" size="mini" @click="AttendanceSave(item)" >保 存</el-button>-->
                                </div>
                                <div slot="reference" class="name-wrapper" style="width:80px;cursor: pointer" @mouseenter="getTimeList(item)" >
                                    <div size="medium">{{ item.doctor_name }}</div>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :prop="WeekDay[6].prop" :label="WeekDay[6].label" >
                    <template slot-scope="scope" >
                        <div v-for="(item,index) in scope.row.index6" >
                            <el-popover trigger="hover" placement="right" width="600" >
                                <h1 style="height:30px;line-height: 30px;font-weight: bolder">排班明细</h1>
                                <div style="height:30px;line-height: 30px;">
                                    <span style="margin-right: 15px;"> 姓名：<span >{{ item.doctor_name }}</span></span>
                                    <span> 日期：<span >{{ item.attendance_date }}</span></span>
                                </div>
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedTime" @change="handleCheckedCitiesChange" >
                                    <span v-for="(tamp,index) in Time" style="display:inline-block;margin-bottom: 2px;">
                                        <el-checkbox v-if="tamp.reserver_checked===1" :label="tamp.template_id" :key="tamp.template_id" disabled >{{tamp.time_interval}}</el-checkbox>
                                        <el-checkbox v-else-if="tamp.reserver_checked===0" :label="tamp.template_id" :key="tamp.template_id"  @change="SaveDetail(item,tamp)">{{tamp.time_interval}}</el-checkbox>
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 0;"  @click="rowChecked(item,index,tamp)">选择</el-button >
                                        <el-button size="mini" v-if="index%4===3" style="margin-left: 3px;"  @click="rowUnChecked(item,index,tamp)">取消</el-button >
                                        <!--<el-checkbox v-if="index%4===3" style="margin-left: 0;" :label="tamp.time_interval" :key="tamp.time_interval" @change="rowChecked(item,index)">勾选一行{{index}}</el-checkbox>-->
                                    </span>
                                </el-checkbox-group>
                                <div  style="float:right;margin:0 5px 5px 0;">
                                    <el-button type="danger" plain style="width:70px" size="mini" v-bind:disabled="EditDisable">删 除</el-button>
                                    <!--<el-button type="primary"  style="width:70px" size="mini" @click="AttendanceSave(item)" >保 存</el-button>-->
                                </div>
                                <div slot="reference" class="name-wrapper" style="width:80px;cursor: pointer" @mouseenter="getTimeList(item)" >
                                    <div size="medium">{{ item.doctor_name }}</div>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div>
                <div class="box" v-for="(item,index) in doctorList" @click="selectDoctor(index,item)" >
                    <div class="doctor"  >
                        <div class="doc_img" >
                            <img >
                        </div>
                        <p class="doctor-id" style="display:none">{{item.doctor_id}}</p>
                        <p class="doctor-name">{{item.doctor_name}}</p>
                        <p class="doctor-department">{{item.department}}</p>
                    </div>
                    <div class="selectMask" >
                        <i class="chooseTick"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    import {tableRequest} from "../../../utilis/common.js";
    import Vue from 'vue';
    let storage = getLocalStorage();
    let hospital_id=storage.getItem("hospital_id");
    export default {
        name: "workforce",
        data() {
            return {
                TableHeight:"455",
                BookingDate:"",
                WeekDay:[
                    {prop: 'index0', label: '周日',tamp:'',date:''},
                    {prop: 'index1', label: '周一',tamp:'',date:''},
                    {prop: 'index2', label: '周二',tamp:'',date:''},
                    {prop: 'index3', label: '周三',tamp:'',date:''},
                    {prop: 'index4', label: '周四',tamp:'',date:''},
                    {prop: 'index5', label: '周五',tamp:'',date:''},
                    {prop: 'index6', label: '周六',tamp:'',date:''},
                ],
                tableData:[
                    {index0:[{status:1}], index1:[], index2:[], index3:[], index4:[], index5:[], index6:[], time_category:"am"},
                    {index0:[{status:1}],  index1:[], index2:[], index3:[], index4:[], index5:[], index6:[], time_category:"pm"},
                    {index0:[{status:1}],  index1:[], index2:[], index3:[], index4:[], index5:[], index6:[], time_category:"nm"}
                ],
                doctorList:[
                    {doctor_id:"1",doctor_name:"宋",department:"内分泌",select:0},
                    {doctor_id:"2",doctor_name:"医生2",department:"内分泌",select:0},
                    {doctor_id:"3",doctor_name:"医生3",department:"内分泌",select:0},
                    {doctor_id:"4",doctor_name:"医生4",department:"内分泌",select:0},
                    {doctor_id:"5",doctor_name:"医生5",department:"内分泌",select:0}
                ],
                selectTime:[],
                am:[
                    {time_interval:"8:00-9:00",template_id:"4"},
                    {time_interval:"9:00-10:00",template_id:"8"},
                    {time_interval:"10:00-11:00",template_id:"12"},
                    {time_interval:"11:00-12:00",template_id:"16"},
                ],
                pm:[
                    {time_interval:"12:00-13:00",template_id:"20"},
                    {time_interval:"13:00-14:00",template_id:"24"},
                    {time_interval:"14:00-15:00",template_id:"28"},
                    {time_interval:"15:00-16:00",template_id:"32"},
                    {time_interval:"16:00-17:00",template_id:"36"},
                    {time_interval:"17:00-18:00",template_id:"40"}
                ],
                nm:[
                    {time_interval:"18:00-19:00",template_id:"44"},
                    {time_interval:"19:00-20:00",template_id:"48"},
                    {time_interval:"21:00-22:00",template_id:"52"}
                ],
                selectModel:"",
                Time:[],
                TimeVal:[],
                TimeRow:[],
                RowCell:undefined,
                time_category:"am",
                checkedTime:[],
                attendance_date_start:"",
                attendance_date_end:"",
                NowTamp:"",
                NowDate:"",
                isIndeterminate:true,
                checkAll:false,
                CheckTemplateID:"",
                Item:"",
                EditDisable:false,

            }
        },
        methods:{
            GetData(){
                let param={
                    "template_category_id":this.template_category_id,
                    "attendance_date_start":this.WeekDay[0].date,
                    "attendance_date_end":this.WeekDay[6].date
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_info",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.clearData();
                       // console.log(response.body);
                        let result=response.body.data;
                        if(result)
                        for(let i=0;i<result.length;i++){
                            for(let j=0;j<this.WeekDay.length;j++){
                                if(result[i].attendance_date===this.WeekDay[j].date){
                                    result[i].colIndex=this.WeekDay[j].prop;           //相应的index
                                    break;
                                }
                            }
                            //第几行
                            if(result[i].time_category==='am')
                                result[i].rowIndex=0;
                            if(result[i].time_category==='pm')
                                result[i].rowIndex=1;
                            if(result[i].time_category==='nm')
                                result[i].rowIndex=2;

                            result[i].tamptotime=Date.parse(result[i].attendance_date)-24*60*60*1000;
                            //push 数据
                            this.tableData[result[i].rowIndex][result[i].colIndex].push(result[i]);
                        }
                    }
                });
            },
            clearData(){
                this.tableData=[
                    {index0:[{status:1}], index1:[], index2:[], index3:[], index4:[], index5:[], index6:[], time_category:"am"},
                    {index0:[{status:1}],  index1:[], index2:[], index3:[], index4:[], index5:[], index6:[], time_category:"pm"},
                    {index0:[{status:1}],  index1:[], index2:[], index3:[], index4:[], index5:[], index6:[], time_category:"nm"}
                ];
                $(".selectMask").css("display", "none");
                $("td").css("background","#ffffff");

            },
            style({row, column, rowIndex, columnIndex}){
                if(columnIndex===0)
                    return;
                else{
                    if(this.WeekDay[columnIndex-1].date===this.NowDate) {
                        return "cellColor"
                    }
                }
            },
            headerStyle({row, column, rowIndex, columnIndex}){
            //  console.log(column)
                  if(columnIndex===0)
                        return;
                    else{
                        if(this.WeekDay[columnIndex-1].date<this.NowDate) {

                            return "success-row"
                        }
                        if(this.WeekDay[columnIndex-1].date===this.NowDate){
                            return "warning-row"
                        }
                    }

            },
            ChangeDate(){
                //周一时间戳

                var timespame0=Date.parse(this.BookingDate)-24*60*60*1000;

                for(var i=0;i<7;i++){
                  //  this.WeekDay[i].label=this.WeekDay[i].label+" ( "+this.timestampToTime(timespame0+i*24*60*60*1000)+" )";
                    this.WeekDay[i].label= this.getWeekStr(i)+" ( "+this.timestampToTime(timespame0+i*24*60*60*1000)+" )";
                    this.WeekDay[i].tamp=timespame0+i*24*60*60*1000;
                    this.WeekDay[i].date=this.timestampToTime2(timespame0+i*24*60*60*1000);

                   //参数 开始日期
                    this.attendance_date_start=this.timestampToTime2(timespame0+0*24*60*60*1000);
                    //参数 结束日期
                    this.attendance_date_end=this.timestampToTime2(timespame0+6*24*60*60*1000);
                }

                //获取医生排班信息

                this.GetData();

                //默认选中当天
                //var time=new Date();
               // var day=time.getDay();
               // $("#week"+day).addClass("className");
            },
            getWeekStr(week){
                switch(week){
                    case 0:
                        return "周日";
                    case 1:
                        return "周一";
                    case 2:
                        return "周二";
                    case 3:
                        return "周三";
                    case 4:
                        return "周四";
                    case 5:
                        return "周五";
                    case 6:
                        return "周六";
                }
            },
            timestampToTime(timestamp) {
                var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M =(date.getMonth()+1) + '/';
                var D = date.getDate() + ' ';
                return M+D;
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
            getMonthDay(){
                //获取当前周 周一
                var d=new Date();
                var day=d.getDay();
                var date=d.getDate();
                if(day==1)
                    return d;
                if(day==0)
                    d.setDate(date+1);
                else
                    d.setDate(date-day+1);

                return d;
            },
            indexMethod(index) {
                let arr = ["上午","下午","夜班"];
                return arr[index]
            },
            CellClick(row, column, cell, event){
                //点击单元格 医生有的在医生列表打钩
                let CellDoctor=row[column.property];
                $(".selectMask").css("display", "none");

                $("td").css("background","#ffffff");
                let flag=true;
                for(let i=0;i<this.WeekDay.length;i++){
                    if(this.WeekDay[i].prop===column.property && this.WeekDay[i].date<this.NowDate){  //小于当前日期 不能选择
                        flag=false;
                        this.RowCell=undefined;
                        this.$message({
                            message: '日期已过，无法进行排班！',
                            type: 'warning'
                        });
                        $(cell).css("cursor", "not-allowed");
                        return;
                    }
                }
                for(let j=0;j<this.doctorList.length;j++){
                    this.doctorList[j].select=0;
                    for(let k=0;k<CellDoctor.length;k++){
                        if(this.doctorList[j].doctor_id === CellDoctor[k].doctor_id){
                            $(".selectMask").eq(j).css("display", "block");
                            this.doctorList[j].select=1;
                        }
                    }
                }

                if(column.type==="index")
                    return;
                if(flag) {
                    $(cell).css("background", "#e7f5ff");
                    this.time_category = row.time_category;
                    for(let j=0;j<this.WeekDay.length;j++){
                        if(this.WeekDay[j].prop===column.property)
                            row[column.property].attendance_date=this.WeekDay[j].date
                    }
                    this.RowCell = row[column.property];


                }
            },
            CellMoseEnter(row, column, cell, event){
                $(cell).css("cursor", "default");
                for(let i=0;i<this.WeekDay.length;i++){
                    if(this.WeekDay[i].prop===column.property && this.WeekDay[i].date<this.NowDate){  //小于当前日期 不能选择

                        $(cell).css("cursor", "not-allowed");
                        return;
                    }
                }
            },
            selectDoctor(index,item){
               //选择医生

                if(!this.RowCell){   //如果没选择时间 返回
                    this.$message({
                        message: '请选择排班日期！',
                        type: 'warning'
                    });
                    return;
                }
                let list=$.extend(true, {},item);
                list.time_category=this.time_category;
                list.attendance_date=this.RowCell.attendance_date;
                list.template_category_id=this.template_category_id;

                if(item.select===0) {
                    item.select = 1;  //选中医生
                    $(".selectMask").eq(index).css("display", "block");
                this.RowCell.push(list);
                }else{
                    item.select = 0;  //取消选中医生
                    $(".selectMask").eq(index).css("display", "none");

                    this.AttendanceDelete(list);  //从数据库中删除数据


                }
            },
            getTimeList(item){
                //鼠标悬停事件

                this.checkedTime=[];
                this.GetModelTime(item);
                // if(this.time_category===item.time_category  && this.Time.length!==0) {
                //     this.AttendanceDetail(item);
                //     return;
                // }else{
                //   //  this.time_category=item.time_category;
                //
                // }
                this.Item=item;
                //快速选择时间
                if(item.time_category==="am")
                    this.selectTime=this.am;
                if(item.time_category==="pm")
                    this.selectTime=this.pm;
                if(item.time_category==="nm")
                    this.selectTime=this.nm;

                if(item.attendance_date<this.NowDate){
                    this.EditDisable=true;

                }else{
                    this.EditDisable=false;
                }

            },
            GetModelTime(item){
                this.TimeVal=[];
                let param = {
                    "template_category_id":this.template_category_id,
                    "time_category":item.time_category
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_time_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.Time = response.body.data;
                        for(let i=0;i<this.Time.length;i++){
                            this.TimeVal.push(this.Time[i].template_id)
                        }
                        //获取出诊时间明细
                       this.AttendanceDetail(item);
                    }
                });
            },
            AttendanceDetail(item){

                let param = {
                    "template_category_id":this.template_category_id,
                    "attendance_date":item.attendance_date,
                    "doctor_id":item.doctor_id,
                    "time_category":item.time_category
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_detail",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                       //console.log(response.body.data);

                        item.time_interval=response.body.data;
                        var time_interval=[];
                        if(item.time_interval)
                        for(let i=0;i<item.time_interval.length;i++){
                            time_interval.push(item.time_interval[i].template_id);
                            for(let j=0;j<this.Time.length;j++){
                                if(item.time_interval[i].template_id===this.Time[j].template_id) {
                                    this.Time[j].reserver_checked = item.time_interval[i].reserver_checked;
                                    this.Time[j].attendance_id = item.time_interval[i].attendance_id;
                                }
                            }
                        }
                      this.checkedTime=time_interval;
                        this.handleCheckedCitiesChange(this.checkedTime)
                    }
                });
            },
            Disabled(){
                let a=new Date();
                this.NowTamp=Date.parse(a);
                this.NowDate=this.timestampToTime2(this.NowTamp);
            },
            handleCheckAllChange(val) {
                //全选
                this.checkedTime = val ? this.TimeVal : [];
                this.isIndeterminate = false;


                if(this.Item.attendance_date<this.NowDate){
                    this.$message({
                        message: '排班日期已过！',
                        type: 'warning'
                    });
                    this.AttendanceDetail(this.Item);
                    return;
                }
                let arr=[];
                if(this.checkedTime.length!=0) {
                    if(this.Item.time_interval)
                    for (let j = 0; j < this.Item.time_interval.length; j++) {

                        arr.push(this.Item.time_interval[j].template_id)
                    }
                        for(let i=0;i<this.checkedTime.length;i++){
                           if(arr.indexOf(this.checkedTime[i])===-1) {
                               let param = {
                                   "doctor_id": this.Item.doctor_id,
                                   "template_id": this.checkedTime[i],
                                   "attendance_date": this.Item.attendance_date,
                               };
                               this.$http.post(baseUrl() + '/comm', {
                                   "methodName": "sp_clinic_doct_attendance_detail_save",
                                   "param": JSON.stringify(param)
                               }).then((response) => {
                                   if (requestSuccess(response.body, this)) {
                                       this.AttendanceDetail(this.Item);
                                   }
                               });
                           }
                        }

                }else{
                    let flag=true;
                    for(let i=0;i<this.Item.time_interval.length;i++){
                        if(this.Item.time_interval[i].reserver_checked===1) {
                            this.$message({
                                message: '已预约时间不能删除!',
                                type: 'warning'
                            });
                            flag=false;
                            continue;
                        }else {
                            this.Delete(this.Item,this.Item.time_interval[i]);
                        }
                    }
                    if(flag){

                        this.GetData();
                        // for (let j = 0; j < this.doctorList.length; j++) {
                        //     for (let i = 0; i < this.RowCell.length; i++) {
                        //         if (this.RowCell[i].doctor_id === this.Item.doctor_id) {   //医生ID
                        //
                        //             this.RowCell.splice(i, 1);
                        //         }
                        //     }
                        //     if (this.doctorList[j].doctor_id === this.Item.doctor_id) {
                        //         $(".selectMask").eq(j).css("display", "none");
                        //         this.doctorList[j].select = 0;
                        //     }
                        // }
                    }
                }

            },
            handleCheckedCitiesChange(value) {
                //checkbox 改变值
                this.TimeRow=[];  //该医生所选时间段

                let checkedCount = value.length;
                //console.log(checkedCount)
               // console.log(this.Time.length)
                this.checkAll = checkedCount === this.Time.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.Time.length;

            },
            SaveDetail(item,temp){

                if(item.attendance_date<this.NowDate){
                    this.$message({
                        message: '排班日期已过！',
                        type: 'warning'
                    });
                    this.AttendanceDetail(item);
                    return;
                }
                if(this.checkedTime.indexOf(temp.template_id)!==-1){
                    this.Save(item,temp);
                }else{
                    this.Delete(item,temp);
                }

            },
            Save(item,temp){
                let param={
                    "doctor_id": item.doctor_id,
                    "template_id":temp.template_id,
                    "attendance_date":item.attendance_date,
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_detail_save",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.AttendanceDetail(item);
                    }
                });
            },
            Delete(item,temp){
                let param={
                    "attendance_id": temp.attendance_id,
                };
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_detail_delete",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                      //  console.log(item)
                        this.AttendanceDetail(item);
                        if(this.checkedTime.length===0)
                            this.GetData();
                    }
                });
            },
            AttendanceSave(item){
                let rows=[];
                for(let i=0;i<this.checkedTime.length;i++){
                    let value={};
                    value.template_id=this.checkedTime[i];
                    rows.push(value);
                }
                let param={
                    "template_category_id": this.template_category_id,
                    "doctor_id": item.doctor_id,
                    "time_category":item.time_category,
                    "attendance_date":item.attendance_date,
                    "rows":rows
                };

                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_save",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.$alert("保存成功！", '提示', {
                            confirmButtonText: '确定',
                        });
                    }
                });
            },
            AttendanceDelete(item)
            {

                let param={
                    "template_category_id": this.template_category_id,
                    "doctor_id": item.doctor_id,
                    "time_category":item.time_category,
                    "attendance_date":item.attendance_date,

                };

                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_delete",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                        this.$message({
                            message: '已删除排班医生！',
                            type: 'success'
                        });

                        if(this.RowCell && this.RowCell.length>0) {
                            for (let i = 0; i < this.RowCell.length; i++) {
                                if (this.RowCell[i].doctor_id === item.doctor_id) {   //医生ID

                                    this.RowCell.splice(i, 1);
                                }
                            }
                            if(this.doctorList)
                            for (let j = 0; j < this.doctorList.length; j++) {

                                if (this.doctorList[j].doctor_id === item.doctor_id) {
                                    $(".selectMask").eq(j).css("display", "none");
                                    this.doctorList[j].select = 0;
                                }
                            }
                        }else{
                            this.GetData();
                        }

                    }
                });
            },
            GetDoctorList(){
                let param={
                    "hospital_id":hospital_id,
                    "is_reserve":1
                }
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_hospital_doctor_query",
                    "param": JSON.stringify(param)
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                      this.doctorList=response.body.data;
                    }
                });
            },
            prevWeek(){
                //上一周
                this.BookingDate=Date.parse(this.BookingDate)-(24*60*60*1000)*7;
                this.BookingDate=new Date(this.BookingDate);
                this.RowCell=undefined;
                this.ChangeDate();
                this.Disabled();
            },
            nextWeek(){
                //下一周
                this.BookingDate=Date.parse(this.BookingDate)+(24*60*60*1000)*7;
                this.BookingDate=new Date(this.BookingDate);
                this.RowCell=undefined;
                this.ChangeDate();
                this.Disabled();
            },
            rowChecked(item,index,tamp){
                if(this.Item.attendance_date<this.NowDate){
                    this.$message({
                        message: '排班日期已过！',
                        type: 'warning'
                    });
                    this.AttendanceDetail(this.Item);
                    return;
                }
               let arr=[];
                let time_interval=[];
                if(item.time_interval)
                for(let j=0;j<item.time_interval.length;j++){
                    time_interval.push(item.time_interval[j].template_id);
                }
                for(let i=index-3;i<=index;i++){
                            if(time_interval.indexOf(this.Time[i].template_id)===-1){
                                this.checkedTime.push(this.Time[i].template_id)
                                arr.push(this.Time[i].template_id);
                            }
                }

                for(let i=0;i<arr.length;i++){

                        let param = {
                            "doctor_id": this.Item.doctor_id,
                            "template_id": arr[i],
                            "attendance_date": this.Item.attendance_date,
                        };
                        this.$http.post(baseUrl() + '/comm', {
                            "methodName": "sp_clinic_doct_attendance_detail_save",
                            "param": JSON.stringify(param)
                        }).then((response) => {
                            if (requestSuccess(response.body, this)) {
                                this.AttendanceDetail(this.Item);
                            }
                        });

                }
            },
            rowUnChecked(item,index,tamp){
                if(this.Item.attendance_date<this.NowDate){
                    this.$message({
                        message: '排班日期已过！',
                        type: 'warning'
                    });
                    this.AttendanceDetail(this.Item);
                    return;
                }
                let deleteArr=[];
                for(let i=index-3;i<=index;i++){
                    for(let j=0;j<this.checkedTime.length;j++){
                            if(this.checkedTime[j]===this.Time[i].template_id) {
                                deleteArr.push(this.checkedTime[j])
                            }
                    }

                }
                if(item.time_interval)
                    for(let k=0;k<item.time_interval.length;k++){
                        if(item.time_interval[k].reserver_checked===1){  //如果有预约
                            continue;
                        }else{
                            if(deleteArr.indexOf(item.time_interval[k].template_id)!==-1){
                                this.Delete(item,item.time_interval[k]);  //删除
                            }
                        }
                    }
            },
            GetTemplateCategory(){
                this.$http.post(baseUrl() + '/comm', {
                    "methodName": "sp_clinic_doct_attendance_template_default"
                }).then((response) => {
                    if (requestSuccess(response.body, this)) {
                         this.template_category_id=response.body.data.template_category_id
                        this.ChangeDate();
                    }
                });
            }
        },

        mounted(){
            this.BookingDate=this.getMonthDay();
            this.GetTemplateCategory();


            $("tbody tr").css("height","210px");
           // this.GetModelTime();
            this.Disabled();
            //获取医生列表
            this.GetDoctorList();


        }
    }
</script>

<style scoped>

.el-checkbox{
    width:120px;
}


    .tab_content{
        padding:8px 10px 0 10px;
    }
    #grid{
        margin-top: 8px;
    }
    .header{
        display:inline-block;
        border-bottom: 1px solid #ccc;
        width:100%;
        height:30px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;

    }
    .personList{
        padding:3px 15px;

    }
    .className{
        background:#b3d8ff;
    }
    .noEdit{
        color:#cccccc;
        cursor: not-allowed;
    }
    .box{
        cursor:pointer;
    }
    .mySeqNum{
        background: url("../../../../static/img/r-deleteM.png") center no-repeat;
        display: inline-block;
        width: 14px;
        height: 15px;

    }
    .mySeqNumCursor{
        cursor:pointer;
        vertical-align: middle;
        margin-top:-4px;
    }
    .box{
        position: relative;
        width: 200px;
        height: 90px;

        display:inline-block;
        margin:5px 13px;
    }
    .doctor{
        height: 70px;
        width: 180px;
        border: 1px solid #dadada;
        background: #fff;
        padding: 9px;
        cursor: pointer;
        margin: 0 auto;
        border-radius: 3px;
    }
    .doc_img{
        border: 1px solid #ebebeb;
        margin-right: 8px;
        height: 68px;
        width: 68px;
        float: left;
    }
    .doc_img img{
        height: 68px;
        width: 68px;
        border: 0;
        vertical-align: bottom;
    }
    .doctor-name {
        font-size: 14px;
        margin-top: 10px;
    }
    .doctor-department{
        color: #a4a4a4;
    }
    .selectMask{
        width: 200px;
        height: 90px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 3px;
        background: #555;
        opacity: 0.5;
        display:none;
    }
    .chooseTick{
        display: block;
        width: 20px;
        height: 20px;
        position: absolute;
        background: url("../../../../static/img/b-tick.png") center no-repeat;
        bottom: 10px;
        right: 10px;
    }
    .block{
        display:block;
    }
</style>
