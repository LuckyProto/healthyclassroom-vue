import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    // component: resolve => require(['../components/page/Readme.vue'], resolve)
                    // component: resolve => require(['../components/page/view.vue'], resolve)
                },
                {
                    path: '/dic/firmManage',//厂商管理
                    component: resolve => require(['../components/page/Dictionary/FirmManagement.vue'], resolve)
                },
                {
                    path: '/dic/basetable',//药品材料
                    component: resolve => require(['../components/page/Dictionary/DrugMaterials.vue'], resolve)
                    //component: resolve => require(['../components/page/Config/UserPermission.vue'], resolve)
                },
                {
                    path: '/dic/TreatmeProject',//诊疗项目
                    component: resolve => require(['../components/page/Dictionary/TreatmentProject.vue'], resolve)
                },
                {
                    path: '/dic/ItemGroup',//组合项目
                    component: resolve => require(['../components/page/Dictionary/ItemGroup.vue'], resolve)
                },
                {
                    path: '/Hos/HospitalStorage',//医院用药
                    component: resolve => require(['../components/page/HospitalStorage/hospitalStorage.vue'], resolve)
                },
                {
                    path: '/Hos/DepSalesDrug',//科室售药
                    component: resolve => require(['../components/page/HospitalStorage/DepSalesDrug.vue'], resolve)
                },
                {
                    path: '/Hos/LibraryStoreDrug',//药房提药
                    component: resolve => require(['../components/page/HospitalStorage/LibraryStoreDrug.vue'], resolve)
                },
                {
                    path: '/Con/UserPermission',//用户管理
                    component: resolve => require(['../components/page/Config/UserPermission.vue'], resolve)
                },
                {
                    path: '/rkgl/purchase',  //采购入库
                    component: resolve => require(['../components/page/rkgl/PurchaseBatch.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/rkgl/PurchaseOrder',  //购药管理-申请采购
                    component: resolve => require(['../components/page/rkgl/PurchaseOrder.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/rkgl/PurchaseAudit',  //购药管理-采购审核
                    component: resolve => require(['../components/page/rkgl/PurchaseAudit.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/rkgl/ReceivingOrder',  //购药管理-确认收货
                    component: resolve => require(['../components/page/rkgl/ReceivingOrder.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/rkgl/ReceivingNote',  //购药管理-查询收货单
                    component: resolve => require(['../components/page/rkgl/ReceivingNote.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/rkgl/libraryReport',  //库存管理-库存查询
                    component: resolve => require(['../components/page/rkgl/libraryReport.vue'], resolve)     // vue-datasource组件
                },
                /*{
                    path: '/rkgl/demo',  //库存管理-库存查询
                    component: resolve => require(['../components/page/Dictionary/WeekDoc.vue'], resolve)     // vue-datasource组件
                },*/
                {
                    path: '/rkgl/demo',  //库存管理-库存查询
                    component: resolve => require(['../components/page/Dictionary/DayDoc.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/BookingManager/Workforce',  //预约管理-排班管理
                    component: resolve => require(['../components/page/BookingManager/Workforce.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/BookingManager/BookingDoc',  //预约管理-患者预约
                    component: resolve => require(['../components/page/BookingManager/BookingDoc.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/CustomerManagement/PatientBaseinfo',  //客户管理-患者基本信息维护
                    component: resolve => require(['../components/page/CustomerManagement/PatientBaseinfo.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/PatientRegistration/PatientRegist',  //患者登记-患者登记
                    component: resolve => require(['../components/page/PatientRegistration/PatientRegist.vue'], resolve)
                },
                {
                    path: '/PatientRegistration/PatientTriage',  //分诊台-分诊列表
                    component: resolve => require(['../components/page/PatientRegistration/PatientTriage.vue'], resolve)
                },
                {
                    path: '/DoctorDesk/PatientsVisits',  //今日就诊
                    component: resolve => require(['../components/page/DoctorDesk/PatientsVisits.vue'], resolve)
                },
                {
                    path: '/userManagement',  //今日就诊
                    component: resolve => require(['../components/page/userManagement/userManagement.vue'], resolve)
                },
                {
                    path: '/bannerManagement',  //今日就诊
                    component: resolve => require(['../components/page/bannerManagement/bannerManagement.vue'], resolve)
                },
                {
                    path: '/addBannerManagement',  //今日就诊
                    component: resolve => require(['../components/page/bannerManagement/addBannerManagement.vue'], resolve)
                },
                {
                    path: '/courseware',  //今日就诊
                    component: resolve => require(['../components/page/courseware/courseware.vue'], resolve)
                },
                {
                    path: '/addcourseware',  //今日就诊
                    component: resolve => require(['../components/page/courseware/addcourseware.vue'], resolve)
                },
                {
                    path: '/UpdateCourseware',  //今日就诊
                    component: resolve => require(['../components/page/courseware/UpdateCourseware.vue'], resolve)
                },
                {
                    path: '/course',  //今日就诊
                    component: resolve => require(['../components/page/course/Course.vue'], resolve)
                },
                {
                    path: '/addcourse',  //今日就诊
                    component: resolve => require(['../components/page/course/AddCourse.vue'], resolve)
                },
                {
                    path: '/UpdateCourse',  //今日就诊
                    component: resolve => require(['../components/page/course/UpdateCourse.vue'], resolve)
                },
                {
                    path: '/courses',  //今日就诊
                    component: resolve => require(['../components/page/courses/Courses.vue'], resolve)
                },
                {
                    path: '/selecteddoctor',  //今日就诊
                    component: resolve => require(['../components/page/doctor/SelectedDoctor.vue'], resolve)
                },
                {
                    path: '/addcourses',  //今日就诊
                    component: resolve => require(['../components/page/courses/AddCourses.vue'], resolve)
                },
                {
                    path: '/doctors',  //今日就诊
                    component: resolve => require(['../components/page/doctors/Doctors.vue'], resolve)
                },
                {
                    path: '/doctor',  //今日就诊
                    component: resolve => require(['../components/page/doctor/doctor.vue'], resolve)
                },
                {
                    path: '/order',  //今日就诊
                    component: resolve => require(['../components/page/order/Order.vue'], resolve)
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
