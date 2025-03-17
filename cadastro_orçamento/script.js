document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    loadProducts();
    loadServices();
    setupEventListeners();
    loadBudgets(); // Carregar orçamentos na dashboard
});

function loadClients() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientSelect = document.getElementById('client');
    clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        clientSelect.appendChild(option);
    });

    document.getElementById('clientSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';
        clients.forEach(client => {
            if (client.name.toLowerCase().includes(searchTerm)) {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                clientSelect.appendChild(option);
            }
        });
    });
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productSelect = document.getElementById('product');
    productSelect.innerHTML = '<option value="">Selecione um produto</option>';
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - ${product.brand} - ${product.model}`;
        option.setAttribute('data-price', product.price);
        option.setAttribute('data-brand', product.brand);
        option.setAttribute('data-model', product.model);
        productSelect.appendChild(option);
    });

    document.getElementById('productSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        productSelect.innerHTML = '<option value="">Selecione um produto</option>';
        products.forEach(product => {
            if (product.name.toLowerCase().includes(searchTerm) || product.brand.toLowerCase().includes(searchTerm) || product.model.toLowerCase().includes(searchTerm)) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - ${product.brand} - ${product.model}`;
                option.setAttribute('data-price', product.price);
                option.setAttribute('data-brand', product.brand);
                option.setAttribute('data-model', product.model);
                productSelect.appendChild(option);
            }
        });
    });
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const serviceSelect = document.getElementById('service');
    serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.serviceName;
        option.setAttribute('data-price', service.price);
        serviceSelect.appendChild(option);
    });

    document.getElementById('serviceSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
        services.forEach(service => {
            if (service.serviceName.toLowerCase().includes(searchTerm)) {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = service.serviceName;
                option.setAttribute('data-price', service.price);
                serviceSelect.appendChild(option);
            }
        });
    });
}

function setupEventListeners() {
    document.getElementById('addItemButton').addEventListener('click', addItem);
    document.getElementById('saveBudgetButton').addEventListener('click', saveBudget);
    document.getElementById('product').addEventListener('change', updatePrice);
    document.getElementById('service').addEventListener('change', updatePrice);
    document.getElementById('quantity').addEventListener('input', updatePrice);
}

let budgetItems = [];
let editItemIndex = -1;

function addItem() {
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const serviceSelect = document.getElementById('service');
    const priceInput = document.getElementById('price');

    const product = productSelect.options[productSelect.selectedIndex].text;
    const quantity = parseInt(quantityInput.value);
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const price = parseFloat(priceInput.value).toFixed(2);

    if (product && quantity && service && price) {
        if (editItemIndex === -1) {
            budgetItems.push({ product, quantity, service, price });
        } else {
            budgetItems[editItemIndex] = { product, quantity, service, price };
            editItemIndex = -1;
        }
        updateBudgetItemsTable();
        alert('Item adicionado ao orçamento!');
        document.getElementById('budgetForm').reset();
    } else {
        alert('Por favor, selecione um produto, uma quantidade, um serviço e um preço válido.');
    }
}

function updateBudgetItemsTable() {
    const budgetItemsTableBody = document.getElementById('budgetItemsTableBody');
    budgetItemsTableBody.innerHTML = '';

    budgetItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.service}</td>
            <td>R$ ${item.price}</td>
            <td>
                <button onclick="editItem(${index})">Editar</button>
                <button onclick="deleteItem(${index})">Deletar</button>
            </td>
        `;
        budgetItemsTableBody.appendChild(row);
    });

    updateTotalPrice();
}

function editItem(index) {
    const item = budgetItems[index];
    document.getElementById('product').value = item.product;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('service').value = item.service;
    document.getElementById('price').value = item.price;
    editItemIndex = index;
}

function deleteItem(index) {
    budgetItems.splice(index, 1);
    updateBudgetItemsTable();
}

function saveBudget() {
    const budgetId = document.getElementById('budgetId').value;
    const clientSelect = document.getElementById('client');
    const statusSelect = document.getElementById('status');
    const observationsInput = document.getElementById('observations');

    const client = clientSelect.options[clientSelect.selectedIndex].text;
    const status = statusSelect.value;
    const observations = observationsInput.value;

    const total = budgetItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);

    const budgetData = {
        id: budgetId ? budgetId : new Date().getTime(),
        client: client,
        items: budgetItems,
        status: status,
        observations: observations,
        total: total
    };

    let budgets = JSON.parse(localStorage.getItem('budgets')) || [];

    if (budgetId) {
        const index = budgets.findIndex(budget => budget.id == budgetId);
        budgets[index] = budgetData;
    } else {
        budgets.unshift(budgetData); // Adiciona o novo orçamento no início da lista
    }

    localStorage.setItem('budgets', JSON.stringify(budgets));

    alert('Orçamento salvo com sucesso!');

    document.getElementById('budgetForm').reset();
    budgetItems = [];
    updateBudgetItemsTable();
    loadBudgets(); // Atualizar a dashboard após salvar o orçamento
}

function updateTotalPrice() {
    let totalPrice = 0;

    budgetItems.forEach(item => {
        totalPrice += parseFloat(item.price) * item.quantity;
    });

    document.getElementById('totalPrice').textContent = `R$ ${totalPrice.toFixed(2)}`;
}

function updatePrice() {
    const productSelect = document.getElementById('product');
    const serviceSelect = document.getElementById('service');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');

    const productPrice = parseFloat(productSelect.options[productSelect.selectedIndex].getAttribute('data-price')) || 0;
    const servicePrice = parseFloat(serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-price')) || 0;
    const quantity = parseInt(quantityInput.value) || 1;

    const totalPrice = (productPrice * quantity) + servicePrice;
    priceInput.value = totalPrice.toFixed(2);
}

function loadBudgets() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const dashboardTableBody = document.getElementById('dashboardTableBody');
    dashboardTableBody.innerHTML = '';

    budgets.forEach(budget => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${budget.client}</td>
            <td>${budget.items.map(item => item.product).join(', ')}</td>
            <td>${budget.items.map(item => item.quantity).join(', ')}</td>
            <td>${budget.items.map(item => item.service).join(', ')}</td>
            <td>${budget.items.map(item => `R$ ${item.price}`).join(', ')}</td>
            <td>R$ ${budget.total}</td>
            <td>${budget.status}</td>
            <td>${budget.observations}</td>
        `;
        dashboardTableBody.appendChild(row);
    });
}