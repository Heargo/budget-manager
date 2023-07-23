<template>
    <div class="flex-col">
        <h1>History</h1>
        
        <h3 v-if="remaining<0 && month==='all'">overdrawn {{remaining}}€</h3>
        <h3 v-else-if="remaining>=0 && month==='all'" class="positive">remaining {{remaining}}€</h3>
        <Chart v-if="transactions.length>0"
            :key="updateChart"
            typeChart="pie"
            :title="months[month]"
            :x="x"
            :y="values"
            :customOptions="null"
            :customColors="colors"
        ></Chart>
        <img v-if="transactions.length==0"  class="nothing-found" src="@/assets/svg/undraw_treasure_of-9-i.svg" alt="">
        <p v-if="transactions.length==0"> Nothing happend during this period</p>
        <h4>{{spent}}€ spent</h4>
        <div class="selectMonth">
            <select name="month" id="" @change="updateTransactions" v-model="month">
                <option v-for="(month,index) in months" :key="month" :value="month" @click="getTransactions">{{month}}</option>
            </select>
            <select name="years" @change="updateTransactions" v-model="year">
                <option v-for="year in years" :key="year" :value="year" @click="getTransactions">{{year}}</option>
            </select>
        </div>
        <div class="container" v-if="transactions.length>0" >
            <Transaction @deleted="removeTransaction" v-for="transaction in transactions" :key="transaction.name" :transaction="transaction" :showDelete="true"></Transaction>
        </div>
    </div>
</template>
<script setup>
import Transaction from '@/components/Transaction.vue';
import { useStore } from '@/stores/store.js';
import Chart from '@/components/Chart.vue';
import { ref, getCurrentInstance } from 'vue'
const instance = getCurrentInstance();

const store = useStore();
const months =["all"].concat(store.MONTH_ORDER);
const years = store.getYearsFromTransactions();
var month = ref("all");
var transactions = ref(null);
var updateChart = ref(0);   
var x = ref(null);
var values = ref([]);
var colors = ref(null);
var remaining = ref(0);
var spent = ref(0);
var year = ref(store.year);

getTransactions();

function getTransactions(){
    if (month.value === "all"){ // if all is selected
        transactions.value= store.getTransactions(null,year.value);
    }
    else{
        transactions.value= store.getTransactions(store.MONTH_TO_INT[month.value], year.value);
    }
    setupChartValues();
}

function updateTransactions(){
    getTransactions()
    instance?.proxy?.$forceUpdate();

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

function removeTransaction(transaction){
    transactions.value = transactions.value.filter(tr => tr.id !== transaction.id);
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
    .nothing-found{
        width: 100%;
        max-width: 300px;
        margin: 1rem;
    }
    .flex-col{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>