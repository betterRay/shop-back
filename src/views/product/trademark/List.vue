<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addOrEdit"
      >添加</el-button
    >

    <el-table :data="trademarkList" style="width: 100%; margin: 20px 0" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{ row, $index }">
          <div>
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="addOrEdit($event, row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteTrademark(row.id, row.tmName)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.page"
      :page-sizes="[1, 3, 5]"
      :page-size="3"
      layout=" prev, pager, next, jumper,sizes,->,total"
      :total="total * 1"
      style="textalign: center"
    >
    </el-pagination>
    <!-- 分页器 -->

    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        style="width: 80%; textalign: center"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip" style="textalign: left">
              只能上传jpg文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trademark",
  data() {
    var validatePass = (rule, value, callback) => {
        if (value.length<3||value.length>8) {
          callback(new Error('品牌名称必须2-8位之间'));
        } else {
          callback();
        }
      };
    return {
      trademarkList: [],

      page: 1,
      limit: 3,
      size: "",
      total: "",

      dialogFormVisible: false,

      form: {
        id: "",
        name: "",
        imageUrl: "",
      },
      rules:{
        name:[{validator: validatePass, message:'品牌名称必须2-8位之间', trigger: 'blur'},
              {required: true, message:'必须输入品牌名称', trigger: 'blur'}],
        imageUrl:[{required: true, message:'必须上传品牌LOGO'}]
      }
    };
  },
  mounted() {
    this.getTrademarkList(this.page, this.limit);
  },
  methods: {
    async getTrademarkList(page, limit) {
      try {
        let response = await this.$API.trademark.getTrademarkList(page, limit);
        if (response.code === 200 || response.code === 20000) {
          this.trademarkList = response.data.records;
          this.size = response.data.size;
          this.total = response.data.total;
        }
      } catch (error) {
        this.$message.warning("获取商品列表失败");
      }
    }, //获取某页商品列表
    handleSizeChange(val) {
      this.limit = val;
      this.getTrademarkList(this.page, this.limit);
    }, //改变每页数量
    handleCurrentChange(val) {
      this.page = val;
      this.getTrademarkList(this.page, this.limit);
    }, //改变当前页
    addOrEdit(event, row) {
      this.dialogFormVisible = true;
      if (row) {
        this.form.imageUrl = row.logoUrl;
        this.form.name = row.tmName;
        this.form.id = row.id;
      } else {
        this.form.imageUrl = "";
        this.form.name = "";
        this.form.id = "";
      }
    }, //添加或修改品牌
    async deleteTrademark(id,tmName) {
      this.$confirm(`此操作将永久删除${tmName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
        const res = await this.$API.trademark.deleteTrademark(id);
        if (res.code === 200 || res.code === 20000) {
          this.$message({
            type: "success",
            message: "删除品牌内容成功!",
          });
        }
        this.getTrademarkList(this.trademarkList.length>1?this.page:this.page-1, this.limit)
      } catch (error) {
        this.$message.warning("删除品牌内容失败了！")
      }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }, //删除品牌

    handleAvatarSuccess(res, file) {
      this.form.imageUrl = res.data;
    }, //上传成功的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }, //上传前的回调
    async closeDialog() {
      this.$refs.ruleForm.validate(async(valid) => {
          if (valid) {
            this.dialogFormVisible = false
            let info = {
              logoUrl: this.form.imageUrl,
              tmName: this.form.name,
            };
            if (this.form.id) {
              info.id = this.form.id;
              this.$confirm("此操作将修改品牌内容, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(async () => {
                  try {
                    let response = await this.$API.trademark.editTrademark(info);
                    if (response.code === 200 || response.code === 20000) {
                      this.$message({
                        type: "success",
                        message: "修改品牌内容成功!",
                      });
                    } //修改品牌内容
                    this.getTrademarkList(this.page, this.limit);
                    //获取某页商品列表
                  } catch (error) {
                    this.$message.warning("修改品牌内容失败了");
                  }
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消修改",
                  });
                });
            } else {
              try {
                let response = await this.$API.trademark.addTrademark(info);
                if (response.code === 200 || response.code === 20000) {
                  this.$message.success("添加商品成功了！");
                } //添加商品至数据库
                this.getTrademarkList(1, this.limit);
                //获取某页商品列表
              } catch (error) {
                this.$message.warning("添加商品失败了");
              }
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
    }, //按下对话框品牌添加删除确认键后
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
