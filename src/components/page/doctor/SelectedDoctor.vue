    <template>
        <div class="user-management-wraper">
            <div class="breakCrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                    <el-breadcrumb-item>首页医生</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="banner-list">
                <!--课件列表标题-->
                <div class="banner-list-title">
                    <p class="banner-list-title-p">
                        <span>医生列表</span>
                        <el-button type="primary" size="mini" class="add-banner-btn" @click='handle_link_course'>关联</el-button>
                    </p>
                </div>
                <!--课件列表内容-->
                <div class="user-list-table">
                    <el-table
                            ref="multipleTable"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                label="医生ID"
                                width="120">
                            <template slot-scope="scope">{{ scope.row.doctor_id }}</template>
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="医生姓名"
                                width="120">
                            <template slot-scope="scope">{{ scope.row.doctor_name }}</template>
                        </el-table-column>
                        <el-table-column
                                prop="hospital_name"
                                label="医院"
                                width="120">
                            <template slot-scope="scope">{{ scope.row.hospital_name }}</template>
                        </el-table-column>
                        <el-table-column
                                prop="specialty"
                                label="科室"
                                width="120">
                            <template slot-scope="scope">{{ scope.row.specialty }}</template>
                        </el-table-column>
                        <el-table-column
                                prop="rank"
                                label="级别"
                                width="120">
                            <template slot-scope="scope">{{ scope.row.rank }}</template>
                        </el-table-column>
                        <el-table-column
                                prop="doctor_image"
                                label="头像"
                                show-overflow-tooltip>
                            <template slot-scope="scope"><img :src="scope.row.doctor_image" alt="" style="width: 50px"></template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--课件列表导航条-->
                <!--<div class="block user-list-panv">-->
                    <!--<el-pagination-->
                            <!--@size-change="handlePageSizeChange"-->
                            <!--@current-change="handleCurrentPageChange"-->
                            <!--:page-sizes="[5, 10, 20, 30, 40]"-->
                            <!--:page-size="page_size"-->
                            <!--:current-page.sync="page_num"-->
                            <!--layout="total, sizes, prev, pager, next, jumper"-->
                            <!--:total="total">-->
                    <!--</el-pagination>-->
                <!--</div>-->
            </div>
        </div>
    </template>

<script>
    import Vue from 'vue';
    import {baseUrl} from "../../../utilis/common.js";
    import {getLocalStorage} from "../../../utilis/common.js";
    export default {
        name: "selected-doctor",
        data() {
            return {
                //请求接口
                class_group_id: '',
                url: baseUrl()+'/comm',
                class_group_doctor_query_methodName: "sp_hc_class_group_doctor_query",
                class_group_self_update_methodName: "sp_hc_class_group_self_update",

                //表格数据
                tableData: [],
                multipleSelection: [],
                total: 0
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handle_link_course(){
                if(this.multipleSelection.length == 1){
                    var self = this;
                    var doctor_id_param = {
                        "class_group_id": self.class_group_id,
                        "doctor_id": this.multipleSelection[0].doctor_id
                    }
                    this.$http.post(self.url, {"methodName": "sp_hc_class_group_self_update", "param": JSON.stringify(doctor_id_param)}).then((res) => {
                        if(res.data.code == 0){
                            Vue.http.headers.common['sign'] = res.body.sign;
                            alert('成功选中医生')
                            this.$router.push('/courses');
                        }
                    })
                }else{
                    alert('只能选择一个医生')
                }
            }
        },
        mounted(){
            var self = this;
            if(this.$route.query.class_group_id){
                this.class_group_id = this.$route.query.class_group_id;
                var class_group_doctor_param = {
                    "class_group_id": self.class_group_id
                }
                self.$http.post(self.url, {"methodName": "sp_hc_class_group_doctor_query", "param": JSON.stringify(class_group_doctor_param)}).then((res) => {
                    if(res.data.code == 0){
                        Vue.http.headers.common['sign'] = res.body.sign;
                        self.tableData = res.body.data;
                        self.total = res.body.data.length;
                    }
                })
            }

        }
    }
</script>

<style scoped>
        .user-management-wraper{
            width: 100%;
        }
        .user-search{
            width: 100%;
            height: 80px;
            padding: 15px 0 15px 15px;
            box-sizing: border-box;
            background: #fff;
            margin-bottom: 20px;
        }
        .user-search-title{
            margin-bottom: 10px;
        }
        .userId{
            margin-right: 8px;
        }
        .search-input{
            height: 24px;
            margin-right: 10px;
        }
        .clear-btn{
            margin-right: 10px;
        }
        .banner-list{
            padding-left: 15px;
            padding-right: 15px;
            padding-bottom: 40px;
            background: #fff;
            overflow: hidden;
        }
        .banner-list-title{
            padding: 15px 0 15px 0;
        }
        .banner-list-title-p{
            overflow: hidden;
        }
        .add-banner-btn{
            float: right;
        }
        .user-list-table{
            margin-bottom: 15px;
        }
        .user-list-panv{
            float: left;
            padding-bottom: 35px;
        }
    </style>