<template>
  <div class="container">
    <div class="header">
      <span class="back" @click="back"> <img src="../assets/back.png" />返回</span>
    </div>
    <h3 class="title">{{ info.name }}</h3>
    <p class="header-img"><img width="100%" :src="info.url" /></p>

    <vue-markdown v-if="info && info.text" @rendered="rendered" class="markdown-body">{{
      info.text
    }}</vue-markdown>
    <!-- <vue-markdown class="markdown-body">{{ info.text }}</vue-markdown> -->
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import "../assets/css/github-markdown.min.css";
export default {
  name: "first",
  components: {
    VueMarkdown,
  },
  data() {
    return {
      info: null,
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$http.get("/admin/user/detail?id=" + this.$route.params.id).then((res) => {
        console.log(res);
        if (res && res.data) {
          this.info = res.data;
        }
      });
    },
    back() {
      this.$router.replace({
        path: "/",
      });
    },
    rendered(html) {
      var a = document.querySelectorAll(".markdown-body a");
      a.forEach((item) => {
        item.setAttribute("target", "_blank");
      });
      var imgs = document.querySelectorAll(".markdown-body img");
      imgs.forEach((d) => {
        d.addEventListener("click", (ev) => {
          console.log(ev);
          window.open(d.src, "_blank");
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .container {
  text-align: center;
} */

.headr-img {
  width: 100%;
  margin-bottom: 20px;
}
.title {
  font-size: 20px;
  margin: 4px 0;
  margin-bottom: 10px;
  text-align: center;
}
.header {
  text-align: left;
  padding: 10px 8px;
  background-color: #fefbfb;
  margin-bottom: 20px;
  color: #4b4848;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
}
.markdown-body {
  background: unset;
  padding: 20px 10px;
}
.back {
  display: flex;
  align-items: center;
}
.back img {
  width: 24px;
  margin-right: 4px;
}
/* .back {
  display: inline-block;
  padding: 6px;
  background: #fff;
  border-radius: 4px;
  margin: 8px;
} */
</style>
