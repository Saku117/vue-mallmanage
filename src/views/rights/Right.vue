<!--
 * @Author: your name
 * @Date: 2020-05-28 13:17:34
 * @LastEditTime: 2020-05-28 15:29:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vue-MallManage\src\views\rights\Right.vue
--> 
<template>
  <div id="right">
    <el-card class="box-cart">
      <my-bread level1="权限管理" level2="权限列表"></my-bread>
      <el-table 
       class="rightTable" height="400px" :data="rightlist" border style="width: 100%">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="240"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="层级">
          <template slot-scope="scope">
            <span v-if="scope.row.level==='0'">一级</span>
            <span v-if="scope.row.level==='1'">二级</span>
            <span v-if="scope.row.level==='2'">三级</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Right",
  data() {
    return {
      rightlist: []
    };
  },
  created() {
    this.getRightlist();
  },
  methods: {
    async getRightlist() {
      const res = await this.$http.get(`rights/list`);
      // console.log(res);
      this.rightlist = res.data.data;
    }
  }
};
</script>
<style scoped>
.right {
  height: 100%;
}
.box-cart {
  height: 100%;
}
.rightTable{
  margin-top: 20px;
}
</style>