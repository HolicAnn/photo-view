<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="中部广告图">
        <Tab1></Tab1>
      </a-tab-pane>
      <a-tab-pane key="2" tab="品牌信息图">
        <Tab2></Tab2>
      </a-tab-pane>
      <a-tab-pane key="3" tab="链接信息图">
        <Tab3></Tab3>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Tab3 from './tab3'
import Tab1 from './tab1'
import Tab2 from './tab2'
export default {
  components: {
    Tab3,
    Tab1,
    Tab2
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: "新建",
      type: "add",
      form: {
        seq: "",
        url: "",
        image: ""
      },
      loading: false,
      previewVisible: false,
      previewImage: '',
      imageUrl: ""
    }
  },
  methods: {
    add() {
      this.visible = true;
      this.title = "新建";
      this.type = "add";
    },
    handleOk() {

    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
      }
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      //  this.headerList = fileList;
    },

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
