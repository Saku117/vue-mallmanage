<template>
  <div>
    <!--  面包屑 -->
    <el-card class="box-cart">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索行 -->
      <el-row class="searchRow">
        <el-col>
          <el-input
            @clear="loadUserList()"
            clearable
            laceholder="请输入内容"
            v-model="query"
            class="inputSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
          </el-input>
          <el-button type="success" @click="showAddUserDia">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="userlist">{{userlist.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch
            @change="changeMgState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetUserRoleDia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户(弹出) -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户(弹出) -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户状态(弹出) -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.username" autocomplete="off"></el-input> -->
          {{form.username}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option :label="item.roleName" :value="i" v-for="(item,i) in roleList" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "User",
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 4,
      userlist: [],
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      currRoleId: "",
      roleList: [],
      currUsername: "",
      currUserId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async editUserRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleRole = false;
        this.$message.success(msg);
      }
    },
    async getAllRole() {
      const res = await this.$http.get(`roles`);
      this.roleList = res.data.data;
      // console.log(this.roleList);
    },
    async showSetUserRoleDia(user) {
      this.dialogFormVisibleRole = true;
      this.form = user;
      this.currUsername = this.form.username;
      this.getAllRole();
      // console.log(this.form);
      this.currUserId = user.id;
      const res = await this.$http.get(`users/${user.id}`);
      this.currRoleId = res.data.data.rid;
      // this.currUserId
    },
    //修改状态
    async changeMgState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
      this.getUserList();
    },
    //编辑用户---发送请求
    async editUser() {
      const res = this.$http.put(`users/${this.form.id}`, this.form);
      console.log(res);
      res.then(res => {
        const {
          meta: { status, msg }
        } = res.data;
        if (status === 200) {
          this.dialogFormVisibleEdit = false;
          this.$message.success(msg);
        }
      });
    },
    showEditUserDia(user) {
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    //删除用户--打开消息盒子
    showDeleUserMsgBox(userId) {
      this.$confirm("删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`);
          console.log(res);
          const {
            meta: { status, msg }
          } = res.data;
          if (status === 200) {
            this.getUserList();
            this.$message({
              type: "success",
              message: msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //添加用户--接口
    async addUser() {
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post(`users`, this.form);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.getUserList();
        // for(const key in this.form){
        //   if(Object.prototype.hasOwnProperty.call(this.form,key)){
        //     this.form[key]="";
        //   }
        // }
        this.form = {};
      } else {
        this.$message.warning(msg);
      }
    },
    //添加用户
    showAddUserDia() {
      this.dialogFormVisibleAdd = true;
    },
    loadUserList() {
      this.getUserList();
    },
    searchUser() {
      this.getUserList();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getUserList();
    },
    async getUserList() {
      const res = this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //   console.log();
      res.then(res => {
        const {
          meta: { status, msg },
          data: { users, total }
        } = res.data;

        if (status === 200) {
          this.userlist = users;
          this.total = total;
          // this.$message.success(msg);
        } else {
          this.$message.warning(msg);
        }
      });
    }
  }
};
</script>

<style scoped>
.box-cart {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>