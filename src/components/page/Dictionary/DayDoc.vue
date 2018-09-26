<template>
    <div>
        <el-table
            ref="multipleTable"
            :span-method="objectSpanMethod"
            :cell-class-name="style"
                  @cell-click="click"
                  :data="tableData"
                  style="width: 100%;"
                  border
                  :height="TableHeight">
            <el-table-column
                type="index"
                label="时间段"
                width="150"
                :index="indexMethod">
            </el-table-column>
            <el-table-column

                v-for="col in docName"
                :prop="col.prop" :label="col.label" >
            </el-table-column>


        </el-table>
    </div>
</template>

<script>
    export default {
        name: "day-doc",
        data() {
            return{
                TableHeight:"455",

                docName: [
                    {prop: 'name1', label: '李瑶',status:'doc1'},
                    {prop: 'name2', label: '周阳',status:'doc2'},
                    {prop: 'name3', label: '皮皮',status:'doc3'},
                ],
                //doc 0 空闲 1 休息 2 有预约


                tableData:[{index:0,doc1:2,doc2:0,doc3:0,name1:"患者1"},
                           {index:1,doc1:2,doc2:0,doc3:0,name1:"患者1"},
                    {index:2,doc1:0,doc2:0,doc3:0},
                    {index:3,doc1:0,doc2:0,doc3:0},
                    {index:4,doc1:0,doc2:0,doc3:0},
                    {index:5,doc1:0,doc2:0,doc3:0},
                    {index:6,doc1:0,doc2:0,doc3:0},
                    {index:7,doc1:0,doc2:0,doc3:0},
                    {index:8,doc1:0,doc2:0,doc3:0},
                    {index:9,doc1:0,doc2:0,doc3:0},
                    {index:10,doc1:0,doc2:0,doc3:0},
                    {index:11,doc1:0,doc2:0,doc3:0},
                    {index:12,doc1:0,doc2:0,doc3:0},
                    {index:13,doc1:0,doc2:0,doc3:0},
                    {index:14,doc1:0,doc2:0,doc3:0},
                    {index:15,doc1:0,doc2:0,doc3:0},
                    {index:16,doc1:0,doc2:0,doc3:0},
                    {index:17,doc1:0,doc2:0,doc3:0},
                    {index:18,doc1:0,doc2:0,doc3:0},
                    {index:19,doc1:0,doc2:0,doc3:0},
                    {index:20,doc1:0,doc2:0,doc3:0},
                    {index:21,doc1:0,doc2:0,doc3:0},
                    {index:22,doc1:0,doc2:0,doc3:0},
                    {index:23,doc1:0,doc2:0,doc3:0},
                    {index:24,doc1:0,doc2:0,doc3:0},
                    {index:25,doc1:0,doc2:0,doc3:0},
                    {index:26,doc1:0,doc2:0,doc3:0},
                    {index:27,doc1:0,doc2:0,doc3:0},
                    {index:28,doc1:0,doc2:0,doc3:0},
                    {index:29,doc1:0,doc2:0,doc3:0},
                    {index:30,doc1:0,doc2:0,doc3:0},
                    {index:31,doc1:0,doc2:0,doc3:0},
                    {index:32,doc1:0,doc2:0,doc3:0},
                    {index:33,doc1:0,doc2:0,doc3:0},
                    {index:34,doc1:0,doc2:0,doc3:0},
                    {index:35,doc1:0,doc2:0,doc3:0},
                    {index:36,doc1:0,doc2:0,doc3:0},
                    {index:37,doc1:0,doc2:0,doc3:0},
                    {index:38,doc1:0,doc2:0,doc3:0},
                    {index:39,doc1:0,doc2:0,doc3:0},
                    {index:40,doc1:0,doc2:0,doc3:0},
                    {index:41,doc1:0,doc2:0,doc3:0},
                    {index:42,doc1:0,doc2:0,doc3:0},
                    {index:43,doc1:0,doc2:0,doc3:0},
                    {index:44,doc1:0,doc2:0,doc3:0},
                    {index:45,doc1:0,doc2:0,doc3:0},
                    {index:46,doc1:0,doc2:0,doc3:0},
                    {index:47,doc1:0,doc2:0,doc3:0},
                    {index:48,doc1:0,doc2:0,doc3:0},
                    {index:49,doc1:0,doc2:0,doc3:0},
                    {index:50,doc1:0,doc2:0,doc3:0},
                    {index:51,doc1:0,doc2:0,doc3:0},
                    {index:52,doc1:0,doc2:0,doc3:0},
                    {index:53,doc1:0,doc2:0,doc3:0},
                    {index:54,doc1:0,doc2:0,doc3:0},
                    {index:55,doc1:0,doc2:0,doc3:0}]
            }
        },
        methods:{
            style({row, column, rowIndex, columnIndex}){

                if(columnIndex==0)
                    return;
                else{
                    var status=this.tableData[rowIndex]["doc"+columnIndex]
                    switch(status){
                        case 0:
                            return '';
                        case 1:
                            console.log(rowIndex+","+columnIndex)
                            return 'success-row';

                    }
                }
            },
            click(row, column, cell, event){
                console.log(column)
                console.log(column.label+","+this.indexMethod(row.index)+","+this.tableData[row.index][column.property])
                var columnIndex
                for(var i=0;i<this.docName.length;i++){
                    if(this.docName[i].prop==column.property){
                        columnIndex=i;
                        break;
                    }

                }
                this.tableData[row.index][this.docName[i].status]=2;
                this.tableData[row.index][column.property]='患者1';

            },
            indexMethod(index) {

                return this.timestampToTime(1522972800000+index*15*60*1000);
            },
            timestampToTime(timestamp) {
                var date =new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var date1=new Date(timestamp+15*60*1000)
                var str1=date.getHours()+":"+((date.getMinutes()<10)?("0"+date.getMinutes()):date.getMinutes())
                var str2=date1.getHours()+":"+((date1.getMinutes()<10)?("0"+date1.getMinutes()):date1.getMinutes())
                return str1+"-"+str2
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex != 0) {
                    var name=this.tableData[row.index][column.property];
                    var rowspan=1;
                    if(row.index!=this.tableData.length-1 && this.tableData[rowIndex]["doc"+columnIndex]==2)
                        for(var i=row.index+1;i<this.tableData.length;i++){
                            if(this.tableData[i][column.property]===name)
                                rowspan++;
                            else
                                break;
                        }
                    if(rowspan>1 && this.tableData[rowIndex]["doc"+columnIndex]==2) {
                        console.log(rowIndex+","+columnIndex+",("+rowspan+",1)")
                        return [rowspan, 1];
                    } else {
                        //console.log(rowIndex+","+columnIndex+",(0,0)")
                        return [1, 1];//0,0
                    }

                }
            }
        }
    }
</script>

<style scoped>
.red{
    background: red;
}
.el-table .success-row {
    background: #f0f9eb;
}
</style>
