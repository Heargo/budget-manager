<template>
  <div class="home">
    <h1>{{date.toLocaleString('en', { month: 'long' })}}'s spendings</h1>
    <h3 v-if="data.remaning<0">overdrawn {{data.remaning}}€</h3>
    <h3 v-else class="positive">remaining {{data.remaning}}€</h3>
    <Chart
      :typeChart="s.typeChart"
      :title="s.title"
      :x="s.x"
      :y="s.y"
      :customOptions="s.options"
      :customColors="s.colors"
      :nbColors="s.nbColors"
      width="80vw"
      >
    </Chart>
    <Spending v-for="spending in store.spendings.filter(s => s.date.split('-')[1] == month).slice().reverse()" :key="spending.name" :spending="spending"></Spending>
  </div>
</template>

<script setup>
import Chart from '@/components/Chart.vue'
import Spending from '@/components/Spending.vue'
import { useStore } from '@/stores/store.js';

const store = useStore();
//new date
const date = new Date();
//get month in string
const month = date.getMonth()+1;

var data = store.getSpendingsByCategory(false, month);
console.log(data)
var s = {
  typeChart: 'pie',
  title: '',
  x: data.x,
  y: data.y,
  colors:data.colors,
  options: null
}
</script>
<style lang="scss" scoped>

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: calc(50px + 1rem);
  h1{
    margin:0;
  }
}
h3{
  color:$red;
  margin:0;
  font-size: 1.7rem;
  text-transform: uppercase;
  &.positive{
    color:$green;
  }
}

.addBtn{
  $size:20vw;
  $maxSize:55px;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: $size;
  height: $size;
  max-width: $maxSize;
  max-height: $maxSize;
  background-color:$txt;
  border-radius: 100%;
  svg{
    stroke:$highlight;
  }
}

</style>