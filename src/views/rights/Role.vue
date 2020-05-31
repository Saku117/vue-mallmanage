<template>
  <el-card>
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row class="addrolebtn">
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag @close="deleteRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="deleteRight(scope.row,item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleteRight(scope.row,item3.id)"
                    closable
                    type="warning"
                    v-for="(item3,i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button
            @click="showSetRightDia(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  修改权限（弹出） -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <el-tree
        ref="tree"
        :data="righttree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrtemp1"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      rolelist: [],
      dialogFormVisibleRight: false,
      defaultProps: {
        label: "authName",
        children: "children"
      },
      righttree: [],
      arrtemp1: [],
      currRoleId: -1
    };
  },
  created() {
    this.getRolelist();
  },
  methods: {
    async setRoleRight() {
      //roleId 当前要修该权限的角色ID
      //目前被选中的节点的 key 所组成的数组 getCheckedKeys()
      let arr1 = this.$refs.tree.getCheckedKeys();
      //目前半选中的节点所组成的数组 getHalfCheckedNodes()
      let arr2 = this.$refs.tree.getHalfCheckedNodes();
      var arr = arr1.concat(arr2);
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      this.$message.success(res.data.meta.msg);
      this.getRolelist();
      this.dialogFormVisibleRight = false;
    },
    async showSetRightDia(role) {
      this.currRoleId = role.id;
      let arrtemp2 = [];
      role.children.forEach(item1 => {
        arrtemp2.push(item1.id);
        item1.children.forEach(item2 => {
          arrtemp2.push(item2.id);
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id);
          });
        });
      });
      this.arrtemp1 = arrtemp2;
      const res = await this.$http.get(`rights/tree`);
      //   res.then(res => {
      //     this.righttree = res.data.data;
      //   });
      this.righttree = res.data.data;
      this.dialogFormVisibleRight = true;
    },
    async deleteRight(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      role.children = res.data.data;
    },
    async getRolelist() {
      const res = await this.$http.get(`roles`);
      this.rolelist = res.data.data;
    }
  }
};
</script>

<style>
.addrolebtn {
  margin-top: 20px;
}
</style>