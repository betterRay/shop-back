<template>
  <div>
    <el-card class="box-card">
      <SelectionFloor @getAttrList="receiveAttrList" :addOrEditFlag="addOrEditFlag"/>
    </el-card>

    <!-- 属性列表展示 -->
    <el-card class="box-card" v-show="addOrEditFlag">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="marginbottom: 10px"
        @click="addAttr()"
        :disabled="attr.categoryId === ''"
        >添加属性</el-button
      >
      <el-table :data="attrList" style="width: 100%" border>
        <el-table-column
          prop="prop"
          label="序号"
          width="80"
          align="center"
          type="index"
        >
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column prop="prop" label="属性值列表" width="width">
          <template slot-scope="{ row, $index }">
            <el-tag
              type="success"
              v-for="(item, index) in row.attrValueList"
              :key="item.id"
              >{{ item.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{ row, $index }">
            <HintButton
              icon="el-icon-edit"
              size="mini"
              type="success"
              title="修改"
              @click="editAttr(row)"
            />
            <el-popconfirm
              title="确认删除该条属性吗？"
              @onConfirm="deleteAttr(row.id)"
            >
              <HintButton
                slot="reference"
                icon="el-icon-delete"
                size="mini"
                type="danger"
                title="删除"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 属性列表增加或者修改界面展示 -->
    <el-card v-show="!addOrEditFlag">
      <el-form ref="form" :model="attr" label-width="80px">
        <el-form-item label="属性名">
          <el-input
            v-model="attr.attrName"
            placeholder="请输入属性名"
            style="width: 170px"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="attr.attrName === ''"
        @click="addAttrValueName()"
        >添加属性值</el-button
      >
      <el-button @click="addOrEditFlag = true">取消</el-button>
      <el-table
        :data="attr.attrValueList"
        style="width: 100%; margin: 10px 0"
        border
      >
        <el-table-column
          prop="prop"
          label="序号"
          width="80px"
          type="index"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="prop" label="属性值名称" width="width">
          <template slot-scope="{ row, $index }">
            <el-input
              v-model="row.valueName"
              placeholder="请输入属性值名称"
              v-show="row.isEdit"
              @blur="inputBlur(row, $index)"
              :ref="$index"
              size="mini"
            ></el-input>
            <span
              v-show="!row.isEdit"
              @click="clickSpan(row, $index)"
              style="display:block;width:100%;heigth:100%"
            >
              {{ row.valueName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <HintButton
              icon="el-icon-delete"
              size="mini"
              type="danger"
              title="删除"
              @click="deleteAttrValueListItem(row,$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        :disabled="attr.attrValueList.length === 0"
        @click="saveAddOrEdit"
        >保存</el-button
      >
      <el-button @click="addOrEditFlag = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { attr } from '@/api';
export default {
  name: "attr",
  data() {
    return {
      attrList: [],
      addOrEditFlag: true,
      category: {},
      attr: {
        attrName: "",
        attrValueList: [],
        // {
        //   attrId: 0,
        //   id: 0,
        //   valueName: ""
        // }
        categoryId: "",
        categoryLevel: 3
      }
    };
  },
  mounted() {},
  methods: {
    receiveAttrList(attrList, category) {
      this.attrList = attrList;
      this.category = category;
      this.attr.categoryId = category.category3Id;
    }, //子向父传递数据用于展示，收集
    addAttrValueName() {
      let attrValueListItem = {
        attrId: 0,
        valueName: "",
        isEdit: true
      };
      this.attr.attrValueList.push(attrValueListItem);
      this.$nextTick(() => {
        this.$refs[this.attr.attrValueList.length - 1].focus();
      });
    }, //增加属性值
    async getAttrList() {
      let res = await this.$API.attr.getAttrList(
        this.category.category1Id,
        this.category.category2Id,
        this.category.category3Id
      );
      if (res.code === 200) {
        this.attrList = res.data;
      }
    }, //获取属性值列表
    async saveAddOrEdit() {
      if (
        this.attr.attrValueList.some(item => {
          return item.valueName === "";
        })
      ) {
        alert("请先输入一个属性值！");
        this.attr.attrValueList = [];
      } else {
        this.attr.attrValueList = this.attr.attrValueList.filter(item => {
          if (item.valueName) {
            delete item.isEdit;
            return true;
          }
        });
        try {
          let res = await this.$API.attr.addOrEditAttr(this.attr);
          if (res.code === 200) {
            this.$message.success("保存属性成功！");
            this.getAttrList();
          }
          this.addOrEditFlag = true;
        } catch (error) {
          this.$message.warning("保存属性失败！");
        }
      }
    }, //点击保存先判断属性值列表中属性值是否都为空，删掉不为空的中的isEdit,然后立即请求更新属性列表（新增或修改）
    addAttr() {
      this.addOrEditFlag = false;
      this.attr = {
        attrName: "",
        attrValueList: [],
        // {
        //   attrId: 0,
        //   id: 0,
        //   valueName: ""
        // }
        categoryId: this.category.category3Id,
        categoryLevel: 3
      };
    }, //增加属性
    editAttr(row) {
      this.addOrEditFlag = false;
      row.attrValueList.forEach(item => {
        this.$set(item, "isEdit", false);
      });
      this.attr = cloneDeep(row);
    }, //修改属性
    async deleteAttr(attrId) {
      let res = await this.$API.attr.deleteAttr(attrId);
      if (res.code === 200) {
        this.$message.success("删除属性成功！");
        this.getAttrList();
      }
    }, //删除属性
    clickSpan(row, $index) {
      row.isEdit = true;
      this.$nextTick(() => {
        this.$refs[$index].focus();
      });
    }, //点击span切换编辑状态
    inputBlur(row, $index) {
      if (row.valueName.trim() === "") {
        row.isEdit = true;
        row.valueName = "";
      } else {
        let isReapt = this.attr.attrValueList.some((item, index) => {
          if ($index !== index) {
            return item.valueName === row.valueName;
          }
        });
        if (isReapt) {
          alert("属性名不能重复");
          row.valueName = "";
          row.isEdit = true;
        } else {
          row.isEdit = false;
        }
      }
    }, //input框失去焦点时判断是否输入空值或者重复属性
    deleteAttrValueListItem(row,$index){
      this.attr.attrValueList.splice($index,1)
    }
  }
};
</script>

<style>
.box-card {
  margin-bottom: 20px;
}
</style>
