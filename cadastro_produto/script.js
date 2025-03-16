document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('showFormButton').addEventListener('click', function() {
        document.getElementById('productFormSection').style.display = 'block';
        document.querySelector('.product-table').style.display = 'none';
        document.getElementById('showFormButton').style.display = 'none';
    });

    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();
        saveProduct();
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const tableBody = document.getElementById('productTableBody');
        tableBody.innerHTML = '';

        products.forEach(product => {
            if (product.name.toLowerCase().includes(searchTerm)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.brand}</td>
                    <td>${product.model}</td>
                    <td>R$ ${product.price}</td>
                    <td>
                        <button class="edit" onclick="editProduct(${product.id})">Editar</button>
                        <button class="delete" onclick="deleteProduct(${product.id})">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}

function saveProduct() {
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('name').value;
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const price = parseFloat(document.getElementById('price').value).toFixed(2);

    const productData = {
        id: productId ? productId : new Date().getTime(),
        name: name,
        brand: brand,
        model: model,
        price: price
    };

    let products = JSON.parse(localStorage.getItem('products')) || [];

    if (productId) {
        const index = products.findIndex(product => product.id == productId);
        products[index] = productData;
    } else {
        products.push(productData);
    }

    localStorage.setItem('products', JSON.stringify(products));

    alert('Produto cadastrado com sucesso!');

    document.getElementById('productForm').reset();
    document.getElementById('productFormSection').style.display = 'none';
    document.querySelector('.product-table').style.display = 'block';
    document.getElementById('showFormButton').style.display = 'block';

    loadProducts();
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.model}</td>
            <td>R$ ${product.price}</td>
            <td>
                <button class="edit" onclick="editProduct(${product.id})">Editar</button>
                <button class="delete" onclick="deleteProduct(${product.id})">Deletar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.id == id);

    document.getElementById('productId').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('brand').value = product.brand;
    document.getElementById('model').value = product.model;
    document.getElementById('price').value = product.price;

    document.getElementById('productFormSection').style.display = 'block';
    document.querySelector('.product-table').style.display = 'none';
    document.getElementById('showFormButton').style.display = 'none';
}

function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (confirm('Tem certeza que deseja deletar este produto?')) {
        products = products.filter(product => product.id != id);
        localStorage.setItem('products', JSON.stringify(products));
        alert('Produto deletado com sucesso!');
        loadProducts();
    }
}