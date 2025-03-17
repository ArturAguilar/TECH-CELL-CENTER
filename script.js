// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    loadProducts();
    loadServices();
    setupEventListeners();
    loadBudgets(); // Carregar orçamentos na dashboard
    loadEditBudget(); // Carregar dados do orçamento para edição, se houver
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
        option.setAttribute('data-phone', client.phone); // Adiciona o número de telefone ao atributo data-phone
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
                option.setAttribute('data-phone', client.phone); // Adiciona o número de telefone ao atributo data-phone
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

    document.getElementById('editAddItemButton').addEventListener('click', addEditItem);
}

let budgetItems = [];
let editItemIndex = -1;

// Função para adicionar um item ao orçamento
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

// Função para atualizar o preço total do orçamento
function updateTotalPrice() {
    let totalPrice = 0;

    budgetItems.forEach(item => {
        totalPrice += parseFloat(item.price) * item.quantity;
    });

    document.getElementById('totalPrice').textContent = `R$ ${totalPrice.toFixed(2)}`;
}

// Função para atualizar o preço com base no produto, serviço e quantidade selecionados
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
            <td>R$ ${budget.total}</td>
            <td>${budget.status}</td>
            <td>${budget.paymentMethod}</td>
            <td>
                <button onclick="openEditBudgetModal(${budget.id})">Editar</button>
                <button onclick="deleteBudget(${budget.id})">Deletar</button>
                <button onclick="sendWhatsApp(${budget.id})">WhatsApp</button>
                <button onclick="printBudget(${budget.id})">Imprimir</button>
            </td>
        `;
        dashboardTableBody.appendChild(row);
    });
}

// Função para abrir a janela modal de edição de orçamento
function openEditBudgetModal(id) {
    const modal = document.getElementById('editBudgetModal');
    const closeModal = document.getElementById('closeModal');
    const saveEditBudgetButton = document.getElementById('saveEditBudgetButton');

    // Carregar os dados do orçamento para edição
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const budget = budgets.find(budget => budget.id === id);

    if (budget) {
        document.getElementById('editBudgetId').value = budget.id;
        document.getElementById('editStatus').value = budget.status;
        document.getElementById('editTotal').value = budget.total;
        editBudgetItems = budget.items;
        updateEditBudgetItemsTable();
    }

    // Carregar os produtos e serviços para edição
    loadEditProducts();
    loadEditServices();

    // Abrir a janela modal
    modal.style.display = 'block';

    // Fechar a janela modal ao clicar no botão de fechar
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    // Fechar a janela modal ao clicar fora do conteúdo da modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Salvar as alterações do orçamento
    saveEditBudgetButton.onclick = function() {
        const budgetId = document.getElementById('editBudgetId').value;
        const status = document.getElementById('editStatus').value;
        const total = document.getElementById('editTotal').value;

        const updatedBudget = {
            id: budgetId,
            status: status,
            items: editBudgetItems,
            total: total
        };

        const index = budgets.findIndex(budget => budget.id == budgetId);
        budgets[index] = updatedBudget;

        localStorage.setItem('budgets', JSON.stringify(budgets));
        alert('Orçamento atualizado com sucesso!');
        modal.style.display = 'none';
        loadBudgets();
    }
}

// Função para carregar os produtos para edição
function loadEditProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productSelect = document.getElementById('editProduct');
    productSelect.innerHTML = '<option value="">Selecione um produto</option>';
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - ${product.brand} - ${product.model}`;
        option.setAttribute('data-price', product.price);
        productSelect.appendChild(option);
    });

    // Adiciona um evento para filtrar os produtos com base na entrada de pesquisa
    document.getElementById('editProductSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        productSelect.innerHTML = '<option value="">Selecione um produto</option>';
        products.forEach(product => {
            if (product.name.toLowerCase().includes(searchTerm) || product.brand.toLowerCase().includes(searchTerm) || product.model.toLowerCase().includes(searchTerm)) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} - ${product.brand} - ${product.model}`;
                option.setAttribute('data-price', product.price);
                productSelect.appendChild(option);
            }
        });
    });
}

// Função para carregar os serviços para edição
function loadEditServices() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const serviceSelect = document.getElementById('editService');
    serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>';
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.serviceName;
        option.setAttribute('data-price', service.price);
        serviceSelect.appendChild(option);
    });

    // Adiciona um evento para filtrar os serviços com base na entrada de pesquisa
    document.getElementById('editServiceSearch').addEventListener('input', function() {
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

let editBudgetItems = [];

// Função para adicionar um item ao orçamento em edição
function addEditItem() {
    const productSelect = document.getElementById('editProduct');
    const quantityInput = document.getElementById('editQuantity');
    const serviceSelect = document.getElementById('editService');
    const totalInput = document.getElementById('editTotal');

    const product = productSelect.options[productSelect.selectedIndex].text;
    const quantity = parseInt(quantityInput.value);
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const productPrice = parseFloat(productSelect.options[productSelect.selectedIndex].getAttribute('data-price'));
    const servicePrice = parseFloat(serviceSelect.options[serviceSelect.selectedIndex].getAttribute('data-price'));
    const totalPrice = (productPrice * quantity + servicePrice).toFixed(2);

    if (product && quantity && service && totalPrice) {
        editBudgetItems.push({ product, quantity, service, totalPrice });
        updateEditBudgetItemsTable();
        alert('Item adicionado ao orçamento!');
        document.getElementById('editBudgetForm').reset();
    } else {
        alert('Por favor, selecione um produto, uma quantidade, um serviço e um preço válido.');
    }
}

// Função para atualizar a tabela de itens do orçamento em edição
function updateEditBudgetItemsTable() {
    const budgetItemsTableBody = document.getElementById('editBudgetItemsTableBody');
    budgetItemsTableBody.innerHTML = '';

    editBudgetItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.service}</td>
            <td>R$ ${item.totalPrice}</td>
            <td>
                <button onclick="editEditItem(${index})">Editar</button>
                <button onclick="deleteEditItem(${index})">Deletar</button>
            </td>
        `;
        budgetItemsTableBody.appendChild(row);
    });

    updateEditTotalPrice();
}

// Função para atualizar o preço total do orçamento em edição
function updateEditTotalPrice() {
    let totalPrice = 0;

    editBudgetItems.forEach(item => {
        totalPrice += parseFloat(item.totalPrice);
    });

    document.getElementById('editTotal').value = totalPrice.toFixed(2);
}

// Função para editar um item do orçamento em edição
function editEditItem(index) {
    const item = editBudgetItems[index];
    document.getElementById('editProduct').value = item.product;
    document.getElementById('editQuantity').value = item.quantity;
    document.getElementById('editService').value = item.service;
    document.getElementById('editTotal').value = item.totalPrice;
    editItemIndex = index;
}

// Função para deletar um item do orçamento em edição
function deleteEditItem(index) {
    editBudgetItems.splice(index, 1);
    updateEditBudgetItemsTable();
}

// Função para editar um orçamento
function editBudget(id) {
    localStorage.setItem('editBudgetId', id);
    window.location.href = '../cadastro_orçamento/orcamentos.html';
}

// Função para carregar os dados do orçamento para edição
function loadEditBudget() {
    const budgetId = localStorage.getItem('editBudgetId');
    if (budgetId) {
        const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
        const budget = budgets.find(budget => budget.id == budgetId);

        if (budget) {
            document.getElementById('budgetId').value = budget.id;
            document.getElementById('client').value = budget.client;
            document.getElementById('status').value = budget.status;
            document.getElementById('observations').value = budget.observations;
            document.getElementById('paymentMethod').value = budget.paymentMethod;
            budgetItems = budget.items;
            updateBudgetItemsTable();
        }

        localStorage.removeItem('editBudgetId');
    }
}

// Função para deletar um orçamento
function deleteBudget(id) {
    let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    budgets = budgets.filter(budget => budget.id !== id);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    loadBudgets();
}

// Função para enviar o orçamento via WhatsApp
function sendWhatsApp(id) {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const budget = budgets.find(budget => budget.id === id);

    if (budget) {
        const clientSelect = document.getElementById('client');
        const clientOption = Array.from(clientSelect.options).find(option => option.text === budget.client);
        const phone = clientOption ? clientOption.getAttribute('data-phone') : '';

        const message = `Orçamento para ${budget.client}:\n\n` +
            budget.items.map(item => `${item.quantity}x ${item.product} (${item.service}) - R$ ${item.price}`).join('\n') +
            `\n\nTotal: R$ ${budget.total}\nStatus: ${budget.status}\nObservações: ${budget.observations}`;

        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Função para imprimir o orçamento
function printBudget(id) {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const budget = budgets.find(budget => budget.id === id);

    if (budget) {
        const doc = new jsPDF();
        doc.text(`Orçamento para ${budget.client}`, 10, 10);
        let y = 20;
        budget.items.forEach(item => {
            doc.text(`${item.quantity}x ${item.product} (${item.service}) - R$ ${item.price}`, 10, y);
            y += 10;
        });
        doc.text(`Total: R$ ${budget.total}`, 10, y + 10);
        doc.text(`Status: ${budget.status}`, 10, y + 20);
        doc.text(`Observações: ${budget.observations}`, 10, y + 30);
        doc.save(`Orçamento_${budget.client}.pdf`);
    }
}