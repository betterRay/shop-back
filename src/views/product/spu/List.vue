<template>
  <div>
    <!-- 三级分类搜索 -->
    <el-card class="box-card" style="marginBottom: 10px">
      <SelectionFloor
        @getAttrList="receiveAttrList"
        :addOrEditFlag="!skuShow && !spuShow"
      />
    </el-card>

    <!-- SPU展示列表 -->
    <el-card v-show="!skuShow && !spuShow">
      <el-button type="primary" icon="el-icon-plus" 
      @click="addSpu"
      :disabled="category3Id ==='' "
        >添加SPU</el-button
      >

      <el-table :data="spuList.records" style="width: 100%;margin:10px 0" border>
        <el-table-column
          prop="prop"
          label="序号"
          width="80"
          align="center"
          type="index"
        >
        </el-table-column>

        <el-table-column prop="spuName" label="SPU名称" width="width">
        </el-table-column>

        <el-table-column prop="description" label="SPU描述" width="width">
        </el-table-column>

        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <HintButton
              icon="el-icon-plus"
              size="mini"
              type="success"
              title="添加SKU"
            />
            <HintButton
              slot="reference"
              icon="el-icon-edit"
              size="mini"
              type="danger"
              title="修改SPU"
              @click="editSpu(row.id)"
            />
            <HintButton
              slot="reference"
              icon="el-icon-info"
              size="mini"
              type="danger"
              title="查看SPU的AKU列表"
            />
            <HintButton
              slot="reference"
              icon="el-icon-delete"
              size="mini"
              type="danger"
              title="删除SPU"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="getList"
      :current-page="this.page"
      :page-sizes="[1, 3, 5]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,sizes,->,total"
      :total="spuList.total"
      :pager-count=5
      style="textAlign: center"
    >
    </el-pagination>
    <!-- 分页器 -->
    </el-card>

    <!-- SPU修改界面 -->
    <SpuChange
    v-show="spuShow" 
    :spuShow.sync='spuShow' 
    ref="spuEdit" 
    :getList="getList"
    :category3IdInit="category3Id"
    />

    <!-- SKU修改界面 -->
    <SkuChange v-show="skuShow" ref="skuEdit"/>
  </div>
</template>

<script>
import SpuChange from './spuChange'
import SkuChange from './skuChange'
export default {
  name: "spu",
  data() {
    return {
      category3Id:'',
      page:1,
      limit:3,
      spuList:{},
      spuShow:false,
      skuShow:false,
    };
  },
  components: {
    SkuChange,SpuChange
  },
  methods: {
    async receiveAttrList(attrList, category) {
      this.category3Id = category.category3Id
      if(this.category3Id){
        this.getList(this.page,this.limit,this.category3Id)
      }
    }, //子向父传递数据用于展示，收集
    async handleSizeChange(pageSize){
      this.limit=pageSize
      let res = await this.$API.spu.getList(this.page,this.limit,this.category3Id)
        if(res.code===200){
          this.spuList=res.data
        }
    },//分页器每页数量变化
    async getList(page=1){
      this.page=page
      let res = await this.$API.spu.getList(this.page,this.limit,this.category3Id)
        if(res.code===200){
          this.spuList=res.data
        }
    },//根据当前页码获取商品SPU列表
    addSpu(){
      this.spuShow=true
      this.$refs.spuEdit.handleSpuAdd()
    },//增加SPU
    editSpu(spuId){
      this.spuShow=true
      this.$refs.spuEdit.handleSpuEdit(spuId)
    },//修改SPU
    addSku(){
      this.skuShow=true
    },//增加SKU
  }
};
</script>

<style lang="scss" scoped></style>
