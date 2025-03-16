document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('showFormButton').addEventListener('click', function() {
        document.getElementById('serviceFormSection').style.display = 'block';
        document.querySelector('.service-table').style.display = 'none';
        document.getElementById('showFormButton').style.display = 'none';
    });

    document.getElementById('serviceForm').addEventListener('submit', function(event) {
        event.preventDefault();
        saveService();
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const services = JSON.parse(localStorage.getItem('services')) || [];
        const tableBody = document.getElementById('serviceTableBody');
        tableBody.innerHTML = '';

        services.forEach(service => {
            if (service.name.toLowerCase().includes(searchTerm) || service.description.toLowerCase().includes(searchTerm)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${service.id}</td>
                    <td>${service.name}</td>
                    <td>${service.description}</td>
                    <td>R$ ${service.price}</td>
                    <td>${service.baseTime} dias</td>
                    <td>
                        <button class="edit" onclick="editService(${service.id})">Editar</button>
                        <button class="delete" onclick="deleteService(${service.id})">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}

function saveService() {
    const serviceId = document.getElementById('serviceId').value;
    const serviceName = document.getElementById('serviceName').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value).toFixed(2);
    const baseTime = parseInt(document.getElementById('baseTime').value).toFixed(1);

    const serviceData = {
        id: serviceId ? serviceId : new Date().getTime(),
        name: serviceName,
        description: description,
        price: price,
        baseTime: baseTime
    };

    let services = JSON.parse(localStorage.getItem('services')) || [];

    if (serviceId) {
        const index = services.findIndex(service => service.id == serviceId);
        services[index] = serviceData;
    } else {
        services.push(serviceData);
    }

    localStorage.setItem('services', JSON.stringify(services));

    alert('Serviço cadastrado com sucesso!');

    document.getElementById('serviceForm').reset();
    document.getElementById('serviceFormSection').style.display = 'none';
    document.querySelector('.service-table').style.display = 'block';
    document.getElementById('showFormButton').style.display = 'block';

    loadServices();
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const tableBody = document.getElementById('serviceTableBody');
    tableBody.innerHTML = '';

    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>R$ ${service.price}</td>
            <td>${service.baseTime} dias</td>
            <td>
                <button class="edit" onclick="editService(${service.id})">Editar</button>
                <button class="delete" onclick="deleteService(${service.id})">Deletar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editService(id) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services.find(service => service.id == id);

    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('description').value = service.description;
    document.getElementById('price').value = service.price;
    document.getElementById('baseTime').value = service.baseTime;

    document.getElementById('serviceFormSection').style.display = 'block';
    document.querySelector('.service-table').style.display = 'none';
    document.getElementById('showFormButton').style.display = 'none';
}

function deleteService(id) {
    let services = JSON.parse(localStorage.getItem('services')) || [];
    if (confirm('Tem certeza que deseja deletar este serviço?')) {
        services = services.filter(service => service.id != id);
        localStorage.setItem('services', JSON.stringify(services));
        alert('Serviço deletado com sucesso!');
        loadServices();
    }
}