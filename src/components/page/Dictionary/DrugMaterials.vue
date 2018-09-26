<template>
    <div class="Drug content_inner">
        <div v-show="DrugShow" >
            <div class="classify"><h4 class="title">药品/材料</h4></div>
            <el-tabs :tab-position="tabPosition" v-model="activeName"  @tab-click="TabChange">
                <el-tab-pane label="西 药" name="1" value="1" class="tab_content">
                    <div id="tools">
                        <el-button type="primary" class="add" @click="AddForm1">新增</el-button>
                        <div style="float:right">
                            <!--<el-checkbox class="piece" v-model="dismantle" @change="GetData">拆零药品</el-checkbox>-->
                            <!--<el-checkbox class="zero" v-model="ZeroStock" @change="GetData">零库存药品</el-checkbox>-->
                            <span class="ml20">状态：</span>
                            <el-select  v-model="states"  size="small"  class="state" @change="GetData">
                                <el-option
                                    key="2"
                                    label="全部"
                                    value="2">
                                </el-option>
                                <el-option
                                    key="1"
                                    label="启用"
                                    value="1">
                                </el-option>
                                <el-option
                                    key="0"
                                    label="停用"
                                    value="0">
                                </el-option>
                            </el-select>
                            <el-input class="search ml20"  placeholder="编号/名称" v-model="searchInput" size="small" @keyup.native="Search">
                                <el-button slot="append" icon="el-icon-search" size="small" @click="SearchForm"></el-button>
                            </el-input>
                        </div>
                    </div>
                    <el-table :data="tableData"  style="width: 100%;"  :height="TableHeight"  class="table"  v-loading="GridLoading" :row-class-name="tableRowClassName">
                        <el-table-column label="名称" min-width="300"  prop="name" sortable>
                        </el-table-column>
                        <el-table-column label="商品名称" min-width="200" prop="commodity_name" sortable>
                        </el-table-column>
                        <el-table-column label="规格" min-width="140" prop="drug_spec_value" sortable>
                        </el-table-column>
                        <el-table-column label="厂家" min-width="300" prop="org_name" sortable>
                        </el-table-column>
                        <!--<el-table-column label="拆零价" width="80" prop="open_price">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="拆零单位" width="80" prop="drug_preparation_unit_name">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="建议零售价" width="90" prop="retail_price">-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="零售单位" width="80" prop="stock_unit_name">-->
                        <!--</el-table-column>-->
                        <el-table-column label="操作" min-width="150">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="info" plain @click="usable(scope.$index, scope.row)" v-if="scope.row.usable_flag===0" v-model="usable_flag">启用</el-button>
                                <el-button size="mini" type="primary" plain @click="usable(scope.$index, scope.row)" v-else-if="scope.row.usable_flag===1" v-model="usable_flag">停用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination" >
                        <el-pagination style="height:15px;margin-top: -12px"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="page_size"
                            :layout="pagination"
                            :total="total_num">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="中 药" name="2" value="2" class="tab_content">
                    <el-button type="primary" class="add" @click="AddForm1">新增</el-button>
                    <div style="float:right">
                        <el-checkbox class="zero"  @change="GetData">零库存中药</el-checkbox>
                        <span class="ml20">状态：</span>
                        <el-select  v-model="states"  size="small"  class="state">
                            <el-option
                                key="0"
                                label="全部"
                                value="0">
                            </el-option>
                            <el-option
                                key="1"
                                label="启用"
                                value="1">
                            </el-option>
                            <el-option
                                key="2"
                                label="停用"
                                value="2">
                            </el-option>
                        </el-select>
                        <el-input class="search ml20" placeholder="编号/名称" v-model="searchInput" size="small">
                            <el-button slot="append" icon="el-icon-search" size="small"></el-button>
                        </el-input>
                    </div>
                    <el-table   style="width: 100%;" :height="TableHeight" class="table"  v-loading="GridLoading">
                        <el-table-column label="名称" width="280">
                        </el-table-column>
                        <el-table-column label="规格" width="180">
                        </el-table-column>
                        <el-table-column label="类型" width="180">
                        </el-table-column>
                        <el-table-column label="零售单位" width="180">
                        </el-table-column>
                        <el-table-column label="操作" min-width="200">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="primary" plain @click="usable(scope.$index, scope.row)" v-if="scope.row.usable_flag===0" v-model="usable_flag">启用</el-button>
                                <el-button size="mini" type="primary" plain @click="usable(scope.$index, scope.row)" v-else-if="scope.row.usable_flag===1" v-model="usable_flag">停用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination style="height:15px;margin-top: -12px"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="10"
                            :layout="pagination"
                            :total="total_num">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="材 料" name="3" value="3" class="tab_content">
                    <el-button type="primary" class="add" @click="AddForm1">新增</el-button>
                    <div style="float:right">
                        <!--<el-checkbox class="zero"  @change="GetData">零库存材料</el-checkbox>-->
                        <span class="ml20">状态：</span>
                        <el-select  v-model="states"  size="small"  class="state" @change="GetData">
                            <el-option
                                key="2"
                                label="全部"
                                value="2">
                            </el-option>
                            <el-option
                                key="1"
                                label="启用"
                                value="1">
                            </el-option>
                            <el-option
                                key="0"
                                label="停用"
                                value="0">
                            </el-option>
                        </el-select>
                        <el-input class="search ml20"  placeholder="编号/名称" v-model="searchInput" size="small" @keyup.native="Search">
                            <el-button slot="append" icon="el-icon-search" size="small" @click="SearchForm"></el-button>
                        </el-input>
                    </div>
                    <el-table :data="tableData"  style="width: 100%;" :height="TableHeight" class="table"  v-loading="GridLoading" :row-class-name="tableRowClassName">
                        <el-table-column label="材料编码" width="280" prop="material_code">
                        </el-table-column>
                        <el-table-column label="材料名称" width="180" prop="material_name">
                        </el-table-column>
                        <el-table-column label="材料规格" width="180" prop="specifications">
                        </el-table-column>
                        <el-table-column label="零售单价" width="180" prop="price">
                        </el-table-column>
                        <el-table-column label="库存单位" width="180" prop="unit_desc">
                        </el-table-column>
                        <el-table-column label="操作" min-width="200" >
                            <template slot-scope="scope">
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="info" plain @click="usableMaterail(scope.$index, scope.row)" v-if="scope.row.is_usable===0" v-model="is_usable">启用</el-button>
                                <el-button size="mini" type="primary" plain @click="usableMaterail(scope.$index, scope.row)" v-else-if="scope.row.is_usable===1" v-model="is_usable">停用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination style="height:15px;margin-top: -12px"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="page_size"
                            :layout="pagination"
                            :total="total_num"
                            :current-page="page_num">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-form v-show="Form1Show" class="From" v-loading="GridLoading">
            <div class="classify"><h4 class="title" v-model="From1Title">{{From1Title}}</h4></div>
            <el-row :gutter="1" class="baseinfo">
                <el-col :span="11">
                    <span class="base-label"><span class="required">* </span>药品名称：</span>
                    <el-input   size="small" clearable style="width:340px;" v-model="form1.name" id="name" @focus="InputCss(form1,'name')">
                    </el-input>
                </el-col>
                <el-col :span="8"  :offset="1">
                    <span class="base-label"><span class="required">* </span>商品名称：</span>
                    <el-input   size="small" clearable style="width:240px;" v-model="form1.commodity_name" id="commodity_name" @focus="InputCss(form1,'commodity_name')">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="1" class="baseinfo">
                <el-col :span="11">
                    <span class="base-label">化学名称：</span>
                    <el-input   size="small" clearable style="width:340px;" v-model="form1.chemistry_name" id="chemistry_name" @focus="InputCss(form1,'chemistry_name')">
                    </el-input>
                </el-col>
                <el-col :span="8" :offset="1">
                    <span class="base-label">条形码：</span>
                    <el-input   size="small" clearable style="width:240px;" v-model="form1.bar_code">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="2" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label"><span class="required">* </span>厂家：</span>
                    <el-select filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="SelectLoading" id="org_id" v-model="form1.org_id" @focus="InputCss(form1,'org_id')"  size="small" style="width:340px;" class="ProductType">
                        <el-option
                            v-for="item in OrgCatgory"
                            :key="item.org_id"
                            :label="item.name"
                            :value="item.org_id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8" :offset="2">
                    <span class="base-label">国药准字：</span>
                    <el-input   size="small" clearable style="width:240px;" v-model="form1.nmpn">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="2" class="baseinfo">
                <el-col :span="9">
                    <span class="base-label"><span class="required">* </span>规格：</span>
                    <el-input   size="small" clearable style="width:340px;"  v-model="form1.drug_spec_value" id="drug_spec_value" @focus="InputCss(form1,'drug_spec_value')">{{this.form1.drug_spec_value}}
                    </el-input>
                </el-col>
                <el-col :span="7">
                    <span class="base-label"><span class="required">* </span>剂型：</span>
                    <el-select  v-model="form1.drug_dosage_id" filterable size="small" style="width:189px;" class="ProductType" id="drug_dosage_id" @focus="InputCss(form1,'drug_dosage_id')">
                        <el-option
                            v-for="item in DrugDosage"
                            :key="item.drug_dosage_id"
                            :label="item.name"
                            :value="item.drug_dosage_id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <span class="base-label"><span class="required">* </span>药品类型：</span>
                    <el-select  v-model="form1.drug_product_category_id"  size="small" style="width:189px;" class="ProductType" id="drug_product_category_id" @focus="InputCss(form1,'drug_product_category_id')">
                        <el-option
                            v-for="item in ProductCategory"
                            :key="item.drug_product_category_id"
                            :label="item.name"
                            :value="item.drug_product_category_id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="2" class="baseinfo">
                <el-col :span="15">
                    <span class="base-label">检索信息：</span>
                    <el-input   size="small" clearable style="width:665px;"  v-model="form1.search" id="search" >
                    </el-input>
                </el-col>
                <el-button type="primary" plain="" size="mini" @click="GetSearch">生成检索</el-button>
            </el-row>
            <div>
                <div class="classify"><h4 class="title">处方信息</h4></div>
                <!--<el-row :gutter="2" class="baseinfo">-->
                    <!--<el-col :span="20">-->
                        <!--<span class="base-label" style="vertical-align: top">药品信息：</span>-->
                        <!--<el-input  type="textarea" clearable  rows=2 size="small" style="width:80%;" resize="none">-->
                        <!--</el-input>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <el-row :gutter="20" class="baseinfo">
                    <el-col :span="20">
                        <span class="base-label">编辑规格：</span>
                        <el-input v-bind:disabled="speDisabled"  size="small"  style="width:100px;"  placeholder="剂量" v-model="form1.dose_num" id="dose_num" @focus="InputCss(form1,'dose_num')" >
                        </el-input>
                        <el-select v-bind:disabled="speDisabled" filterable placeholder="剂量单位" id="drug_dose_unit_id" v-model="form1.drug_dose_unit_id"  size="small" style="width:120px;" class="ProductType" @focus="InputCss(form1,'drug_dose_unit_id')" >
                            <el-option
                                v-for="item in DrugDoseUnit"
                                :key="item.drug_dose_unit_id"
                                :label="item.name"
                                :value="item.drug_dose_unit_id">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.en_sign }}</span>
                            </el-option>
                        </el-select>
                        <span style="font-size: 18px;vertical-align: bottom;"> * </span>
                        <el-input  v-bind:disabled="speDisabled" size="small"  style="width:100px;" placeholder="制剂数量" v-model="form1.preparation_num" id="preparation_num" @focus="InputCss(form1,'preparation_num')" >
                        </el-input>
                        <el-select v-bind:disabled="speDisabled" filterable placeholder="制剂单位" v-model="form1.drug_preparation_unit_id"  size="small" style="width:120px;" class="ProductType"  id="drug_preparation_unit_id" @focus="InputCss(form1,'drug_preparation_unit_id')" >
                            <el-option
                                v-for="item in DrugPreparationUnit"
                                :key="item.drug_preparation_unit_id"
                                :label="item.name"
                                :value="item.drug_preparation_unit_id">
                            </el-option>
                        </el-select>
                        <span style="font-size: 20px;vertical-align: middle;"> / </span>
                        <el-select v-bind:disabled="speDisabled" filterable placeholder="库存单位"  v-model="form1.stock_unit_id" size="small" style="width:120px;" id="stock_unit_id"  @focus="InputCss(form1,'stock_unit_id')" >
                            <el-option
                                v-for="item in DrugStockUnit"
                                :key="item.stock_unit_id"
                                :label="item.name"
                                :value="item.stock_unit_id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="2" class="baseinfo">
                    <!--<el-col :span="8">-->
                        <!--<span class="base-label"><span class="required">* </span>是否拆零：</span>-->
                        <!--<el-radio-group v-model="form1.is_dismantle" @change="IsDismantle">-->
                            <!--<el-radio :label="0">否</el-radio>-->
                            <!--<el-radio :label="1">是</el-radio>-->
                        <!--</el-radio-group>-->
                    <!--</el-col>-->
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>是否抗菌药：</span>
                        <el-radio-group v-model="form1.is_antibiosis">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>是否处方药：</span>
                        <el-radio-group v-model="form1.is_prescription">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="8">
                        <span class="base-label">图片信息：</span>
                        <el-input   size="small" clearable style="width:189px;" v-model="form1.pic_info">
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="2" class="baseinfo">
                    <!--<el-col :span="8">-->
                        <!--<span class="base-label"><span class="required">* </span>建议零售价：</span>-->
                        <!--<el-input   size="small" clearable style="width:189px;" v-model="form1.retail_price" id="retail_price" @focus="InputCss('retail_price')">-->
                        <!--</el-input>-->
                        <!--<span v-show="RetailPriceUnit" v-model="retail_price_unit">{{retail_price_unit}}</span>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<span class="base-label">最高限价：</span>-->
                        <!--<el-input   size="small" clearable style="width:189px;" v-model="form1.peak_price">-->
                        <!--</el-input>-->
                        <!--<span  v-show="RetailPriceUnit" v-model="retail_price_unit">{{retail_price_unit}}</span>-->
                    <!--</el-col>-->

                </el-row>
                <!--<el-row :gutter="2" class="baseinfo" v-show="DismantlePrice">-->
                    <!--<el-col :span="8">-->
                        <!--<span class="base-label"><span class="required">* </span>拆零价：</span>-->
                        <!--<el-input   size="small" clearable style="width:189px;" v-model="form1.open_price" id="open_price" @focus="InputCss('open_price')">-->
                        <!--</el-input>-->
                        <!--<span v-show="OpenPriceUnit" v-model="open_price_unit">{{open_price_unit}}</span>-->
                    <!--</el-col>-->
                <!--</el-row>-->
            </div>
                <div class="classify" style="margin-top: -10px" ><h4 class="title">使用信息</h4></div>
                <el-row :gutter="2" class="baseinfo">
                    <el-col :span="20">
                        <span class="base-label" style="vertical-align: top">用法用量：</span>
                        <el-input type="textarea" size="small" rows=2 clearable style="width:80%;" v-model="form1.use_usage_message">
                        </el-input>
                    </el-col>
                </el-row>
            <div style="float:right;margin:0 10px 5px 0;overflow: hidden;">
                <el-button plain class="add" @click="CancelForm1">取消</el-button>
                <el-button type="primary"  class="add" @click="SaveDrugProduct">保存</el-button>
            </div>
        </el-form>
        <el-form v-show="Form2Show" class="From" v-loading="GridLoading">
            <div class="classify"><h4 class="title" v-model="From1Title">{{From1Title}}</h4></div>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label"><span class="required">* </span>药品名称：</span>
                    <el-input   size="small" clearable style="width:340px;" >
                    </el-input>
                </el-col>
                <el-col :span="10">
                    <span class="base-label">经典药名：</span>
                    <el-input   size="small" clearable style="width:340px;" >
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label">厂商：</span>
                    <el-input   size="small" clearable style="width:340px;" >
                    </el-input>
                </el-col>
                <el-col :span="10">
                    <span class="base-label">产地：</span>
                    <el-input   size="small" clearable style="width:340px;" >
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>规格：</span>
                    <el-input   size="small" clearable style="width:189px;" >
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <span class="base-label">拼音：</span>
                    <el-input   size="small" clearable style="width:189px;" >
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <span class="base-label"><span class="required">* </span>药品类型：</span>
                    <el-select  v-model="form1.drug_cha_category_id"  size="small" style="width:189px;" class="ProductType">
                        <el-option
                            v-for="item in ChnCategory"
                            :key="item.drug_cha_category_id"
                            :label="item.name"
                            :value="item.drug_cha_category_id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <div>
                <div class="classify"><h4 class="title">处方信息</h4></div>
                <el-row :gutter="20" class="baseinfo">
                    <el-col :span="11">
                        <span class="base-label" style="vertical-align: top">药品信息：</span>
                        <el-input  type="textarea" clearable rows=4 size="small" style="width:80%;" resize="none">
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="baseinfo">
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>零售单位：</span>
                        <el-select filterable  v-model="form2.drug_dose_unit_id"  size="small" style="width:189px;" class="ProductType">
                            <el-option
                                v-for="item in DrugStockUnit"
                                :key="item.stock_unit_id"
                                :label="item.name"
                                :value="item.stock_unit_id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>建议零售价：</span>
                        <el-input   size="small" clearable style="width:189px;" >
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <span class="base-label">最高限价：</span>
                        <el-input   size="small" clearable style="width:189px;" >
                        </el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="baseinfo">
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>库存单位：</span>
                        <el-select filterable  v-model="form2.drug_dose_unit_id"  size="small" style="width:189px;" class="ProductType">
                            <el-option
                                v-for="item in DrugStockUnit"
                                :key="item.stock_unit_id"
                                :label="item.name"
                                :value="item.stock_unit_id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>库存转化率：</span>
                        <el-input   size="small" clearable style="width:189px;" >
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <span class="base-label">图片信息：</span>
                        <el-input   size="small" clearable style="width:189px;" >
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div class="category_btn">
                <el-button plain class="add" @click="CancelForm1">取消</el-button>
                <el-button type="primary"  class="add" >保存</el-button>
            </div>
        </el-form>
        <el-form v-show="Form3Show" class="From" v-loading="GridLoading">
            <div class="classify"><h4 class="title" v-model="From1Title">{{From1Title}}</h4></div>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label"><span class="required">* </span>材料名称：</span>
                    <el-input  v-model="form3.material_name" size="small" clearable style="width:340px;" id="material_name" @focus="InputCss(form3,'material_name')">
                    </el-input>
                </el-col>
                <el-col :span="10">
                    <span class="base-label"><span class="required">* </span>材料编码：</span>
                    <el-input v-model="form3.material_code"  size="small" clearable style="width:240px;" id="material_code" @focus="InputCss(form3,'material_code')">
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="baseinfo">
                <el-col :span="10">
                    <span class="base-label"><span class="required">* </span>材料分类：</span>
                    <el-select filterable  v-model="form3.material_category_id"  size="small" style="width:189px;" class="ProductType" id="material_category_id" @focus="InputCss(form3,'material_category_id')">
                        <el-option
                            v-for="item in MeterialCategoryList"
                            :key="item.material_category_id"
                            :label="item.category_name"
                            :value="item.material_category_id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <div>
                <div class="classify"><h4 class="title">材料规格</h4></div>
                <el-row :gutter="20" class="baseinfo">
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>材料规格：</span>
                        <el-input  v-model="form3.specifications" size="small" clearable style="width:189px;" id="specifications" @focus="InputCss(form3,'specifications')">
                        </el-input>

                    </el-col>
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>库存单位：</span>
                        <el-input  v-model="form3.unit_desc" size="small" clearable style="width:189px;" id="unit_desc" @focus="InputCss(form3,'unit_desc')">
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <span class="base-label"><span class="required">* </span>零售单价：</span>
                        <el-input  v-model="form3.price" size="small" clearable style="width:189px;" id="price" @focus="InputCss(form3,'price')">
                        </el-input>
                    </el-col>
                    <!--<el-col :span="8">-->
                        <!--<span class="base-label"><span class="required">* </span>是否拆包：</span>-->
                        <!--<el-select filterable  v-model="form2.drug_dose_unit_id"  size="small" style="width:189px;" class="ProductType">-->
                            <!--<el-option-->
                                <!--key="0"-->
                                <!--label="否"-->
                                <!--value="0">-->
                            <!--</el-option>-->
                            <!--<el-option-->
                                <!--key="1"-->
                                <!--label="是"-->
                                <!--value="1">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<span class="base-label"><span class="required">* </span>最小单位：</span>-->
                        <!--<el-select filterable  v-model="form2.drug_dose_unit_id"  size="small" style="width:189px;" class="ProductType" @change="StockUnit">-->
                            <!--<el-option-->
                                <!--v-for="item in DrugStockUnit"-->
                                <!--:key="item.stock_unit_id"-->
                                <!--:label="item.name"-->
                                <!--:value="item.stock_unit_id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-col>-->
                </el-row>
                <el-row :gutter="20" class="baseinfo">

                    <!--<el-col :span="8">-->
                        <!--<span class="base-label"><span class="required">* </span>库存单位进制：</span>-->
                        <!--<el-input   size="small" clearable style="width:189px;" >-->
                        <!--</el-input>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<span class="base-label">图片信息：</span>-->
                        <!--<el-input   size="small" clearable style="width:189px;" >-->
                        <!--</el-input>-->
                    <!--</el-col>-->
                </el-row>
            </div>
            <!--<div>-->
                <!--<div class="classify"><h4 class="title">材料价格</h4></div>-->
                <!--<el-row :gutter="20" class="baseinfo">-->
                    <!--<el-col :span="8">-->
                        <!--<span class="base-label"><span class="required">* </span>零售单价：</span>-->
                        <!--<el-input   size="small" clearable style="width:189px;" >-->
                        <!--</el-input>-->
                        <!--&lt;!&ndash;<span v-show="RetailPriceUnit" v-model="retail_price_unit">{{retail_price_unit}}</span>&ndash;&gt;-->
                    <!--</el-col>-->
                <!--</el-row>-->
            <!--</div>-->
            <div class="category_btn">
                <el-button plain class="add" @click="CancelForm1">取消</el-button>
                <el-button type="primary"  class="add" @click="SaveMaterial">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {baseUrl} from "../../../utilis/common.js";
    import {requestSuccess} from "../../../utilis/common.js";
    import {StrTrim} from "../../../utilis/common.js";
    import Vue from 'vue';

    export default {
        name: "drug-materials",
        data() {
            return {
                TableHeight:"455",               //表格最大高度
                From1Title:"",                  //药品页面标题
                DrugShow:true,
                Form1Show:false,               //西药、中成药表单
                Form2Show:false,               //中药
                Form3Show:false,               //材料
                tabPosition: 'left',
                searchInput:"",
                dismantle:"",                  //拆零药品搜索
                ZeroStock:"",                  //零库存药品搜索
                activeName:"1",                //默认选中的panel
                DrugDosage:[],                 //剂型下拉数据
                OrgCatgory:[],                 //厂家类型
                SelectLoading:false,
                ProductCategory:[],           //成药药品类型数据
                ChnCategory:[],               //中药药品类型数据
                MeterialCategoryList:[],          //材料类型数据
                DrugPreparationUnit:[],       //成药药品制剂单位数据
                DrugDoseUnit:[],             //成药药品剂量单位数据
                DrugStockUnit:[],            //成品药品库存单位
                DismantlePrice:false,       //拆零价显示隐藏
                form1:{
                    "is_antibiosis":0,
                },
                form2:{},
                form3:{
                    "is_usable":1
                },
                nameShow:false,
                commodity_nameShow:false,
                states:"1",
                tableData: [],
                total_num:0,
                page_num:1,
                page_size:10,
                pagination:"total, sizes, prev, pager, next",
                usable_flag:"",                 //停用启用
                GridLoading:false,
                RetailPriceUnit:false,         //零售价单位
                OpenPriceUnit:false,
                speDisabled:false

            };
        },
        methods:{
            TabChange(tab,e){
                this.GetData();
            },
            GetData(){
                //获取表格数据
                // var dismantle;
                // if(this.dismantle)
                //     dismantle=1;
                // else{
                //     dismantle=0;
                // }
                if(this.activeName==="1") {
                    let param = {
                        "search": this.searchInput,
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                        "state":Number(this.states),
                        // "dismantle":dismantle
                    };
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_drug_product_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.tableData = response.body.data.rows;
                            //if(this.tableData)
                            // for(let i=0;i<this.tableData.length;i++){
                            //     if(this.tableData[i].open_price===null)
                            //         this.tableData[i].open_price="--";
                            //     if(this.tableData[i].open_price===0 && !this.tableData[i].is_dismantle)
                            //         this.tableData[i].open_price="--"
                            // }
                            this.total_num = response.body.data.total_num;
                            if (this.total_num <= Number(this.page_size)) {
                                this.pagination = "total, sizes";
                            } else {
                                this.pagination = "total, sizes, prev, pager, next";
                            }
                        }
                        this.GridLoading = false;
                    });
                }else if(this.activeName==="3"){
                    let param = {
                        "search": this.searchInput,
                        "page_num": this.page_num,
                        "page_size": this.page_size,
                        "state":Number(this.states),
                    };
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_material_query",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.tableData = response.body.data.rows;
                            this.total_num = response.body.data.total_num;
                            if (this.total_num <= Number(this.page_size)) {
                                this.pagination = "total, sizes";
                            } else {
                                this.pagination = "total, sizes, prev, pager, next";
                            }
                        }
                        this.GridLoading = false;
                    });
                }
            },
            SearchForm(){
                this.GetData();
            },
            Search(){
                if(this.searchInput===""){
                    this.GetData();
                }
            },
            handleEdit(index,row){     //编辑厂商
                this.clearData();

                if(this.activeName==="1"){
                    //搜索厂商
                    this.remoteMethod(row.org_name,0);
                    this.DrugShow=false;
                    this.Form1Show=true;
                    this.Form2Show=false;
                    this.Form3Show=false;
                    this.From1Title="药品基本信息";
                    //处理数据
                    // if(row.open_price==="--")
                    //     row.open_price=undefined;
                    this.form1=row;

                    // if(this.form1.stock_unit_id!==null){
                    //     let obj = {};
                    //     obj = this.DrugStockUnit.find((item)=>{
                    //         return item.stock_unit_id === this.form1.stock_unit_id;
                    //     });
                    //     this.RetailPriceUnit=true;
                    //     this.retail_price_unit="元/"+obj.name
                    // }else{
                    //     this.RetailPriceUnit=false;
                    // }
                    // if(this.form1.drug_preparation_unit_id!==null){
                    //     let obj = {};
                    //     obj = this.DrugPreparationUnit.find((item)=>{
                    //         return item.drug_preparation_unit_id === this.form1.drug_preparation_unit_id;
                    //     });
                    //     this.OpenPriceUnit=true;
                    //     //this.open_price_unit="元/"+obj.name
                    // }else{
                    //     this.OpenPriceUnit=false;
                    // }
                   // this.remoteMethod(row.org_id,0);

                    this.dose_name=row.dose_unit_name;
                    this.stock_name=row.stock_unit_name;
                    this.preparation_name=row.drug_preparation_unit_name;
                    //this.IsDismantle();    //是否拆零

                }else if(this.activeName==="2"){
                    this.DrugShow=false;
                    this.Form2Show=true;
                    this.Form1Show=false;
                    this.Form3Show=false;
                    this.From1Title="药品基本信息"
                }else if(this.activeName==="3"){

                    this.DrugShow=false;
                    this.Form3Show=true;
                    this.Form1Show=false;
                    this.Form2Show=false;
                    this.From1Title="基本属性";
                    this.form3=row;

                }
                //this.speDisabled=true;
            },
            clearData(){              //清除表单数据
                $("input").css({"color":"#606266","border-color":"#dcdfe6"});

                this.form1={
                    "is_dismantle":0,
                    "is_prescription":0,
                    "is_antibiosis":0
                };
                // if(this.form1.stock_unit_id!==undefined){
                //     let obj = {};
                //     obj = this.DrugStockUnit.find((item)=>{
                //         return item.stock_unit_id === this.form1.stock_unit_id;
                //     });
                //     this.RetailPriceUnit=true;
                //    // this.retail_price_unit="元/"+obj.name
                // }else{
                //     this.RetailPriceUnit=false;
                // }
                // if(this.form1.drug_preparation_unit_id!==undefined){
                //     let obj = {};
                //     obj = this.DrugPreparationUnit.find((item)=>{
                //         return item.drug_preparation_unit_id === this.form1.drug_preparation_unit_id;
                //     });
                //     this.OpenPriceUnit=true;
                //     //this.open_price_unit="元/"+obj.name
                // }else{
                //     this.OpenPriceUnit=false;
                // }
                this.form2={};
                this.form3={
                    "is_usable":1
                };
                this.IsDismantle();
                this.preparation_name="";
                this.stock_name="";
                this.dose_name="";
                this.speDisabled=false;
            },
            AddForm1(){
                this.clearData();
                if(this.activeName==="1"){
                    this.DrugShow=false;
                    this.Form1Show=true;    //成药
                    this.Form2Show=false;
                    this.Form3Show=false;
                    this.From1Title="药品基本信息"
                }else if(this.activeName==="2"){
                    this.DrugShow=false;
                    this.Form1Show=false;
                    this.Form2Show=true;    //中药
                    this.Form3Show=false;
                    this.From1Title="药品基本信息"
                }else if(this.activeName==="3"){
                    this.DrugShow=false;
                    this.Form1Show=false;
                    this.Form2Show=false;
                    this.Form3Show=true;   //材料
                    this.From1Title="基本属性"
                }
                this.form1.usable_flag="1"; //新增 非停用状态
            },
            remoteMethod(query,time) {
                //生产厂商 远程搜索
                query=StrTrim(query);
                if(time===undefined)
                    time=800;
                if (query !== '') {
                    this.SelectLoading = true;
                    setTimeout(() => {
                        let param={
                            "search":query,
                            "manufacturer_category_id":2
                        };
                        this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_org_category_query","param":JSON.stringify(param)}).then((response) => {
                            if(requestSuccess(response.body,this)){
                                this.OrgCatgory=response.body.data;
                            }
                            this.GridLoading = false;
                            this.SelectLoading = false;
                        });
                    }, time);
                } else {
                    this.OrgCatgory = [];
                }
            },
            GetDrugDosage(){
                //获取剂型
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_drug_dosage_query"}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.DrugDosage=response.body.data;
                    }
                });
            },
            GetProductCategory(){
                //成药药品类型
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_drug_product_category_query"}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.ProductCategory=response.body.data;
                    }
                });
            },
            GetChaCategory(){
                //中药药品类型
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_drug_cha_category_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.ChnCategory = response.body.data;
                    }
                });
            },
            MeterialCategory(){
                //材料类型
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_drug_meterial_category_query"}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.MeterialCategoryList=response.body.data;
                    }
                });
            },
            GetDrugDoseUnit(){
                //成药药品剂量单位
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_drug_dose_unit_query"}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        this.DrugDoseUnit = response.body.data;
                    }
                });
            },
            GetDrugPreparationUnit(){
                //成药药品制剂单位
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_drug_preparation_unit_query"}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.DrugPreparationUnit=response.body.data;
                    }
                });
            },
            GetDrugStockUnit(){
                //成药药品库存单位
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_drug_stock_unit_query"}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this.DrugStockUnit=response.body.data;
                    }
                });
            },
            CancelForm1(){
                //取消按钮
                    this.DrugShow = true;
                    this.Form1Show = false;
                    this.Form2Show = false;
                    this.Form3Show = false;
                    this.GetData();
            },
            IsDismantle(){                //是否拆零
                if(this.form1.is_dismantle===1){
                    this.DismantlePrice=true
                }else{
                    this.DismantlePrice=false;
                   // Vue.set(this.form1,"open_price", undefined);
                }
            },
            handleSizeChange(val) {
                this.page_size=val;
                this.GetData();
            },
            handleCurrentChange(val) {
                this.page_num=val;
                this.GetData();
            },
            SaveDrugProduct() {
                //成药保存
                //不为空提示

                //this. getSpec();

                let IDArr;
                    IDArr = ["name", "commodity_name","org_id", "drug_spec_value", "drug_dosage_id", "drug_product_category_id"];
                if (this.showPoint(this.form1,IDArr))
                    return;
                //处理价格数据
                //去空格
                this.form1.name=StrTrim(this.form1.name);
                this.form1.commodity_name=StrTrim(this.form1.commodity_name);
                this.form1.drug_spec_value=StrTrim(this.form1.drug_spec_value);
                let param = $.extend(true, {}, this.form1);

                 if (param.dose_num === "" || param.dose_num === null)
                     delete param.dose_num;
                if (param.dose_num !== undefined)
                    param.dose_num = Number(this.form1.dose_num)* 100;

                 if (param.preparation_num === "" || param.preparation_num === null)
                     delete param.preparation_num;
                // if (param.peak_price !== undefined)
                //     param.peak_price = Number(this.form1.peak_price).toFixed(2) * 100;
                //
                // if (param.open_price === "" || param.open_price === null)
                //     delete param.open_price;
                // if (param.open_price !== undefined)
                //     param.open_price = Number(this.form1.open_price).toFixed(2) * 100;
               //显示模态层 保存数据
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_drug_product_save",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.form1.drug_product_id = response.body.data.drug_product_id;
                            this.CancelForm1();                        //返回主页面 刷新表格信息
                            this.GetData();
                            this.$alert("保存成功！", '提示', {
                                confirmButtonText: '确定',
                            });
                        }
                        this.GridLoading = false;
                    });
            },
            usable(index,row){
                //启用 停用
                if(row.usable_flag===0){
                    this.usable_flag="启用";
                    row.usable_flag=1;
                }else if(row.usable_flag===1){
                    this.usable_flag="停用";
                    row.usable_flag=0;
                }
                var param=JSON.stringify(row);
                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_drug_product_save","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){

                        this. GetData();                      //返回主页面 刷新表格信息
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                    this.GridLoading=false;
                });
            },
            tableRowClassName({row, rowIndex}) {
                if (row.usable_flag===0) {
                    return 'success-row';
                }
                if (row.is_usable===0) {
                    return 'success-row';
                }
            },
            StockUnit(val){
                //零售价单位显示
                let obj = {};
                obj = this.DrugStockUnit.find((item)=>{
                    return item.stock_unit_id === val;
                });
                this.RetailPriceUnit=true;
                //this.retail_price_unit="元/"+obj.name
            },
            OpenUnit(val){
                //库存单位显示
                let obj = {};
                obj = this.DrugPreparationUnit.find((item)=>{
                    return item.drug_preparation_unit_id === val;
                });

                this.OpenPriceUnit=true;
                //this.open_price_unit="元/"+obj.name
            },
            showPoint(form,IDArray){
                //不能为空的提示
                var flag=false;
                for (var i=0;i<IDArray.length;i++){
                    if(!form[IDArray[i]] || form[IDArray[i]]==="必填项不能为空"){
                        Vue.set(form,IDArray[i],'必填项不能为空');
                        $("#"+IDArray[i]).css({"color":"red","border-color":"red"});
                        flag=true
                    }
                }
                return flag
            },
            InputCss(form,id){
                if(form[id]==="必填项不能为空") {
                    Vue.set(form, id, undefined);
                    $("#" + id).css({"border-color": "#dcdfe6", "color": "#606266"})
                }
            },
            SpecValue3(val){

                let drug_dose = {};
                drug_dose = this.DrugDoseUnit.find((item)=>{
                    return item.drug_dose_unit_id === val;
                });
                this.dose_name = drug_dose.name;
                this.getSpec();
            },
            SpecValue1(val){
                let stock_unit = {};
                stock_unit = this.DrugStockUnit.find((item)=>{
                    return item.stock_unit_id === val;
                });
                this.stock_name = stock_unit.name;
                this.getSpec();
            },
            SpecValue2(val){

                let preparation = {};
                preparation = this.DrugPreparationUnit.find((item)=>{
                    return item.drug_preparation_unit_id === val;
                });
                this.preparation_name = preparation.name;
               this.getSpec();

            },
            getSpec(){

                if(this.preparation_name===undefined)
                    this.preparation_name="";
                if(this.stock_name===undefined)
                    this.stock_name="";
                if(this.dose_name===undefined)
                    this.dose_name="";
                if(this.form1.dose_num===undefined)
                    this.form1.dose_num="";
                if(this.form1.preparation_num===undefined)
                    this.form1.preparation_num="";

                this.form1.drug_spec_value=this.form1.dose_num+this.dose_name +'*'+this.form1.preparation_num+this.preparation_name+'/'+this.stock_name
                Vue.set(this.form1, 'drug_spec_value',this.form1.drug_spec_value);
                if(this.preparation_name===undefined)
                    this.preparation_name="";
                if(this.stock_name===undefined)
                    this.stock_name="";
                if(this.dose_name===undefined)
                    this.dose_name="";
                if(this.form1.dose_num===undefined)
                    this.form1.dose_num="";
                if(this.form1.preparation_num===undefined)
                    this.form1.preparation_num="";
            },
            GetSearch(){
                //生产检索
                if(!this.form1.chemistry_name)
                    this.form1.chemistry_name="";
                if(!this.form1.name)
                    this.form1.name="";
                if(!this.form1.commodity_name)
                    this.form1.commodity_name="";
                this.$http.post(baseUrl()+'/drugSearch',{"name":this.form1.name,"commodity_name":this.form1.commodity_name,"chemistry_name":this.form1.chemistry_name}).then((response) => {
                    if(requestSuccess(response.body,this)) {
                        Vue.set(this.form1,"search","药品名:"+response.body.data.name+",商品名:"+response.body.data.commodityName+",化学名:"+response.body.data.chemistryName);
                        this.form1.search="药品名:"+response.body.data.name+",商品名:"+response.body.data.commodityName+",化学名:"+response.body.data.chemistryName;
                    }
                });
            },
            SaveMaterial(){
                let IDArr;
                IDArr = ["material_name", "material_code","material_category_id", "specifications", "unit_desc","price"];
                if (this.showPoint(this.form3,IDArr))
                    return;
                if (this.form3.price === "" || this.form3.price === null)
                    delete this.form3.price;
                if (this.form3.price !== undefined)
                    this.form3.price = Number(this.form3.price).toFixed(2) * 100;

                if(this.form3.material_id) {

                    //去空格
                    this.form3.material_name=StrTrim(this.form3.material_name);
                    this.form3.specifications=StrTrim(this.form3.specifications);

                    let param = $.extend(true, {}, this.form3);

                    //显示模态层 保存数据
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_material_update",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.CancelForm1();                        //返回主页面 刷新表格信息
                            this.GetData();
                            this.$alert("保存成功！", '提示', {
                                confirmButtonText: '确定',
                            });
                        }
                        this.GridLoading = false;
                    });
                }else{


                    //去空格
                    this.form3.material_name=StrTrim(this.form3.material_name);
                    this.form3.specifications=StrTrim(this.form3.specifications);

                    let param = $.extend(true, {}, this.form3);

                    //显示模态层 保存数据
                    this.GridLoading = true;
                    this.$http.post(baseUrl()+'/comm', {
                        "methodName": "sp_clinic_material_save",
                        "param": JSON.stringify(param)
                    }).then((response) => {
                        if(requestSuccess(response.body,this)){
                            this.CancelForm1();                        //返回主页面 刷新表格信息
                            this.GetData();
                            this.$alert("保存成功！", '提示', {
                                confirmButtonText: '确定',
                            });
                        }
                        this.GridLoading = false;
                    });
                }
            },
            usableMaterail(index,row){
                //启用 停用
                if(row.is_usable===0){
                    this.is_usable="启用";
                    row.is_usable=1;
                }else if(row.is_usable===1){
                    this.is_usable="停用";
                    row.is_usable=0;
                }
                var param=JSON.stringify(row);
                this.GridLoading=true;
                this.$http.post(baseUrl()+'/comm',{"methodName":"sp_clinic_material_update","param":param}).then((response) => {
                    if(requestSuccess(response.body,this)){
                        this. GetData();                      //返回主页面 刷新表格信息
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                    }
                    this.GridLoading=false;
                });
            },

        },
        mounted() {
            this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-85;
            window.onresize  = () => {
                this.TableHeight=($(window).height())-60-($("#tools").height())-20-($(".pagination").height())-85;
            };
            this.GetData();        //获取表格数据
            this.GetDrugDosage(); //剂型
            this.GetProductCategory();//成药药品类型
            this.GetChaCategory();//中药药品类型
            this.GetDrugDoseUnit();//成药药品剂量单位
            this.GetDrugPreparationUnit();//成药药品制剂单位
            this.GetDrugStockUnit();//成药药品库存单位
            this.MeterialCategory() //获取材料分类
        }
    }
</script>

<style scoped>
    .el-table .success-row {
        background: #f0f9eb;
    }
    .From{
        position:relative;
        height:100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .tab_content{
        padding:8px 10px 0 5px;
    }
    .add{
        width:90px;
        height:30px;
        line-height:0;
    }
    .table{
        border-top:1px solid #ccc;
        margin-top: 10px;
    }
    .baseinfo{
        padding: 10px 0 5px 5px;
    }
    .base-label{
        width: 110px;
        display: inline-block;
        text-align: right;
    }
    .category_btn{
        float:right;
        margin:30px 10px;
        overflow: hidden;
    }
    .search{
        width:215px;
    }
    .ml20{
        margin-left: 20px;
    }
    .pointNull{
        font-size:12px;
        color:red;
        display:none;
    }
    .point{
        color:red;
        border-color:red;
    }
</style>
