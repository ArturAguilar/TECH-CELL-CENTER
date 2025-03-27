// Executa quando o DOM é completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarAplicacao();
});

function inicializarAplicacao() {
    carregarClientes();
    carregarProdutos();
    carregarServicos();
    configurarOuvintesEventos();
    carregarOrcamentos();
    configurarFiltroOrcamentos();
}

function configurarFiltroOrcamentos() {
    const entradaPesquisaOrcamento = document.getElementById('entradaPesquisaOrcamento');
    entradaPesquisaOrcamento.addEventListener('input', function() {
        const termoPesquisa = entradaPesquisaOrcamento.value.toLowerCase();
        const linhas = document.querySelectorAll('#corpoTabelaOrcamentos tr');
        linhas.forEach(linha => {
            const cliente = linha.querySelector('td:nth-child(2)').textContent.toLowerCase();
            linha.style.display = cliente.includes(termoPesquisa) ? '' : 'none';
        });
    });
}

// Função para carregar os clientes do localStorage e preencher o select de clientes
function carregarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const inputPesquisaCliente = document.getElementById('pesquisaCliente');
    const listaClientes = document.getElementById('listaClientes');

    inputPesquisaCliente.addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        listaClientes.innerHTML = '';

        clientes.forEach(cliente => {
            if (cliente.nome.toLowerCase().includes(termoPesquisa) && cliente.ativo) {
                const li = document.createElement('li');
                li.textContent = cliente.nome;
                li.setAttribute('data-id', cliente.id);
                li.setAttribute('data-telefone', cliente.telefone);
                li.setAttribute('data-endereco', cliente.endereco);
                li.setAttribute('data-cpf', cliente.cpf);
                li.addEventListener('click', function() {
                    inputPesquisaCliente.value = cliente.nome;
                    listaClientes.innerHTML = ''; // Limpa as sugestões após a seleção
                });
                listaClientes.appendChild(li);
            }
        });
    });

    inputPesquisaCliente.addEventListener('blur', function() {
        const termoPesquisa = this.value.toLowerCase();
        const clienteValido = clientes.some(cliente => cliente.nome.toLowerCase() === termoPesquisa && cliente.ativo);

        if (!clienteValido) {
            this.value = '';
        }
        listaClientes.innerHTML = '';
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
        option.textContent = `${produto.nome} - ${produto.marca} - ${produto.modelo} - R$ ${produto.preco}`;
        option.setAttribute('data-preco', produto.preco);
        option.setAttribute('data-marca', produto.marca);
        option.setAttribute('data-modelo', produto.modelo);
        selectProduto.appendChild(option);
    });

    document.getElementById('pesquisaProduto').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
        produtos.forEach(produto => {
            if (produto.nome.toLowerCase().includes(termoPesquisa) || produto.marca.toLowerCase().includes(termoPesquisa) || produto.modelo.toLowerCase().includes(termoPesquisa)) {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = `${produto.nome} - ${produto.marca} - ${produto.modelo} - R$ ${produto.preco}`;
                option.setAttribute('data-preco', produto.preco);
                option.setAttribute('data-marca', produto.marca);
                option.setAttribute('data-modelo', produto.modelo);
                option.addEventListener('click', function() {
                    document.getElementById('pesquisaProduto').value = produto.nome;
                    selectProduto.innerHTML = '';
                });
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
        option.textContent = `${servico.nomeServico} - ${servico.tempoBase} dias - R$ ${servico.preco}`;
        option.setAttribute('data-preco', servico.preco);
        selectServico.appendChild(option);
    });

    document.getElementById('pesquisaServico').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase();
        selectServico.innerHTML = '<option value="">Selecione um serviço</option>';
        servicos.forEach(servico => {
            if (servico.nomeServico.toLowerCase().includes(termoPesquisa)) {
                const option = document.createElement('option');
                option.value = servico.id;
                option.textContent = `${servico.nomeServico} - R$ ${servico.preco} - ${servico.tempoBase} dias`;
                option.setAttribute('data-preco', servico.preco);
                option.addEventListener('click', function() {
                    document.getElementById('pesquisaServico').value = servico.nomeServico;
                    selectServico.innerHTML = '';
                });
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
    document.getElementById('botaoMostrarFormulario').addEventListener('click', function() {
        document.getElementById('secaoFormularioOrcamento').style.display = 'block';
        document.getElementById('botaoMostrarFormulario').style.display = 'none';
        document.getElementById('secaoTabelaOrcamentos').style.display = 'none';
    });
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
    const precoProduto = parseFloat(selectProduto.options[selectProduto.selectedIndex].getAttribute('data-preco')) || 0;
    const precoServico = parseFloat(selectServico.options[selectServico.selectedIndex].getAttribute('data-preco')) || 0;
    const tempoServico = parseFloat(selectServico.options[selectServico.selectedIndex].getAttribute('data-tempo')) || 0;
    const precoTotal = (precoProduto * quantidade + precoServico).toFixed(2);

    if ((produto && quantidade && !isNaN(precoProduto)) || (servico && !isNaN(precoServico) && !isNaN(tempoServico))) {
        itensOrcamento.push({ produto, quantidade, servico, precoProduto, precoServico, precoTotal, tempoServico });
        atualizarTabelaItensOrcamento();
        document.getElementById('formularioOrcamento').reset();
        atualizarPrecoTotal();
    } else {
        alert('Por favor, selecione um produto ou um serviço válido.');
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
            <td><button onclick="deletarItem(${index})">Deletar</button></td>
        `;
        corpoTabelaItensOrcamento.appendChild(linha);
    });
    atualizarPrecoTotal();
}

// Função para deletar um item do orçamento
function deletarItem(index) {
    itensOrcamento.splice(index, 1);
    atualizarTabelaItensOrcamento();
    atualizarPrecoTotal();
}

// Função para salvar o orçamento
function salvarOrcamento(event) {
    event.preventDefault();
    const orcamentoId = document.getElementById('orcamentoId').value;
    const pesquisaCliente = document.getElementById('pesquisaCliente').value;
    const selectStatus = document.getElementById('status');
    const selectFormaPagamento = document.getElementById('formaPagamento');

    const listaClientes = document.getElementById('listaClientes');
    const clienteOption = Array.from(listaClientes.children).find(li => li.textContent === pesquisaCliente);

    if (!clienteOption) {
        alert('Por favor, selecione um cliente válido.');
        return;
    }

    const clienteId = clienteOption.getAttribute('data-id');
    const clienteNome = clienteOption.textContent;
    const clienteTelefone = clienteOption.getAttribute('data-telefone');
    const clienteEndereco = clienteOption.getAttribute('data-endereco');
    const clienteCPF = clienteOption.getAttribute('data-cpf');
    const status = selectStatus.value;
    const formaPagamento = selectFormaPagamento.value;

    const total = itensOrcamento.reduce((sum, item) => sum + parseFloat(item.precoTotal), 0).toFixed(2);

    const dadosOrcamento = {
        id: orcamentoId ? orcamentoId : gerarIdUnico(),
        clienteId,
        clienteNome,
        clienteTelefone,
        clienteEndereco,
        clienteCPF,
        itens: itensOrcamento,
        status,
        formaPagamento,
        total
    };

    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];

    if (orcamentoId) {
        const index = orcamentos.findIndex(orcamento => orcamento.id == orcamentoId);
        orcamentos[index] = dadosOrcamento;
    } else {
        orcamentos.unshift(dadosOrcamento);
    }

    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

    alert('Orçamento salvo com sucesso!');

    document.getElementById('formularioOrcamento').reset();
    itensOrcamento = [];
    atualizarTabelaItensOrcamento();
    atualizarPrecoTotal();
    carregarOrcamentos();

    document.getElementById('secaoFormularioOrcamento').style.display = 'none';
    document.getElementById('mostrarFormularioBotao').style.display = 'block';
}

// Função para atualizar o preço total do orçamento
function atualizarPrecoTotal() {
    let precoTotal = 0;

    itensOrcamento.forEach(item => {
        precoTotal += (parseFloat(item.precoProduto) * item.quantidade) + parseFloat(item.precoServico);
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
        const produtos = orcamento.itens.filter(item => item.produto).map(item => `${item.produto} (${item.quantidade})`).join(', ');
        const servicos = orcamento.itens.filter(item => item.servico).map(item => `${item.servico}`).join(', ');

        linha.innerHTML = `
            <td>${orcamento.id}</td>
            <td>${orcamento.clienteNome}</td>
            <td>${produtos}</td>
            <td>${servicos}</td>
            <td>R$ ${orcamento.total}</td>
            <td>${orcamento.status}</td>
            <td>${orcamento.formaPagamento}</td>
            <td class="acoes">
                <button class="editar" onclick="editarOrcamento(${index})">Editar</button>
                <button class="deletar" onclick="deletarOrcamento(${index})">Deletar</button>
                <button class="enviar" onclick="mandarWhatsApp(${index})">WhatsApp</button>
            </td>
        `;
        corpoTabelaOrcamentos.appendChild(linha);
    });

    document.getElementById('secaoTabelaOrcamentos').style.display = 'block';
}

// Função para editar um orçamento
function editarOrcamento(index) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos[index];

    document.getElementById('orcamentoId').value = orcamento.id;
    document.getElementById('cliente').value = orcamento.clienteId;
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

// Função para enviar orçamento por WhatsApp
function mandarWhatsApp(index) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos[index];

    const clienteId = orcamento.clienteId;
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(cliente => cliente.id === clienteId);

    if (!cliente) {
        alert('Cliente não encontrado.');
        return;
    }

    const clienteNome = cliente.nome;
    const clienteEndereco = cliente.endereco;
    const clienteCPF = cliente.cpfCnpj;
    const clienteTelefone = cliente.telefone.replace(/\D/g, '');

    const produtos = orcamento.itens.filter(item => item.produto).map(item => `${item.produto} (${item.quantidade}) - R$ ${item.precoProduto}`).join('\n');
    const servicos = orcamento.itens.filter(item => item.servico).map(item => `${item.servico} - R$ ${item.precoServico}`).join('\n');

    const total = `R$ ${orcamento.total}`;
    const status = orcamento.status;
    const formaPagamento = orcamento.formaPagamento;
    const tempoConclusao = orcamento.itens.reduce((total, item) => total + item.tempoServico, 0);
    const tempoConclusaoDias = tempoConclusao;

    const mensagem = `Olá ${clienteNome},\n\nAqui está o seu orçamento:\n\nNome do Cliente: ${clienteNome}\nCPF: ${clienteCPF}\nEndereço: ${clienteEndereco}\n\nProdutos:\n${produtos}\n\nServiços:\n${servicos}\n\nTempo de Conclusão: ${tempoConclusaoDias} dias\nTotal: ${total}\nStatus: ${status}\nForma de Pagamento: ${formaPagamento}\n\nObrigado por escolher a Tech Cell Center Brasil!`;

    const url = `https://wa.me/${clienteTelefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Função para gerar um ID único
function gerarIdUnico() {
    let clientes = JSON.parse(localStorage.getItem('produtos')) || [];
    let novoId;

    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000).toString(); // Gera número de 11 dígitos
    } while (clientes.some(produto => produto.id === novoId)); // Garante que o ID seja único

    return novoId;
}