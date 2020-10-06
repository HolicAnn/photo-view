<template>
  <div>
    <a-table :scroll="{ x: true}" :data-source="list" :pagination="page" @change="change">
      <a-table-column title="序号" data-index="seq"></a-table-column>
      <a-table-column title="名称" data-index="name"></a-table-column>
      <a-table-column title="开始时间" data-index="starttime"></a-table-column>
      <a-table-column title="结束时间" data-index="endtime"></a-table-column>
      <a-table-column title="免费距离" data-index="freeDistance"></a-table-column>
      <a-table-column title="超出运费($/km)" data-index="fee"></a-table-column>
      <a-table-column title="区号" data-index="no"></a-table-column>
      <a-table-column title="显示">
        <template slot-scope="scope">
          <a-icon
            v-if="scope.show"
            theme="twoTone"
            style="font-size:24px;"
            two-tone-color="#52c41a"
            type="eye"
          />
          <a-icon type="eye-invisible" v-else />
        </template>
      </a-table-column>
      <a-table-column title="地址" data-index="address"></a-table-column>
      <a-table-column title="图片">
        <template slot-scope="scope">
          <img height="60px" :src="scope.photo" />
        </template>
      </a-table-column>
      <a-table-column title="地址" data-index="url"></a-table-column>
      <a-table-column fixed="right">
        <template slot-scope="scope">
          <a-button size="small" style="margin-right:14px;" @click="copy(scope._id)">复制</a-button>
          <a-button type="primary" size="small" @click="edit(scope)" style="margin-right:14px;">编辑</a-button>
          <a-button type="danger" size="small" @click="del(scope._id)">删除</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-row style="margin:10px 0;">
      <a-button type="primary" @click="add">新建</a-button>
    </a-row>
    <a-modal class="modal" v-model="visible" :title="title" width="800px" @ok="handleOk">
      <a-form :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-item label="序号">
              <a-input v-model="form.seq"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="店名">
              <a-input v-model="form.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="显示">
              <a-switch v-model="form.show"></a-switch>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="区号">
              <a-input v-model="form.no"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开始时间">
              <a-time-picker
                style="width:100%"
                valueFormat="HH:mm"
                format="HH:mm"
                v-model="form.starttime"
              ></a-time-picker>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束时间">
              <a-time-picker
                style="width:100%"
                valueFormat="HH:mm"
                format="HH:mm"
                v-model="form.endtime"
              ></a-time-picker>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="免运费距离(km)">
              <a-input v-model="form.freeDistance"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="超出运费($/km)">
              <a-input v-model="form.fee"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="活动地址">
              <a-input v-model="form.url"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="地址简介">
              <a-input type="textarea" :rows="5" v-model="form.address"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
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
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 20 }" label="地图位置">
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
          </a-col>
        </a-row>
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
        fee: 0,
        seq: "",
        url:""
      },
      // icon: require("../../assets/images/tea.png"),
      // amapManager: new AMapManager(),

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
    clickMap(e) {
      this.form.position = [e.latLng.lng(), e.latLng.lat()]
    },
    getSearch() {
      this.$http.get("/admin/store/list?s=" + (this.page.current - 1) * this.page.pageSize + "&n=" + this.page.pageSize).then(res => {
        console.log(res)
        if (res) {
          this.list = res.data || []
          this.page.total = res.total || 0;
        }
      })
    },
    add() {
      this.visible = true
      this.title = '新建'
      this.type = 'add'
    },
    handleOk() {
      let url = ""
      if (this.type == "add") {
        url = "/admin/store/add"
      }
      if (this.type == "edit") {
        url = "/admin/store/edit"
      }
      this.$http.post(url, this.form).then(res => {
        if (res) {
          this.visible = false;
          this.form = {
            name: '',
            show: false,
            no: '',
            address: '',
            starttime: '',
            endtime: '',
            photo: '',
            position: [121.5273285, 31.21515044],
            freeDistance: 5,
            fee: 0,
            seq: "",
            url: ""
          }
          this.getSearch()
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
          this.form['photo'] = info.file.response.url
        }
      }
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
      this.form = this.deepClone(data);
      this.visible = true;
      this.type = "edit";
      this.title = "编辑"
    },
    copy(id) {
      this.$http.post("/admin/store/copy", {
        id,
      }).then(res => {
        if (res) {
          this.getSearch();
        }
      })
    },

    del(id) {
      this.$confirm({
        title: "提示",
        content: h => <div style="color:red;">确定删除当前数据</div>,
        onOk: () => {
          this.$http.post("/admin/store/del", {
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
  }
}
</script>
<style scoped>
.amap-demo {
  height: 250px;
}
.modal {
  top: 60px;
}
</style>

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
