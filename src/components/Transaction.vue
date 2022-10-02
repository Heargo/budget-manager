<template>
    <div v-if="transaction" class="transaction">
        <div>
            <img :src="require(`@/assets/icons/${store.categories[transaction.category].icon}`)" alt="icon" class="icon" :style="{backgroundColor:store.categories[transaction.category].color}">
            <div>
                <p class="amout">{{parseFloat(transaction.amount).toFixed(2)}}€</p>
                <p class="name">{{transaction.name}}</p>
            </div>
        </div>
        <p class="date">{{new Date(transaction.date).toLocaleDateString('fr-FR', {year: 'numeric', month: 'numeric', day: 'numeric'})}}</p>
        <img v-if="showDelete" class="delete" src="@/assets/svg/close-outline.svg" alt="delete" @click="store.deleteTransaction(transaction.id)">
    </div>
</template>
<script setup>
import { useStore } from '@/stores/store.js';

const store = useStore();
//props
const props = defineProps(['transaction','showDelete']);

//on created
const onCreated = function() {
    console.log("transaction", transaction)
}

</script>
<style lang="scss" scoped>
    .transaction {
        position:relative;
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
            &.delete{
                position: absolute;
                right: -0.5rem;
                top: -0.5rem;
                cursor: pointer;
                background-color:$red;
                padding: 0;
                margin:0;
                width: 1.5rem;
                height: 1.5rem;
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