<template>
    <div v-if="spending" class="spending">
        <div>
            <img :src="require(`@/assets/icons/${store.categories[spending.category].icon}`)" alt="icon" class="icon" :style="{backgroundColor:store.categories[spending.category].color}">
            <div>
                <p class="amout">{{spending.amount}}€</p>
                <p class="name">{{spending.name}}</p>
            </div>
        </div>
        <p class="date">{{new Date(spending.date).toLocaleDateString('fr-FR', {year: 'numeric', month: 'numeric', day: 'numeric'})}}</p>
    </div>
</template>
<script setup>
import { useStore } from '@/stores/store.js';

const store = useStore();
//props
const props = defineProps(['spending'])

//on created
const onCreated = function() {
    console.log("spending", spending)
}

</script>
<style lang="scss" scoped>
    .spending {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 95%;
        max-width: 800px;
        background-color: $bg2;
        border-radius: 15px;
        margin:0.2rem 0;
        img{
            width: 50px;
            height: 50px;
            border-radius: 15px;
            padding: 0.5rem;
            margin-right: 1rem;
            @include width-under(500px){
                width: 30px;
                height: 30px;
            }
        }
        //left content
        div{
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            div{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;

                .amout{
                    margin:0;
                    font-size: 2em;
                    color:$txt;
                    @include width-under(500px){
                        font-size: 1.6em;
                    }
                }
                .name{
                    margin:0;
                    font-size: 1em;
                    color:$txt;
                    @include width-under(500px){
                        font-size: 0.8em;
                    }
                }
            }
        }
        .date{
            margin: 0.8rem;
            color:$txt;
        }
    }
</style>