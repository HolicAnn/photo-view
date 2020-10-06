<template>
  <div>
    <a-table :data-source="list" :pagination="false">
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="图片">
        <template slot-scope="scope">
          <img :src="scope.url" height="100px" />
        </template>
      </a-table-column>
      <a-table-column title="地址" data-index="href"></a-table-column>
      <a-table-column>
        <template slot-scope="scope">
          <a-button type="primary" size="small" @click="edit(scope)" style="margin-right:14px;">编辑</a-button>
          <a-button type="danger" size="small" @click="del(scope)">删除</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="margin:10px 0;">
      <a-button type="primary" @click="add">新建</a-button>
    </a-row>
    <a-modal v-model="visible" :title="title" @ok="handleOk">
      <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
        <a-form-item label="序号">
          <a-input v-model="form.seq"></a-input>
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model="form.href"></a-input>
        </a-form-item>
        <a-form-item label="图片">
          <a-upload
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/admin/upload/"
            @change="handleChange"
          >
            <img width="100%" v-if="form.url" :src="form.url" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      list: [],
      visible: false,
      title: "新建",
      type: "add",
      form: {
        seq: "",
        url: "",
        href: ""
      },
    }
  },
  mounted() {
    this.getSearch();
  },
  methods: {
    add() {
      this.visible = true;
      this.title = "新建";
      this.type = "add";
      this.form = {
        seq: "",
        url: "",
        href: ""
      };
    },
    getSearch() {
      this.$http.get("/admin/links/list").then(res => {
        console.log(res)
        if (res) {
          this.list = res.data || []
        }
      })
    },

    handleOk() {
      let url = ""
      if (this.type == "add") {
        url = "/admin/links/add"
      } else if (this.type == 'edit') {
        url = "/admin/links/edit"
      }
      this.$http.post(url, {
        ...this.form,
      }).then(res => {
        this.visible = false;
        this.getSearch();
      })

    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        this.loading = false;
        if (info.file.response && info.file.response.state == 200) {
          this.form.url = info.file.response.url;
        }
      }
    },
    isClass(o) {
      if (o === null) return "Null";
      if (o === undefined) return "Undefined";
      return Object.prototype.toString.call(o).slice(8, -1);
    },
    deepClone(obj) {
      var result, oClass = this.isClass(obj);
      if (oClass === "Object") {
        result = {};
      } else if (oClass === "Array") {
        result = [];
      } else {
        return obj;
      }
      for (let key in obj) {
        var copy = obj[key];
        if (this.isClass(copy) == "Object") {
          result[key] = this.deepClone(copy);//递归调用
        } else if (this.isClass(copy) == "Array") {
          result[key] = this.deepClone(copy);
        } else {
          result[key] = obj[key];
        }
      }
      return result;

    },
    edit(data) {
      this.visible = true;
      this.title = "编辑";
      this.type = "edit";
      this.form = this.deepClone(data);
    },
    del(id) {
      console.log(id)
      this.$confirm({
        title: "提示",
        content: h => <div style="color:red;">确定删除当前数据</div>,
        onOk: () => {
          this.$http.post("/admin/links/del", {
            id
          }).then(res => {
            if (res) {

              this.getSearch();
            }
          })
        },
        onCancel() {

        },
      });
    }

  },
}
</script>

<style scoped >
</style>

<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-upload-list-picture-card-container {
  width: 100%;
  height: auto;
}

.ant-upload-list-picture-card .ant-upload-list-item {
  height: 160px;
  width: 100%;
}

.ant-form-item-control {
  line-height: auto;
}
</style>
