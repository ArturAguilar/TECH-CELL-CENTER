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
            this.value = ''; // Limpa o campo apenas se o cliente não for válido
        }
        setTimeout(() => {
            listaClientes.innerHTML = ''; // Limpa as sugestões após um pequeno atraso
        }, 200);
    });
}

// Função para carregar os produtos do localStorage e preencher o select de produtos
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const inputPesquisaProduto = document.getElementById('pesquisaProduto');
    const listaProdutos = document.getElementById('listaProdutos');

    inputPesquisaProduto.addEventListener('input', function () {
        const termoPesquisa = this.value.trim().toLowerCase();
        listaProdutos.innerHTML = ''; // Limpa as sugestões anteriores

        if (termoPesquisa === '') {
            return; // Não exibe sugestões se o campo estiver vazio
        }

        produtos.forEach(produto => {
            if (produto.nome.toLowerCase().includes(termoPesquisa)) {
                const li = document.createElement('li');
                li.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
                li.setAttribute('data-id', produto.id);
                li.setAttribute('data-preco', produto.preco);
                li.addEventListener('click', function () {
                    inputPesquisaProduto.value = produto.nome; // Preenche o campo com o nome do produto
                    inputPesquisaProduto.setAttribute('data-preco', produto.preco); // Define o preço no atributo
                    listaProdutos.innerHTML = ''; // Limpa as sugestões após a seleção
                    atualizarPreco(); // Atualiza o preço
                });
                listaProdutos.appendChild(li);
            }
        });
    });

    inputPesquisaProduto.addEventListener('blur', function () {
        setTimeout(() => {
            listaProdutos.innerHTML = ''; // Limpa as sugestões ao perder o foco
        }, 200);
    });
}

// Função para carregar os serviços do localStorage e preencher o select de serviços
function carregarServicos() {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const inputPesquisaServico = document.getElementById('pesquisaServico');
    const listaServicos = document.getElementById('listaServicos');

    inputPesquisaServico.addEventListener('input', function () {
        const termoPesquisa = this.value.trim().toLowerCase();
        listaServicos.innerHTML = ''; // Limpa as sugestões anteriores

        if (termoPesquisa === '') {
            return; // Não exibe sugestões se o campo estiver vazio
        }

        servicos.forEach(servico => {
            if (servico.nomeServico.toLowerCase().includes(termoPesquisa)) {
                const li = document.createElement('li');
                li.textContent = `${servico.nomeServico} - R$ ${servico.preco.toFixed(2).replace('.', ',')} - ${servico.tempoBase} dias`;
                li.setAttribute('data-id', servico.id);
                li.setAttribute('data-preco', servico.preco); // Garante que o preço seja recuperado corretamente
                li.addEventListener('click', function () {
                    inputPesquisaServico.value = servico.nomeServico; // Preenche o campo com o nome do serviço
                    inputPesquisaServico.setAttribute('data-preco', servico.preco); // Define o preço no atributo
                    listaServicos.innerHTML = ''; // Limpa as sugestões após a seleção
                    atualizarPreco(); // Atualiza o preço
                });
                listaServicos.appendChild(li);
            }
        });
    });

    inputPesquisaServico.addEventListener('blur', function () {
        setTimeout(() => {
            listaServicos.innerHTML = ''; // Limpa as sugestões ao perder o foco
        }, 200);
    });
}

// Função para configurar os ouvintes de eventos
function configurarOuvintesEventos() {
    document.getElementById('botaoAdicionarItem').addEventListener('click', adicionarItem);
    document.getElementById('botaoSalvarOrcamento').addEventListener('click', salvarOrcamento);
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
    const produto = document.getElementById('pesquisaProduto').value;
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
    const servico = document.getElementById('pesquisaServico').value;
    const precoProduto = parseFloat(document.getElementById('pesquisaProduto').getAttribute('data-preco')) || 0;
    const precoServico = parseFloat(document.getElementById('pesquisaServico').getAttribute('data-preco')) || 0;

    let precoTotal = 0;

    // Calcula o total apenas para os itens selecionados
    if (precoProduto > 0 && quantidade > 0) {
        precoTotal += precoProduto * quantidade;
    }

    if (precoServico > 0) {
        precoTotal += precoServico;
    }

    if ((produto && quantidade > 0) || servico) {
        itensOrcamento.push({ produto, quantidade, servico, precoProduto, precoServico, precoTotal: precoTotal.toFixed(2) });
        atualizarTabelaItensOrcamento();
        atualizarPrecoTotal();
        document.getElementById('formularioOrcamento').reset();
    } else {
        alert('Por favor, selecione um produto ou serviço válido.');
    }
}

// Função para atualizar a tabela de itens do orçamento
function atualizarTabelaItensOrcamento() {
    const corpoTabela = document.getElementById('corpoTabelaItensOrcamento');
    corpoTabela.innerHTML = ''; // Limpa a tabela antes de preenchê-la

    itensOrcamento.forEach((item, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${item.produto || ''}</td> <!-- Exibe vazio se não houver produto -->
            <td>${item.quantidade || ''}</td> <!-- Exibe vazio se não houver quantidade -->
            <td>${item.servico || ''}</td> <!-- Exibe vazio se não houver serviço -->
            <td>R$ ${item.precoTotal.replace('.', ',')}</td>
            <td>
                <button onclick="removerItem(${index})">Remover</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

// Função para deletar um item do orçamento
function deletarItem(index) {
    itensOrcamento.splice(index, 1);
    atualizarTabelaItensOrcamento();
    atualizarPrecoTotal();
}

// Função para remover um item do orçamento
function removerItem(index) {
    // Remove o item do array `itensOrcamento` com base no índice
    itensOrcamento.splice(index, 1);

    // Atualiza a tabela de itens do orçamento
    atualizarTabelaItensOrcamento();

    // Atualiza o preço total do orçamento
    atualizarPrecoTotal();
}

// Função para salvar o orçamento
function salvarOrcamento() {
    const orcamentoId = document.getElementById('orcamentoId').value || Date.now(); // Gera um ID único se não existir
    const cliente = document.getElementById('pesquisaCliente').value.trim();
    const status = document.getElementById('status').value;
    const formaPagamento = document.getElementById('formaPagamento').value;
    const observacoes = document.getElementById('observacoes').value.trim();

    // Verifica se há itens no orçamento
    if (itensOrcamento.length === 0) {
        alert('Adicione pelo menos um item ao orçamento antes de salvar.');
        return;
    }

    // Verifica se o cliente foi selecionado
    if (!cliente) {
        alert('Por favor, selecione um cliente válido.');
        return;
    }

    // Calcula o total do orçamento
    const total = itensOrcamento.reduce((sum, item) => {
        const totalProduto = parseFloat(item.precoProduto) * item.quantidade || 0;
        const totalServico = parseFloat(item.precoServico) || 0;
        return sum + totalProduto + totalServico;
    }, 0).toFixed(2);

    // Cria o objeto do orçamento
    const dadosOrcamento = {
        id: parseInt(orcamentoId),
        cliente,
        itens: itensOrcamento,
        status,
        formaPagamento,
        observacoes,
        total: parseFloat(total)
    };

    // Recupera os orçamentos existentes no localStorage
    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];

    // Verifica se o orçamento já existe (edição)
    const index = orcamentos.findIndex(orc => orc.id === dadosOrcamento.id);
    if (index !== -1) {
        orcamentos[index] = dadosOrcamento; // Atualiza o orçamento existente
    } else {
        orcamentos.push(dadosOrcamento); // Adiciona um novo orçamento
    }

    // Salva os orçamentos atualizados no localStorage
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

    // Exibe uma mensagem de sucesso
    alert('Orçamento salvo com sucesso!');

    // Limpa o formulário e os itens do orçamento
    document.getElementById('formularioOrcamento').reset();
    itensOrcamento = [];
    atualizarTabelaItensOrcamento();
    atualizarPrecoTotal();

    // Atualiza a tabela de orçamentos registrados
    carregarOrcamentos();

    // Oculta o formulário e exibe a tabela de orçamentos
    document.getElementById('secaoFormularioOrcamento').style.display = 'none';
    document.getElementById('botaoMostrarFormulario').style.display = 'block';
    document.getElementById('secaoTabelaOrcamentos').style.display = 'block';
}

// Função para atualizar o preço total do orçamento
function atualizarPrecoTotal() {
    let precoTotal = 0;

    itensOrcamento.forEach(item => {
        const totalProduto = parseFloat(item.precoProduto) * item.quantidade || 0;
        const totalServico = parseFloat(item.precoServico) || 0;
        precoTotal += totalProduto + totalServico;
    });

    document.getElementById('precoTotal').textContent = `R$ ${precoTotal.toFixed(2).replace('.', ',')}`;
}

// Função para atualizar o preço com base no produto, serviço e quantidade selecionados
function atualizarPreco() {
    const selectProduto = document.getElementById('pesquisaProduto');
    const inputQuantidade = document.getElementById('quantidade');
    const selectServico = document.getElementById('pesquisaServico');
    const inputPreco = document.getElementById('preco');

    // Recupera os valores do produto, quantidade e serviço
    const quantidade = parseInt(inputQuantidade.value) || 0;
    const precoProduto = selectProduto.getAttribute('data-preco') ? parseFloat(selectProduto.getAttribute('data-preco')) : 0;
    const precoServico = selectServico.getAttribute('data-preco') ? parseFloat(selectServico.getAttribute('data-preco')) : 0;

    let precoTotal = 0;

    // Calcula o total apenas para os itens selecionados
    if (precoProduto > 0 && quantidade > 0) {
        precoTotal += precoProduto * quantidade;
    }

    if (precoServico > 0) {
        precoTotal += precoServico;
    }

    // Atualiza o campo de preço
    inputPreco.value = `R$ ${precoTotal.toFixed(2).replace('.', ',')}`;
}

// Função para carregar os orçamentos do localStorage e preencher a tabela de orçamentos
function carregarOrcamentos() {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaOrcamentos');
    corpoTabela.innerHTML = ''; // Limpa a tabela antes de preenchê-la

    orcamentos.forEach(orcamento => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${orcamento.id}</td>
            <td>${orcamento.cliente}</td>
            <td>${orcamento.itens
                .filter(item => item.produto)
                .map(item => `${item.produto} (${item.quantidade})`)
                .join(', ') || ''}</td>
            <td>${orcamento.itens
                .filter(item => item.servico)
                .map(item => `${item.servico}`)
                .join(', ') || ''}</td>
            <td>R$ ${orcamento.total.toFixed(2).replace('.', ',')}</td>
            <td>${orcamento.status}</td>
            <td>${orcamento.formaPagamento}</td>
            <td class="acoes">
                <button class="btn btn-editar" onclick="editarOrcamento(${orcamento.id})">Editar</button>
                <button class="btn btn-excluir deletar" onclick="excluirOrcamento(${orcamento.id})">Excluir</button>
                <button class="btn btn-whatsapp enviar" onclick="mandarWhatsApp(${orcamento.id})">WhatsApp</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

// Função para editar um orçamento
function editarOrcamento(id) {
    // Recupera os orçamentos do localStorage
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos.find(orc => orc.id === id);

    // Verifica se o orçamento foi encontrado
    if (!orcamento) {
        alert('Orçamento não encontrado.');
        return;
    }

    // Preenche os campos do formulário com os dados do orçamento
    document.getElementById('orcamentoId').value = orcamento.id;
    document.getElementById('pesquisaCliente').value = orcamento.cliente;
    document.getElementById('status').value = orcamento.status;
    document.getElementById('formaPagamento').value = orcamento.formaPagamento;
    document.getElementById('observacoes').value = orcamento.observacoes;

    // Carrega os itens do orçamento no array `itensOrcamento`
    itensOrcamento = orcamento.itens;
    atualizarTabelaItensOrcamento();

    // Exibe o formulário de edição
    document.getElementById('secaoFormularioOrcamento').style.display = 'block';
    document.getElementById('botaoMostrarFormulario').style.display = 'none';
    document.getElementById('secaoTabelaOrcamentos').style.display = 'none';
}

// Função para deletar um orçamento
function deletarOrcamento(index) {
    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    orcamentos.splice(index, 1);
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
    carregarOrcamentos();
}

// Função para excluir um orçamento
function excluirOrcamento(id) {
    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    orcamentos = orcamentos.filter(orcamento => orcamento.id !== id);

    // Atualiza o localStorage
    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

    // Atualiza a tabela de orçamentos
    carregarOrcamentos();

    alert('Orçamento excluído com sucesso!');
}

// Função para enviar orçamento por WhatsApp
function mandarWhatsApp(id) {
    // Recupera os orçamentos do localStorage
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos.find(orc => orc.id === id);

    // Verifica se o orçamento foi encontrado
    if (!orcamento) {
        alert('Orçamento não encontrado.');
        return;
    }

    // Recupera os clientes do localStorage
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(cli => cli.nome === orcamento.cliente);

    // Verifica se o cliente foi encontrado
    if (!cliente) {
        alert('Cliente não encontrado.');
        return;
    }

    // Dados do cliente
    const clienteNome = cliente.nome;
    const clienteEndereco = cliente.endereco || 'Não informado';
    const clienteCPF = cliente.cpfCnpj || 'Não informado';

    // Remove caracteres não numéricos do telefone e converte para o formato internacional
    let clienteTelefone = cliente.telefone; // Remove caracteres não numéricos
    if (clienteTelefone.length === 11) {
        clienteTelefone = `55${clienteTelefone}`; // Adiciona o código do país (Brasil: 55)
    }

    // Formata os produtos e serviços do orçamento
    const produtos = orcamento.itens
        .filter(item => item.produto)
        .map(item => `${item.produto} (${item.quantidade}) - R$ ${item.precoProduto.toFixed(2).replace('.', ',')}`)
        .join('\n');
    const servicos = orcamento.itens
        .filter(item => item.servico)
        .map(item => `${item.servico} - R$ ${item.precoServico.toFixed(2).replace('.', ',')}`)
        .join('\n');

    // Total do orçamento
    const total = `R$ ${orcamento.total.toFixed(2).replace('.', ',')}`;

    // Mensagem formatada
    const mensagem = `Olá ${clienteNome},\n\nAqui está o seu orçamento:\n\nNome do Cliente: ${clienteNome}\nCPF: ${clienteCPF}\nEndereço: ${clienteEndereco}\n\nProdutos:\n${produtos || 'Nenhum produto selecionado'}\n\nServiços:\n${servicos || 'Nenhum serviço selecionado'}\n\nTotal: ${total}\nStatus: ${orcamento.status}\nForma de Pagamento: ${orcamento.formaPagamento}\n\nObrigado por escolher a Tech Cell Center Brasil!`;

    // Gera o link do WhatsApp
    const url = `https://wa.me/${clienteTelefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp Web em uma nova aba
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

function salvarServico() {
    const servicoId = gerarIdUnico();
    const nomeServico = document.getElementById('nomeServico').value;
    const preco = parseFloat(document.getElementById('precoServico').value.replace(',', '.')) || 0;
    const tempoBase = parseInt(document.getElementById('tempoBaseServico').value, 10) || 0;

    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    servicos.push({ id: servicoId, nomeServico, preco, tempoBase });
    localStorage.setItem('servicos', JSON.stringify(servicos));

    alert('Serviço salvo com sucesso!');
}
