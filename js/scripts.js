const Modal = {
    open(){
        //Abrir o modal
        //Adicionar a classe active ao modal 
        document
            .querySelector(".modal-overlay")
            .classList
            .toggle('active');
    },
    close(){
        // Fechar o modal
        // Remover a classe active do modal
        document
            .querySelector(".modal-overlay")
            .classList
            .toggle('active');
    }
}

const transactions = [{
        id:1,
        description: 'Luz',
        amount: -50000,
        date: '15/08/2021'
    },{
        id:2,
        description: 'Criação website',
        amount: 500000,
        date: '15/08/2021'
    },{
        id:3,
        description: 'Internet',
        amount: -20000,
        date: '15/08/2021'
    },{
        id:4,
        description: 'App',
        amount: 20000,
        date: '15/08/2021'
    }
]

const Transaction = {
    all: transactions,
    add(transaction){
        Transaction.all.push(transaction)
        console.log(Transaction.all)
    },
    incomes(){
        // somas as entradas
        let income = 0;
       Transaction.all.forEach(transaction => {
            if(transaction.amount > 0){
                income += transaction.amount;
            }
       })
        return  income;
    
    },
    expenses(){
        // soma as saídas
        let expenses = 0
        Transaction.all.forEach(transaction =>{
            if(transaction.amount < 0){
                expenses += transaction.amount;
            }
        })
        return expenses;
    },
    total(){
        // entradas - saídas
        let total = 0;
        total =Transaction.incomes() + Transaction.expenses();

        return total;
    }
}

// Substituir os dados do HTML com os dados do JS

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction,index){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction); 
        DOM.transactionsContainer.appendChild(tr);
    },    
    innerHTMLTransaction(transaction){

        const CSSclass = transaction.amount < 0 ? "expense" : "income";
        const amount = Utils.formatCurrency(transaction.amount);
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><a href="#"><img src="./img/minus.svg" alt="Remover transação"></a></td>
        `;
        return html;
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses());

        document
            .getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total())
    }
};

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-": "";
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })

        return signal + value;
    }
}

transactions.forEach(transaction =>{
    DOM.addTransaction(transaction)
})

DOM.updateBalance()

Transaction.add({
    id: 39,
    description: "Alo",
    amount: 200,
    date: "15/08/2021"
})
