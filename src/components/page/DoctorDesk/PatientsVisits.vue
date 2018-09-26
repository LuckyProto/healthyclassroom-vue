<template>
    <div class="patientsVisits content_inner">
        <div v-show="FrimShow">
            <div class="classify"><h4 class="title">今日就诊</h4></div>
            <div class="tab_content">
                <div id="tools">
                    <el-button type="primary" plain="" class="add" @click="GetData(20)">候诊中</el-button>
                    <el-button type="primary"  plain="" class="add" @click="GetData(30)">治疗中</el-button>
                    <el-button type="primary"  plain="" class="add" @click="GetData(40)">已完成</el-button>
                    <div style="float:right">
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
                        <el-input class="search ml20"  placeholder="姓名/病历号" v-model="searchInput" size="small" @keyup.native="Search">
                            <el-button slot="append" icon="el-icon-search" size="small" @click="SearchForm"></el-button>
                        </el-input>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <el-card shadow="hover" class="s_box" >
                            <div class="patient_name">李瑶</div>
                        <div style="margin:3px;">
                            <span style="margin-right: 10px;">25岁</span><span style="margin-right: 10px;">女</span><span style="margin-right: 10px;">复诊</span>
                        </div>

                            <div style="margin:3px;">就诊医生：顾峰</div>
                            <div style="margin:3px;">就诊时间：2018-05-10</div>
                            <div class="bottom clearfix">
                                <el-button type="text" class="button">继续治疗</el-button>
                                <el-button type="text" class="button" style="float: right">完成就诊</el-button>
                            </div>
                    </el-card>
                </div>
            </div>
        </div>
        <div v-show="FormShow">

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
        name: "patientsVisits",
        data() {
            return {
                FormShow:false,
                FrimShow:true,
                form:{

                },
                cardData:[]
            }
        },
        methods:{
            GetData(status){
                let param={
                    "search":this.searchInput,
                    "states":Number(status),
                    "BookingDate":this.form.BookingDate
                };
                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_reserve_medical_visit_query","param":JSON.stringify(param)}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.cardData = response.body.data;
                        if(this.cardData)
                        for(let i=0;i<this.cardData.length;i++){

                            if(!this.cardData[i].patient_name && (this.cardData[i].family_name || this.cardData[i].self_name)) {
                                if (this.cardData[i].family_name)
                                    this.cardData[i].patient_name = this.cardData[i].family_name;
                                if (this.cardData[i].self_name)
                                    this.cardData[i].patient_name = this.cardData[i].self_name;
                            }
                           //性别
                            if(this.cardData[i].gender===0)
                                this.cardData[i].gender_name="女";
                            if(this.cardData[i].gender===1)
                                this.cardData[i].gender_name="男";
                            if(this.cardData[i].gender===2)
                                this.cardData[i].gender_name="保密";
                            //初诊 复诊
                            if(this.cardData[i].is_first===0)
                                this.cardData[i].is_first_name="初诊";
                            if(this.cardData[i].is_first===1)
                                this.cardData[i].is_first_name="复诊";
                        }


                    }
                    this.GridLoading=false;
                });
            },
        }
    }
</script>

<style scoped>
    .patient_name{
        font-size: 18px;
        font-weight: bold;
        max-width: 130px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .s_box {
        min-width: 250px;
        width: 20%;
        padding: 0 15px;
        height: 170px;
        margin-bottom: 20px;
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
