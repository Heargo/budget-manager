<template>
  <div class="home">
    <h1>{{date.toLocaleString('en', { month: 'long' })}}'s spendings</h1>
    <h3 v-if="data.remaining<0">overdrawn {{data.remaining}}€</h3>
    <h3 v-else class="positive">remaining {{data.remaining}}€</h3>
    <h4>{{data.spent}}€ spent</h4>
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
    <Transaction v-for="transaction in store.getMonthTransactions(month)" :key="transaction.name" :transaction="transaction" :showDelete="false"></Transaction>
  </div>
</template>

<script setup>
import Chart from '@/components/Chart.vue'
import Transaction from '@/components/Transaction.vue'
import { useStore } from '@/stores/store.js';

const store = useStore();
//new date
const date = new Date();
//move to next month
// date.setMonth(date.getMonth() + 0);
//get month in string
const month = date.getMonth()+1;

var data = store.getTransactionsByCategory(false, month);
// console.log(data)
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
h4{
  color:$txt;
  margin:0;
  font-size: 1rem;
  text-transform: uppercase;
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