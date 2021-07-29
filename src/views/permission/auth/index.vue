<template>
  <div>
    <el-tree
      :data="roleMenu.children"
      show-checkbox
      node-key="id"
      ref="tree"
      default-expand-all
      :default-checked-keys="defaultCheckedId"
      :props="defaultProps"
      style="marginBottom:20px"
    >
    </el-tree>

    <el-button type="primary" @click="saveMenuOfRole">保存</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</template>

<script>
export default {
  name: "Auth",
  data() {
    return {
      roleId:'',  
      roleMenu: {},
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultCheckedId: []
    };
  },
  beforeMount() {
      this.roleId=this.$route.params.id
  },
  mounted() {
    this.getMenuByRoleId(this.roleId);
  },
  methods: {
    async getMenuByRoleId(roleId) {
      try {
        let res = await this.$API.auth.getMenuByRoleId(roleId);
        if (res.code === 200 || res.code === 20000) {
          this.roleMenu = res.data;
        }
        this.getDefaultCheckedId(this.roleMenu.children);
      } catch (error) {}
    }, //根据对应角色id获取其菜单权限
    getDefaultCheckedId(arr) {
      return arr.forEach(item => {
          this.getDefaultCheckedId(item.children);
          if (item.children.length === 0&&item.select === true) {
            this.defaultCheckedId.push(item.id);
          }
        
      });
    }, //递归遍历层层收集数组对象中select为true的id值！！
    async saveMenuOfRole(){
        let permissionId=this.$refs.tree.getCheckedKeys() 
        try {
            let res = await this.$API.auth.updateMenuByRoleId(this.roleId,permissionId)
                if(res.code===200||res.code===20000){
                    this.$message.success('保存修改成功了！')
                }
                this.$router.push('/permission/role')
        } catch (error) {
            this.$message.error('保存修改出错了！')
        }
    },//按下保存之后发请求保存，并且成功后跳转路由
    cancel(){
        this.$router.push('/permission/role')
    }
  },
  watch: {
    roleMenu(newV, oldV) {} //监测roleMenu变化后，开始启动筛选
  }
};
</script>

<style></style>
