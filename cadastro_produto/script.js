// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
    configurarOuvintesDeEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesDeEventos() {
    document.getElementById('mostrarFormularioBotao').addEventListener('click', function() {
        toggleFormulario(true);
    });

    const formularioProduto = document.getElementById('formularioProduto');
    formularioProduto.removeEventListener('submit', lidarComSubmissaoFormulario);
    formularioProduto.addEventListener('submit', lidarComSubmissaoFormulario);

    document.getElementById('entradaPesquisa').addEventListener('input', filtrarProdutos);
}

// Função para alternar a exibição do formulário
function toggleFormulario(mostrar) {
    document.getElementById('secaoFormularioProduto').style.display = mostrar ? 'block' : 'none';
    document.querySelector('.tabela-produto').style.display = mostrar ? 'none' : 'block';
    document.getElementById('mostrarFormularioBotao').style.display = mostrar ? 'none' : 'block';
}

// Função para filtrar os produtos
function filtrarProdutos() {
    const termoPesquisa = this.value.toLowerCase();
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaProdutos');
    corpoTabela.innerHTML = '';

    produtos.forEach(produto => {
        if (produto.nome.toLowerCase().includes(termoPesquisa)) {
            corpoTabela.appendChild(criarLinhaTabela(produto));
        }
    });
}

// Função para adicionar um produto à tabela
function criarLinhaTabela(produto) {
    const linha = document.createElement('tr');
    linha.innerHTML = `
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>${produto.marca}</td>
        <td>${produto.modelo}</td>
        <td>${produto.preco}</td>
        <td>${produto.categoria}</td>
        <td class="acoes">
            <button class="editar" onclick="editarProduto(${produto.id})">Editar</button>
            <button class="deletar" onclick="deletarProduto(${produto.id})">Deletar</button>
        </td>
    `;
    return linha;
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    event.preventDefault();
    salvarProduto();
}

// Função para validar os campos do formulário
function validarFormulario() {
    const nome = document.getElementById('nome').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const preco = document.getElementById('preco').value;
    const categoria = document.getElementById('categoria').value;

    return nome && marca && modelo && preco && categoria; // Retorna true se todos os campos forem preenchidos
}

// Função para salvar o produto no localStorage
function salvarProduto() {
    const produtoId = document.getElementById('produtoId').value;
    const nome = document.getElementById('nome').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const preco = document.getElementById('preco').value;
    const categoria = document.getElementById('categoria').value;

    const dadosProduto = {
        id: gerarIdClienteUnico(), // Gera um ID único para o produto
        nome,
        marca,
        modelo,
        preco,
        categoria
    };

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    if (produtoId) {
        const index = produtos.findIndex(produto => produto.id == produtoId);
        produtos[index] = dadosProduto;
    } else {
        produtos.push(dadosProduto);
    }

    localStorage.setItem('produtos', JSON.stringify(produtos));

    alert('Produto salvo com sucesso!');
    document.getElementById('formularioProduto').reset();
    toggleFormulario(false);
    carregarProdutos();
}

function gerarIdClienteUnico() {
    let clientes = JSON.parse(localStorage.getItem('produtos')) || [];
    let novoId;

    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000).toString(); // Gera número de 11 dígitos
    } while (clientes.some(produto => produto.id === novoId)); // Garante que o ID seja único

    return novoId;
}

// Função para carregar os produtos
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaProdutos');
    corpoTabela.innerHTML = '';

    produtos.forEach(produto => corpoTabela.appendChild(criarLinhaTabela(produto)));
}

// Função para editar um produto
function editarProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(produto => produto.id == id);

    if (!produto) return;

    document.getElementById('produtoId').value = produto.id;
    document.getElementById('nome').value = produto.nome;
    document.getElementById('marca').value = produto.marca;
    document.getElementById('modelo').value = produto.modelo;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('categoria').value = produto.categoria;

    toggleFormulario(true);
}

// Função para deletar um produto
function deletarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    if (confirm('Você tem certeza que deseja excluir esse produto?')) {
        produtos = produtos.filter(produto => produto.id != id);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        alert('Produto deletado com sucesso!');
        carregarProdutos();
    }
}