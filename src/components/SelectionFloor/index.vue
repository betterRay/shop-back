<template>
  <el-form :inline="true" class="demo-form-inline" :model="category" :disabled='!addOrEditFlag'>
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="getCategory2"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in category1List"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="getCategory3"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in category2List"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="category.category3Id" placeholder="请选择" @change="getAttrList">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in category3List"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
</template>

<script>
export default {
    name:'SelectionFloor',
    data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      },
      attrList:[]
    };
  },
  props:['addOrEditFlag'],
  mounted() {
    this.getCategory1();
  },
  methods: {
    async getCategory1() {
      let res = await this.$API.attr.getCategory1();
      if (res.code === 200) {
        this.category1List = res.data;
      }
    }, //获取一级分类
    async getCategory2(category1Id) {
      this.category.category2Id=''
      this.category.category3Id=''
      let res = await this.$API.attr.getCategory2(category1Id);
      if (res.code === 200) {
        this.category2List = res.data;
        this.attrList=[]
        this.$emit('getAttrList',this.attrList,this.category)
      }
    }, //获取二级分类
    async getCategory3(category2Id) {
      this.category.category3Id=''
      let res = await this.$API.attr.getCategory3(category2Id);
      if (res.code === 200) {
        this.category3List = res.data;
        this.attrList=[]
        this.$emit('getAttrList',this.attrList,this.category)
      }
    }, //获取三级分类
    async getAttrList(category3Id){
        let res=await this.$API.attr.getAttrList(this.category.category1Id,this.category.category2Id,category3Id)
        if(res.code===200){
            this.attrList=res.data
            this.$emit('getAttrList',this.attrList,this.category)
        }
        
    }
  }
}
</script>

<style>

</style>