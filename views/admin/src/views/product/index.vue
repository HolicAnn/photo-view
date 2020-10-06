<template>
  <div>
    <a-tabs v-model="defaultKey" @change="change">
      <a-tab-pane key="1" tab="分类列表">
        <list-view @show="showTab"></list-view>
      </a-tab-pane>
      <a-tab-pane v-if="show && classifyId" key="2" tab="产品列表">
        <item-view :parentId="classifyId"></item-view>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ListView from './list'
import ItemView from './items'
export default {
  components: {
    ListView,
    ItemView
  },
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
        url: '',
        image: ''
      },
      loading: false,
      previewVisible: false,
      previewImage: '',
      imageUrl: '',
      show: false,
      classifyId: '',
      defaultKey: '1'
    }
  },
  methods: {
    add() {
      this.visible = true
      this.title = '新建'
      this.type = 'add'
    },
    handleOk() { },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      //  this.headerList = fileList;
    },
    showTab(data) {
      let { show, classifyId } = data
      this.show = show
      this.classifyId = classifyId
      this.$nextTick(() => {
        this.defaultKey = '2'
      })
    },
    change(key) {
      if (key == 1) {
        this.show = false
        this.classifyId = ''
      }
      console.log(key)
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
