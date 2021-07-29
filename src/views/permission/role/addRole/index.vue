<template>
  <el-dialog
    title="添加角色"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose"
    width="35%"
  >
    <el-form :model="newRole" :rules="rules" ref="ruleForm">
      <div>请输入新名称</div>
      <el-form-item prop="roleName">
        <el-input
          v-model="newRole.roleName"
          autocomplete="off"
          style="marginTop:20px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirmAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AddRole",
  data() {
    return {
      newRole: {
        deleted: false,
        gmtCreate: "2021-07-20 09:50:13",
        gmtModified: "2021-07-20 18:50:25",
        id: "",
        remark: null,
        roleName: ""
      },
      rules:{
        roleName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
      }
    };
  },
  props: ["dialogFormVisible", "getAllRole"],
  methods: {
    cancel() {
      this.$emit("update:dialogFormVisible", false);
    }, //取消添加新角色
    confirmAdd() {
      this.$refs.ruleForm.validate(async(valid) => {
          if (valid) {
            alert('submit!');
            try {
              let res = await this.$API.role.addRole(this.newRole);
              if (res.code === 200 || res.code === 20000) {
                this.$emit("update:dialogFormVisible", false);
              }
              this.getAllRole();
            } catch (error) {
              this.$message.error("添加新角色失败！");
            }
            this.newRole = {
              deleted: false,
              gmtCreate: "2021-07-20 09:50:13",
              gmtModified: "2021-07-20 18:50:25",
              id: "",
              remark: null,
              roleName: ""
            };
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }, //确定添加新角色
    handleClose() {
      this.$emit("update:dialogFormVisible", false);
    } //处理对话框的关闭
  }
};
</script>

<style></style>
