<template>
    <div>
        <h2>New Transaction</h2>
        <form>
            <input type="number" step="0.01" id="name" v-model="amount" placeholder="XX€">
            <input type="text" id="number" v-model="name" placeholder="Name">
            <!-- <label for="category">Category</label> -->
            <select id="category" ref="category">
                <option selected value="" disabled>Category</option>    
                <option v-for="(category,name) in store.categories" :value="name" :key="category" :style="{'background-color':category.color}">{{name}}</option>
            </select>
            <input type="date" id="date" v-model="date" placeholder="Date">

            <button @click="addTransaction">Add</button>
        </form>
    </div>
</template>
<script setup>
import { useStore } from '@/stores/store.js';
import {ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useStore();

var amount = ref(null);
var name = ref(null);
var category = ref(null);
var date = ref(null);
const router = useRouter()

const addTransaction = function() {
    if (amount.value==0 || name.value=="" || category.value=="" || name.value==null || category.value==null) {
        alert("Please fill all fields");
        return;
    }
    if(date.value=="" || date.value==null){
        date.value = store.convertDateToTxt(new Date());
    }
    var data = {amount:amount.value, name:name.value, category:category.value.value,date:date.value}
    store.addTransaction(data);
    amount.value = null;
    name.value = null;
    category.value = null;
    router.push('/');
}

</script>
<style lang="scss" scoped>
h2{
    font-size: 3rem;
    text-align: center;
}
form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    input,select{
        width: 80%;
        margin: 0.2rem 0;
        border-radius:10px;
        outline: none;
        border:1px $txt solid;
        padding: 0.2rem 0.5rem;
        height: 2.5rem;
        font-size: 1.5rem;
    }
    select{
        width: calc(80% + 1rem ); 
        font-size: 1.5rem;
        option{
            text-transform: capitalize;
        }
    }
    button{
        width: 50%;
        max-width:150px;
        height: 2rem;
        padding: 0.1rem 0.5rem;
        margin: 0.2rem 0;
        margin-top: 2rem;
        border-radius: 15px;
        outline:none;
        border:1px solid $txt;
        background-color: $bg;
        color: $txt;
        font-size: 1.2rem;
        cursor: pointer;
    }
}
</style>