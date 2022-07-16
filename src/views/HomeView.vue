<template>
  <div class="home">
    <h1>Vos dépenses</h1>
    <Spending v-for="spending in store.spendings" :key="spending.name" :spending="spending"></Spending>
    <Chart
      :typeChart="s.typeChart"
      :title="s.title"
      :x="s.x"
      :y="s.y"
      :customOptions="s.options"
      :customColors="s.colors"
      :nbColors="s.nbColors"
      width="500px"
      >
    </Chart>
  </div>
</template>

<script setup>
import Chart from '@/components/Chart.vue'
import Spending from '@/components/Spending.vue'
import { useStore } from '@/stores/store.js';

const store = useStore();
var data = store.getSpendingsByCategory(true);
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
    h1{
      margin:0;
    }
  }

</style>