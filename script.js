document.addEventListener('DOMContentLoaded', function() {
    carregarClientes();
    carregarProdutos();
    carregarServicos();
    configurarOuvintesEventos();
    carregarOrcamentoEdicao(); // Carregar dados do orçamento para edição, se houver
});

// Função para carregar os clientes do localStorage e preencher o select de clientes
function carregarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const selectCliente = document.getElementById('cliente');
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nome;
        option.setAttribute('data-telefone', cliente.telefone); // Adiciona o número de telefone ao atributo data-telefone
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
                option.setAttribute('data-telefone', cliente.telefone); // Adiciona o número de telefone ao atributo data-telefone
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
    const preco = parseFloat(inputPreco.value).toFixed(2);

    if (produto && quantidade && servico && preco) {
        if (indiceItemEdicao === -1) {
            itensOrcamento.push({ produto, quantidade, servico, preco });
        } else {
            itensOrcamento[indiceItemEdicao] = { produto, quantidade, servico, preco };
            indiceItemEdicao = -1;
        }
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
            <td>R$ ${item.preco}</td>
            <td>
                <button onclick="editarItem(${index})">Editar</button>
                <button onclick="deletarItem(${index})">Deletar</button>
            </td>
        `;
        corpoTabelaItensOrcamento.appendChild(linha);
    });

    atualizarPrecoTotal();
}

// Função para editar um item do orçamento
function editarItem(index) {
    const item = itensOrcamento[index];
    document.getElementById('produto').value = item.produto;
    document.getElementById('quantidade').value = item.quantidade;
    document.getElementById('servico').value = item.servico;
    document.getElementById('preco').value = item.preco;
    indiceItemEdicao = index;
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
    const inputObservacoes = document.getElementById('observacoes');

    const cliente = selectCliente.options[selectCliente.selectedIndex].text;
    const status = selectStatus.value;
    const observacoes = inputObservacoes.value;

    const total = itensOrcamento.reduce((sum, item) => sum + parseFloat(item.preco) * item.quantidade, 0).toFixed(2);

    const dadosOrcamento = {
        id: orcamentoId ? orcamentoId : new Date().getTime(),
        cliente: cliente,
        itens: itensOrcamento,
        status: status,
        observacoes: observacoes,
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
    carregarOrcamentos(); // Atualizar a dashboard após salvar o orçamento
}

// Função para atualizar o preço total do orçamento
function atualizarPrecoTotal() {
    let precoTotal = 0;

    itensOrcamento.forEach(item => {
        precoTotal += parseFloat(item.preco) * item.quantidade;
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

// Função para carregar os orçamentos do localStorage e preencher a tabela da dashboard
function carregarOrcamentos() {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const corpoTabelaDashboard = document.getElementById('corpoTabelaDashboard');
    corpoTabelaDashboard.innerHTML = '';

    orcamentos.forEach(orcamento => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${orcamento.cliente}</td>
            <td>${orcamento.itens.map(item => item.produto).join(', ')}</td>
            <td>${orcamento.itens.map(item => item.quantidade).join(', ')}</td>
            <td>${orcamento.itens.map(item => item.servico).join(', ')}</td>
            <td>R$ ${orcamento.total}</td>
            <td>${orcamento.status}</td>
            <td>${orcamento.formaPagamento}</td>
            <td>
                <button onclick="deletarOrcamento(${orcamento.id})">Deletar</button>
            </td>
        `;
        corpoTabelaDashboard.appendChild(linha);
    });
}

// Função para deletar um orçamento
function deletarOrcamento(id) {
    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    orcamentos = orcamentos.filter(orcamento => orcamento.id !== id);
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    carregarOrcamentos(); // Atualizar a dashboard após deletar o orçamento
}

// Função para carregar os dados do orçamento para edição
function carregarOrcamentoEdicao() {
    const orcamentoId = localStorage.getItem('orcamentoEdicaoId');
    if (orcamentoId) {
        const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
        const orcamento = orcamentos.find(orcamento => orcamento.id == orcamentoId);

        if (orcamento) {
            document.getElementById('orcamentoId').value = orcamento.id;
            document.getElementById('cliente').value = orcamento.cliente;
            document.getElementById('status').value = orcamento.status;
            document.getElementById('observacoes').value = orcamento.observacoes;
            document.getElementById('formaPagamento').value = orcamento.formaPagamento;
            itensOrcamento = orcamento.itens;
            atualizarTabelaItensOrcamento();
        }

        localStorage.removeItem('orcamentoEdicaoId');
    }
}