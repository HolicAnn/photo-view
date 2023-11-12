<template>
  <div class="container">
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="(res, index) in list" :key="index" @click="go(res)">
        <p><img width="100%" style="object-fit:fill" :src="res.url" /></p>
        <p class="name" :title="res.name" style="font-size: 14px">
          {{ res.name }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "first",
  data() {
    return {
      list: [],
      title: "",
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
      this.$router.push({
        path: "/detail/" + data._id,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  text-align: center;
  padding: 30px 0;
  font-size: 50px;
}
ul {
  overflow: auto;
}
ul li {
  width: 39%;
  float: left;
  padding: 10px;
  background: #fff;
  margin: 10px;
  border-radius: 2px;
  text-align: center;
  display: block;
  cursor: pointer;
}
ul li:hover {
  box-shadow: 2px 0px 4px 2px #eee;
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
</style>
