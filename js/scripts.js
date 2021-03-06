const Modal = {
    open() {
        //Abrir o modal
        //Adicionar a classe active ao modal 
        document
            .querySelector(".modal-overlay")
            .classList
            .toggle('active');
    },
    close() {
        // Fechar o modal
        // Remover a classe active do modal
        document
            .querySelector(".modal-overlay")
            .classList
            .toggle('active');
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions" , JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction);
        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload();
    },

    incomes() {
        // somas as entradas
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += Number(transaction.amount);
            }
        })
        return income;
    },

    expenses() {
        // soma as saídas
        let expenses = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expenses += Number(transaction.amount);
            }
        })
        return expenses;
    },

    total() {
        // entradas - saídas
        let total = 0;
        total = Transaction.incomes() + Transaction.expenses();

        return total;
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr);
    },
    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount < 0 ? "expense" : "income";
        const amount = Utils.formatCurrency(transaction.amount);
        const date = Utils.formatDate(transaction.date);
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./img/minus.svg" alt="Remover transação">
            </td>
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
    },
    clearTransactions() {
        this.transactionsContainer.innerHTML = "";
    }
};

const Utils = {
    formatAmount(value) {
        value = value * 100;
        return Math.round(value);
    },

    formatDate(value) {
        const splittedDate = value.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100;

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value;
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date,
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues();
        if (description?.trim() === "" ||
            amount?.trim() === "" ||
            date?.trim() === "") {
            throw new Error("Por favor, preencha todos os campos");
        }
    },

    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    submit(event) {
        event.preventDefault()

        // Verificar se todas as informações foram preenchidas
        try {
            Form.validateFields();
            // Formatar os dados antes de salvar
            const transaction = Form.formatValues();
            // Salvar
            Transaction.add(transaction);
            // Limpar formulario
            Form.clearFields();
            // Modal feche
            Modal.close()
            // Atualizar a aplicação
            App.reload();
        } catch (e) {
            alert(e.message)
        }

    }
}

const App = {
    init() {

        Transaction.all.forEach(DOM.addTransaction);
        // Transaction.all.forEach(
        //     (transaction,index) => {
        //     DOM.addTransaction(transaction,index)
        // });

        DOM.updateBalance();
        Storage.set(Transaction.all);

    },
    reload() {
        DOM.clearTransactions();
        App.init()
    }
}

const teste =  fetch('http://localhost/api__controle_gastos/api/v1/carteira/mostrar')
.then(T => T.json())
.then(result => {
    Storage.set(result.dados) 
}
)

console.log(Storage.get())



App.init();

