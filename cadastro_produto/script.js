// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
    configurarOuvintesDeEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesDeEventos() {
    // Mostra o formulário de adicionar produto e esconde a tabela de produtos
    document.getElementById('mostrarFormularioBotao').addEventListener('click', function() {
        document.getElementById('secaoFormularioProduto').style.display = 'block';
        document.querySelector('.tabela-produto').style.display = 'none';
        document.getElementById('mostrarFormularioBotao').style.display = 'none';
    });

    // Remova qualquer evento de submissão existente antes de adicionar um novo
    const formularioProduto = document.getElementById('formularioProduto');
    formularioProduto.removeEventListener('submit', lidarComSubmissaoFormulario); // Remove o evento de submissão existente para evitar a duplicação de eventos
    formularioProduto.addEventListener('submit', lidarComSubmissaoFormulario); // Adiciona um novo evento de submissão para lidar com a submissão do formulário

    // Adiciona um evento para filtrar os produtos com base na entrada de pesquisa
    document.getElementById('entradaPesquisa').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase(); // Obtém o termo de pesquisa digitado pelo usuário em letras minúsculas para facilitar a comparação de string
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const corpoTabela = document.getElementById('corpoTabelaProdutos');
        corpoTabela.innerHTML = '';

        produtos.forEach(produto => { // Percorre cada produto armazenado no localStorage
            if (produto.nome.toLowerCase().includes(termoPesquisa)) { // Verifica se o nome do produto contém o termo de pesquisa digitado
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
                corpoTabela.appendChild(linha);
            }
        });
    });
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    event.preventDefault(); // Previne a ação padrão do formulário (enviar a página)
    salvarProduto(); // Chama a função para salvar o produto
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
        id: produtoId || new Date().getTime(), // Gera um ID único para o produto
        nome: nome,
        marca: marca,
        modelo: modelo,
        preco: preco,
        categoria: categoria
    };

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    if (produtoId) { // Se o ID do produto já existe, atualiza o produto existente com os novos dados do produto
        const index = produtos.findIndex(produto => produto.id == produtoId);
        produtos[index] = dadosProduto; // Atualiza o produto existente com os novos dados do produto
    } else {
        produtos.push(dadosProduto); // Adiciona o novo produto ao array de produtos existente no localStorage
    }

    localStorage.setItem('produtos', JSON.stringify(produtos)); // Salva o array de produtos atualizado no localStorage para persistência

    alert('Produto salvo com sucesso!');

    document.getElementById('formularioProduto').reset(); // Limpa o formulário após salvar o produto
    document.getElementById('secaoFormularioProduto').style.display = 'none';
    document.querySelector('.tabela-produto').style.display = 'block';
    document.getElementById('mostrarFormularioBotao').style.display = 'block';

    carregarProdutos();
}

// Função para carregar os produtos do localStorage e preencher a tabela de produtos
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaProdutos');
    corpoTabela.innerHTML = '';

    produtos.forEach(produto => { // Percorre cada produto armazenado no localStorage e exibe na tabela de produtos na página HTML
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
        corpoTabela.appendChild(linha);
    });
}

// Função para editar um produto
function editarProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(produto => produto.id == id); // Encontra o produto a ser editado no array de produtos com base no ID do produto fornecido

    document.getElementById('produtoId').value = produto.id;
    document.getElementById('nome').value = produto.nome;
    document.getElementById('marca').value = produto.marca;
    document.getElementById('modelo').value = produto.modelo;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('categoria').value = produto.categoria;

    document.getElementById('secaoFormularioProduto').style.display = 'block';
    document.querySelector('.tabela-produto').style.display = 'none';
    document.getElementById('mostrarFormularioBotao').style.display = 'none';
}

// Função para deletar um produto
function deletarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    if (confirm('Você tem certeza que deseja excluir esse produto?')) {
        produtos = produtos.filter(produto => produto.id != id); // Remove o produto a ser deletado do array de produtos com base no ID do produto fornecido
        localStorage.setItem('produtos', JSON.stringify(produtos));
        alert('Produto deletado com sucesso!');
        carregarProdutos();
    }
}