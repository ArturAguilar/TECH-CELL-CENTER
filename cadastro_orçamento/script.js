// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    loadProducts();
    loadServices();
    setupEventListeners();
    loadBudgets(); // Carregar orçamentos na dashboard
});

// Função para carregar os clientes do localStorage e preencher o select de clientes
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

    // Adiciona um evento para filtrar os clientes com base na entrada de pesquisa
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

// Função para carregar os produtos do localStorage e preencher o select de produtos
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

    // Adiciona um evento para filtrar os produtos com base na entrada de pesquisa
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

// Função para carregar os serviços do localStorage e preencher o select de serviços
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

    // Adiciona um evento para filtrar os serviços com base na entrada de pesquisa
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

// Função para configurar os ouvintes de eventos
function setupEventListeners() {
    document.getElementById('addItemButton').addEventListener('click', addItem);
    document.getElementById('saveBudgetButton').addEventListener('click', saveBudget);
    document.getElementById('product').addEventListener('change', updatePrice);
    document.getElementById('service').addEventListener('change', updatePrice);
    document.getElementById('quantity').addEventListener('input', updatePrice);
}

let budgetItems = [];
let editItemIndex = -1;

// Função para adicionar um item ao orçamento
function addItem() {
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const serviceSelect = document.getElementById('service');
    const totalInput = document.getElementById('total');

    const product = productSelect.options[productSelect.selectedIndex].text;
    const quantity = parseInt(quantityInput.value);
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const productPrice = parseFloat(productSelect.options[productSelect.selectedIndex].getAttribute('data-price'));
    const servicePrice = parseFloat(serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-price'));
    const totalPrice = parseFloat(totalInput.value).toFixed(2);

    if (product && quantity && service && totalPrice) {
        if (editItemIndex === -1) {
            budgetItems.push({ product, quantity, service, productPrice, servicePrice, totalPrice });
        } else {
            budgetItems[editItemIndex] = { product, quantity, service, productPrice, servicePrice, totalPrice };
            editItemIndex = -1;
        }
        updateBudgetItemsTable();
        alert('Item adicionado ao orçamento!');
        document.getElementById('budgetForm').reset();
    } else {
        alert('Por favor, selecione um produto, uma quantidade, um serviço e um preço válido.');
    }
}

// Função para atualizar a tabela de itens do orçamento
function updateBudgetItemsTable() {
    const budgetItemsTableBody = document.getElementById('budgetItemsTableBody');
    budgetItemsTableBody.innerHTML = '';

    budgetItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.service}</td>
            <td>R$ ${item.totalPrice}</td>
            <td>
                <button onclick="editItem(${index})">Editar</button>
                <button onclick="deleteItem(${index})">Deletar</button>
            </td>
        `;
        budgetItemsTableBody.appendChild(row);
    });

    updateTotalPrice();
}

// Função para editar um item do orçamento
function editItem(index) {
    const item = budgetItems[index];
    document.getElementById('product').value = item.product;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('service').value = item.service;
    document.getElementById('price').value = item.price;
    editItemIndex = index;
}

// Função para deletar um item do orçamento
function deleteItem(index) {
    budgetItems.splice(index, 1);
    updateBudgetItemsTable();
}

// Função para salvar o orçamento
function saveBudget() {
    const budgetId = document.getElementById('budgetId').value;
    const clientSelect = document.getElementById('client');
    const statusSelect = document.getElementById('status');
    const observationsInput = document.getElementById('observations');
    const paymentMethodSelect = document.getElementById('paymentMethod');

    const client = clientSelect.options[clientSelect.selectedIndex].text;
    const status = statusSelect.value;
    const observations = observationsInput.value;
    const paymentMethod = paymentMethodSelect.value;

    const total = budgetItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);

    const budgetData = {
        id: budgetId ? budgetId : new Date().getTime(),
        client: client,
        items: budgetItems,
        status: status,
        observations: observations,
        paymentMethod: paymentMethod,
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

// Função para atualizar o preço total do orçamento
function updateTotalPrice() {
    let totalPrice = 0;

    budgetItems.forEach(item => {
        totalPrice += parseFloat(item.totalPrice);
    });

    document.getElementById('totalPrice').textContent = `R$ ${totalPrice.toFixed(2)}`;
}

// Função para atualizar o preço com base no produto, serviço e quantidade selecionados
function updatePrice() {
    const productSelect = document.getElementById('product');
    const serviceSelect = document.getElementById('service');
    const quantityInput = document.getElementById('quantity');
    const totalInput = document.getElementById('total');

    const productPrice = parseFloat(productSelect.options[productSelect.selectedIndex].getAttribute('data-price')) || 0;
    const servicePrice = parseFloat(serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-price')) || 0;
    const quantity = parseInt(quantityInput.value) || 1;

    const totalPrice = (productPrice * quantity) + servicePrice;
    totalInput.value = totalPrice.toFixed(2);
}

// Função para carregar os orçamentos do localStorage e preencher a tabela da dashboard
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
            <td>${budget.paymentMethod}</td>
            <td>${budget.observations}</td>
        `;
        dashboardTableBody.appendChild(row);
    });
}