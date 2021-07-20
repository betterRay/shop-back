<template>
  <el-card>
    <el-form ref="form" :model="spuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuInfo.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="(item, index) in trademarkList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spuInfo.description"
          placeholder="SPU描述"
          rows="5"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAddSuccess"
          :file-list="spuInfo.spuImageList || []"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          v-model="restSaleAttr"
          :placeholder="`还有${restSaleAttrList.length}项未选择`"
        >
          <el-option
            :label="item.name"
            :value="`${item.name}:${item.id}`"
            v-for="(item, index) in restSaleAttrList"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-cion-plus"
          @click="addSaleAttr"
          :disabled="restSaleAttr === ''"
          >添加销售属性</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-table :data="spuInfo.spuSaleAttrList" style="width: 100%">
          <el-table-column label="序号" width="width" type="index">
          </el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="item.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row, item)"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <div>
                <HintButton
                  title="删除销售属性"
                  icon="el-icon-delete"
                  size="mini"
                  type="primary"
                  @click="deleteSaleAttr($index)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateSpu">保存</el-button>
        <el-button @click="backToSpu">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SpuChange",
  data() {
    return {
      data: [],
      restSaleAttr: "",
      spuInfo: {
        category3Id: 0,
        description: "",
        // id: 0,
        spuImageList: [],
        spuName: "",
        spuSaleAttrList: []
        // tmId: 0
      }, //对应商品spu属性
      //   spuImageList: [], //对应商品spu图片列表
      trademarkList: [], //所有品牌列表
      allSaleAttrList: [], //所有销售属性列表

      //upload图片区域
      dialogImageUrl: "",
      dialogVisible: false,

      //销售属性值tag区域
      inputValue: ""
    };
  },
  props: ['getList','category3IdInit'],
  methods: {
    async handleSpuEdit(spuId) {
      let res = await this.$API.spu.getSpu(spuId);
      if (res.code === 200) {
        this.spuInfo = res.data;
      }
      // http://localhost:9528/dev-api/admin/product/getSpuById/3 获取对应商品spu属性

      let res1 = await this.$API.sku.getSpuImageList(spuId);
      if (res1.code === 200) {
        let spuImageList = res1.data;
        spuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuInfo.spuImageList = spuImageList;
      }
      // http://localhost:9528/dev-api/admin/product/spuImageList/3 获取对应商品spu图片列表

      let res2 = await this.$API.trademark.getAllTrademarkList();
      if (res2.code === 200) {
        this.trademarkList = res2.data;
      }
      // http://localhost:9528/dev-api/admin/product/baseTrademark/getTrademarkList 获取所有品牌列表

      let res3 = await this.$API.spu.getSaleAttrList();
      if (res3.code === 200) {
        this.allSaleAttrList = res3.data;
      }
      // http://localhost:9528/dev-api/admin/product/baseSaleAttrList 获取所有销售属性列表
    }, //处理修改spu的函数
    async handleSpuAdd() {
      
      let res3 = await this.$API.spu.getSaleAttrList();
      if (res3.code === 200) {
        this.allSaleAttrList = res3.data;
      }
      // http://localhost:9528/dev-api/admin/product/baseSaleAttrList 获取所有销售属性列表
      let res2 = await this.$API.trademark.getAllTrademarkList();
      if (res2.code === 200) {
        this.trademarkList = res2.data;
      }
      // http://localhost:9528/dev-api/admin/product/baseTrademark/getTrademarkList 获取所有品牌列表
    },
    handleRemove(file, fileList) {
      this.spuInfo.spuImageList = fileList;
    }, //处理照片墙文件删除
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }, //处理照片墙照片预览
    handleAddSuccess(response, file, fileList) {
      fileList.forEach(item => {
        item.imgName = item.name;
        item.imgUrl = item.url;
      });
      this.spuInfo.spuImageList = fileList;
      console.log(this.spuInfo.spuImageList);
    }, //上传图片成功的回调
    addSaleAttr() {
      let item = {
        baseSaleAttrId: this.restSaleAttr.split(":")[1] * 1,
        saleAttrName: this.restSaleAttr.split(":")[0],
        spuSaleAttrValueList: []
      };
      this.spuInfo.spuSaleAttrList.push(item);
      this.restSaleAttr=''
    }, //增加销售属性
    handleClose(row, item) {
      row.spuSaleAttrValueList.splice(
        row.spuSaleAttrValueList.indexOf(item),
        1
      );
    }, //关闭销售属性值
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    }, //button点击事件
    handleInputConfirm(row) {
      let saleAttrValueItem = {
        saleAttrValueName: this.inputValue,
        baseSaleAttrId: row.baseSaleAttrId
      };
      if (this.inputValue.trim() === "") {
      } else if (
        row.spuSaleAttrValueList.some(item => {
          return item.saleAttrValueName === saleAttrValueItem.saleAttrValueName;
        })
      ) {
        this.$message.warning("销售属性值不能重复！");
      } else {
        row.spuSaleAttrValueList.push(saleAttrValueItem);
      }
      this.inputValue = "";
      this.$set(row, "inputVisible", false);
    }, //处理属性值列表input框失去焦点或按下enter键
    deleteSaleAttr(index) {
      this.spuInfo.spuSaleAttrList.splice(index, 1);
    }, //删除销售属性
    async updateSpu() {
      try {      
        if(!this.spuInfo.category3Id){
          this.spuInfo.category3Id=this.category3IdInit
        } 
        let res = await this.$API.spu.addUpdate(this.spuInfo);
        if (res.code === 200) {
          this.$message.success('修改SPU属性成功！')
        }
        this.$emit('update:spuShow', false)
        this.getList()
      } catch (error) {
        alert('修改SPU属性失败了！')
      }
      this.spuInfo={
        category3Id: 0,
        description: "",
        // id: 0,
        spuImageList: [],
        spuName: "",
        spuSaleAttrList: []
        // tmId: 0
      }
    }, //更新SPU
    backToSpu(){
      this.$emit('update:spuShow', false)
      this.spuInfo={
        category3Id: 0,
        description: "",
        // id: 0,
        spuImageList: [],
        spuName: "",
        spuSaleAttrList: []
        // tmId: 0
      }
    },//点击回到SPU展示页
  },
  computed: {
    restSaleAttrList() {
      return this.allSaleAttrList.filter(item => {
        return this.spuInfo.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName;
        });
      });
    } //计算剩余的销售属性
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
