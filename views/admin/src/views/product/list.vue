<template>
  <div>
    <a-table :pagination="false" :data-source="list" @change="change">
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="图片">
        <template slot-scope="scope">
          <img :src="scope.url" height="100px" />
        </template>
      </a-table-column>
      <a-table-column title="名称" data-index="name"></a-table-column>
      <a-table-column>
        <template slot-scope="scope">
          <a-button
            type="primary"
            size="small"
            style="margin-right: 14px"
            @click="edit(scope)"
            >编辑</a-button
          >
          <a-button type="danger" size="small" @click="del(scope._id)">删除</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="margin: 10px 0">
      <a-button type="primary" @click="add">新建</a-button>
    </a-row>
    <a-modal v-model="visible" :title="title" width="700px" @ok="handleOk">
      <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
        <a-form-item label="序号">
          <a-input v-model="form.seq"></a-input>
        </a-form-item>

        <a-form-item label="名称">
          <a-input v-model="form.name"></a-input>
        </a-form-item>

        <a-form-item label="描述">
          <v-md-editor
            v-model="form.text"
            height="400px"
            :left-toolbar="leftToolbar"
            :right-toolbar="rightToolbar"
            :toolbar="toolbar"
            mode="edit"
            ref="editor"
            @change="changeEd($event)"
          ></v-md-editor>
          <!-- <a-input v-model="form.memo"></a-input> -->
        </a-form-item>

        <a-form-item label="图片">
          <a-upload
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            name="filepath"
            action="/admin/user/upload/"
            @change="handleChange"
          >
            <img v-if="form.filepath" :src="form.filepath" alt="avatar" />
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
        name: "",
        text: "",
        filepath: "",
      },
      loading: false,
      page: {
        pageSize: 15,
        total: 0,
        current: 1,
      },
      editor: null,
      leftToolbar:
        "h bold italic strikethrough quote | ul ol table hr | link customToolbar2 customToolbar1 code",
      rightToolbar: "preview sync-scroll	 fullscreen",
      toolbar: {
        customToolbar1: {
          title: "附件",
          icon: "icon-attachment",
          action(editor) {
            // Bus.$emit("openUploader", {
            //   // 传入的参数
            //   target: "/dput/dmessage/upload",
            // });
            self.$el.style.cursor = "wait";
            self.$el.querySelector(".v-md-textarea-editor textarea").style.cursor =
              "wait";
          },
        },
        customToolbar2: {
          title: "图片链接",
          icon: "v-md-icon-img",
          action(editor) {
            editor.insert((selected) => {
              return {
                text: "![image.png](http://)",
              };
            });
            // Bus.$emit("openUploader", {
            //   // 传入的参数
            //   target: "/dput/dmessage/upload",
            // });
          },
        },
        //v-md-icon-img
      },
    };
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
        name: "",
        text: "",
        filepath: "",
      };
    },
    changeEd(text) {
      this.form.text = text;
    },
    handleOk() {
      let url = "/admin/user/add";
      if (this.type == "edit") {
        url = "/admin/user/edit";
      }
      this.$http.post(url, this.form).then((res) => {
        if (res) {
          this.visible = false;
          this.getSearch();
        }
      });
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        this.loading = false;
        console.log(info.file.response);
        if (info.file.response && info.file.response.state == 200) {
          this.form["filepath"] = info.file.response.url;
        }
      }
    },

    getSearch() {
      this.$http.get("/admin/user/list").then((res) => {
        if (res) {
          this.list = res.list || [];
          //   this.page.total = res.total || 0;
        }
      });
    },

    change({ current }) {
      this.page.current = current;
      this.getSearch();
    },
    edit(data) {
      this.type = "edit";
      this.form = this.deepClone(data);
      this.form.filepath = data.url;
      this.visible = true;
      this.title = "编辑";
    },
    isClass(o) {
      if (o === null) return "Null";
      if (o === undefined) return "Undefined";
      return Object.prototype.toString.call(o).slice(8, -1);
    },
    deepClone(obj) {
      var result,
        oClass = this.isClass(obj);
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
          result[key] = this.deepClone(copy); //递归调用
        } else if (this.isClass(copy) == "Array") {
          result[key] = this.deepClone(copy);
        } else {
          result[key] = obj[key];
        }
      }
      return result;
    },
    del(id) {
      console.log(id);
      this.$confirm({
        title: "提示",
        content: (h) => <div style="color:red;">确定删除当前数据</div>,
        onOk: () => {
          this.$http
            .post("/admin/user/delete", {
              id,
            })
            .then((res) => {
              if (res) {
                this.getSearch();
              }
            });
        },
        onCancel() {},
      });
    },
  },
};
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
