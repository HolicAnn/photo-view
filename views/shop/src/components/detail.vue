<template>
  <div class="container">
    <h2>{{ info.name }}</h2>
    <p><img width="100%" :src="info.url" /></p>
    <p class="memo" :title="info.memo">{{ info.memo }}</p>
  </div>
</template>

<script>
export default {
  name: 'first',
  data() {
    return {
      info: []
    }
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$http.get("/admin/user/detail?id=" + this.$route.params.id).then(res => {
        console.log(res)
        if (res && res.data) {
          this.info = res.data;
        }
      })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  text-align: center;
  padding: 30px 0;
  font-size: 50px;
}
.container{
  text-align: center;
}
ul {
  overflow: auto;
}
ul li {
  width: 400px;
  float: left;
  padding: 10px;
  background: #fff;
  margin: 10px;
  border-radius: 2px;
  text-align: center;
  display: block;
}
img {
  max-width: 300px;
  margin-bottom:20px ;
}
.name {
  font-size: 20px;
  margin: 4px 0;
}
.memo {
  padding:  20px;
  color: #827878;
  text-align: left;
}
</style>
