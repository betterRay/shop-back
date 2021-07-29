<template>
  <div>
    <el-table
      :data="menuInfo.children"
      style="width: 100%;marginTop: 20px;"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称"> </el-table-column>

      <el-table-column prop="code" label="权限值"> </el-table-column>

      <el-table-column label="跳转权限值"> </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <HintButton
            title="添加菜单"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            :disabled="row.level === 4"
            @click="addMenu(row)"
          />
          <HintButton
            title="修改菜单"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            :disabled="row.level === 1"
            @click="updateMenu(row)"
          />
          <HintButton
            title="删除"
            size="mini"
            type="danger"
            :disabled="row.level === 1"
            @click="deleteMenu(row)"
            icon="el-icon-delete"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改菜单" :visible.sync="updateDialogFormVisible">
      <el-form :model="Menu" label-width="100px" ref="ruleForm1" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="Menu.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="Menu.code" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpdateMenu('ruleForm1')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="添加菜单" :visible.sync="addDialogFormVisible">
      <el-form :model="Menu" label-width="100px" :rules="rules" ref="ruleForm2">
        <el-form-item
          label="父级名称"
          v-if="fatherLevel !== 1"
        >
          <el-input v-model="fatherName" autocomplete="off" disabled></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="Menu.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="功能权限值" prop="code">
          <el-input v-model="Menu.code" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddMenu('ruleForm2')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Menu",
  data() {
    return {
      menuInfo: [],
      addDialogFormVisible: false,
      updateDialogFormVisible: false,
      fatherName: "",
      fatherLevel: "",
      Menu: {
        children: [{}],
        code: "",
        deleted: false,
        gmtCreate: "",
        gmtModified: "",
        id: "",
        level: 0,
        name: "",
        pid: "",
        select: true,
        status: 0,
        toCode: "",
        type: 0
      },
      rules: {
          name: [
            { required: true, message: '必须输入名称', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '必须输入功能权限值', trigger: 'blur' }
          ]
        }
    };
  },
  mounted() {
    this.getmenu();
  },
  methods: {
    async getmenu() {
      let res = await this.$API.menu.getmenu();
      if (res.code === 200 || res.code === 20000) {
        this.menuInfo = res.data;
      } else {
        alert("获取菜单失败了");
      }
    }, //获取所有菜单
    addMenu(row) {
      this.fatherName = row.name;
      this.fatherLevel = row.level;
      this.Menu = {
        // children: [{}],
        code: "",
        // deleted: false,
        // gmtCreate: new Date()+'',
        // gmtModified: new Date()+'',
        id: "",
        level: row.level + 1,
        name: "",
        pid: row.id + "",
        // select: true,
        status: 0,
        toCode: "",
        type: 1
      };
      this.addDialogFormVisible = true;
      console.log(row);
    }, //添加菜单
    async updateMenu(row) {
      this.updateDialogFormVisible = true;
      this.Menu = cloneDeep(row);
    }, //点击更新菜单
    confirmUpdateMenu(formName) {
      this.$refs[formName].validate(async(valid) => {
        console.log(valid)
          if (valid) {
            alert('提交成功!');
            this.updateDialogFormVisible = false;
              try {
                let res = await this.$API.menu.updateMenu(this.Menu);
                this.getmenu();
              } catch (error) {
                this.$message.warning("修改菜单失败了！");
              }
          } else {
            console.log('error submit!!');
            return false;
          }
        });

    }, //点击确认更新
    confirmAddMenu(formName) {
      this.$refs[formName].validate(async(valid) => {
          if (valid) {
            alert('提交成功!');
            this.addDialogFormVisible = false;
              try {
                let res = await this.$API.menu.addMenu(this.Menu);
                this.getmenu();
              } catch (error) {
                this.$message.warning("添加菜单失败了！");
              }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }, //点击确认添加菜单
    deleteMenu(row) {
      this.$confirm("此操作将永久删除该菜单项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async(action, instance, done) => {
          if (action === "confirm") {
              await this.$API.menu.deleteMenu(row.id)
              this.getmenu()
              done();
          } else {
            done();
          }
        }
      }).then(action => {
        this.$message({
          type: "success",
          message: "删除菜单项成功了！"
        });
      });
    } //删除菜单属性
  }
};
</script>

<style></style>
