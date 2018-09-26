<template>
    <el-row>
        <el-col :span="3">
        <div class="sidebar">
            <button class="sidebar_toTopBtn" @click="toTop()" v-if="sidebar_ul_height >= 560">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-iconfonticonfonti2copy"></use>
                </svg>
            </button>
            <div class="sidebar_content" v-bind:style="{top: this.ty + 'px'}">
                <el-menu
                    ref="sidebar_nav"
                    default-active="2"
                    class="el-menu-vertical-demo sidebar_ul"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    :collapse="isCollapse"
                >
                    <el-menu-item :index="key" v-for="(value, key) in menus" v-on:click="handleToMedicinalManage(key)">
                        <svg class="icon el-icon-menu" aria-hidden="true">
                            <use :href="value.icon"></use>
                        </svg>
                        <span slot="title">{{key}}</span>
                    </el-menu-item>
                </el-menu>
            </div>
            <button class="sidebar_toBottomBtn" @click="toBottom()" v-if="sidebar_ul_height >= 560">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-iconfonticonfonti2"></use>
                </svg>
            </button>
        </div>
        </el-col>
    </el-row>
</template>

<script>
    import {getLocalStorage} from "../../utilis/common.js";
    import {fetchData} from "../../utilis/common.js";
    export default {
        data() {
            return {
                sidebar_ul_height: 0,
                isCollapse: true,
                ty: 0,
                documentH: 0,
                menus: {

                },
                count: 0,
                icons: [
                    {"cname" : "首页",      "ename": "#icon-shouye18"},
                    {"cname" :"预约管理",    "ename": "#icon-shouye17"},
                    {"cname" :"购药" ,      "ename"  :  "#icon-shouye1"},
                    {"cname" :"患者登记",    "ename":  "#icon-dengji"},
                    {"cname" :"分诊台" ,    "ename" :   "#icon-follow-up"},
                    {"cname" :"今日就诊" ,   "ename" : "#icon-shouye23"},
                    {"cname" :"收费管理" ,   "ename" : "#icon-money"},
                    {"cname" :"库存管理" ,   "ename" : "#icon-cailiaokufang"},
                    {"cname" :"诊所管理" ,   "ename" : "#icon-xiaozhensuo"},
                    {"cname" :"字典维护" ,   "ename" : "#icon-zidian"},
                    {"cname" :"统计报表" ,   "ename" : "#icon-tongji"},
                    {"cname" :"短信管理" ,    "ename" : "#icon-duanxin"},
                    {"cname" :"门诊护士站" ,  "ename" : "#icon-zhuanjia"},
                    {"cname" :"理疗师工作站",  "ename": "#icon-yuanshigongzuozhan"},
                    {"cname" :"医院档案" ,    "ename" : "#icon-dangan"},
                    {"cname" :"中医知识库",   "ename" : "#icon-weibiaoti9"}
                ]
            }
        },
        methods: {
            toTop () {
                if(this.ty <= (this.sidebar_ul_height - this.documentH)){
                    this.ty = (this.sidebar_ul_height - this.documentH - 56)
                }else{
                    this.ty -= 56;
                }
            },
            toBottom () {
                if(this.ty >= 0){
                    this.ty = 30
                }else{
                    this.ty += 56;
                }
            },
            handleToMedicinalManage (key){
                console.log(key)
                switch(true){
                    case key == "库存管理":
                        this.$router.push('/firmManage');
                        break;
                    case key == "字典维护":
                        this.$router.push('/basetable');
                        break;
                    case key == "用户管理":
                        this.$router.push('/UserPermission');
                        break;
                }
            }
        },
        mounted () {
            var self = this;
            var storage = getLocalStorage();
            var credential_id = storage.getItem("credential_id");
            var param= {
                "credential_id": credential_id
            };
            this.$http.post('api/comm', {"methodName":"sp_clinic_menu_query", "param":JSON.stringify(param)}).then((res) => {
                res.data.data = [
                    {"css":null,"url":"stock_url","name":"库存管理","sort":1,"menu_id":1,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"采购入库","sort":1,"menu_id":2,"parent_id":1},
                    {"css":"stock_css","url":"retreat_stock_url","name":"退药入库","sort":2,"menu_id":3,"parent_id":1},

                    {"css":null,"url":"stock_url","name":"收费管理","sort":1,"menu_id":4,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科","sort":1,"menu_id":5,"parent_id":4},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科","sort":2,"menu_id":6,"parent_id":4},

                    {"css":null,"url":"stock_url","name":"首页","sort":1,"menu_id":7,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":8,"parent_id":7},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":9,"parent_id":7},

                    {"css":null,"url":"stock_url","name":"购药","sort":1,"menu_id":10,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":11,"parent_id":10},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":12,"parent_id":10},

                    {"css":null,"url":"stock_url","name":"患者登记","sort":1,"menu_id":13,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":14,"parent_id":13},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":15,"parent_id":13},

                    {"css":null,"url":"stock_url","name":"分诊台","sort":1,"menu_id":16,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":17,"parent_id":13},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":18,"parent_id":13},

                    {"css":null,"url":"stock_url","name":"今日就诊","sort":1,"menu_id":19,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13},

                    {"css":null,"url":"stock_url","name":"诊所管理","sort":1,"menu_id":19,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13},

                    {"css":null,"url":"stock_url","name":"字典维护","sort":1,"menu_id":19,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13},

                    {"css":null,"url":"stock_url","name":"统计报表","sort":1,"menu_id":19,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13},

                    {"css":null,"url":"stock_url","name":"短信管理","sort":1,"menu_id":19,"parent_id":0},
                    {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13},
                    {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13},


                ]
                var menus = {}
                console.log(res.data.data)
                res.data.data.forEach(function (item, index, array) {
                    if(item.parent_id === 0){
                        menus[item.name] = {}
                        menus[item.name].submenus = []
                        res.data.data.forEach(function (_item, index, array) {
                            if(_item.parent_id == item.menu_id){
                                menus[item.name].submenus.push(_item.name)
                            }
                        })
                        self.icons.forEach(function (icon, index, array) {
                            if(icon.cname == item.name){
                                menus[item.name].icon = icon.ename
                            }
                        })
                    }
                })
                self.menus = menus;
            });
        },
        updated () {
            if(this.count == 1){
                return
            }else{
                var documentH = $(document).height()
                this.documentH = documentH;
                console.log(this.documentH)
                var sidebar_ul_height = this.$refs.sidebar_nav.$el.clientHeight
                this.sidebar_ul_height = sidebar_ul_height;
                if(this.sidebar_ul_height >= 560){
                    this.ty = 30;
                }else{
                    this.ty = 0;
                }
                this.count++;
            }
        }
    }
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
    .sidebar{
        position: relative;
        width: 64px;
        height: 700px;
        background: #2D3640;
    }
    .sidebar_toTopBtn{
        position: absolute;
        width: 64px;
        height: 30px;
        background: #545C64;
        z-index: 1;
    }
    .sidebar_toBottomBtn{
        position: fixed;
        bottom: 0px;
        width: 64px;
        height: 30px;
        background: #545C64;
        z-index: 1;
    }
    .sidebar .sidebar_content{
        position: absolute;
    }
    .sidebar .sidebar_content .sidebar_ul{
        z-index: 0;
    }
</style>
