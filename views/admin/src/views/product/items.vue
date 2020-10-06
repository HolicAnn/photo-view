<template>
  <div>
    <a-table :data-source="list" :pagination="page" @change="change">
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="图片">
        <template slot-scope="scope">
          <img :src="scope.thumb" height="100px" />
        </template>
      </a-table-column>
      <a-table-column title="名称" data-index="title"></a-table-column>
      <a-table-column title="描述" data-index="desc"></a-table-column>
      <a-table-column title="背景色" data-index="background_color"></a-table-column>
      <a-table-column>
        <template slot-scope="scope">
          <a-button type="primary" size="small" style="margin-right:14px;" @click="edit(scope)">编辑</a-button>
          <a-button type="danger" size="small" @click="del(scope._id)">删除</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="margin:10px 0;">
      <a-button type="primary" @click="add">新建</a-button>
    </a-row>
    <a-modal v-model="visible" :title="title" width="600px" @ok="handleOk">
      <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-item label="序号">
          <a-input v-model="form.seq"></a-input>
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-model="form.title"></a-input>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-model="form.desc"></a-input>
        </a-form-item>
        <a-form-item label="链接">
          <a-input v-model="form.url"></a-input>
        </a-form-item>
        <a-form-item label="背景色">
          <a-input v-model="form.background_color"></a-input>
        </a-form-item>
        <a-form-item label="图片">
          <a-upload
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/admin/upload/"
            @change="handleChange"
          >
            <img v-if="form.thumb" :src="form.thumb" alt="avatar" />
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
  props: ["parentId"],
  data() {
    return {
      loading: false,
      list: [
      ],
      visible: false,
      title: '新建',
      type: 'add',
      form: {
        seq: '',
        title: "",
        background_color: "",
        desc: "",
        thumb: "",
        url: ""
      },
      loading: false,
      page: {
        pageSize: 15,
        total: 0,
        current: 1
      },
    }
  },
  mounted() {
    this.getSearch();
  },
  methods: {
    add() {
      this.visible = true
      this.title = '新建'
      this.type = 'add'
      this.form = {
        seq: '',
        title: "",
        background_color: "",
        desc: "",
        thumb: "",
        url: ""
      };

    },
    handleOk() {
      let url = "/admin/product/add"
      this.form.parentId = this.parentId;
      if (this.type == "edit") {
        url = "/admin/product/edit"
      }
      this.$http.post(url, this.form).then(res => {
        if (res) {
          this.visible = false;
          this.getSearch();
        }
      })
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response && info.file.response.state == 200) {
          this.form['thumb'] = info.file.response.url
        }
      }
    },
    getSearch() {
      this.$http.get("/admin/product/list?type=1&s=" + (this.page.current - 1) * this.page.pageSize + "&n=" + this.page.pageSize + "&parentId=" + this.parentId).then(res => {
        if (res) {
          this.list = res.data || []
          this.page.total = res.total || 0;
        }
      })
    },

    change({ current }) {
      this.page.current = current;
      this.getSearch();
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
      this.type = "edit";
      this.form = this.deepClone(data);
      this.visible = true
      this.title = '编辑'
    },
    del(id) {
      console.log(id)
      this.$confirm({
        title: "提示",
        content: h => <div style="color:red;">确定删除当前数据</div>,
        onOk: () => {
          this.$http.post("/admin/product/del", {
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
  }
}
</script>
<style scoped></style>

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
