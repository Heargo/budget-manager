<template>
    <div>
        <h1>Categories</h1>
        <select name="years" @change="updateTransactions" v-model="year">
                <option v-for="year in years" :key="year" :value="year" @click="getTransactions">{{year}}</option>
        </select>
        <div v-for="(c,name) in store.categories" :key="c" class="containerCategory">
            <div class="toggle" :style="{'background-color':c.color}" @click="toggleChartName(name)">
                <img :src="require(`@/assets/icons/${c.icon}`)" :alt="name">
                <p>{{name}}</p>
            </div>
            <Chart v-if="toggleChart==name"
                :typeChart="s.typeChart"
                :title="s.title"
                :x="s.x"
                :y="s.y"
                :customOptions="s.options"
                :customColors="s.colors"
                :nbColors="s.nbColors"
            ></Chart>
        </div>
    </div>
</template>
<script setup>
import Chart from '@/components/Chart.vue'
import { useStore } from '@/stores/store.js';
import { ref } from 'vue';
const store = useStore();
var toggleChart = ref(null);
var s = ref(null);
const years = store.getYearsFromTransactions();
var year = ref(store.year);

function toggleChartName(name){
    toggleChart.value==name ? toggleChart.value = null : toggleChart.value = name;
    updateDataChart(name);
}
function updateDataChart(name){
    var data = store.getTransactionsByMonth(name,year.value);
    s.value = {
        typeChart: 'bar',
        title: '',
        x: data.x,
        y: data.y,
        colors:data.colors,
        options: null
    }
}


</script>
<style lang="scss">
    h1{
        text-align: center;
    }
    // .containerCategory{
    //     width: 100vw;
    // }
    .toggle{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 0rem 1rem;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        &:hover{
            filter: brightness(0.8);
        }
        img{
            width:4rem;
            margin-right: 1rem;
        }
        p{
            font-size: 2rem;
            text-transform: capitalize;
        }

    }
</style>