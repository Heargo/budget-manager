<template>
    <div class="myStat" >
        <div class="chartContainer" :class="{'pie':typeChart=='pie','other':typeChart!='pie'}" :style="{width:width,height:height}">
            <canvas id="myChart"></canvas>
            <h1 class="title" v-if="options.plugins.title.display">{{ title }}</h1>
        </div>
    </div>
</template>
<script>
import Chart from 'chart.js/auto'
export default {
    name : "Stat",
    data(){
        return{
            colors:[],
            options:{},
            colorsUnique:"#FFFFFF",
        }
    },
    created(){
        // COLORS
        if(this.customColors.length==0){
            var referenceColors=['#eccc68','#ffa502','#ff6b81','#ff6348','#ff4757','#7bed9f','#70a1ff','#5352ed','#2ed573','#1e90ff','#3742fa']
            //shuffle referenceColors
            referenceColors = [... referenceColors].sort(() => 0.5 - Math.random());
            //select nbcolors random colors from referenceColors
            this.colors = referenceColors.slice(0,this.nbColors)
        }
        else{
            this.colors = this.customColors
        }
        if(this.nbColors==1){
            this.colorsUnique=this.colors[0]
        }
        if (this.typeChart=='line' && this.nbColors>1){
            this.colorsUnique="#727272"
        }

        // OPTIONS
        if(this.customOptions==null){
            this.options={
                plugins: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false
                    },
                }
            }
        }
    },
    props:{
        title:String,
        x:Array,
        y:Array,
        typeChart: String,
        customOptions:Object,
        nbColors:Number,
        customColors:{
            type:Array,
            default:[]
        },
        width:String,
        height:String,

    },
    mounted(){
        const data = {
            labels: this.x,
            datasets: [{
                label: this.title,
                backgroundColor: this.colors,
                borderColor: this.colorsUnique,
                data: this.y,
            }]
        };
        const config = {
            type: this.typeChart,
            data: data,
            options: this.options
        };
        // console.log(config)
        /* eslint-disable no-unused-vars */
        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
        /* eslint-enable no-unused-vars */
    },
}
</script>
<style lang="scss">
    .chartContainer{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin:auto;
        &.pie{
            max-width: 50vh;
        }
        &.other{
            max-width: min(700px,100vw);
        }
    }
    .myStat{
        margin:1rem 0;
        // border:solid 1px red;
    }
</style>