<template>
  <div>
    <a-table :data-source="list">
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="名称" data-index="name"></a-table-column>
      <a-table-column title="开始时间" data-index="starttime"></a-table-column>
      <a-table-column title="结束时间" data-index="endtime"></a-table-column>
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="图片">
        <template slot-scope="scope">
          <img :src="scope.photo" />
        </template>
      </a-table-column>
      <!-- <a-table-column title="地址" data-index="url"></a-table-column> -->
      <a-table-column data-index="action">
        <template slot-scope="scope">
          <a-button size="small" style="margin-right:14px;">复制</a-button>
          <a-button type="primary" size="small" style="margin-right:14px;">编辑</a-button>
          <a-button type="danger" size="small">删除</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-row>
      <a-button type="primary" @click="add">新建</a-button>
    </a-row>
    <a-modal v-model="visible" :title="title" width="600px" @ok="handleOk">
      <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-item label="序号">
          <a-input v-model="form.seq"></a-input>
        </a-form-item>
        <a-form-item label="店名">
          <a-input v-model="form.seq"></a-input>
        </a-form-item>
        <a-form-item label="显示">
          <a-switch v-model="form.show"></a-switch>
        </a-form-item>
        <a-form-item label="区号">
          <a-input v-model="form.no"></a-input>
        </a-form-item>
        <a-form-item label="开始时间">
          <a-time-picker format="HH:mm" v-model="form.starttime"></a-time-picker>
        </a-form-item>
        <a-form-item label="结束时间">
          <a-time-picker format="HH:mm" v-model="form.endtime"></a-time-picker>
        </a-form-item>
        <a-form-item label="免运费距离(km)">
          <a-input v-model="form.freeDistance"></a-input>
        </a-form-item>
        <a-form-item label="超出运费($/km)">
          <a-input v-model="form.fee"></a-input>
        </a-form-item>
        <a-form-item label="图片">
          <a-upload
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="/admin/upload/"
            @change="handleChange"
          >
            <img v-if="form.photo" :src="form.photo" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="地址简介">
          <a-input v-model="form.address"></a-input>
        </a-form-item>
        <a-form-item label="地图位置">
          <gmap-map
            @click="clickMap"
            class="amap-demo"
            :center="{ lat: form.position[1], lng: form.position[0] }"
            :zoom="12"
            :clickable="true"
          >
            <gmap-marker :position="{ lat: form.position[1], lng: form.position[0] }"></gmap-marker>
          </gmap-map>
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
      list: [
        {
          seq: 1
        },
        {}
      ],
      visible: false,
      title: '新建',
      type: 'add',
      form: {
        name: '',
        show: false,
        no: '',
        address: '',
        starttime: '',
        endtime: '',
        photo: '',
        position: [121.5273285, 31.21515044],
        freeDistance: 5,
        fee: 0
      },
      // icon: require("../../assets/images/tea.png"),
      // amapManager: new AMapManager(),
      zoom: 12,
      center: { lng: 121.5273285, lat: 31.21515044 },
      loading: false
    }
  },
  methods: {
    clickMap(e) {
      this.form.position = [e.latLng.lng(), e.latLng.lat()]
      console.log(e.latLng.lat())
    },
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
        this.loading = false
        if (info.file.response && info.file.response.state == 200) {
          this.form['photo'] = info.file.response.url
        }
      }
      console.log(info, key)
    }
  }
}
</script>
<style scoped></style>

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
