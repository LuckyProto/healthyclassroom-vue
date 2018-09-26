<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="ms-doc">
            <h3>欢迎进入预览页面</h3>
            <article>
                <el-row :gutter="20">
                    <el-col :span="6"><div class="grid-content bg-purple  hei"><p>今日新增</p><span>{{added}}</span></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple  hei"><p>今日完成</p><span>{{completed}}</span></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple  hei"><p>今日到访</p><span>{{visited}}</span></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple  hei"><p>今日费用</p><span>{{cost}}</span><p>实收费用</p><span>{{costed}}</span></div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18"><div class="grid-content bg-purple  hei global"><img src="../../../static/img/banner.jpg" alt=""></div></el-col>
                    <el-col :span="6"> <div class="grid-content bg-purple  hei">图片</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="18">
                        <div class="grid-content bg-purple">
                            <h3>今日就诊</h3>
                            <el-row :gutter="20">
                                <el-col :span="24"><div class="grid-content bg-purple">某某某</div></el-col>
                                <el-col :span="24"><div class="grid-content bg-purple">某某某</div></el-col>
                                <el-col :span="24"><div class="grid-content bg-purple">某某某</div></el-col>
                                <el-col :span="24"><div class="grid-content bg-purple">某某某</div></el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="6"><div class="grid-content bg-purple  hei">消息</div></el-col>
                </el-row>
            </article>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                added: 10,
                completed: 8,
                visited: 17,
                cost: 18000,
                costed: 159999,
                patientTreated: [
                    'john', 'dog', 'cat'
                ]
            }
        }
    }
</script>

<style scoped>
    .ms-doc{
        width:100%;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .ms-doc h3{
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }
    .ms-doc article{
        padding: 45px;
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    .el-row {
        margin-bottom: 20px;
    }

    .el-col:last-child{
        margin-bottom: 0;
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .hei{
        height: 100px;
    }
    .global img{
        width: 100%;
        height: 100%;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>
