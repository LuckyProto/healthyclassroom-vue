<template>
    <el-row>
        <el-col :span="3">
        <div class="sidebar" v-bind:style="{height: this.sidebarH + 'px'}">
            <button class="sidebar_toTopBtn" @click="toTop()" v-if="sidebar_ul_height > documentH - 60">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-iconfonticonfonti2copy"></use>
                </svg>
            </button>
            <div class="sidebar_content" v-bind:style="{top: this.ty + 'px'}">
                <el-menu
                    ref="sidebar_nav"
                    default-active="2"
                    class="el-menu-vertical-demo sidebar_ul"
                    background-color="#25446B"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    :collapse="isCollapse"
                >
                    <el-menu-item class="is-dark" :index="key" v-for="(value, key) in menus" v-on:click="toSubpage(key)">
                        <svg class="icon el-icon-menu" aria-hidden="true">
                            <use :href="value.icon"></use>
                        </svg>
                        <div slot="title" class="submenu">
                            <p class="menutitle">{{key}}</p>
                            <div :key="index" v-for="(submenu, index) in value.submenus">
                                <button class="subbtn" v-on:click="toSubpage(submenu.cname)">{{submenu.cname}}</button>
                            </div>
                        </div>
                    </el-menu-item>
                </el-menu>
            </div>
            <button class="sidebar_toBottomBtn" @click="toBottom()" v-if="sidebar_ul_height > documentH - 60">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-iconfonticonfonti2"></use>
                </svg>
            </button>
        </div>
        </el-col>
    </el-row>
</template>

<script>
    import {baseUrl} from "../../utilis/common.js";
    import {getLocalStorage} from "../../utilis/common.js";
    import {fetchData} from "../../utilis/common.js";
    export default {
        data() {
            return {
                sidebar_ul_height: 0,
                isCollapse: true,
                ty: 0,
                documentH: $(document).height(),
                sidebarH:0,
                menus: {

                },
                count: 0,
                lis: 0,
                clickCount: 0,
                wrapCount: 0,
                icons: [
                    {"cname" : "首页","ename":"#icon-shouye18"},
                    {"cname" :"预约管理","ename":"#icon-shouye17"},
                    {"cname" :"购药","ename":"#icon-shouye1"},
                    {"cname" :"患者登记","ename":"#icon-dengji"},
                    {"cname" :"分诊台","ename":"#icon-follow-up"},
                    {"cname" :"今日就诊","ename":"#icon-shouye23"},
                    {"cname" :"收费管理","ename":"#icon-money"},
                    {"cname" :"库存管理","ename":"#icon-cailiaokufang"},
                    {"cname" :"诊所管理","ename":"#icon-xiaozhensuo"},
                    {"cname" :"字典维护","ename":"#icon-zidian"},
                    {"cname" :"统计报表","ename":"#icon-tongji"},
                    {"cname" :"短信管理","ename":"#icon-duanxin"},
                    {"cname" :"门诊护士站","ename":"#icon-zhuanjia"},
                    {"cname" :"理疗师工作站","ename": "#icon-yuanshigongzuozhan"},
                    {"cname" :"医院档案","ename":"#icon-dangan"},
                    {"cname" :"中医知识库","ename":"#icon-weibiaoti9"},
                    {"cname" :"用户管理","ename":"#icon-shouye48"},
                    {"cname" :"医院配置","ename":"#icon-yuanshigongzuozhan"},
                    {"cname" :"采购管理","ename":"#icon-pharmacy"},
                    {"cname" :"药房管理","ename":"#icon-shouye1"},
                    {"cname" :"客户管理","ename":"#icon-web-icon-"}
                ]
            }
        },
        methods: {
            toTop () {
                if(this.clickCount > (this.lis - this.wrapCount)){
                    return;
                }else{
                    this.ty -= 56;
                    this.clickCount++;
                }
            },
            toBottom () {
                this.clickCount--;
                if(this.clickCount <= 0){
                    this.clickCount = 0;
                }
                if(this.ty >= 0){
                    this.ty = 28;
                }else{
                    this.ty += 56;
                }
            },
            toSubpage(cname){
                switch(true){
                    case cname == "药品管理":
                        this.$router.push('/dic/basetable');
                        break;
                    case cname == "厂商管理":
                        this.$router.push('/dic/firmManage');
                        break;
                    case cname == "采购入库":
                        this.$router.push('/rkgl/purchase');
                        break;
                    case cname == "采购申请":
                        this.$router.push('/rkgl/PurchaseOrder');
                        break;
                    case cname == "采购审核":
                        this.$router.push('/rkgl/PurchaseAudit');
                        break;
                    case cname == "收货管理":
                        this.$router.push('/rkgl/ReceivingOrder');
                        break;
                    case cname == "收货查询":
                        this.$router.push('/rkgl/ReceivingNote');
                        break;
                    case cname == "用户管理":
                        this.$router.push('/Con/UserPermission');
                        break;
                    case cname == "医院配置":
                        this.$router.push('/Hos/HospitalStorage');
                        break;
                    case cname == "科室售药":
                        this.$router.push('/Hos/DepSalesDrug');
                        break;
                    case cname == "药房提货":
                        this.$router.push('/Hos/LibraryStoreDrug');
                        break;
                    case cname == "库存查询":
                        this.$router.push('/rkgl/libraryReport');
                        break;
                    case cname == "排班管理":
                        this.$router.push('/BookingManager/Workforce');
                        break;
                    case cname == "预约管理":
                        this.$router.push('/BookingManager/BookingDoc');
                        break;
                    case cname == "基本信息":
                        this.$router.push('/CustomerManagement/PatientBaseinfo');
                        break;
                    case cname == "诊疗项目":
                        this.$router.push('/dic/TreatmeProject');
                        break;
                    case cname == "组合项目":
                        this.$router.push('/dic/ItemGroup');
                        break;
                    case cname == "患者登记":
                        this.$router.push('/PatientRegistration/PatientRegist');
                        break;
                    case cname == "分诊台":
                        this.$router.push('/PatientRegistration/PatientTriage');
                        break;
                    case cname == "今日就诊":
                        this.$router.push('/DoctorDesk/PatientsVisits');
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
            this.$http.post(baseUrl()+'/comm', {"methodName":"sp_clinic_menu_query", "param":JSON.stringify(param)}).then((res) => {
               //  res.data.data = [
               //     {"css":null,"url":"stock_url","name":"库存管理","sort":1,"menu_id":1,"parent_id":0},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"库存管理","sort":1,"menu_id":2,"parent_id":1},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"采购入库","sort":1,"menu_id":2,"parent_id":1},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"退药入库","sort":2,"menu_id":3,"parent_id":1},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"退药出库","sort":2,"menu_id":4,"parent_id":1},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"抓药出库","sort":2,"menu_id":5,"parent_id":1},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"盘点管理","sort":2,"menu_id":5,"parent_id":1},
               //
               //     {"css":null,"url":"stock_url","name":"收费管理","sort":1,"menu_id":4,"parent_id":0},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"儿科","sort":1,"menu_id":5,"parent_id":4},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"妇科","sort":2,"menu_id":6,"parent_id":4},
               //
               //     {"css":null,"url":"stock_url","name":"首页","sort":1,"menu_id":7,"parent_id":0},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":8,"parent_id":7},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":9,"parent_id":7},
               //
               //     {"css":null,"url":"stock_url","name":"购药","sort":1,"menu_id":10,"parent_id":0},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":11,"parent_id":10},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":12,"parent_id":10},
               //
               //     {"css":null,"url":"stock_url","name":"患者登记","sort":1,"menu_id":13,"parent_id":0},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":14,"parent_id":13},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":15,"parent_id":13},
               //
               //     {"css":null,"url":"stock_url","name":"分诊台","sort":1,"menu_id":16,"parent_id":0},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":17,"parent_id":16},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":18,"parent_id":16},
               //
               //     {"css":null,"url":"stock_url","name":"今日就诊","sort":1,"menu_id":19,"parent_id":0},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13},
               //
               //      {"css":null,"url":"stock_url","name":"诊所管理","sort":1,"menu_id":19,"parent_id":0},
               //      {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":19},
               //      {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":19},
               //
               //      {"css":null,"url":"stock_url","name":"字典维护","sort":1,"menu_id":19,"parent_id":0},
               //      {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13},
               //      {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13}, {"css":null,"url":"stock_url","name":"统计报表","sort":1,"menu_id":19,"parent_id":0}, {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13}, {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13},
               //
               //     {"css":null,"url":"stock_url","name":"短信管理","sort":1,"menu_id":19,"parent_id":0},
               //     {"css":"stock_css","url":"purchase_stock_url","name":"儿科医生","sort":1,"menu_id":20,"parent_id":13},
               //     {"css":"stock_css","url":"retreat_stock_url","name":"妇科医生","sort":2,"menu_id":21,"parent_id":13},
               // ]
                var menus = {}
                var lis = 0;
                res.data.data.forEach(function (item, index, array) {
                    if(item.parent_id === 0){
                        lis++;
                        menus[item.name] = {}
                        menus[item.name].submenus = []
                        res.data.data.forEach(function (_item, index, array) {
                            if(_item.parent_id == item.menu_id){
                                menus[item.name].submenus.push({"cname":_item.name, "url": _item.url})
                            }
                        })
                        self.icons.forEach(function (icon, index, array) {
                            if(icon.cname == item.name){
                                menus[item.name].icon = icon.ename
                                menus[item.name].url = item.url
                            }
                        })
                    }
                })
                self.menus = menus;
                self.lis = lis;
            });
            window.onresize = () => {
                return (() => {
                    self.documentH = $(document).height()
                })()
            }
        },
        // mounted () {
        //     const self = this;
        //     window.onresize = () => {
        //         return (() => {
        //             self.documentH = $(document).height()
        //         })()
        //     }
        // },
        watch: {
            documentH: function () {
                var wrapCount = parseInt((this.documentH - 60) / 56);
                this.wrapCount = wrapCount;
                this.sidebarH = this.documentH - 60;
                if(this.sidebar_ul_height > this.documentH - 60){
                    this.ty = 28;
                }else{
                    this.ty = 0;
                }
            }
        },
        updated () {
            if(this.count == 1){
                return
            }else{
                var documentH = $(document).height();
                var wrapCount = parseInt((documentH - 60) / 56);
                this.wrapCount = wrapCount;
                this.documentH = documentH;
                this.sidebarH = documentH - 60;
                var sidebar_ul_height = this.$refs.sidebar_nav.$el.clientHeight;
                this.sidebar_ul_height = sidebar_ul_height;
                if(sidebar_ul_height > documentH - 60){
                    this.ty = 28;
                }else{
                    this.ty = 0;
                }
                this.count++;
            }
        }
    }
</script>

<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
    .sidebar{
        position: relative;
        width: 64px;
        overflow: hidden;
        background: #25446B;
    }
    .sidebar_toTopBtn{
        position: absolute;
        width: 64px;
        height: 28px;
        background: #25446B;
        border: 1px solid #25446B;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        z-index: 1;
    }
    .sidebar_toBottomBtn{
        position: absolute;
        bottom: 0px;
        width: 64px;
        height: 28px;
        background: #25446B;
        border: 1px solid #25446B;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        z-index: 1;
    }
    .sidebar .sidebar_content{
        position: absolute;
    }

    .sidebar .sidebar_content .sidebar_ul{
        z-index: 0;
    }

    .submenu{
        overflow: hidden;
        width: 180px;
        padding: 10px 0px 10px 10px;
        background-color: #274569;
    }

    .submenu .menutitle{
        font-size: 16px;
    }

    .submenu .subbtn{
        float: left;
        width: 80px;
        height: 24px;
        background: #062b58;
        margin-right: 10px;
        margin-top: 10px;
        border: 1px solid #25446B;
        color: #fff;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
    }
    .submenu .subbtn:nth-child(2n+2){
        margin-right: 0;
    }
    .is-dark{
        background: #25446B !important;
    }
</style>
