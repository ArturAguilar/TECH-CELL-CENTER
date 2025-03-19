// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarClientes();
    carregarProdutos();
    carregarServicos();
    carregarOrcamentos();
    configurarOuvintesEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesEventos() {
    // Mostra o formulário de adicionar orçamento e esconde a tabela de orçamentos
    document.getElementById('botaoMostrarFormularioOrcamento').addEventListener('click', function() {
        resetarFormularioOrcamento(); // Reseta o formulário ao abrir um novo orçamento
        document.getElementById('secaoFormularioOrcamento').style.display = 'block';
        document.querySelector('.tabela-orcamento').style.display = 'none';
        document.getElementById('botaoMostrarFormularioOrcamento').style.display = 'none';
    });

    // Adiciona um item ao orçamento
    document.getElementById('botaoAdicionarItem').addEventListener('click', adicionarItem);

    // Salva o orçamento
    document.getElementById('botaoSalvarOrcamento').addEventListener('click', salvarOrcamento);

    // Pesquisa de cliente
    document.getElementById('pesquisaCliente').addEventListener('input', function() {
        filtrarOpcoes('cliente', 'pesquisaCliente');
    });

    // Pesquisa de produto
    document.getElementById('pesquisaProduto').addEventListener('input', function() {
        filtrarOpcoes('produto', 'pesquisaProduto');
    });

    // Pesquisa de serviço
    document.getElementById('pesquisaServico').addEventListener('input', function() {
        filtrarOpcoes('servico', 'pesquisaServico');
    });

    // Adiciona um evento para filtrar os orçamentos com base na entrada de pesquisa
    document.getElementById('inputBuscaOrcamento').addEventListener('input', function() {
        const termoBusca = this.value.toLowerCase(); // Obtem o valor da entrada de pesquisa em minúsculas para facilitar a comparação de string
        const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
        const corpoTabela = document.getElementById('corpoTabelaOrcamentos');
        corpoTabela.innerHTML = '';

        orcamentos.forEach(orcamento => { // Percorre cada orçamento armazenado no localStorage
            if (orcamento.cliente.toLowerCase().includes(termoBusca) || orcamento.status.toLowerCase().includes(termoBusca)) { // Verifica se o cliente ou o status do orçamento contém o termo de busca digitado pelo usuário
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${orcamento.id}</td>
                    <td>${orcamento.cliente}</td>
                    <td>${orcamento.status}</td>
                    <td>${orcamento.observacoes}</td>
                    <td>${orcamento.total}</td>
                    <td class="acoes">
                        <button class="editar" onclick="editarOrcamento(${orcamento.id})">Editar</button>
                        <button class="deletar" onclick="deletarOrcamento(${orcamento.id})">Deletar</button>
                    </td>
                `;
                corpoTabela.appendChild(row);
            }
        });
    });
}

// Função para resetar o formulário de orçamento
function resetarFormularioOrcamento() {
    document.getElementById('formularioOrcamento').reset();
    document.getElementById('idOrcamento').value = '';
    document.getElementById('corpoTabelaItensOrcamento').innerHTML = '';
    document.getElementById('precoTotal').textContent = 'R$ 0.00';
    document.getElementById('total').value = '0.00';
}

// Função para carregar os clientes do localStorage e preencher o campo de seleção de clientes
function carregarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const selectCliente = document.getElementById('cliente');
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';

    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.nomeCliente;
        option.textContent = cliente.nomeCliente;
        selectCliente.appendChild(option);
    });
}

// Função para carregar os produtos do localStorage e preencher o campo de seleção de produtos
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const selectProduto = document.getElementById('produto');
    selectProduto.innerHTML = '<option value="">Selecione um produto</option>';

    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.nomeProduto;
        option.textContent = produto.nomeProduto;
        option.dataset.preco = produto.precoProduto;
        selectProduto.appendChild(option);
    });
}

// Função para carregar os serviços do localStorage e preencher o campo de seleção de serviços
function carregarServicos() {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const selectServico = document.getElementById('servico');
    selectServico.innerHTML = '<option value="">Selecione um serviço</option>';

    servicos.forEach(servico => {
        const option = document.createElement('option');
        option.value = servico.nomeServico;
        option.textContent = servico.nomeServico;
        option.dataset.preco = servico.precoServico;
        selectServico.appendChild(option);
    });
}

// Função para carregar os orçamentos do localStorage e preencher a tabela de orçamentos
function carregarOrcamentos() {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaOrcamentos');
    corpoTabela.innerHTML = '';

    orcamentos.forEach(orcamento => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${orcamento.id}</td>
            <td>${orcamento.cliente}</td>
            <td>${orcamento.status}</td>
            <td>${orcamento.observacoes}</td>
            <td>${orcamento.total}</td>
            <td class="acoes">
                <button class="editar" onclick="editarOrcamento(${orcamento.id})">Editar</button>
                <button class="deletar" onclick="deletarOrcamento(${orcamento.id})">Deletar</button>
            </td>
        `;
        corpoTabela.appendChild(row);
    });

    console.log('Orçamentos carregados:', orcamentos);
}

// Função para adicionar um item ao orçamento
function adicionarItem() {
    const produto = document.getElementById('produto').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const servico = document.getElementById('servico').value;

    const precoProduto = getProdutoPreco(produto);
    const precoServico = getServicoPreco(servico);
    const totalItem = (precoProduto * quantidade) + precoServico;

    const corpoTabela = document.getElementById('corpoTabelaItensOrcamento');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${produto}</td>
        <td>${quantidade}</td>
        <td>${servico}</td>
        <td>${totalItem.toFixed(2)}</td>
        <td class="acoes">
            <button class="excluir" onclick="excluirItem(this)">Excluir</button>
        </td>
    `;
    corpoTabela.appendChild(row);

    atualizarTotal();
}

// Função para atualizar o total do orçamento
function atualizarTotal() {
    const corpoTabela = document.getElementById('corpoTabelaItensOrcamento');
    let total = 0;

    corpoTabela.querySelectorAll('tr').forEach(row => {
        const totalItem = parseFloat(row.cells[3].textContent);
        total += totalItem;
    });

    document.getElementById('precoTotal').textContent = `R$ ${total.toFixed(2)}`;
    document.getElementById('total').value = total.toFixed(2);
}

// Função para salvar o orçamento
function salvarOrcamento() {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const idOrcamento = document.getElementById('idOrcamento').value || Date.now();
    const cliente = document.getElementById('cliente').value;
    const status = document.getElementById('status').value;
    const observacoes = document.getElementById('observacoes').value;
    const total = document.getElementById('total').value;

    const novoOrcamento = {
        id: idOrcamento,
        cliente: cliente,
        status: status,
        observacoes: observacoes,
        total: total
    };

    const index = orcamentos.findIndex(orcamento => orcamento.id == idOrcamento);
    if (index >= 0) {
        orcamentos[index] = novoOrcamento;
    } else {
        orcamentos.push(novoOrcamento);
    }

    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

    carregarOrcamentos();
    document.getElementById('secaoFormularioOrcamento').style.display = 'none';
    document.querySelector('.tabela-orcamento').style.display = 'block';
    document.getElementById('botaoMostrarFormularioOrcamento').style.display = 'block';
}

// Função para excluir um item do orçamento
function excluirItem(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    atualizarTotal();
}

// Função para excluir um orçamento
function deletarOrcamento(id) {
    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    if (confirm('Você tem certeza que deseja excluir esse orçamento?')) {
        orcamentos = orcamentos.filter(orcamento => orcamento.id != id); // Remove o orçamento a ser deletado do array de orçamentos com base no ID do orçamento fornecido  
        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
        alert('Orçamento deletado com sucesso!');
        carregarOrcamentos();
    }
}

// Função para editar um orçamento
function editarOrcamento(id) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos.find(orcamento => orcamento.id === id);

    if (orcamento) {
        document.getElementById('idOrcamento').value = orcamento.id;
        document.getElementById('cliente').value = orcamento.cliente;
        document.getElementById('status').value = orcamento.status;
        document.getElementById('observacoes').value = orcamento.observacoes;
        document.getElementById('total').value = orcamento.total;

        document.getElementById('secaoFormularioOrcamento').style.display = 'block';
        document.querySelector('.tabela-orcamento').style.display = 'none';
        document.getElementById('botaoMostrarFormularioOrcamento').style.display = 'none';
    }
}

// Função para obter o preço do produto
function getProdutoPreco(produto) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const produtoEncontrado = produtos.find(p => p.nomeProduto === produto);
    return produtoEncontrado ? produtoEncontrado.precoProduto : 0;
}

// Função para obter o preço do serviço
function getServicoPreco(servico) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const servicoEncontrado = servicos.find(s => s.nomeServico === servico);
    return servicoEncontrado ? servicoEncontrado.precoServico : 0;
}

// Função para filtrar as opções de cliente, produto ou serviço
function filtrarOpcoes(tipo, inputId) {
    const termoBusca = document.getElementById(inputId).value.toLowerCase();
    const select = document.getElementById(tipo);
    const opcoes = select.querySelectorAll('option');

    opcoes.forEach(opcao => {
        if (opcao.value.toLowerCase().includes(termoBusca)) {
            opcao.style.display = '';
        } else {
            opcao.style.display = 'none';
        }
    });
}