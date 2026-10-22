
// store transactions
let transactions = [];
let monthlyBudget = 0;

// store charts
let incomeExpenseChart = null;
let categoryChart = null;

// transaction categories
const categories = {
    income: ["Salary", "Freelance", "Other"],
    expense: [
        "Food", "Transportation", "Shopping", "Bills",
        "Entertainment", "Health", "Education", "Other"
    ]
};

// get html elements
const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const dateInput = document.getElementById("date");

const editTransactionId = document.getElementById("editTransactionId");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");

const tableBody = document.querySelector("#transactionTable tbody");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const balanceEl = document.getElementById("balance");

const monthFilter = document.getElementById("monthFilter");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");
const transactionCount = document.getElementById("transactionCount");

const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");
const budgetAmount = document.getElementById("budgetAmount");
const budgetProgressBar = document.getElementById("budgetProgressBar");
const budgetStatus = document.getElementById("budgetStatus");
const exportBtn = document.getElementById("exportBtn");

// format an amount as money
function formatMoney(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

// get today's date
function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// fix older date formats
function normalizeDate(value) {
    if (typeof value !== "string") {
        return getToday();
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (match) {
        const month = match[1].padStart(2, "0");
        const day = match[2].padStart(2, "0");
        return `${match[3]}-${month}-${day}`;
    }

    return getToday();
}

// format a date for the table
function formatDate(date) {
    const parts = date.split("-");
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

// create a unique id
function createId() {
    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()}`;
}

// get the selected month
function getSelectedMonth() {
    return monthFilter.value || getToday().slice(0, 7);
}

// get transactions for the month
function getMonthlyTransactions() {
    return transactions.filter(t =>
        t.date.startsWith(getSelectedMonth())
    );
}

// add up transactions by type
function calculateTotal(items, type) {
    return items
        .filter(t => t.type === type)
        .reduce((total, t) => total + t.amount, 0);
}

// save transactions
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// load saved transactions
function loadTransactions() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("transactions") || "[]"
        );

        transactions = Array.isArray(saved)
            ? saved.filter(t =>
                t &&
                typeof t.description === "string" &&
                Number.isFinite(Number(t.amount)) &&
                Number(t.amount) > 0 &&
                ["income", "expense"].includes(t.type)
            ).map(t => ({
                id: String(t.id ?? createId()),
                description: t.description,
                amount: Number(t.amount),
                type: t.type,
                category: t.category || "Other",
                date: normalizeDate(t.date)
            }))
            : [];
    } catch (error) {
        console.error("could not load transactions", error);
        transactions = [];
    }
}

// save the budget
function saveBudget() {
    localStorage.setItem("monthlyBudget", String(monthlyBudget));
}

// load the budget
function loadBudget() {
    const saved = Number(localStorage.getItem("monthlyBudget"));
    monthlyBudget = Number.isFinite(saved) && saved >= 0 ? saved : 0;
    budgetInput.value = monthlyBudget || "";
}

// show categories for the selected type
function updateCategoryOptions() {
    const type = typeSelect.value;
    const previous = categorySelect.value;

    categorySelect.innerHTML = '<option value="">Select Category</option>';

    if (!categories[type]) {
        return;
    }

    categories[type].forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    if (categories[type].includes(previous)) {
        categorySelect.value = previous;
    }
}

typeSelect.addEventListener("change", updateCategoryOptions);

// add or update a transaction
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeSelect.value;
    const category = categorySelect.value;
    const date = dateInput.value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("please enter a valid description and amount");
        return;
    }

    if (!categories[type] || !categories[type].includes(category)) {
        alert("please select a valid category");
        return;
    }

    if (!date) {
        alert("please select a date");
        return;
    }

    const editingId = editTransactionId.value;

    if (editingId) {
        const transaction = transactions.find(t => t.id === editingId);

        if (!transaction) {
            resetForm();
            return;
        }

        transaction.description = description;
        transaction.amount = amount;
        transaction.type = type;
        transaction.category = category;
        transaction.date = date;
    } else {
        transactions.push({
            id: createId(),
            description,
            amount,
            type,
            category,
            date
        });
    }

    saveTransactions();
    resetForm();
    refreshDashboard();
});

// clear the form
function resetForm() {
    form.reset();
    editTransactionId.value = "";
    submitBtn.textContent = "+ Add Transaction";
    formTitle.textContent = "Add Transaction";
    cancelEditBtn.hidden = true;
    dateInput.value = getToday();
    updateCategoryOptions();
}

// fill the form with a transaction
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);

    if (!transaction) {
        return;
    }

    editTransactionId.value = transaction.id;
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeSelect.value = transaction.type;

    updateCategoryOptions();

    categorySelect.value = transaction.category;
    dateInput.value = transaction.date;

    submitBtn.textContent = "Save Changes";
    formTitle.textContent = "Edit Transaction";
    cancelEditBtn.hidden = false;

    document.getElementById("add-transaction").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    descriptionInput.focus({ preventScroll: true });
}

cancelEditBtn.addEventListener("click", resetForm);

// delete a transaction
function deleteTransaction(id) {
    const transaction = transactions.find(t => t.id === id);

    if (!transaction) {
        return;
    }

    if (!confirm(`Delete "${transaction.description}"?`)) {
        return;
    }

    transactions = transactions.filter(t => t.id !== id);

    if (editTransactionId.value === id) {
        resetForm();
    }

    saveTransactions();
    refreshDashboard();
}

// update income, expenses, and balance
function updateSummary() {
    const monthly = getMonthlyTransactions();

    const income = calculateTotal(monthly, "income");
    const expenses = calculateTotal(monthly, "expense");

    const balance = calculateTotal(transactions, "income")
        - calculateTotal(transactions, "expense");

    incomeEl.textContent = formatMoney(income);
    expensesEl.textContent = formatMoney(expenses);
    balanceEl.textContent = formatMoney(balance);

    balanceEl.style.color = balance >= 0 ? "#16a66a" : "#f04455";
}

// update the monthly budget
function updateBudget() {
    const expenses = calculateTotal(
        getMonthlyTransactions(), "expense"
    );

    budgetAmount.textContent = formatMoney(monthlyBudget);

    if (monthlyBudget <= 0) {
        budgetProgressBar.style.width = "0%";
        budgetStatus.textContent = "Set your monthly budget";
        return;
    }

    const percentage = (expenses / monthlyBudget) * 100;
    budgetProgressBar.style.width = `${Math.min(percentage, 100)}%`;

    if (expenses > monthlyBudget) {
        budgetProgressBar.style.background = "#f04455";
        budgetStatus.textContent =
            `${formatMoney(expenses - monthlyBudget)} over budget`;
    } else {
        budgetProgressBar.style.background = "#6546e8";
        budgetStatus.textContent =
            `${formatMoney(monthlyBudget - expenses)} remaining`;
    }
}

// save the entered budget
saveBudgetBtn.addEventListener("click", function() {
    const amount = Number(budgetInput.value);

    if (!Number.isFinite(amount) || amount < 0) {
        alert("please enter a valid budget");
        return;
    }

    monthlyBudget = amount;
    saveBudget();
    updateBudget();
});

// filter and sort transactions
function getFilteredTransactions() {
    const search = searchInput.value.toLowerCase().trim();
    const type = filterType.value;
    const category = filterCategory.value;

    return getMonthlyTransactions()
        .filter(t =>
            t.description.toLowerCase().includes(search) ||
            t.category.toLowerCase().includes(search)
        )
        .filter(t => type === "all" || t.type === type)
        .filter(t => category === "all" || t.category === category)
        .sort((a, b) => b.date.localeCompare(a.date));
}

// display transactions in the table
function renderTransactions() {
    tableBody.innerHTML = "";

    const filtered = getFilteredTransactions();

    transactionCount.textContent =
        `${filtered.length} transaction${filtered.length === 1 ? "" : "s"}`;

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.className = "empty-state";
        cell.textContent = "No transactions found";

        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    filtered.forEach(transaction => {
        const row = document.createElement("tr");

        // add transaction details
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category;

        const amountCell = document.createElement("td");
        amountCell.textContent =
            `${transaction.type === "income" ? "+" : "-"}${formatMoney(transaction.amount)}`;
        amountCell.className = transaction.type;

        const typeCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = `type-badge ${transaction.type}`;
        badge.textContent = transaction.type === "income"
            ? "Income" : "Expense";
        typeCell.appendChild(badge);

        const dateCell = document.createElement("td");
        dateCell.textContent = formatDate(transaction.date);

        // create edit and delete buttons
        const actionCell = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () =>
            editTransaction(transaction.id)
        );

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () =>
            deleteTransaction(transaction.id)
        );

        actionCell.append(editBtn, deleteBtn);

        row.append(
            descriptionCell,
            categoryCell,
            amountCell,
            typeCell,
            dateCell,
            actionCell
        );

        tableBody.appendChild(row);
    });
}

// update the income and expense chart
function updateIncomeExpenseChart() {
    if (typeof Chart === "undefined") {
        return;
    }

    const labels = [];
    const incomeData = [];
    const expenseData = [];

    const selected = getSelectedMonth();
    const [year, month] = selected.split("-").map(Number);

    // get the last six months
    for (let i = 5; i >= 0; i--) {
        const date = new Date(year, month - 1 - i, 1);
        const key = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

        labels.push(date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit"
        }));

        const items = transactions.filter(t =>
            t.date.startsWith(key)
        );

        incomeData.push(calculateTotal(items, "income"));
        expenseData.push(calculateTotal(items, "expense"));
    }

    const canvas = document.getElementById("incomeExpenseChart");

    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

    incomeExpenseChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    backgroundColor: "#16a66a",
                    borderRadius: 6
                },
                {
                    label: "Expenses",
                    data: expenseData,
                    backgroundColor: "#6546e8",
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                },
                tooltip: {
                    callbacks: {
                        label: context =>
                            `${context.dataset.label}: ${formatMoney(context.parsed.y)}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => "$" + value
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// update the spending category chart
function updateCategoryChart() {
    if (typeof Chart === "undefined") {
        return;
    }

    const expenses = getMonthlyTransactions().filter(
        t => t.type === "expense"
    );

    const totals = {};

    // add expenses by category
    expenses.forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(totals);
    const values = Object.values(totals);

    const colors = [
        "#6546e8",
        "#16a66a",
        "#f4ad42",
        "#f04455",
        "#377cf6",
        "#b75be8",
        "#24b9c7",
        "#8993aa"
    ];

    const canvas = document.getElementById("categoryChart");

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: labels.length ? labels : ["No expenses"],
            datasets: [{
                data: values.length ? values : [1],
                backgroundColor: values.length
                    ? colors.slice(0, values.length)
                    : ["#e7e9f2"],
                borderWidth: 3,
                borderColor: "#ffffff",
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
                legend: {
                    position: "bottom"
                },
                tooltip: {
                    callbacks: {
                        label: context => values.length
                            ? `${context.label}: ${formatMoney(context.parsed)}`
                            : "No expenses yet"
                    }
                }
            }
        }
    });
}

// export transactions to a csv file
function exportTransactions() {
    const items = getFilteredTransactions();

    if (items.length === 0) {
        alert("no transactions to export");
        return;
    }

    const rows = [
        ["Description", "Amount", "Type", "Category", "Date"]
    ];

    items.forEach(t => {
        rows.push([
            t.description,
            t.amount,
            t.type,
            t.category,
            t.date
        ]);
    });

    // escape special characters for csv
    const csv = rows.map(row =>
        row.map(value => {
            let text = String(value);

            // prevent spreadsheet formulas from running
            if (/^[\s]*[=+\-@]/.test(text)) {
                text = "'" + text;
            }

            return `"${text.replace(/"/g, '""')}"`;
        }).join(",")
    ).join("\r\n");

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `money-tracker-${getSelectedMonth()}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

// update the full dashboard
function refreshDashboard() {
    updateSummary();
    updateBudget();
    renderTransactions();
    updateIncomeExpenseChart();
    updateCategoryChart();
}

// update when filters change
monthFilter.addEventListener("change", refreshDashboard);
searchInput.addEventListener("input", renderTransactions);
filterType.addEventListener("change", renderTransactions);
filterCategory.addEventListener("change", renderTransactions);
exportBtn.addEventListener("click", exportTransactions);

// highlight the selected sidebar link
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function() {
        document.querySelectorAll(".nav-link").forEach(item =>
            item.classList.remove("active")
        );

        this.classList.add("active");
    });
});

// start the app
function initializeApp() {
    dateInput.value = getToday();
    monthFilter.value = getToday().slice(0, 7);

    loadTransactions();
    loadBudget();
    updateCategoryOptions();
    refreshDashboard();
}

initializeApp();

