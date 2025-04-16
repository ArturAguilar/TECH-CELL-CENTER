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

    inputPesquisaCliente.addEventListener('input', function () {
        const termoPesquisa = this.value.trim().toLowerCase();
        listaClientes.innerHTML = ''; // Limpa as sugestões anteriores

        if (termoPesquisa === '') {
            return; // Não exibe sugestões se o campo estiver vazio
        }

        clientes.forEach(cliente => {
            if (cliente.nome.toLowerCase().includes(termoPesquisa) && cliente.ativo) {
                const li = document.createElement('li');
                li.textContent = cliente.nome;
                li.setAttribute('data-id', cliente.id);
                li.setAttribute('data-telefone', cliente.telefone);
                li.setAttribute('data-endereco', cliente.endereco);
                li.setAttribute('data-cpf', cliente.cpf);

                li.addEventListener('click', function () {
                    inputPesquisaCliente.value = cliente.nome; // Preenche o campo com o nome do cliente
                    inputPesquisaCliente.setAttribute('data-id', cliente.id); // Define o ID do cliente no atributo
                    inputPesquisaCliente.setAttribute('data-telefone', cliente.telefone); // Define o telefone no atributo
                    inputPesquisaCliente.setAttribute('data-endereco', cliente.endereco); // Define o endereço no atributo
                    inputPesquisaCliente.setAttribute('data-cpf', cliente.cpf); // Define o CPF no atributo
                    listaClientes.innerHTML = ''; // Limpa as sugestões após a seleção
                });

                listaClientes.appendChild(li);
            }
        });
    });

    inputPesquisaCliente.addEventListener('blur', function () {
        setTimeout(() => {
            listaClientes.innerHTML = ''; // Limpa as sugestões ao perder o foco
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
    document.getElementById('pesquisaProduto').addEventListener('input', atualizarPreco);
    document.getElementById('quantidade').addEventListener('input', atualizarPreco);
    document.getElementById('pesquisaServico').addEventListener('input', atualizarPreco);
}

let itensOrcamento = [];
let indiceItemEdicao = -1;

// Função para adicionar um item ao orçamento
function adicionarItem() {
    const produto = document.getElementById('pesquisaProduto').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
    const servico = document.getElementById('pesquisaServico').value.trim();
    const precoProduto = produto ? parseFloat(document.getElementById('pesquisaProduto').getAttribute('data-preco')) || 0 : 0;
    const precoServico = servico ? parseFloat(document.getElementById('pesquisaServico').getAttribute('data-preco')) || 0 : 0;

    let precoTotal = 0;

    // Considera o preço do produto apenas se a quantidade for maior que 1
    if (produto && precoProduto > 0 && quantidade > 1) {
        precoTotal += precoProduto * quantidade;
    } else if (produto && precoProduto > 0 && quantidade === 1) {
        precoTotal += precoProduto; // Apenas adiciona o preço unitário
    }

    // Adiciona o preço do serviço apenas se ele for válido
    if (servico && precoServico > 0) {
        precoTotal += precoServico;
    }

    if ((produto && quantidade > 0) || servico) {
        itensOrcamento.push({ produto, quantidade, servico, precoProduto, precoServico, precoTotal: precoTotal.toFixed(2) });
        atualizarTabelaItensOrcamento();
        atualizarPrecoTotal(); // Atualiza o total automaticamente
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

    // Atualiza o total automaticamente após atualizar a tabela
    atualizarPrecoTotal();
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
    const orcamentoId = document.getElementById('orcamentoId').value || gerarIdUnico(); // Gera um ID único se não existir
    const clienteId = document.getElementById('pesquisaCliente').getAttribute('data-id'); // Obtém o ID do cliente
    const clienteNome = document.getElementById('pesquisaCliente').value.trim(); // Obtém o nome do cliente
    const status = document.getElementById('status').value;
    const formaPagamento = document.getElementById('formaPagamento').value;
    const observacoes = document.getElementById('observacoes').value.trim();

    // Verifica se há itens no orçamento
    if (itensOrcamento.length === 0) {
        alert('Adicione pelo menos um item ao orçamento antes de salvar.');
        return;
    }

    // Verifica se o cliente foi selecionado
    if (!clienteId || !clienteNome) {
        alert('Por favor, selecione um cliente válido.');
        return;
    }

    // Calcula o total do orçamento
    const total = itensOrcamento.reduce((sum, item) => {
        const totalProduto = item.produto ? parseFloat(item.precoProduto) * (parseInt(item.quantidade, 10) || 0) : 0;
        const totalServico = item.servico ? parseFloat(item.precoServico) || 0 : 0;
        return sum + totalProduto + totalServico;
    }, 0).toFixed(2);

    // Cria o objeto do orçamento
    const dadosOrcamento = {
        id: parseInt(orcamentoId),
        cliente: {
            id: clienteId,
            nome: clienteNome
        },
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
        const totalProduto = item.produto ? parseFloat(item.precoProduto) * (parseInt(item.quantidade, 10) || 0) : 0;
        const totalServico = item.servico ? parseFloat(item.precoServico) || 0 : 0;
        precoTotal += totalProduto + totalServico;
    });

    // Atualiza o elemento do DOM com o total formatado
    document.getElementById('precoTotal').textContent = `R$ ${precoTotal.toFixed(2).replace('.', ',')}`;
}

// Função para atualizar o preço com base no produto, serviço e quantidade selecionados
function atualizarPreco() {
    const selectProduto = document.getElementById('pesquisaProduto');
    const inputQuantidade = document.getElementById('quantidade');
    const selectServico = document.getElementById('pesquisaServico');
    const inputPreco = document.getElementById('preco');

    const quantidade = parseInt(inputQuantidade.value) || 0;
    const precoProduto = selectProduto.getAttribute('data-preco') ? parseFloat(selectProduto.getAttribute('data-preco')) : 0;
    const precoServico = selectServico.getAttribute('data-preco') ? parseFloat(selectServico.getAttribute('data-preco')) : 0;

    let precoTotal = 0;

    // Calcula o preço do produto apenas se ele for válido
    if (precoProduto > 0 && quantidade > 0) {
        precoTotal += precoProduto * quantidade;
    }

    // Adiciona o preço do serviço apenas se ele for válido
    if (precoServico > 0) {
        precoTotal += precoServico;
    }

    // Atualiza o campo de preço no formulário
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
            <td>${orcamento.cliente.nome}</td>
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
                <button class="btn btn-whatsapp" onclick="abrirModalOrcamento(${orcamento.id})">Visualizar</button>
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
    document.getElementById('pesquisaCliente').value = orcamento.cliente.nome;
    document.getElementById('pesquisaCliente').setAttribute('data-id', orcamento.cliente.id);
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
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    // Encontra o orçamento pelo ID
    const orcamento = orcamentos.find(o => o.id === id);

    if (!orcamento) {
        alert('Orçamento não encontrado.');
        return;
    }

    // Encontra o cliente pelo nome do orçamento
    const cliente = clientes.find(c => c.nome === orcamento.cliente.nome);

    if (!cliente) {
        alert('Cliente não encontrado no registro de clientes.');
        return;
    }

    // Verifica se o cliente está ativo
    if (!cliente.ativo) {
        alert('Este cliente está inativo e não pode receber orçamentos.');
        return;
    }

    // Dados do cliente
    const clienteNome = cliente.nome;
    let clienteTelefone = cliente.telefone ? cliente.telefone.toString().replace(/\D/g, '') : ''; // Remove caracteres não numéricos

    // Verifica se o número de telefone é válido
    if (!clienteTelefone) {
        alert('Número de telefone do cliente não encontrado.');
        return;
    }

    // Adiciona o código do país (Brasil: 55) se necessário
    if (clienteTelefone.length === 11) {
        clienteTelefone = `55${clienteTelefone}`;
    } else if (clienteTelefone.length === 10) {
        clienteTelefone = `55${clienteTelefone}`;
    } else if (!clienteTelefone.startsWith('55')) {
        alert('Número de telefone inválido ou incompleto.');
        return;
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
    const mensagem = `Olá, ${clienteNome}!\n\n` +
        `Aqui está o resumo do seu orçamento com a Tech Cell Center Brasil:\n\n` +
        `Código do Orçamento: ${orcamento.id}\n` +
        `Produtos:\n${produtos || 'Nenhum produto selecionado'}\n` +
        `Serviços:\n${servicos || 'Nenhum serviço selecionado'}\n` +
        `Total: ${total}\n` +
        `Status: ${orcamento.status}\n` +
        `Forma de Pagamento: ${orcamento.formaPagamento}\n` +
        `Observações: ${orcamento.observacoes || 'Nenhuma observação'}\n\n` +
        `Estamos à disposição para esclarecer qualquer dúvida ou ajustar o orçamento conforme necessário. É sempre um prazer atendê-lo(a)!\n\n` +
        `Entre em contato conosco pelo WhatsApp ou responda a esta mensagem.\n` +
        `Tech Cell Center Brasil - Soluções que conectam você ao futuro!`;

    // Gera o link do WhatsApp
    const url = `https://wa.me/${clienteTelefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp Web em uma nova aba
    window.open(url, '_blank');
}

// Função para abrir o modal de visualização do orçamento
function abrirModalOrcamento(id) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const orcamento = orcamentos.find(o => o.id === id);

    if (!orcamento) {
        alert('Orçamento não encontrado.');
        return;
    }

    // Encontra o cliente pelo nome do orçamento
    const cliente = clientes.find(c => c.nome === orcamento.cliente.nome);

    if (!cliente) {
        alert('Cliente não encontrado no registro de clientes.');
        return;
    }

    // Verifica se o cliente está ativo
    if (!cliente.ativo) {
        alert('Este cliente está inativo e não pode receber orçamentos.');
        return;
    }

    // Dados do cliente
    const clienteNome = cliente.nome;
    let clienteTelefone = cliente.telefone ? cliente.telefone.toString().replace(/\D/g, '') : ''; // Remove caracteres não numéricos

    // Verifica se o número de telefone é válido
    if (!clienteTelefone) {
        alert('Número de telefone do cliente não encontrado.');
        return;
    }

    // Adiciona o código do país (Brasil: 55) se necessário
    if (clienteTelefone.length === 11) {
        clienteTelefone = `55${clienteTelefone}`;
    } else if (clienteTelefone.length === 10) {
        clienteTelefone = `55${clienteTelefone}`;
    } else if (!clienteTelefone.startsWith('55')) {
        alert('Número de telefone inválido ou incompleto.');
        return;
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
    const mensagem = `Olá, ${clienteNome}!\n\n` +
        `Aqui está o resumo do seu orçamento com a Tech Cell Center Brasil:\n\n` +
        `Código do Orçamento: ${orcamento.id}\n` +
        `Produtos:\n${produtos || 'Nenhum produto selecionado'}\n` +
        `Serviços:\n${servicos || 'Nenhum serviço selecionado'}\n` +
        `Total: ${total}\n` +
        `Status: ${orcamento.status}\n` +
        `Forma de Pagamento: ${orcamento.formaPagamento}\n` +
        `Observações: ${orcamento.observacoes || 'Nenhuma observação'}\n\n` +
        `Estamos à disposição para esclarecer qualquer dúvida ou ajustar o orçamento conforme necessário. É sempre um prazer atendê-lo(a)!\n\n` +
        `Entre em contato conosco pelo WhatsApp.\n` +
        `Tech Cell Center Brasil - Soluções que conectam você ao futuro!`;

    // Gera o link do WhatsApp
    const url = `https://wa.me/${clienteTelefone}?text=${encodeURIComponent(mensagem)}`;

    // Preenche as informações do orçamento no modal
    document.getElementById('modalCodigoOrcamento').textContent = orcamento.id;
    document.getElementById('modalClienteOrcamento').textContent = clienteNome;
    document.getElementById('modalProdutosOrcamento').textContent = orcamento.itens
        .filter(item => item.produto)
        .map(item => `${item.produto} (x${item.quantidade})`)
        .join(', ') || 'Nenhum produto';
    document.getElementById('modalServicosOrcamento').textContent = orcamento.itens
        .filter(item => item.servico)
        .map(item => item.servico)
        .join(', ') || 'Nenhum serviço';
    document.getElementById('modalTotalOrcamento').textContent = total;
    document.getElementById('modalStatusOrcamento').textContent = orcamento.status;
    document.getElementById('modalFormaPagamentoOrcamento').textContent = orcamento.formaPagamento;
    document.getElementById('modalObservacoesOrcamento').textContent = orcamento.observacoes || 'Nenhuma observação';

    // Configura o botão do WhatsApp para abrir o link
    const botaoWhatsApp = document.getElementById('botaoWhatsApp');
    botaoWhatsApp.href = url;

    // Exibe o modal
    document.getElementById('modalOrcamento').style.display = 'flex';
}

// Fecha o modal ao clicar no botão de fechar
document.getElementById('fecharModalOrcamento').addEventListener('click', function () {
    document.getElementById('modalOrcamento').style.display = 'none';
});

// Função para gerar um ID único de 11 dígitos
function gerarIdUnico() {
    const clientes = JSON.parse(localStorage.getItem('orcamento')) || [];
    let novoId;

    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000); // Gera número de 11 dígitos
    } while (clientes.some(orcamento => orcamento.id === novoId)); // Garante que o ID seja único

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