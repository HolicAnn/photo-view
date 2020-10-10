<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="(res, index) in list" :key="index" @click="go(res)">
        <div class="item">
          <p class="img"><img width="100%" :src="res.url" /></p>
          <p class="name" :title="res.name" style="font-size: 14px">
            {{ res.name }}
          </p>
        </div>
      </li>
    </ul>
    <transition name="fade">
       <my-img v-if="show" :info="data"></my-img>
    </transition>

  </div>
</template>

<script>
import MyImg from "./detail";
export default {
  components: {
    MyImg
  },
  name: "first",
  data() {
    return {
      list: [],
      title: "",
      data: {},
      show: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http.get("/admin/user/list").then((res) => {
        console.log(res);
        if (res && res.list) {
          this.list = res.list;
          this.title = res.title;
        }
      });
    },
    go(data) {
      this.data = data;
      console.log(this.data)
      this.show = true;
      // this.$router.push({
      //   path: "/detail/" + data._id,
      // });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  padding-bottom: 0;
}
ul {
  overflow: auto;
}
ul li {
  width: 50%;
  float: left;

  /* margin: 10px; */
  border-radius: 2px;
  text-align: center;
  display: block;
  cursor: pointer;
  box-sizing: border-box;
}
.item {
  margin: 10px;
  background: #fff;
  background: #f7e6cd;
}
ul li:hover {
  box-shadow: 2px 0px 4px 2px #eee;
}
.img {
  padding: 10px;
  background: #fff;
}
ul li img {
  height: 200px;
}
.name,
.memo {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.name {
  font-size: 20px;
  margin: 4px 0;
}
.memo {
  color: #827878;
}
.fade-enter-active, .fade-leave-active {
  transition: all .2s linear;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: scale(0.5);
  opacity:0.5
}
</style>
