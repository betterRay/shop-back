<template>
<el-dialog title="设置角色" :visible.sync="dispatchVisible">
  <el-form :model="form">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="form.userName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色列表" :label-width="formLabelWidth">
      
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
export default {
    name:'DispatchUser',
    data () {
        return {
            form:{
                userName:''
            },
            formLabelWidth:80
        }
    },
    props:['dispatchVisible'],

}
</script>

<style>

</style>