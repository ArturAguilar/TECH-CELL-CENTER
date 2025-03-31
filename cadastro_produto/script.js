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

    document.querySelectorAll('input[name="statusProduto"]').forEach(radio => {
        radio.addEventListener('change', filtrarProdutos);
    });

    document.getElementById('preco').addEventListener('input', function() {
        this.value = formatarPreco(this.value);
    });
}

// Função para alternar a exibição do formulário
function toggleFormulario(mostrar) {
    document.getElementById('secaoFormularioProduto').style.display = mostrar ? 'block' : 'none';
    document.querySelector('.tabela-produto').style.display = mostrar ? 'none' : 'block';
    document.getElementById('mostrarFormularioBotao').style.display = mostrar ? 'none' : 'block';
}

// Função para filtrar os produtos
function filtrarProdutos() {
    const termoPesquisa = document.getElementById('entradaPesquisa').value.trim().toLowerCase();
    const statusFiltro = document.querySelector('input[name="statusProduto"]:checked').value;
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaProdutos');
    corpoTabela.innerHTML = '';

    produtos.forEach(produto => {
        const nomeIncluiTermo = produto.nome.toLowerCase().includes(termoPesquisa);
        const statusCorreto = (statusFiltro === 'ativos' && produto.ativo !== false) ||
                              (statusFiltro === 'inativos' && produto.ativo === false);

        if (nomeIncluiTermo && statusCorreto) {
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
        <td>R$ ${produto.preco.toFixed(2).replace(".", ",")}</td> <!-- Exibe o preço formatado -->
        <td>${produto.categoria}</td>
        <td class="acoes">
            ${produto.ativo ? `
                <button class="editar" onclick="editarProduto('${produto.id}')">Editar</button>
                <button class="inativar" onclick="inativarProduto('${produto.id}')">Inativar</button>
            ` : `
                <button class="ativar" onclick="ativarProduto('${produto.id}')">Ativar</button>
                <button class="deletar" onclick="deletarProduto('${produto.id}')">Excluir</button>
            `}
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
    let preco = document.getElementById('preco').value;
    const categoria = document.getElementById('categoria').value;

    if (!validarPreco(preco)) {
        alert('Por favor, insira um preço válido.');
        return;
    }

    // Converte o preço para número
    preco = parseFloat(preco.replace(/[^\d,]/g, "").replace(",", "."));

    const dadosProduto = {
        id: produtoId ? parseInt(produtoId) : gerarIdProdutoUnico(),
        nome,
        marca,
        modelo,
        preco, // Armazena o preço como número
        categoria,
        ativo: true
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

// Função para gerar um ID único para o produto
function gerarIdProdutoUnico() {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let novoId;

    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000); // Gera número de 11 dígitos
    } while (produtos.some(produto => produto.id === novoId)); // Garante que o ID seja único

    return novoId;
}

// Função para carregar os produtos
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaProdutos');
    corpoTabela.innerHTML = '';

    produtos.forEach(produto => corpoTabela.appendChild(criarLinhaTabela(produto)));

    filtrarProdutos(); // Aplica o filtro de status e pesquisa após carregar todos os produtos
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
    document.getElementById('preco').value = produto.preco.toFixed(2).replace(".", ","); // Exibe o preço formatado
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

// Função para inativar um produto
function inativarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const index = produtos.findIndex(produto => produto.id == id);
    if (index !== -1) {
        produtos[index].ativo = false;
        localStorage.setItem('produtos', JSON.stringify(produtos));
        alert('Produto inativado com sucesso!');
        carregarProdutos();
    }
}

// Função para ativar um produto
function ativarProduto(id) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const index = produtos.findIndex(produto => produto.id == id);
    if (index !== -1) {
        produtos[index].ativo = true;
        localStorage.setItem('produtos', JSON.stringify(produtos));
        alert('Produto ativado com sucesso!');
        carregarProdutos();
    }
}

// Função para formatar o preço
function formatarPreco(preco) {
    preco = preco.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    preco = (parseFloat(preco) / 100).toFixed(2) + ''; // Converte para número e fixa duas casas decimais
    preco = preco.replace(".", ","); // Substitui ponto por vírgula
    preco = preco.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona pontos como separadores de milhar
    return "R$ " + preco;
}

// Função para validar o preço
function validarPreco(preco) {
    const precoNumerico = parseFloat(preco.replace(/[^\d,]/g, "").replace(",", "."));
    return !isNaN(precoNumerico) && precoNumerico > 0;
}

// Função para salvar o orçamento no localStorage
function salvarOrcamento() {
    const orcamentoId = document.getElementById('orcamentoId').value;
    const cliente = document.getElementById('cliente').value;
    const itens = JSON.parse(localStorage.getItem('itensOrcamento')) || [];
    const status = document.getElementById('status').value;
    const formaPagamento = document.getElementById('formaPagamento').value;

    // Calcula o total do orçamento
    const total = itens.reduce((sum, item) => {
        const totalProduto = parseFloat(item.precoProduto) * item.quantidade || 0;
        const totalServico = parseFloat(item.precoServico) || 0;
        return sum + totalProduto + totalServico;
    }, 0);

    const dadosOrcamento = {
        id: orcamentoId ? parseInt(orcamentoId) : gerarIdOrcamentoUnico(),
        cliente,
        itens,
        status,
        formaPagamento,
        total: total.toFixed(2)
    };

    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];

    if (orcamentoId) {
        const index = orcamentos.findIndex(orcamento => orcamento.id == orcamentoId);
        orcamentos[index] = dadosOrcamento;
    } else {
        orcamentos.push(dadosOrcamento);
    }

    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

    alert('Orçamento salvo com sucesso!');
    document.getElementById('formularioOrcamento').reset();
    carregarOrcamentos();
}