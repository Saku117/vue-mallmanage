<template>
  <div class="home">
    <el-container class="container">
      <el-header class="header">
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">图片</div>
          </el-col>
          <el-col :span="18">
            <!-- <div class="grid-content bg-purple-light"> -->
            <h3 class="middle">电商后台管理系统</h3>
            <!-- </div> -->
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <a class="loginout" href="javascript:;" @click.prevent="handleSignout()">退出</a>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside class="aside" width="200px">
          <el-menu :unique-opened="true" :router="true">
            <el-submenu :index="''+item1.order" v-for="(item1,index) in menus" :key="index">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.authName}}</span>
              </template>
              <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">
                <i class="el-icon-user-solid"></i>{{item2.authName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data() {
    return {
      menus: []
    };
  },
  //进入首页的权限验证
  beforeCreate() {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   this.$router.push({ name: "Login" });
    // }
  },
  created() {
    this.getMenus();
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      this.menus = res.data.data;
    },
    handleSignout() {
      localStorage.removeItem("token");
      this.$message.success("退出成功");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style>
.home {
  height: 100%;
}
.el-header {
  padding: 0 !important;
}
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
.middle {
  text-align: center;
}
.loginout {
  text-decoration: none;
  line-height: 60px;
}
</style>
