<template>
    <div class="workforce content_inner">
        <div class="classify"><h4 class="title">排班管理</h4></div>
        <div class="tab_content">
            <el-date-picker
                v-model="BookingDate"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周" @change="ChangeDate" size="small">
            </el-date-picker>
            <div style="height: 400px;margin-top: 10px;border:1px solid #ccc;">
                <div class="box" style="width:14%;float:left;height:100%;border-right:1px solid #ccc; " @click="select(0)">
                    <span id="week0"  class="header">周日</span>
                    <div style="height:30%;border-bottom: 1px solid #ccc;background: red" @click="select(0,0)">
                        <div v-for="(doc,index) in weekDoc[0][0]" class="personList" >
                            <div class="text-success" @mouseover="overShow(0,index)" @mouseout="outHide(0,index)">
                                {{doc.name}}  <i class="mySeqNum mySeqNumCursor" v-on:click="del(0,index)" style="display:none" ></i>
                            </div>
                        </div>
                    </div>
                    <div style="height:30%;border-bottom: 1px solid #ccc;background: red" @click="select(0,1)">
                        <div v-for="(doc,index) in weekDoc[0][1]" class="personList" >
                            <div class="text-success" @mouseover="overShow(0,index)" @mouseout="outHide(0,index)">
                                {{doc.name}}  <i class="mySeqNum mySeqNumCursor" v-on:click="del(0,index)" style="display:none" ></i>
                            </div>
                        </div>
                    </div>
                    <div style="height:30%;">
                        <div v-for="(doc,index) in weekDoc[0][2]" class="personList" @click="select(0,2)">
                            <div class="text-success" @mouseover="overShow(0,index)" @mouseout="outHide(0,index)">
                                {{doc.name}}  <i class="mySeqNum mySeqNumCursor" v-on:click="del(0,index)" style="display:none" ></i>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="box" style="width:14%;float:left;height:100%;border-right:1px solid #ccc;" @click="select(1)">
                    <span id="week1" @click="select(1)" class="header">周一</span>
                    <div>
                        <div v-for="(doc,index) in weekDoc[1]" class="personList">
                            <p class="text-success" @mouseover="overShow(1,index)" @mouseout="outHide(1,index)">
                                {{doc.name}}<i class="mySeqNum mySeqNumCursor" v-on:click="del(1,index)" style="display:none" ></i>
                            </p>
                        </div>
                    </div>

                </div>
                <div class="box" style="width:14%;float:left;height:100%;border-right:1px solid #ccc;" @click="select(2)">
                    <span id="week2" @click="select(2)" class="header">周二</span>
                    <div>
                        <div v-for="(doc,index) in weekDoc[2]" class="personList">
                            <p class="text-success" @mouseover="overShow(2,index)" @mouseout="outHide(2,index)">
                                {{doc.name}}<i class="mySeqNum mySeqNumCursor" v-on:click="del(2,index)" style="display:none" ></i>
                            </p>
                        </div>
                    </div>

                </div>
                <div class="box" style="width:14%;float:left;height:100%;border-right:1px solid #ccc;" @click="select(3)">
                    <span id="week3" @click="select(3)" class="header">周三</span>
                    <div>
                        <div v-for="(doc,index) in weekDoc[3]" class="personList">
                            <p class="text-success" @mouseover="overShow(3,index)" @mouseout="outHide(3,index)">
                                {{doc.name}}<i class="mySeqNum mySeqNumCursor" v-on:click="del(3,index)" style="display:none" ></i>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="box" style="width:14.5%;float:left;height:100%;border-right:1px solid #ccc;" @click="select(4)">
                    <span id="week4" @click="select(4)" class="header">周四</span>
                    <div>
                        <div v-for="(doc,index) in weekDoc[4]" class="personList">
                            <p class="text-success" @mouseover="overShow(4,index)" @mouseout="outHide(4,index)">
                                {{doc.name}}<i class="mySeqNum mySeqNumCursor" v-on:click="del(4,index)" style="display:none" ></i>
                            </p>
                        </div>
                    </div>

                </div>
                <div class="box" style="width:14.5%;float:left;height:100%;border-right:1px solid #ccc;" @click="select(5)">
                    <span id="week5" @click="select(5)" class="header">周五</span>
                    <div>
                        <div v-for="(doc,index) in weekDoc[5]" class="personList">
                            <p class="text-success" @mouseover="overShow(5,index)" @mouseout="outHide(5,index)">
                                {{doc.name}}<i class="mySeqNum mySeqNumCursor" v-on:click="del(5,index)" style="display:none" ></i>
                            </p>
                        </div>
                    </div>

                </div>
                <div class="box" style="width:14.5%;float:left;height:100%;" @click="select(6)">
                    <span id="week6" @click="select(6)" class="header">周六</span>
                    <div>
                        <div v-for="(doc,index) in weekDoc[6]" class="personList">
                            <p class="text-success" @mouseover="overShow(6,index)" @mouseout="outHide(6,index)">
                                {{doc.name}}<i class="mySeqNum mySeqNumCursor" v-on:click="del(6,index)" style="display:none" ></i>
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
        <div @click="add('医生13333')" >
            医生1
        </div>
        <div @click="add('医生2')">
            医生2
        </div>
        <div @click="add('医生3')">
            医生3
        </div>
    </div>
</template>

<script>
    export default {
        name: "workforce",
        data() {
            return {
                BookingDate:"",
                weekDoc:[
                    [[{name:"测试"}],[],[]],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ],
                current:-1,
                dayCurrent:-1,
            }
        },
        methods:{
            del(current,index){
                this.weekDoc[current].splice(index,1)
            },
            overShow(current,index){
                // $("#week"+current).siblings().find("i").each(function(){
                //     $(this).css("display","none");
                // });

                $("#week"+current).siblings().find("i").eq(index).css("display","inline-block");
            },
            outHide(current,index){
                $("#week"+current).siblings().find("i").eq(index).css("display","none");
            },
            add(doc){
                // if(this.current==-1){
                //     alert("请先选择星期几")
                //     return;
                // }

                for(var i=0;i<this.weekDoc[this.current][this.dayCurrent].length;i++) {
                    if (this.weekDoc[this.current][this.dayCurrent][i].name == doc) {
                        alert("请勿重复添加")
                        return;
                    }
                }

                this.weekDoc[this.current][this.dayCurrent].push({name:doc})
            },
            select(current,dayCurrent){
                // if($("#week0").text()=="周日"){
                //     alert("请先选择日期")
                //     return;
                // }
                this.current=current;
                this.dayCurrent=dayCurrent;
                console.log(this.dayCurrent)
                for(var i=0;i<7;i++){
                    if(i==current)
                        $("#week"+i).addClass("className");
                    else
                        $("#week"+i).removeClass("className")
                }
            },
            ChangeDate(){
                //周一时间戳
                var timespame0=Date.parse(this.BookingDate)-24*60*60*1000;

                for(var i=0;i<7;i++){

                    $("#week"+i).html(this.getWeekStr(i)+" ( "+this.timestampToTime(timespame0+i*24*60*60*1000)+" )");
                    $("#week"+i).removeClass("className");
                }
                //默认选中当天
                var time=new Date();
                var day=time.getDay();
                $("#week"+day).addClass("className");
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

                this.current=day;
                return d;
            }
        },
        mounted(){
            this.BookingDate=this.getMonthDay();
            this.ChangeDate();
        }
    }
</script>

<style scoped>

    .tab_content{
        padding:8px 10px 0 10px;
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

</style>
