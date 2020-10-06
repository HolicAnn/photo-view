<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="头部轮播图">
        <HeaderTab></HeaderTab>
      </a-tab-pane>
      <a-tab-pane key="2" tab="中部轮播图">
        <MiddleTab></MiddleTab>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import HeaderTab from "./header"
import MiddleTab from "./middle"
export default {
  components: {
    HeaderTab,
    MiddleTab
  },
  data() {
    return {

    }
  },
  methods: {

  },
}
</script>

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
</style>
