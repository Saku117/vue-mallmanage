<!--
 * @Author: your name
 * @Date: 2020-05-29 15:47:16
 * @LastEditTime: 2020-05-29 17:01:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-mallmanage\src\views\goods\goods.vue
--> 
<template>
  <el-card>
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-row class="searchRow">
      <el-col>
        <el-input
          @clear="loadGoodsList()"
          clearable
          laceholder="请输入内容"
          v-model="query"
          class="inputSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchGoods()"></el-button>
        </el-input>
        <el-button type="success" @click="$router.push({name:'addgood'})">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="goodslist" style="width: 100% " height="400px">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="goods_name" label="姓名"></el-table-column>
      <el-table-column prop="goods_price" label="价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="goodslist">{{goodslist.row.add_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditGoodsDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleGoodsMsgBox(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑商品(弹出) -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="商品" :label-width="formLabelWidth">
          <el-input disabled v-model="form.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量" :label-width="formLabelWidth">
          <el-input v-model="form.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-input v-model="form.goods_cat" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editGood()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  name: "goods",
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 40,
      goodslist: [],
      total: "",
      form: {
        goods_id: "",
        goods_name: "",
        goods_cat:"",
        goods_price: "",
        goods_weight: "",
        goods_number:""
      },
      formLabelWidth: "100px",
      dialogFormVisibleEdit: false
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async editGood() {
      const res = await this.$http.put(
        `goods/${this.form.goods_id}`,
        this.form
      );
      this.$message.success(res.data.meta.msg)
      this.dialogFormVisibleEdit=false
    },
    showEditGoodsDia(good) {
      this.dialogFormVisibleEdit = true;
      this.form = good;
    },
    showDeleGoodsMsgBox(goodId) {
      this.$confirm("删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`goods/${goodId}`);
          // console.log(res);
          const {
            meta: { status, msg }
          } = res.data;
          if (status === 200) {
            this.getGoodsList();
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
    searchGoods() {
      this.getGoodsList();
    },
    loadGoodsList() {
      this.getGoodsList();
    },
    showAddUserDia() {},
    async getGoodsList() {
      const res = this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //   console.log();
      res.then(res => {
        const {
          meta: { status, msg },
          data: { goods, total }
        } = res.data;
        // console.log(res.data);
        if (status === 200) {
          this.goodslist = goods;
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

<style>
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>