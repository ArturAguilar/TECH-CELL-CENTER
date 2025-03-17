document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('showFormButton').addEventListener('click', function() {
        document.getElementById('clientFormSection').style.display = 'block';
        document.querySelector('.client-table').style.display = 'none';
        document.getElementById('showFormButton').style.display = 'none';
    });

    // Remova qualquer evento de submissão existente antes de adicionar um novo
    const clientForm = document.getElementById('clientForm');
    clientForm.removeEventListener('submit', handleFormSubmit);
    clientForm.addEventListener('submit', handleFormSubmit);

    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const tableBody = document.getElementById('clientTableBody');
        tableBody.innerHTML = '';

        clients.forEach(client => {
            if (client.name.toLowerCase().includes(searchTerm)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.name}</td>
                    <td>${client.cpfCnpj}</td>
                    <td>${client.phone}</td>
                    <td>${client.address}</td>
                    <td class="actions">
                        <button class="edit" onclick="editClient(${client.id})">Editar</button>
                        <button class="delete" onclick="deleteClient(${client.id})">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    saveClient();
}

function saveClient() {
    const clientId = document.getElementById('clientId').value;
    const name = document.getElementById('name').value;
    const cpfCnpj = document.getElementById('cpfCnpj').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;

    const address = `${street}, ${number}, ${neighborhood}, ${city}`;

    const clientData = {
        id: clientId || new Date().getTime(),
        name: name,
        cpfCnpj: cpfCnpj,
        phone: phone,
        address: address
    };

    let clients = JSON.parse(localStorage.getItem('clients')) || [];

    if (clientId) {
        const index = clients.findIndex(client => client.id == clientId);
        clients[index] = clientData;
    } else {
        clients.push(clientData);
    }

    localStorage.setItem('clients', JSON.stringify(clients));

    alert('Cliente salvo com sucesso!');

    document.getElementById('clientForm').reset();
    document.getElementById('clientFormSection').style.display = 'none';
    document.querySelector('.client-table').style.display = 'block';
    document.getElementById('showFormButton').style.display = 'block';

    loadClients();
}

function loadClients() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const tableBody = document.getElementById('clientTableBody');
    tableBody.innerHTML = '';

    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.cpfCnpj}</td>
            <td>${client.phone}</td>
            <td>${client.address}</td>
            <td class="actions">
                <button class="edit" onclick="editClient(${client.id})">Editar</button>
                <button class="delete" onclick="deleteClient(${client.id})">Deletar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editClient(id) {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const client = clients.find(client => client.id == id);

    document.getElementById('clientId').value = client.id;
    document.getElementById('name').value = client.name;
    document.getElementById('cpfCnpj').value = client.cpfCnpj;
    document.getElementById('phone').value = client.phone;

    const addressParts = client.address.split(', ');
    document.getElementById('street').value = addressParts[0];
    document.getElementById('number').value = addressParts[1];
    document.getElementById('neighborhood').value = addressParts[2];
    document.getElementById('city').value = addressParts[3];

    document.getElementById('clientFormSection').style.display = 'block';
    document.querySelector('.client-table').style.display = 'none';
    document.getElementById('showFormButton').style.display = 'none';
}

function deleteClient(id) {
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    if (confirm('Você tem certeza que deseja excluir esse cliente?')) {
        clients = clients.filter(client => client.id != id);
        localStorage.setItem('clients', JSON.stringify(clients));
        alert('Cliente Deletado com Sucesso!');
        loadClients();
    }
}