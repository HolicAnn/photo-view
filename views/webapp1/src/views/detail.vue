<template>
  <div class="container">
    <div class="header">
      <span class="back" @click="back">X</span>
    </div>
    <h3>{{ info.name }}</h3>
    <p><img width="100%" :src="info.url" /></p>
    <!-- <p class="memo" :title="info.memo">{{ info.memo }}</p> -->
  </div>
</template>

<script>
export default {
  name: 'first',
  props:["info"],
  data() {
    return {
     // info: []
    }
  },
  mounted() {
    console.log(this.info)
   // this.getDetail();
  },
  methods: {
    back() {
      this.$parent.show=false;
      // this.$router.replace({
      //   path: "/"
      // })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  text-align: center;
  font-size: 14px;
  padding: 10px 0;
}
.container {
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
  max-width: 98%;
}
.name {
  font-size: 20px;
  margin: 4px 0;
}
.memo {
  padding: 20px;
  color: #827878;
  text-align: left;
}
.header {
  text-align: left;
}
.back {
  display: inline-block;
  padding: 6px 8px;
  background: #fff;
  border-radius: 4px;
  margin: 8px;
}
.container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: all 0.2s ease-in-out;

}
</style>
