<template>
    <div>
        <h1>History</h1>
        <div class="container">
            <Transaction v-for="transaction in store.getTransactions()" :key="transaction.name" :transaction="transaction" :showDelete="true"></Transaction>
        </div>
    </div>
</template>
<script setup>
import Transaction from '@/components/Transaction.vue';
import { useStore } from '@/stores/store.js';

const store = useStore();
</script>
<style lang="scss" scoped>
    h1{
        text-align: center;
        font-size: 3rem;
    }
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>