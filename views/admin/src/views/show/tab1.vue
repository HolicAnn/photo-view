<template>
  <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
    <a-form-item label="图片">
      <a-upload
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        action="/admin/upload/"
        @change="handleChange"
      >
        <img style="width:100%" v-if="form.url" :src="form.url" alt="avatar" />
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </a-form-item>
    <a-form-item label="跳转地址">
      <a-input v-model="form.href"></a-input>
    </a-form-item>
    <a-form-item label="显示">
      <a-switch v-model="form.show" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 2 }">
      <a-button :loading="loading" type="primary" @click="submit">确定</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        url: "",
        href: "",
        show: false,
        type: 1
      },
    }
  },
  mounted() {
    this.getBaseInfo();
  },
  methods: {
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        this.loading = false;
        if (info.file.response && info.file.response.state == 200) {
          this.form["url"] = info.file.response.url;
        }
      }
    },
    submit() {
      this.loading = true;
      this.$http.post("/admin/show/edit", this.form).then(res => {
      }).finally(() => {
        this.loading = false;
      })
    },
    getBaseInfo() {
      this.$http.get("/admin/show/detail?type=1").then(res => {
        if (res && res.data) {
          for (let key in this.form) {
            this.form[key] = res.data[key]
          }
        }
      })
    }
  },
}
</script>

<style>
.avatar-uploader > .ant-upload {
  width: 100%;
  height: 100%;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
