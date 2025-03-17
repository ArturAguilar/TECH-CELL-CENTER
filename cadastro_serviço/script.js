// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    setupEventListeners();
});

// Função para configurar os ouvintes de eventos
function setupEventListeners() {
    // Mostra o formulário de adicionar serviço e esconde a tabela de serviços
    document.getElementById('showFormButton').addEventListener('click', function() {
        document.getElementById('serviceFormSection').style.display = 'block';
        document.querySelector('.service-table').style.display = 'none';
        document.getElementById('showFormButton').style.display = 'none';
    });

    // Remova qualquer evento de submissão existente antes de adicionar um novo
    const serviceForm = document.getElementById('serviceForm');
    serviceForm.removeEventListener('submit', handleFormSubmit);
    serviceForm.addEventListener('submit', handleFormSubmit);

    // Adiciona um evento para filtrar os serviços com base na entrada de pesquisa
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const services = JSON.parse(localStorage.getItem('services')) || [];
        const tableBody = document.getElementById('serviceTableBody');
        tableBody.innerHTML = '';

        services.forEach(service => {
            if (service.serviceName.toLowerCase().includes(searchTerm) || service.description.toLowerCase().includes(searchTerm)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${service.id}</td>
                    <td>${service.serviceName}</td>
                    <td>${service.description}</td>
                    <td>${service.price}</td>
                    <td>${service.baseTime}</td>
                    <td>${service.category}</td>
                    <td class="actions">
                        <button class="edit" onclick="editService(${service.id})">Editar</button>
                        <button class="delete" onclick="deleteService(${service.id})">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}

// Função para lidar com a submissão do formulário
function handleFormSubmit(event) {
    event.preventDefault();
    saveService();
}

// Função para salvar o serviço no localStorage
function saveService() {
    const serviceId = document.getElementById('serviceId').value;
    const serviceName = document.getElementById('serviceName').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const baseTime = document.getElementById('baseTime').value;
    const category = document.getElementById('category').value;

    const serviceData = {
        id: serviceId || new Date().getTime(),
        serviceName: serviceName,
        description: description,
        price: price,
        baseTime: baseTime,
        category: category
    };

    console.log('Saving service:', serviceData);

    let services = JSON.parse(localStorage.getItem('services')) || [];

    if (serviceId) {
        const index = services.findIndex(service => service.id == serviceId);
        services[index] = serviceData;
    } else {
        services.unshift(serviceData); // Adiciona o novo serviço no início da lista
    }

    localStorage.setItem('services', JSON.stringify(services));

    alert('Serviço salvo com sucesso!');

    document.getElementById('serviceForm').reset();
    document.getElementById('serviceFormSection').style.display = 'none';
    document.querySelector('.service-table').style.display = 'block';
    document.getElementById('showFormButton').style.display = 'block';

    loadServices();
}

// Função para carregar os serviços do localStorage e preencher a tabela de serviços
function loadServices() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const tableBody = document.getElementById('serviceTableBody');
    tableBody.innerHTML = '';

    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.serviceName}</td>
            <td>${service.description}</td>
            <td>${service.price}</td>
            <td>${service.baseTime}</td>
            <td>${service.category}</td>
            <td class="actions">
                <button class="edit" onclick="editService(${service.id})">Editar</button>
                <button class="delete" onclick="deleteService(${service.id})">Deletar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    console.log('Loaded services:', services);
}

// Função para editar um serviço
function editService(id) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services.find(service => service.id == id);

    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.serviceName;
    document.getElementById('description').value = service.description;
    document.getElementById('price').value = service.price;
    document.getElementById('baseTime').value = service.baseTime;
    document.getElementById('category').value = service.category;

    document.getElementById('serviceFormSection').style.display = 'block';
    document.querySelector('.service-table').style.display = 'none';
    document.getElementById('showFormButton').style.display = 'none';
}

// Função para deletar um serviço
function deleteService(id) {
    let services = JSON.parse(localStorage.getItem('services')) || [];
    if (confirm('Você tem certeza que deseja excluir esse serviço?')) {
        services = services.filter(service => service.id != id);
        localStorage.setItem('services', JSON.stringify(services));
        alert('Serviço deletado com sucesso!');
        loadServices();
    }
}