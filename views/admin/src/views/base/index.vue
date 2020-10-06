<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="基本配置">
        <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
          <a-form-item label="LOGO">
            <a-upload
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="/admin/upload/"
              @change="
                res => {
                  return handleChange(res, 'logo')
                }
              "
            >
              <img v-if="form.logo" :src="form.logo" alt="avatar" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item label="背景颜色">
            <a-input v-model="form.background_color"></a-input>
          </a-form-item>
          <a-form-item label="悬浮按钮">
            <a-upload
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="/admin/upload/"
              @change="
                res => {
                  return handleChange(res, 'float')
                }
              "
            >
              <img v-if="form.float" :src="form.float" alt="avatar" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item label="按钮链接">
            <a-input v-model="form.url"></a-input>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 2 }">
            <a-button :loading="loading1" type="primary" @click="submit">确定</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <!-- <a-tab-pane key="2" tab="左侧菜单配置"></a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        logo: '',
        background_color: '',
        float: '',
        url: ''
      },
      loading1: false
    }
  },
  mounted() {
    this.getBaseInfo()
  },
  methods: {
    handleChange(info, key) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
        console.log(this.form[key])
        if (info.file.response && info.file.response.state == 200) {
          this.form[key] = info.file.response.url
          console.log(this.form[key])
        }
      }
      console.log(info, key)
    },
    submit() {
      this.loading1 = true
      this.$http
        .post('/admin/basic/edit', this.form)
        .then(res => {})
        .finally(() => {
          this.loading1 = false
        })
    },
    getBaseInfo() {
      this.$http.get('/admin/basic/detail').then(res => {
        if (res && res.data) {
          for (let key in this.form) {
            this.form[key] = res.data[key]
          }
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
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
