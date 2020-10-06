<template>
  <div>
    <a-form layout="inline" style="margin-bottom:10px;">
      <a-form-item label="轮播时间">
        <a-input v-model.lazy="duration"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="setDuration">确定</a-button>
      </a-form-item>
    </a-form>
    <a-table :data-source="list" :pagination="page" @change="change">
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="图片">
        <template slot-scope="scope">
          <img :src="scope.url" height="100px" />
        </template>
      </a-table-column>
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
      },
      page: {
        pageSize: 15,
        total: 0,
        current: 1
      },
      duration: ""
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
      }
    },
    getSearch() {
      this.$http.get("/admin/swiper/list?type=2&s=" + (this.page.current - 1) * this.page.pageSize + "&n=" + this.page.pageSize).then(res => {
        console.log(res)
        if (res) {
          this.list = res.data || []
          if (res.data.length >= 1) {
            this.duration = res.data[0].duration || ""
          }

          this.page.total = res.total || 0;
        }
      })
    },
    setDuration() {
      this.$http.post("/admin/swiper/setDuration", {
        duration: this.duration,
        type: 2
      }).then(res => {
        this.visible = false;
        this.page.current = 1;
        this.getSearch();
      })
    },
    handleOk() {
      if (this.type == "add") {
        this.$http.post("/admin/swiper/add", {
          ...this.form,
          type: 2
        }).then(res => {
          this.visible = false;
          this.getSearch();
        })
      } else if (this.type == "edit") {
        this.$http.post("/admin/swiper/edit", {
          ...this.form,
          type: 2,
        }).then(res => {
          this.visible = false;
          this.getSearch();
        })
      }


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
    change({ current }) {
      this.page.current = current;
      this.getSearch();
    },
    edit(data) {
      this.form = this.deepClone(data);
      this.visible = true;
      this.type = "edit";
      this.title = "编辑"
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
    del(id) {
      console.log(id)
      this.$confirm({
        title: "提示",
        content: h => <div style="color:red;">确定删除当前数据</div>,
        onOk: () => {
          this.$http.post("/admin/swiper/del", {
            id
          }).then(res => {
            if (res) {
              this.page.current = 1;
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
