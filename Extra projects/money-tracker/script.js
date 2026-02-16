let transactions = [];

// DOM Elements
const form = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const tableBody = document.querySelector('#transactionTable tbody');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const balanceEl = document.getElementById('balance');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
});

// Add transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeSelect.value,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);
    saveTransactions();
    renderTransactions();
    form.reset();
});

// Render transactions in table
function renderTransactions() {
    tableBody.innerHTML = '';

    if (transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No transactions yet</td></tr>';
        updateSummary();
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td class="${transaction.type}">${transaction.type.toUpperCase()}</td>
            <td>${transaction.date}</td>
            <td><button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });

    updateSummary();
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    renderTransactions();
}

// Calculate and update summary
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    incomeEl.textContent = `$${income.toFixed(2)}`;
    expensesEl.textContent = `$${expenses.toFixed(2)}`;
    balanceEl.textContent = `$${balance.toFixed(2)}`;

    // Color balance based on positive/negative
    if (balance >= 0) {
        balanceEl.style.color = '#28a745';
    } else {
        balanceEl.style.color = '#dc3545';
    }
}

// Save to local storage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load from local storage
function loadTransactions() {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        transactions = JSON.parse(saved);
    }
    renderTransactions();
}