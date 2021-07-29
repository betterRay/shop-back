<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" inline>
      <el-form-item>
        <el-input placeholder="用户名" v-model="form.userName"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchRole"
          >查询</el-button
        >
        <el-button @click="clearSearch">清空</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="addNewRole">添加</el-button>
    <el-button type="info" @click="batchRemove">批量删除</el-button>

    <AddUser
      :dialogFormVisible.sync="dialogFormVisible"
      :getAllUser="getAllUser"
    />

    <DispatchUser 
    :dispatchVisible.sync="dispatchVisible"
    />
    <el-table
      :data="allUser.items"
      style="margin:20px 0px"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column label="序号" width="80" type="index" align="center">
      </el-table-column>

      <el-table-column
        prop="username"
        label="用户名" >
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="用户昵称" >
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="权限列表" >
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="创建时间" 
        width="200"
        >
      </el-table-column>

      <el-table-column 
      prop="gmtModified" 
      label="更新时间"
      width="200"
      >
      </el-table-column>

      <el-table-column
        prop="address"
        label="操作"
        show-overflow-tooltip
        width="200"
        align="center"
      >
        <template slot-scope="{ row, $index }">
          <HintButton
            size="mini"
            type="info"
            icon="el-icon-info"
            title="分配角色"
            @click.native="dispatchPower(row.id)"
          />
          <HintButton
            size="mini"
            type="primary"
            icon="el-icon-edit"
            title="修改用户"
            @click.native="updateRole(row, $index)"
            v-if="!row.isEdit"
          />
          <HintButton
            size="mini"
            type="danger"
            icon="el-icon-delete"
            title="删除用户"
            @click="deleteRole(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="5"
      layout="  prev, pager, next, jumper,->,sizes,total"
      :total="allUser.total"
      style="textAlign:center"
    >
    </el-pagination>
  </div>
</template>

<script>
import AddUser from "./addUser/index.vue";
import DispatchUser from "./dispatchRole/index.vue";
export default {
  name: "User",
  data() {
    return {
      page: 1,
      limit: 5,
      allUser: {}, //返回的用户数据列表
      form: {
        userName: ""
      }, //搜索框收集数据
      originRoleName: "",
      role: {}, //更新角色收集的数据
      dialogFormVisible: false, //添加对话框是否显示
      dispatchVisible:false,//分配角色对话框显示与否
      batchDeleteId: { data: [] } //批量要删除的id组成的数组
    };
  },
  mounted() {
    this.getAllUser();
  },
  components: {
    AddUser,
    DispatchUser
  },
  methods: {
    async getAllUser() {
      let res = await this.$API.user.getAllUser(
        this.page,
        this.limit,
        this.form.userName
      );
      if (res.code === 200 || res.code === 20000) {
        this.allUser = res.data;
      }
    }, //获取所有角色
    handleSizeChange(limit) {
      this.limit = limit;
      this.getAllUser();
    }, //处理分页器每页显示条数
    handleCurrentChange(page) {
      this.page = page;
      this.getAllUser();
    }, //处理分页器当前页数
    searchRole() {
      this.getAllUser();
    }, //按角色名查询角色
    clearSearch() {
      this.form.userName = "";
      this.getAllUser();
    }, //清空搜索框
    dispatchPower(id) {
      this.$router.push(`/permission/auth/${id}`);
    }, //带着自己的id跳转到分配权限界面申请获得自己对应的权限信息
    updateRole(row, index) {
      this.originRoleName = row.roleName;
      this.$set(row, "isEdit", true);
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    }, //修改角色名称
    async finishRole(row, index) {
      this.$set(row, "isEdit", false);
      this.role = { ...row };
      delete this.role.isEdit;
      if (row.roleName !== this.originRoleName) {
        try {
          let res = await this.$API.role.updateRole(this.role);
          if (res.code === 200 || res.code === 20000) {
            this.getAllUser();
          }
          this.$message.success("修改角色信息成功");
        } catch (error) {
          this.$message.error("修改角色信息失败了");
        }
      }
    }, //点确定发送请求重新获取角色列表
    cancelRoleChange(row) {
      this.$set(row, "isEdit", false);
      this.$message.info("已取消角色修改");
    }, //点击取消角色修改
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            try {
              let res = await this.$API.role.deleteRole(id);
              if (res.code === 200 || res.code === 20000) {
                this.$message.success("删除角色成功啦！");
              }
              this.getAllUser();
              done();
            } catch (error) {
              this.$message.error("删除角色失败啦！");
            }
          } else {
            this.$message.info("已取消删除！");
            done();
          }
        }
      });
    }, //点击删除角色
    addNewRole() {
      this.dialogFormVisible = true;
    }, //点击添加新角色
    async batchRemove() {
      try {
        let res = await this.$API.role.batchRemoveRole(this.batchDeleteId);
        if (res.code === 200 || res.code === 20000) {
          this.getAllUser();
          this.$message.success("批量删除成功！");
        }
      } catch (error) {
        this.$message.error("批量删除失败！");
      }
    }, //批量删除
    handleSelectionChange(val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item.id);
      });
      this.batchDeleteId.data = arr;
    } //收集选中的角色的id值
  }
};
</script>

<style></style>
