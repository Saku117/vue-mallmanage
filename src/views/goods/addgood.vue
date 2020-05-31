<!--
 * @Author: your name
 * @Date: 2020-05-29 16:58:17
 * @LastEditTime: 2020-05-30 21:14:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-mallmanage\src\views\goods\addgood.vue
--> 
<template>
  <el-card style="height:100%">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-alert class="alert" title="添加商品消息" type="success" center show-icon></el-alert>
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      style="height:400px;overflow:auto"
    >
      <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="selectedOptions"
              :options="options"
              :props="defaultProp"
              @change="handleChange"
              expand-trigger="hover"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDyparams" :key="i">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaticparams" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>
            <quill-editor class="editor" v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDyparams: [],
      checkList: [],
      arrStaticparams: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  components: {
    quillEditor
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    //添加商品 -发送请求
    async addGoods() {
      this.form.goods_cat = this.selectedOptions.join(",");
      //在发送请求之前，处理this.form中未处理数据
      let arr1 = this.arrDyparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      let arr2 = this.arrStaticparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.form.attrs = [...arr1, ...arr2];
      const res = await this.$http.post(`goods`, this.form);
      console.log(res.data.data.meta.msg);
			this.$router.push('/goods')
    },
    handlePreview(file) {
      console.log(file);
    },
    handleRemove(file) {
      let Index = this.from.pics.findIndex(item => {
        return item.pic === file.response.data.tem_path;
      });
      this.form.pics.splice(Index, 1);
      // this.form.pics.splice({
      // 	pic:file.data.tmp_path
      // })
    },
    handleSuccess(file) {
      this.form.pics.push({
        pic: file.data.tmp_path
      });
    },
    async tabChange() {
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请选择商品的三级分类");
          return;
        } else {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          this.arrDyparams = res.data.data;
          this.arrDyparams.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
        }
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请选择商品的三级分类");
          return;
        } else {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          this.arrStaticparams = res.data.data;
        }
      }
    },
    handleChange() {},
    // 获取三级分类的消息
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
    }
  }
};
</script>
<style scoped>
.alert {
  margin-top: 20px;
}
.editor {
  height: 300px;
}
</style>
