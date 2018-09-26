<template>
    <div>
        <!--<el-date-picker-->
            <!--v-model="ApproveDate"-->
            <!--type="date"-->
            <!--size="small"-->
            <!--id="StartDate"-->
            <!--format="yyyy 年 MM 月 dd 日"-->
            <!--value-format="timestamp"-->
            <!--@change="ChangeDate"-->
            <!--placeholder="选择日期" style="width:175px;margin-right: 20px" >-->
        <!--</el-date-picker>-->
        <el-date-picker
            v-model="ApproveDate2"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="选择周" @change="ChangeDate">
        </el-date-picker>
        <div style="height: 200px">
            <div  style="width:14%;display: inline-block">
                <span id="week0" @click="select(0)" class="week">周日</span>
                <div v-for="(doc,index) in weekDoc[0]">
                    <div class="text-success" >
                        {{doc.name}}|<span v-on:click="del(0,index)">删除</span>
                    </div>
                </div>
            </div>
            <div  style="width:14%;display: inline-block">
                <span id="week1" @click="select(1)" class="week">周一</span>
                <li v-for="(doc,index) in weekDoc[1]">
                    <p class="text-success" >
                        {{doc.name}}|<span v-on:click="del(1,index)">删除</span>
                    </p>
                </li>
            </div>
            <div  style="width:14%;display: inline-block">
                <span id="week2" @click="select(2)" class="week">周二</span>
                <li v-for="(doc,index) in weekDoc[2]">
                    <p class="text-success" >
                        {{doc.name}}|<span v-on:click="del(2,index)">删除</span>
                    </p>
                </li>
            </div>
            <div  style="width:14%;display: inline-block">
                <span id="week3" @click="select(3)" class="week">周三</span>
                <li v-for="(doc,index) in weekDoc[3]">
                    <p class="text-success" >
                        {{doc.name}}|<span v-on:click="del(3,index)">删除</span>
                    </p>
                </li>
            </div>
            <div  style="width:14%;display: inline-block">
                <span id="week4" @click="select(4)" class="week">周四</span>
                <li v-for="(doc,index) in weekDoc[4]">
                    <p class="text-success" >
                        {{doc.name}}|<span v-on:click="del(4,index)">删除</span>
                    </p>
                </li>
            </div>
            <div  style="width:14%;display: inline-block">
                <span id="week5" @click="select(5)" class="week">周五</span>
                <li v-for="(doc,index) in weekDoc[5]">
                    <p class="text-success" >
                        {{doc.name}}|<span v-on:click="del(5,index)">删除</span>
                    </p>
                </li>
            </div>
            <div  style="width:14%;display: inline-block">
                <span id="week6" @click="select(6)" class="week">周六</span>
                <li v-for="(doc,index) in weekDoc[6]">
                    <p class="text-success" >
                        {{doc.name}}|<span v-on:click="del(6,index)">删除</span>
                    </p>
                </li>
            </div>

        </div>

        <div @click="add('医生1')" >
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
        name: "111",
        data() {
            return {
                ApproveDate:"",
                ApproveDate2:"",
                weekDoc:[
                    [{name:"测试"}],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ],
                current:-1
            }
        },
        methods:{
            del(current,index){
                this.weekDoc[current].splice(index,1)
            },
            add(doc){
                if(this.current==-1){
                    alert("请先选择星期几")
                    return;
                }

                for(var i=0;i<this.weekDoc[this.current].length;i++) {
                    if (this.weekDoc[this.current][i].name == doc) {
                        alert("请勿重复添加")
                        return;
                    }
                }

                this.weekDoc[this.current].push({name:doc})
            },
            select(current){
                if($("#week0").text()=="周日"){
                    alert("请先选择日期")
                    return;
                }

                this.current=current;
                for(var i=0;i<7;i++){
                    if(i==current)
                        $("#week"+i).css("background","#990000")
                    else
                        $("#week"+i).css("background","#999999")
                }
            },
            ChangeDate(){

                //周一时间戳
                var timespame0=Date.parse(this.ApproveDate2)-24*60*60*1000
                for(var i=0;i<7;i++){
                    $("#week"+i).html(this.getWeekStr(i)+"<br>"+this.timestampToTime(timespame0+i*24*60*60*1000));

                }
            },
            getWeekStr(week){
                switch(week){
                    case 0:
                        return "周日"
                    case 1:
                        return "周一"
                    case 2:
                        return "周二"
                    case 3:
                        return "周三"
                    case 4:
                        return "周四"
                    case 5:
                        return "周五"
                    case 6:
                        return "周六"
                }
            },
            timestampToTime(timestamp) {
                var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M =(date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                return Y+M+D;
            }
        }
    }
</script>

<style scoped>
.week{
    height:30px;

}
</style>
