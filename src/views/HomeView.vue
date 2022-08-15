<template>
  <div class="home">
    <h1>{{date.toLocaleString('en', { month: 'long' })}}'s spendings</h1>
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
    <Spending v-for="spending in store.spendings" :key="spending.name" :spending="spending"></Spending>
    <router-link to="/add" class="addBtn">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </router-link>
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

// console.log(month);
console.log(store.spendings)
var data = store.getSpendingsByCategory(true, month);
var s = {
  typeChart: 'pie',
  title: 'dzazd',
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

.addBtn{
  $size:20vw;
  $maxSize:60px;
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