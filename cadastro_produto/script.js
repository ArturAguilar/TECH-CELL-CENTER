// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    carregarProdutos();
    configurarOuvintesDeEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesDeEventos() {
    document.getElementById('mostrarFormularioBotao').addEventListener('click', function () {
        toggleFormulario(true);
    });

    const formularioProduto = document.getElementById('formularioProduto');
    formularioProduto.addEventListener('submit', salvarProduto);

    document.getElementById('entradaPesquisa').addEventListener('input', filtrarProdutos);

    document.querySelectorAll('input[name="statusProduto"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const filtro = this.value; // "ativos" ou "inativos"
            carregarProdutos(filtro);
        });
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
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaProdutos');

    // Verifica o status atual (ativos ou inativos)
    const statusAtual = document.querySelector('input[name="statusFiltroProduto"]:checked').value;

    // Filtra os produtos com base no status e no termo de pesquisa
    const produtosFiltrados = produtos.filter(produto => {
        const correspondeStatus = statusAtual === 'ativos' ? produto.ativo : !produto.ativo;
        const correspondePesquisa = produto.nome.toLowerCase().includes(termoPesquisa);
        return correspondeStatus && correspondePesquisa;
    });

    // Limpa a tabela antes de preenchê-la
    corpoTabela.innerHTML = '';

    // Exibe uma mensagem se não houver produtos no filtro atual
    if (produtosFiltrados.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.innerHTML = `<td colspan="6" style="text-align: center;">Nenhum produto encontrado.</td>`;
        corpoTabela.appendChild(linhaVazia);
        return;
    }

    // Adiciona os produtos filtrados na tabela
    produtosFiltrados.forEach(produto => {
        const linha = criarLinhaTabela(produto);
        if (linha) {
            corpoTabela.appendChild(linha);
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
        <td>R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
        <td>${produto.categoria}</td>
        <td class="acoes">
            <button class="editar" onclick="editarProduto('${produto.id}')">Editar</button>
            <button class="deletar" onclick="deletarProduto('${produto.id}')">Excluir</button>
        </td>
    `;
    return linha;
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    salvarProduto(event);
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
function salvarProduto(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    const produtoId = document.getElementById('produtoId').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const preco = parseFloat(document.getElementById('preco').value.replace(/[^\d,]/g, "").replace(",", "."));
    const categoria = document.getElementById('categoria').value.trim();
    const status = document.querySelector('input[name="statusProduto"]:checked').value; // Obtém o status selecionado

    if (!nome || !marca || !modelo || isNaN(preco) || !categoria) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const dadosProduto = {
        id: produtoId ? parseInt(produtoId) : gerarIdProdutoUnico(),
        nome,
        marca,
        modelo,
        preco,
        categoria,
        ativo: status === 'ativo' // Define o status como booleano
    };

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    if (produtoId) {
        const index = produtos.findIndex(produto => produto.id == produtoId);
        if (index !== -1) {
            produtos[index] = dadosProduto;
        }
    } else {
        produtos.push(dadosProduto);
    }

    localStorage.setItem('produtos', JSON.stringify(produtos));
    alert('Produto salvo com sucesso!');
    document.getElementById('formularioProduto').reset();
    toggleFormulario(false);

    location.reload();
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
function carregarProdutos(filtro = 'ativos') {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaProdutos');

    // Filtra os produtos com base no status
    const produtosFiltrados = produtos.filter(produto => {
        return filtro === 'ativos' ? produto.ativo : !produto.ativo;
    });

    // Limpa a tabela antes de preenchê-la
    corpoTabela.innerHTML = '';

    // Adiciona os produtos filtrados na tabela
    produtosFiltrados.forEach(produto => {
        const linha = criarLinhaTabela(produto);
        if (linha) {
            corpoTabela.appendChild(linha);
        }
    });

    // Exibe uma mensagem se não houver produtos no filtro atual
    if (produtosFiltrados.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.innerHTML = `<td colspan="8" style="text-align: center;">Nenhum produto encontrado.</td>`;
        corpoTabela.appendChild(linhaVazia);
    }
}

// Função para editar um produto
function editarProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produto = produtos.find(produto => produto.id == id);
    if (!produto) return;

    // Preenche os campos do formulário com os dados do produto
    document.getElementById('produtoId').value = produto.id;
    document.getElementById('nome').value = produto.nome || '';
    document.getElementById('marca').value = produto.marca || '';
    document.getElementById('modelo').value = produto.modelo || '';
    document.getElementById('preco').value = produto.preco.toFixed(2).replace(".", ",");
    document.getElementById('categoria').value = produto.categoria || '';

    // Define o status do produto
    if (produto.ativo) {
        document.getElementById('statusAtivo').checked = true;
    } else {
        document.getElementById('statusInativo').checked = true;
    }

    // Exibe o formulário para edição
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

function aplicarMascaraPreco(campo) {
    let valor = campo.value.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    valor = (parseFloat(valor) / 100).toFixed(2) + ""; // Converte para número e fixa duas casas decimais
    valor = valor.replace(".", ","); // Substitui ponto por vírgula
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona pontos como separadores de milhar
    campo.value = "R$ " + valor; // Adiciona o prefixo "R$"
}

// Função para validar o preço
function validarPreco(preco) {
    const precoNumerico = parse
    Float(preco.replace(/[^\d,]/g, "").replace(",", "."));
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

// Função para cancelar o formulário
function cancelarFormulario() {
    document.getElementById('formularioProduto').reset(); // Reseta os campos do formulário
    toggleFormulario(false); // Oculta o formulário e exibe a tabela
}