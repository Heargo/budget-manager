<template>
    <div>
        <h1>History</h1>
        
        <h3 v-if="remaining<0 && month==0">overdrawn {{remaining}}€</h3>
        <h3 v-else-if="remaining>=0 && month==0" class="positive">remaining {{remaining}}€</h3>
        <Chart v-if="x!=null"
            :key="updateChart"
            typeChart="pie"
            :title="months[month]"
            :x="x"
            :y="values"
            :customOptions="null"
            :customColors="colors"
        ></Chart>
        <h4>{{spent}}€ spent</h4>
        <div class="selectMonth">
            <img src="@/assets/svg/chevron-back-circle-outline.svg" alt="previous" @click="previousMonth()">
            <h3>{{months[month]}}</h3>
            <img src="@/assets/svg/chevron-forward-circle-outline.svg" alt="next" @click="nextMonth()">
        </div>
        <div class="container">
            <Transaction v-for="transaction in transactions" :key="transaction.name" :transaction="transaction" :showDelete="true"></Transaction>
        </div>
    </div>
</template>
<script setup>
import Transaction from '@/components/Transaction.vue';
import { useStore } from '@/stores/store.js';
import Chart from '@/components/Chart.vue';
import { ref } from 'vue'

const store = useStore();
const months =["all"].concat(store.getMonthsUntilNow());
var month = ref(0);
var transactions = ref(null);
var updateChart = ref(0);
var x = ref(null);
var values = ref([]);
var colors = ref(null);
var remaining = ref(0);
var spent = ref(0);
getTransactions();

function getTransactions(){
    console.log("getTransactions");
    if (month.value == 0){ // if all is selected
        transactions.value= store.getTransactions();
    }
    else{
        transactions.value= store.getTransactions(store.MONTH_TO_INT[months[month.value]]);
    }
    setupChartValues();
}

function previousMonth(){
    //get previous month
    month.value = (month.value - 1 + months.length) % months.length;
    getTransactions();
}
function nextMonth(){
    //get next month
    month.value = (month.value + 1) % months.length;
    getTransactions();
}


function setupChartValues(){
    //reset
    x.value = null;
    values.value = [];
    colors.value = null;
    //get all months categories
    x.value = Object.keys(store.categories);
    //remove savings from x
    x.value = x.value.filter(category => category != "savings" && category != "monthly budget");

    //get all colors of categories
    colors.value = x.value.map(key => store.categories[key].color);
    for(var i = 0; i < x.value.length; i++){
       values.value.push(0)
    }
    //foreach transaction add value to corresponding category
    transactions.value.forEach(tr => {
        //get index of category
        var index = x.value.indexOf(tr.category);
        if(index>=0){
            values.value[parseInt(index)] += parseFloat(tr.amount);
        }
    });

    //get remaining and spent
    remaining.value = parseFloat(store.getCurrentSavings()).toFixed(2);
    spent.value = values.value.reduce((a, b) => a + b, 0).toFixed(2);

    updateChart.value++;
}


</script>
<style lang="scss" scoped>
    h1{
        text-align: center;
        font-size: 3rem;
        margin-bottom: 0.5rem;
    }
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .selectMonth{
        width: 90%;
        max-width: 300px;
        margin:1rem auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        img{
            width: 30px;
            height: 30px;
            cursor: pointer;
        }
        h3{
            text-transform: capitalize;
            color:$txt;
        }
    }

    h3{
        text-align: center;
        color:$red;
        margin:0;
        font-size: 1.7rem;
        text-transform: uppercase;
        &.positive{
            color:$green;
        }
    }
    h4{
         text-align: center;
        color:$txt;
        margin:0;
        font-size: 1rem;
        text-transform: uppercase;
    }
</style>