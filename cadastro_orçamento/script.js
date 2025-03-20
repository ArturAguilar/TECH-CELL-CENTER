document.addEventListener('DOMContentLoaded', function() {
    carregarClientes();
    carregarProdutos();
    carregarServicos();
    configurarOuvintesEventos();
    carregarOrcamentos(); // Carregar orçamentos na tabela

    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const menuNav = document.querySelector('.menu-nav');

    menuToggle.addEventListener('click', function() {
        menuNav.classList.toggle('ativo');
        menuToggle.classList.toggle('ativo');
    });

    // Mostrar formulário de adicionar orçamento
    const mostrarFormularioBotao = document.getElementById('mostrarFormularioBotao');
    const secaoFormularioOrcamento = document.getElementById('secaoFormularioOrcamento');
    const secaoTabelaOrcamentos = document.getElementById('secaoTabelaOrcamentos');

    mostrarFormularioBotao.addEventListener('click', function() {
        secaoFormularioOrcamento.style.display = 'block';
        mostrarFormularioBotao.style.display = 'none';
        secaoTabelaOrcamentos.style.display = 'none';
    });

    // Função para filtrar orçamentos pelo nome do cliente
    const entradaPesquisaOrcamento = document.getElementById('entradaPesquisaOrcamento');
    entradaPesquisaOrcamento.addEventListener('input', function() {
        const termoPesquisa = entradaPesquisaOrcamento.value.toLowerCase();
        const linhas = document.querySelectorAll('#corpoTabelaOrcamentos tr');
        linhas.forEach(linha => {
            const cliente = linha.querySelector('td:nth-child(2)').textContent.toLowerCase();
            if (cliente.includes(termoPesquisa)) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    });
});

function fecharMenu() {
    const menuNav = document.querySelector('.menu-nav');
    const menuToggle = document.getElementById('menuToggle');
    menuNav.classList.remove('ativo');
    menuToggle.classList.remove('ativo');
}

// Função para carregar os clientes do localStorage e preencher o select de clientes
function carregarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const selectCliente = document.getElementById('cliente');
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nome;
        selectCliente.appendChild(option);
    });

    // Adiciona um evento para filtrar os clientes com base na entrada de pesquisa
    document.getElementById('pesquisaCliente').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
        clientes.forEach(cliente => {
            if (cliente.nome.toLowerCase().includes(termoPesquisa)) {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nome;
                selectCliente.appendChild(option);
            }
        });
    });
}

// Função para carregar os produtos do localStorage e preencher o select de produtos
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const selectProduto = document.getElementById('produto');
    selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = `${produto.nome} - ${produto.marca} - ${produto.modelo}`;
        option.setAttribute('data-preco', produto.preco);
        option.setAttribute('data-marca', produto.marca);
        option.setAttribute('data-modelo', produto.modelo);
        selectProduto.appendChild(option);
    });

    // Adiciona um evento para filtrar os produtos com base na entrada de pesquisa
    document.getElementById('pesquisaProduto').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
        produtos.forEach(produto => {
            if (produto.nome.toLowerCase().includes(termoPesquisa) || produto.marca.toLowerCase().includes(termoPesquisa) || produto.modelo.toLowerCase().includes(termoPesquisa)) {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = `${produto.nome} - ${produto.marca} - ${produto.modelo}`;
                option.setAttribute('data-preco', produto.preco);
                option.setAttribute('data-marca', produto.marca);
                option.setAttribute('data-modelo', produto.modelo);
                selectProduto.appendChild(option);
            }
        });
    });
}

// Função para carregar os serviços do localStorage e preencher o select de serviços
function carregarServicos() {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const selectServico = document.getElementById('servico');
    selectServico.innerHTML = '<option value="">Selecione um serviço</option>';
    servicos.forEach(servico => {
        const option = document.createElement('option');
        option.value = servico.id;
        option.textContent = servico.nomeServico;
        option.setAttribute('data-preco', servico.preco);
        selectServico.appendChild(option);
    });

    // Adiciona um evento para filtrar os serviços com base na entrada de pesquisa
    document.getElementById('pesquisaServico').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        selectServico.innerHTML = '<option value="">Selecione um serviço</option>';
        servicos.forEach(servico => {
            if (servico.nomeServico.toLowerCase().includes(termoPesquisa)) {
                const option = document.createElement('option');
                option.value = servico.id;
                option.textContent = servico.nomeServico;
                option.setAttribute('data-preco', servico.preco);
                selectServico.appendChild(option);
            }
        });
    });
}

// Função para configurar os ouvintes de eventos
function configurarOuvintesEventos() {
    document.getElementById('botaoAdicionarItem').addEventListener('click', adicionarItem);
    document.getElementById('botaoSalvarOrcamento').addEventListener('click', salvarOrcamento);
    document.getElementById('produto').addEventListener('change', atualizarPreco);
    document.getElementById('servico').addEventListener('change', atualizarPreco);
    document.getElementById('quantidade').addEventListener('input', atualizarPreco);
}

let itensOrcamento = [];
let indiceItemEdicao = -1;

// Função para adicionar um item ao orçamento
function adicionarItem() {
    const selectProduto = document.getElementById('produto');
    const inputQuantidade = document.getElementById('quantidade');
    const selectServico = document.getElementById('servico');
    const inputPreco = document.getElementById('preco');

    const produto = selectProduto.options[selectProduto.selectedIndex].text;
    const quantidade = parseInt(inputQuantidade.value);
    const servico = selectServico.options[selectServico.selectedIndex].text;
    const precoProduto = parseFloat(selectProduto.options[selectProduto.selectedIndex].getAttribute('data-preco'));
    const precoServico = parseFloat(selectServico.options[selectServico.selectedIndex].getAttribute('data-preco'));
    const precoTotal = parseFloat(inputPreco.value).toFixed(2);

    if (produto && quantidade && servico && precoTotal) {
        itensOrcamento.push({ produto, quantidade, servico, precoProduto, precoServico, precoTotal });
        atualizarTabelaItensOrcamento();
        alert('Item adicionado ao orçamento!');
        document.getElementById('formularioOrcamento').reset();
    } else {
        alert('Por favor, selecione um produto, uma quantidade, um serviço e um preço válido.');
    }
}

// Função para atualizar a tabela de itens do orçamento
function atualizarTabelaItensOrcamento() {
    const corpoTabelaItensOrcamento = document.getElementById('corpoTabelaItensOrcamento');
    corpoTabelaItensOrcamento.innerHTML = '';

    itensOrcamento.forEach((item, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${item.produto}</td>
            <td>${item.quantidade}</td>
            <td>${item.servico}</td>
            <td>R$ ${item.precoTotal}</td>
            <td>
                <button onclick="deletarItem(${index})">Deletar</button>
            </td>
        `;
        corpoTabelaItensOrcamento.appendChild(linha);
    });

    atualizarPrecoTotal();
}

// Função para deletar um item do orçamento
function deletarItem(index) {
    itensOrcamento.splice(index, 1);
    atualizarTabelaItensOrcamento();
}

// Função para salvar o orçamento
function salvarOrcamento() {
    const orcamentoId = document.getElementById('orcamentoId').value;
    const selectCliente = document.getElementById('cliente');
    const selectStatus = document.getElementById('status');
    const selectFormaPagamento = document.getElementById('formaPagamento');

    const cliente = selectCliente.options[selectCliente.selectedIndex].text;
    const status = selectStatus.value;
    const formaPagamento = selectFormaPagamento.value;

    const total = itensOrcamento.reduce((sum, item) => sum + parseFloat(item.precoTotal) * item.quantidade, 0).toFixed(2);

    const dadosOrcamento = {
        id: orcamentoId ? orcamentoId : new Date().getTime(),
        cliente: cliente,
        itens: itensOrcamento,
        status: status,
        formaPagamento: formaPagamento,
        total: total
    };

    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];

    if (orcamentoId) {
        const index = orcamentos.findIndex(orcamento => orcamento.id == orcamentoId);
        orcamentos[index] = dadosOrcamento;
    } else {
        orcamentos.unshift(dadosOrcamento); // Adiciona o novo orçamento no início da lista
    }

    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

    alert('Orçamento salvo com sucesso!');

    document.getElementById('formularioOrcamento').reset();
    itensOrcamento = [];
    atualizarTabelaItensOrcamento();
    carregarOrcamentos(); // Atualizar a tabela de orçamentos

    // Esconder o formulário e mostrar o botão "Criar Novo Orçamento"
    document.getElementById('secaoFormularioOrcamento').style.display = 'none';
    document.getElementById('mostrarFormularioBotao').style.display = 'block';
}

// Função para atualizar o preço total do orçamento
function atualizarPrecoTotal() {
    let precoTotal = 0;

    itensOrcamento.forEach(item => {
        precoTotal += parseFloat(item.precoTotal) * item.quantidade;
    });

    document.getElementById('precoTotal').textContent = `R$ ${precoTotal.toFixed(2)}`;
}

// Função para atualizar o preço com base no produto, serviço e quantidade selecionados
function atualizarPreco() {
    const selectProduto = document.getElementById('produto');
    const selectServico = document.getElementById('servico');
    const inputQuantidade = document.getElementById('quantidade');
    const inputPreco = document.getElementById('preco');

    const precoProduto = parseFloat(selectProduto.options[selectProduto.selectedIndex].getAttribute('data-preco')) || 0;
    const precoServico = parseFloat(selectServico.options[selectServico.selectedIndex].getAttribute('data-preco')) || 0;
    const quantidade = parseInt(inputQuantidade.value) || 1;

    const precoTotal = (precoProduto * quantidade) + precoServico;
    inputPreco.value = precoTotal.toFixed(2);
}

// Função para carregar os orçamentos do localStorage e preencher a tabela de orçamentos
function carregarOrcamentos() {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const corpoTabelaOrcamentos = document.getElementById('corpoTabelaOrcamentos');
    corpoTabelaOrcamentos.innerHTML = '';

    orcamentos.forEach((orcamento, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${orcamento.id}</td>
            <td>${orcamento.cliente}</td>
            <td>${orcamento.itens.map(item => `${item.produto} (${item.quantidade})`).join(', ')}</td>
            <td>R$ ${orcamento.total}</td>
            <td>${orcamento.status}</td>
            <td>${orcamento.formaPagamento}</td>
            <td class="acoes">
                <button class="editar" onclick="editarOrcamento(${index})">Editar</button>
                <button class="deletar" onclick="deletarOrcamento(${index})">Deletar</button>
            </td>
        `;
        corpoTabelaOrcamentos.appendChild(linha);
    });

    // Mostrar a tabela de orçamentos registrados
    document.getElementById('secaoTabelaOrcamentos').style.display = 'block';
}

// Função para editar um orçamento
function editarOrcamento(index) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos[index];

    document.getElementById('orcamentoId').value = orcamento.id;
    document.getElementById('cliente').value = orcamento.cliente;
    document.getElementById('status').value = orcamento.status;
    document.getElementById('formaPagamento').value = orcamento.formaPagamento;

    itensOrcamento = orcamento.itens;
    atualizarTabelaItensOrcamento();

    document.getElementById('secaoFormularioOrcamento').style.display = 'block';
    document.getElementById('mostrarFormularioBotao').style.display = 'none';
    document.getElementById('secaoTabelaOrcamentos').style.display = 'none';
}

// Função para deletar um orçamento
function deletarOrcamento(index) {
    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    orcamentos.splice(index, 1);
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    carregarOrcamentos();
}
