import { defineStore } from 'pinia'


const DEFAULT_CATEGORIES = {
    logement:{
        icon:"maison.png",
        color:"#f8cb87"
    },
    food:{
        icon:"panier.png",
        color:"#7fbdae"
    },
    transport:{
        icon:"valise.png",
        color:"#c58ade"
    },
    party:{
        icon:"biere.png",
        color:"#ed7179"
    },
    savings:{
        icon:"saving.png",
        color:"#9ac666"
    },
    "monthly budget":{
        icon:"budget.png",
        color:"#e5e5e5"
    }
};
const MONTH_ORDER= ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];
// var MONTH_TO_INT = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12};
var INT_TO_MONTH = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};

function initCategories(){
    var dico = JSON.parse(localStorage.getItem('categories')) || {};
    for (const [key, value] of Object.entries(DEFAULT_CATEGORIES)) {
        dico[key] = value;
    }

    return dico;
}

// useStore could be anything like useUser, useCart 
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
    state: () => {
        return {
            count:0,
            // savings:JSON.parse(localStorage.getItem('savings')) || null,
            transactions:JSON.parse(localStorage.getItem('transactions')) || [],
            categories:initCategories(),

        }
      },
      actions: {
        generateID(str){
            var hash = 0, i, chr;
            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
              chr   = str.charCodeAt(i);
              hash  = ((hash << 5) - hash) + chr;
              hash |= 0; // Convert to 32bit integer
            }
            return hash;
        },
        convertDateToTxt(date){
            return date.toISOString();
        },
        addTransaction(data){
            console.log("addTransactions",data);
            this.transactions.push(data);
            //add id to the transaction (id is the hash of name and date)
            data.id = this.generateID(data.name + data.date);
            //update local storage
            localStorage.setItem('transactions', JSON.stringify(this.transactions));
        },
        deleteTransaction(id){
            if(!confirm("Are you sure you want to delete this transaction?")) return;
            
            console.log("delete transaction",id);
            this.transactions = this.transactions.filter(transaction => transaction.id !== id);
            localStorage.setItem('transactions', JSON.stringify(this.transactions));
        },
        getMonthTransactions(month){
            var tr= this.transactions.filter(s => s.date.split('-')[1] == month);
            //return transactions sorted by transaction date
            var tr= this.transactions.sort((a,b)=>{
                var aDate = new Date(a.date);
                var bDate = new Date(b.date);
                return bDate - aDate;
            });
            return tr;
        },
        getTransactions()
        {
            // return transactions sorted by transaction date
            var tr= this.transactions.sort((a,b)=>{
                var aDate = new Date(a.date);
                var bDate = new Date(b.date);
                return bDate - aDate;
            });
            return tr;
        },
        getCustomCategory(){
            return JSON.parse(localStorage.getItem('categories')) || {};
        },
        isSaveCorrupted(save){
            console.log("save",save);
            //check if there is a key transaction in the save 
            if(!save.transactions) return true;
            //check if there is a key categories in the save
            if(!save.categories) return true;
            console.log("Base ok");
            
            //check transactions keys
            for(let transaction of save.transactions){
                if(!transaction.amount || !transaction.name || !transaction.category || !transaction.date || !transaction.id) return true;
            }
            console.log("Transactions ok");

            //check categories keys
            for(let category of Object.keys(save.categories)){
                var cat = save.categories[category];
                if(!cat.icon || !cat.color) return true;
            }
            console.log("Categories ok");

            return false;
        },
        importSave(save){
            if(this.isSaveCorrupted(save)){
                alert("Save is corrupted");
                return;
            }
            //update transactions
            this.transactions = save.transactions;
            localStorage.setItem('transactions', JSON.stringify(this.transactions));
            //update categories
            localStorage.setItem('categories', JSON.stringify(save.categories));
            this.categories = initCategories();
        },
        previousRemaningMonthBudget(month){
            var previousMonth = month - 1;
            if(previousMonth === 0){
                previousMonth = 12;
            }
            var previousMonthBudget = this.transactions.reduce((acc, transaction) => {
                if(transaction.category === "monthly budget" && transaction.date.split("-")[1] == previousMonth){
                    return acc + parseFloat(transaction.amount);
                }else if(transaction.category != "savings" && transaction.date.split("-")[1] == previousMonth){
                    return acc - parseFloat(transaction.amount);
                }
                return acc;
            },0);
            return previousMonthBudget;

        },
        transferRemaningBudget(month){
            console.log("attemp transferRemaningBudget");
            var previousMonthBudget = this.previousRemaningMonthBudget(month);
            console.log("previousMonthBudget", previousMonthBudget);
            if(previousMonthBudget>0){
                console.log("transferRemaningBudget",previousMonthBudget);
                //set date to last day of previous month
                var date = new Date();
                date.setMonth(month-1); //set month as parameter
                date.setDate(-1); //get previous month

                this.addTransaction({
                    name:"Transfer remaining budget to savings",
                    amount:-previousMonthBudget,
                    category:"monthly budget",
                    date:this.convertDateToTxt(date)
                });
            }
        },
        getTransactionsByCategory(showSavings,month){
            
            //get all months categories
            var x = Object.keys(this.categories);
            //remove savings from x
            if(!showSavings){
                x = x.filter(category => category != "savings");
            }
            //get all colors of categories
            var colors = x.map(key => this.categories[key].color);
            var values=[]
            for(var i=0;i<x.length;i++){
                //get total amount of transactions by category for the month
                var total = this.transactions.reduce((acc, transaction) => {
                    if(transaction.category === x[i] && transaction.date.split("-")[1] == month){
                        return acc + parseFloat(transaction.amount);
                    }
                    return acc;
                }
                ,0);
                values.push(total);
            }
            //if no monthly budget for the month add one.
            var monthlyBudget = this.transactions.filter(transaction => transaction.category === "monthly budget" && transaction.date.split("-")[1] == month);
            console.log("monthlyBudget for "+month,monthlyBudget);
            if(monthlyBudget.length==0 && this.getSavings()>0){
                console.log("no monthly budget for the month, adding one");
                //transfert remaining budget from previous month to savings before 
                this.transferRemaningBudget(month);
                //calculate monthly budget for the remaining months (until june)
                var monthlyBudget = this.getSavings()/(11-(month-8)%12);
                var date = new Date();
                date.setMonth(month-1); //for test purpose (-1 because month is 0-11)
                this.addTransaction({
                    name:"Default budget",
                    amount:monthlyBudget.toFixed(2),
                    date:this.convertDateToTxt(date),
                    category:"monthly budget",
                });
                values[x.indexOf("monthly budget")] = monthlyBudget.toFixed(2);
            }

            var spend=0;
            for (var i = 0; i < x.length; i++) {
                if(i!=x.indexOf("monthly budget")){
                    spend+=values[i];
                }
            }
            values[x.indexOf("monthly budget")] -= spend;
            var remaning=0;
            if(values[x.indexOf("monthly budget")]<0){
                colors[x.indexOf("monthly budget")]="#e63946";
                remaning=values[x.indexOf("monthly budget")];
                values[x.indexOf("monthly budget")] = 0;
            }else{
                remaning=values[x.indexOf("monthly budget")];
            }

            return{
                x:x,
                y:values,
                colors:colors,
                remaning:remaning.toFixed(2)
            }

        },
        getSavings(){
            //get all value in transactions with category savings
            var savings = this.transactions.reduce((acc, transaction) => {
                if(transaction.category === "savings"){
                    return acc + parseFloat(transaction.amount);
                }
                return acc;
            },0);

            return savings;
        },
        deleteCategory(category){
            if (confirm('Are you sure you want to delete the category <'+category+'>?')) {
                delete this.categories[category];
                //delete all transactions with this category
                this.transactions = this.transactions.filter(transaction => transaction.category !== category);
                //update local storage
                localStorage.setItem('transactions', JSON.stringify(this.transactions));
                var customCategories = JSON.parse(localStorage.getItem('categories')) || {};
                delete customCategories[category];
                localStorage.setItem('categories', JSON.stringify(customCategories));
            }
        },
        newCategory(name, color, icon){
            this.categories[name] = {
                color:color,
                icon:icon
            }
            //get custom categories
            var customCategories = JSON.parse(localStorage.getItem('categories')) || {};
            //add new category to custom categories
            customCategories[name] = {
                color:color,
                icon:icon
            }
            localStorage.setItem('categories', JSON.stringify(customCategories));
        },
        getSavingsUntil(month){
            var savings = this.transactions.reduce((acc, transaction) => {
                if(transaction.category == "savings" && MONTH_ORDER.indexOf(INT_TO_MONTH[transaction.date.split("-")[1]])<=MONTH_ORDER.indexOf(month)){
                    return acc + parseFloat(transaction.amount);
                }
                return acc;
            },0);
            return savings;
        },
        getTransactionsUntil(month){
            var savings = this.transactions.reduce((acc, transaction) => {
                if(transaction.category != "savings" && MONTH_ORDER.indexOf(INT_TO_MONTH[parseInt(transaction.date.split("-")[1])])<=MONTH_ORDER.indexOf(month)){
                    return acc + parseFloat(transaction.amount);
                }
                return acc;
            },0);
            return savings;
        },
        getTransactionsByMonth(category)
        {
            if(category == "savings"){
                var transactions = this.transactions.filter(transaction => transaction.category != category);
            }else{
                var transactions = this.transactions.filter(transaction => transaction.category === category);
            }
            var transactionsByMonth = [0,0,0,0,0,0,0,0,0,0,0,0];
            for(var i=0;i<transactions.length;i++){
                var date = transactions[i].date.split("-");
                var month = parseInt(date[1]);
                //case monthly budget (remove the transaction to transfer the remaining budget to savings)
                if(transactions[i].amount >0){
                    transactionsByMonth[MONTH_ORDER.indexOf(INT_TO_MONTH[month])] += parseFloat(transactions[i].amount);
                }
            }

            //case category is savings
            if(category == "savings"){
                MONTH_ORDER.forEach((month,index) => {
                    transactionsByMonth[index] = this.getSavingsUntil(month) - this.getTransactionsUntil(month);
                });
            }

            //array of months
            return {x:MONTH_ORDER,y:Object.values(transactionsByMonth),colors:this.categories[category].color};
        }


      },
})