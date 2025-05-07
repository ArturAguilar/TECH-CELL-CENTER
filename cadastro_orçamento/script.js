// Executa quando o DOM é completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    inicializarAplicacao();
    carregarOrcamentos();
});

function inicializarAplicacao() {
    carregarClientes();
    carregarProdutos();
    carregarServicos();
    configurarOuvintesEventos();
    configurarFiltroOrcamentos();

    // Recupera os itens do orçamento do localStorage
    const itensSalvos = JSON.parse(localStorage.getItem('itensOrcamento')) || [];
    if (itensSalvos.length > 0) {
        itensOrcamento = itensSalvos;
        atualizarTabelaItensOrcamento();
        atualizarPrecoTotal();
    }

    // Recupera os dados do cliente selecionado
    const clienteSelecionado = JSON.parse(localStorage.getItem('clienteSelecionado'));
    if (clienteSelecionado) {
        document.getElementById('pesquisaCliente').value = clienteSelecionado.nome || '';
        document.getElementById('telefoneCliente').value = clienteSelecionado.telefone || '';
        document.getElementById('emailCliente').value = clienteSelecionado.email || '';
        document.getElementById('enderecoCliente').value = clienteSelecionado.endereco || '';
        document.getElementById('cpfCnpjCliente').value = clienteSelecionado.cpfCnpj || '';
    }
}

function configurarFiltroOrcamentos() {
    const entradaPesquisaOrcamento = document.getElementById('entradaPesquisaOrcamento');
    entradaPesquisaOrcamento.addEventListener('input', filtrarOrcamentos);
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
                li.setAttribute('data-email', cliente.email);
                li.setAttribute('data-endereco', cliente.endereco);
                li.setAttribute('data-cpf', cliente.cpfCnpj);

                li.addEventListener('click', function () {
                    // Preenche o campo de pesquisa com o nome do cliente
                    inputPesquisaCliente.value = cliente.nome;

                    // Define o atributo data-id com o ID do cliente
                    inputPesquisaCliente.setAttribute('data-id', cliente.id);

                    // Preenche os campos de telefone, e-mail, endereço e CPF/CNPJ
                    document.getElementById('telefoneCliente').value = cliente.telefone || '';
                    document.getElementById('emailCliente').value = cliente.email || '';
                    document.getElementById('enderecoCliente').value = cliente.endereco || '';
                    document.getElementById('cpfCnpjCliente').value = cliente.cpfCnpj || '';

                    // Salva os dados do cliente no localStorage
                    localStorage.setItem('clienteSelecionado', JSON.stringify(cliente));

                    // Limpa as sugestões após a seleção
                    listaClientes.innerHTML = '';
                });

                listaClientes.appendChild(li);
            }
        });
    });

    // Preenche automaticamente os campos ao perder o foco, caso o nome do cliente seja válido
    inputPesquisaCliente.addEventListener('blur', function () {
        const clienteSelecionado = clientes.find(cliente => cliente.nome.toLowerCase() === inputPesquisaCliente.value.trim().toLowerCase());
        if (clienteSelecionado) {
            document.getElementById('telefoneCliente').value = clienteSelecionado.telefone || '';
            document.getElementById('emailCliente').value = clienteSelecionado.email || '';
            document.getElementById('enderecoCliente').value = clienteSelecionado.endereco || '';
            document.getElementById('cpfCnpjCliente').value = clienteSelecionado.cpfCnpj || '';
            inputPesquisaCliente.setAttribute('data-id', clienteSelecionado.id);
            localStorage.setItem('clienteSelecionado', JSON.stringify(clienteSelecionado));
        } else {
            // Limpa os campos se o cliente não for encontrado
            document.getElementById('telefoneCliente').value = '';
            document.getElementById('emailCliente').value = '';
            document.getElementById('enderecoCliente').value = '';
            document.getElementById('cpfCnpjCliente').value = '';
            inputPesquisaCliente.removeAttribute('data-id');
        }

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
    document.getElementById('botaoAdicionarItem').addEventListener('click', function (event) {

        adicionarItem(); // Chama a função para adicionar o item
    });
    document.getElementById('botaoSalvarOrcamento').addEventListener('click', salvarOrcamento);
    document.getElementById('quantidade').addEventListener('input', atualizarPreco);
    document.getElementById('botaoMostrarFormulario').addEventListener('click', function () {
        document.getElementById('secaoFormularioOrcamento').style.display = 'block';
        document.getElementById('botaoMostrarFormulario').style.display = 'none';
        document.getElementById('secaoTabelaOrcamentos').style.display = 'none';
    });
    document.getElementById('pesquisaProduto').addEventListener('input', atualizarPreco);
    document.getElementById('quantidade').addEventListener('input', atualizarPreco);
    document.getElementById('pesquisaServico').addEventListener('input', atualizarPreco);
    document.getElementById('botaoCancelarOrcamento').addEventListener('click', function () {
        cancelarFormularioOrcamento();
    });
}

function aplicarMascaraTelefone(campo) {
    let valor = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (valor.length > 10) {
        // Formato para telefones com DDD e 9 dígitos (ex: (11) 98765-4321)
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (valor.length > 5) {
        // Formato para telefones com DDD e 8 dígitos (ex: (11) 8765-4321)
        valor = valor.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (valor.length > 2) {
        // Formato para DDD e início do número (ex: (11) 8765)
        valor = valor.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
    } else {
        // Formato para DDD (ex: (11))
        valor = valor.replace(/^(\d*)/, "($1");
    }

    campo.value = valor; // Atualiza o valor do campo
}

function aplicarMascaraCpfCnpj(campo) {
    let valor = campo.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (valor.length > 11) {
        // Formato para CNPJ (ex: 12.345.678/0001-90)
        valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else if (valor.length > 9) {
        // Formato para CPF (ex: 123.456.789-00)
        valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
        // Formato parcial do CPF (ex: 123.456.789)
        valor = valor.replace(/^(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else if (valor.length > 3) {
        // Formato parcial do CPF (ex: 123.456)
        valor = valor.replace(/^(\d{3})(\d{0,3})/, "$1.$2");
    }

    campo.value = valor; // Atualiza o valor do campo
}

// Função para cancelar o formulário de orçamento
function cancelarFormularioOrcamento() {
    // Oculta o formulário de orçamento
    document.getElementById('secaoFormularioOrcamento').style.display = 'none';

    // Exibe a tabela de orçamentos
    document.getElementById('secaoTabelaOrcamentos').style.display = 'block';

    // Exibe o botão "Criar Novo Orçamento"
    document.getElementById('botaoMostrarFormulario').style.display = 'block';

    // Limpa os campos do formulário
    limparFormularioOrcamento();
}

// Função para limpar os campos do formulário de orçamento
function limparFormularioOrcamento() {
    document.getElementById('formularioOrcamento').reset(); // Reseta os campos do formulário

    // Limpa os itens do orçamento
    itensOrcamento = [];
    atualizarTabelaItensOrcamento();
    atualizarPrecoTotal();

    // Remove os dados temporários do localStorage
    localStorage.removeItem('itensOrcamento');
    localStorage.removeItem('clienteSelecionado');
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

    // Calcula o preço total
    if (produto && precoProduto > 0 && quantidade > 0) {
        precoTotal += precoProduto * quantidade;
    }

    if (servico && precoServico > 0) {
        precoTotal += precoServico;
    }

    if ((produto && quantidade > 0) || servico) {
        itensOrcamento.push({ produto, quantidade, servico, precoProduto, precoServico, precoTotal: precoTotal.toFixed(2) });
        atualizarTabelaItensOrcamento();
        atualizarPrecoTotal();

        // Salva os itens no localStorage
        localStorage.setItem('itensOrcamento', JSON.stringify(itensOrcamento));

        // Limpa os campos de entrada para o próximo item
        document.getElementById('pesquisaProduto').value = '';
        document.getElementById('pesquisaProduto').removeAttribute('data-preco');
        document.getElementById('quantidade').value = '';
        document.getElementById('pesquisaServico').value = '';
        document.getElementById('pesquisaServico').removeAttribute('data-preco');
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
            <td>${item.produto || ''}</td>
            <td>${item.quantidade || ''}</td>
            <td>${item.servico || ''}</td>
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
    const orcamentoId = document.getElementById('orcamentoId').value || gerarIdUnico();
    const clienteId = document.getElementById('pesquisaCliente').getAttribute('data-id');
    const clienteNome = document.getElementById('pesquisaCliente').value.trim();
    const clienteTelefone = document.getElementById('telefoneCliente').value.trim();
    const clienteEmail = document.getElementById('emailCliente').value.trim();
    const clienteEndereco = document.getElementById('enderecoCliente').value.trim();
    const clienteCpfCnpj = document.getElementById('cpfCnpjCliente').value.trim();
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
            nome: clienteNome,
            telefone: clienteTelefone,
            email: clienteEmail,
            endereco: clienteEndereco,
            cpfCnpj: clienteCpfCnpj
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

    // Atualiza a tabela de orçamentos registrados
    carregarOrcamentos();

    // Oculta o formulário e exibe a tabela de orçamentos
    document.getElementById('secaoFormularioOrcamento').style.display = 'none';
    document.getElementById('botaoMostrarFormulario').style.display = 'block';
    document.getElementById('secaoTabelaOrcamentos').style.display = 'block';

    // Limpa o formulário e os itens do orçamento
    limparFormularioOrcamento();
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

    if (!selectProduto || !selectServico) {
        console.error('Elemento selectProduto ou selectServico não encontrado.');
        return;
    }

    const quantidade = parseInt(inputQuantidade.value) || 0;
    const precoProduto = selectProduto.getAttribute('data-preco')
        ? parseFloat(selectProduto.getAttribute('data-preco'))
        : 0;
    const precoServico = selectServico.getAttribute('data-preco')
        ? parseFloat(selectServico.getAttribute('data-preco'))
        : 0;

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
                .join(', ') || 'Nenhum produto'}</td>
            <td>${orcamento.itens
                .filter(item => item.servico)
                .map(item => `${item.servico}`)
                .join(', ') || 'Nenhum serviço'}</td>
            <td>R$ ${orcamento.total.toFixed(2).replace('.', ',')}</td>
            <td>${orcamento.status}</td>
            <td>${orcamento.formaPagamento}</td>
            <td class="acoes">
                <button class="btn btn-whatsapp" onclick="abrirModalOrcamento(${orcamento.id})">Visualizar</button>
                <button class="btn btn-editar" onclick="editarOrcamento(${orcamento.id})">Editar</button>
                <button class="btn btn-excluir" onclick="excluirOrcamento(${orcamento.id})">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

function filtrarOrcamentos() {
    const termoPesquisa = document.getElementById('entradaPesquisaOrcamento').value.trim().toLowerCase();
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaOrcamentos');
    corpoTabela.innerHTML = ''; // Limpa a tabela antes de preenchê-la

    // Filtra os orçamentos com base no nome do cliente
    const orcamentosFiltrados = orcamentos.filter(orcamento =>
        orcamento.cliente.nome.toLowerCase().includes(termoPesquisa)
    );

    // Exibe uma mensagem se não houver orçamentos no filtro atual
    if (orcamentosFiltrados.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.innerHTML = `<td colspan="8" style="text-align: center;">Nenhum orçamento encontrado.</td>`;
        corpoTabela.appendChild(linhaVazia);
        return;
    }

    // Adiciona os orcamentos filtrados na tabela
    orcamentosFiltrados.forEach(orcamento => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${orcamento.id}</td>
            <td>${orcamento.cliente.nome}</td>
            <td>${orcamento.itens
                .filter(item => item.produto)
                .map(item => `${item.produto} (${item.quantidade})`)
                .join(', ') || 'Nenhum produto'}</td>
            <td>${orcamento.itens
                .filter(item => item.servico)
                .map(item => `${item.servico}`)
                .join(', ') || 'Nenhum serviço'}</td>
            <td>R$ ${orcamento.total.toFixed(2).replace('.', ',')}</td>
            <td>${orcamento.status}</td>
            <td>${orcamento.formaPagamento}</td>
            <td class="acoes">
                <button class="btn btn-visualizar" onclick="abrirModalOrcamento(${orcamento.id})">Visualizar</button>
                <button class="btn btn-editar" onclick="editarOrcamento(${orcamento.id})">Editar</button>
                <button class="btn btn-excluir" onclick="excluirOrcamento(${orcamento.id})">Excluir</button>
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
    document.getElementById('observacoes').value = orcamento.observacoes || '';

    // Preenche os campos do cliente (telefone, e-mail, endereço, CPF/CNPJ)
    document.getElementById('telefoneCliente').value = orcamento.cliente.telefone || '';
    document.getElementById('emailCliente').value = orcamento.cliente.email || '';
    document.getElementById('enderecoCliente').value = orcamento.cliente.endereco || '';
    document.getElementById('cpfCnpjCliente').value = orcamento.cliente.cpfCnpj || '';

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
    const orcamento = orcamentos.find(o => o.id === id);

    if (!orcamento) {
        alert('Orçamento não encontrado.');
        return;
    }

    // Dados do cliente
    const clienteNome = orcamento.cliente.nome;
    let clienteTelefone = orcamento.cliente.telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
    const clienteEmail = orcamento.cliente.email;
    const clienteEndereco = orcamento.cliente.endereco;
    const clienteCpfCnpj = orcamento.cliente.cpfCnpj;

    // Verifica se o número de telefone é válido
    if (!clienteTelefone) {
        alert('Número de telefone do cliente não encontrado.');
        return;
    }

    // Adiciona o código do país (Brasil: 55) se necessário
    if (!clienteTelefone.startsWith('55')) {
        clienteTelefone = `55${clienteTelefone}`;
    }

    // Formata os produtos e serviços do orçamento como lista
    const produtos = orcamento.itens
        .filter(item => item.produto)
        .map(item => `- ${item.produto} (x${item.quantidade}) - R$ ${item.precoProduto.toFixed(2).replace('.', ',')}`)
        .join('\n') || 'Nenhum produto selecionado';

    const servicos = orcamento.itens
        .filter(item => item.servico)
        .map(item => `- ${item.servico} - R$ ${item.precoServico.toFixed(2).replace('.', ',')}`)
        .join('\n') || 'Nenhum serviço selecionado';

    // Total do orçamento
    const total = `R$ ${orcamento.total.toFixed(2).replace('.', ',')}`;

    // Mensagem formatada
    const mensagem = `Olá, *${clienteNome}!*\n\n` +
        `Aqui está o resumo do seu orçamento com a Tech Cell Center Brasil:\n\n` +
        `*Telefone:* ${orcamento.cliente.telefone}\n` +
        `*Email:* ${clienteEmail}\n` +
        `*Endereço:* ${clienteEndereco}\n` +
        `*CPF/CNPJ:* ${clienteCpfCnpj}\n\n` +
        `*Produtos:*\n${produtos}\n\n` +
        `*Serviços:*\n${servicos}\n\n` +
        `*Total:* ${total}\n` +
        `*Status:* ${orcamento.status}\n` +
        `*Forma de Pagamento:* ${orcamento.formaPagamento}\n` +
        `*Observações:* ${orcamento.observacoes || 'Nenhuma observação'}\n\n` +
        `Estamos à disposição para esclarecer qualquer dúvida ou ajustar o orçamento conforme necessário. É sempre um prazer atendê-lo(a)!\n\n` +
        `*Tech Cell Center Brasil* - Soluções que conectam você ao futuro!`;

    // Gera o link do WhatsApp
    const url = `https://wa.me/${clienteTelefone}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp Web em uma nova aba
    window.open(url, '_blank');
}

// Função para abrir o modal de visualização do orçamento
function abrirModalOrcamento(id) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos.find(o => o.id === id);

    if (!orcamento) {
        alert('Orçamento não encontrado.');
        return;
    }

    // Preenche os dados no modal
    document.getElementById('modalCodigoOrcamento').textContent = orcamento.id;
    document.getElementById('modalClienteOrcamento').textContent = orcamento.cliente.nome;
    document.getElementById('modalTelefoneCliente').textContent = orcamento.cliente.telefone;
    document.getElementById('modalEmailCliente').textContent = orcamento.cliente.email;
    document.getElementById('modalEnderecoCliente').textContent = orcamento.cliente.endereco;
    document.getElementById('modalCpfCnpjCliente').textContent = orcamento.cliente.cpfCnpj;
    document.getElementById('modalProdutosOrcamento').textContent = orcamento.itens
        .filter(item => item.produto)
        .map(item => `${item.produto} (x${item.quantidade})`)
        .join(', ') || 'Nenhum produto';
    document.getElementById('modalServicosOrcamento').textContent = orcamento.itens
        .filter(item => item.servico)
        .map(item => item.servico)
        .join(', ') || 'Nenhum serviço';
    document.getElementById('modalTotalOrcamento').textContent = `R$ ${orcamento.total.toFixed(2).replace('.', ',')}`;
    document.getElementById('modalStatusOrcamento').textContent = orcamento.status;
    document.getElementById('modalFormaPagamentoOrcamento').textContent = orcamento.formaPagamento;
    document.getElementById('modalObservacoesOrcamento').textContent = orcamento.observacoes || 'Nenhuma observação';

    // Configura o botão de enviar por WhatsApp
    const botaoWhatsApp = document.getElementById('botaoEnviarWhatsApp');
    botaoWhatsApp.onclick = function () {
        mandarWhatsApp(id);
    };

    // Configura o botão de gerar PDF
    const botaoPDF = document.getElementById('botaoGerarPDF');
    botaoPDF.onclick = function () {
        gerarPDF(id);
    };

    // Exibe o modal
    const modal = document.getElementById('modalOrcamento');
    modal.style.display = 'block';
}

// Função para gerar PDF do orçamento
function gerarPDF(id) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos.find(o => o.id === id);

    if (!orcamento) {
        alert('Orçamento não encontrado.');
        return;
    }

    // Cria uma nova instância do jsPDF
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPos = 20;

    // Função para verificar se precisa de nova página
    const checkNewPage = (height) => {
        if (yPos + height > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    };

    // Função auxiliar para adicionar texto com quebra de linha
    const addText = (text, x, y, maxWidth) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return lines.length * 7;
    };

    // Cabeçalho
    doc.setFillColor(255, 72, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Tech Cell Center Brasil", pageWidth/2, 25, { align: "center" });
    doc.setFontSize(16);
    doc.text("Orçamento", pageWidth/2, 35, { align: "center" });

    // Reset de cores e fonte
    doc.setTextColor(0, 0, 0);
    yPos = 50;

    // Informações do Orçamento
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Orçamento #${orcamento.id}`, margin, yPos);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 15;

    // Dados do Cliente
    checkNewPage(60);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin - 5, yPos - 5, pageWidth - (margin * 2) + 10, 45, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Dados do Cliente:", margin, yPos);
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Nome: ${orcamento.cliente.nome}`, margin, yPos);
    yPos += 7;
    doc.text(`Telefone: ${orcamento.cliente.telefone}`, margin, yPos);
    yPos += 7;
    doc.text(`Email: ${orcamento.cliente.email}`, margin, yPos);
    yPos += 7;
    doc.text(`Endereço: ${orcamento.cliente.endereco}`, margin, yPos);
    yPos += 7;
    doc.text(`CPF/CNPJ: ${orcamento.cliente.cpfCnpj}`, margin, yPos);
    yPos += 15;

    // Produtos
    checkNewPage(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Produtos:", margin, yPos);
    yPos += 10;

    // Cabeçalho da tabela de produtos
    doc.setFillColor(240, 240, 240);
    doc.rect(margin - 5, yPos - 5, 180, 7, 'F');
    doc.setFontSize(12);
    doc.text("Item", margin, yPos);
    doc.text("Quantidade", margin + 100, yPos);
    doc.text("Valor Unit.", margin + 150, yPos);
    doc.text("Total", margin + 200, yPos);
    yPos += 7;

    // Lista de produtos
    doc.setFont("helvetica", "normal");
    orcamento.itens.filter(item => item.produto).forEach(item => {
        checkNewPage(7);
        doc.text(item.produto, margin, yPos);
        doc.text(item.quantidade.toString(), margin + 100, yPos);
        doc.text(`R$ ${item.precoProduto.toFixed(2).replace('.', ',')}`, margin + 150, yPos);
        doc.text(`R$ ${(item.precoProduto * item.quantidade).toFixed(2).replace('.', ',')}`, margin + 200, yPos);
        yPos += 7;
    });
    yPos += 10;

    // Serviços
    checkNewPage(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Serviços:", margin, yPos);
    yPos += 10;

    // Cabeçalho da tabela de serviços
    doc.setFillColor(240, 240, 240);
    doc.rect(margin - 5, yPos - 5, 180, 7, 'F');
    doc.text("Serviço", margin, yPos);
    doc.text("Valor", margin + 150, yPos);
    yPos += 7;

    // Lista de serviços
    doc.setFont("helvetica", "normal");
    orcamento.itens.filter(item => item.servico).forEach(item => {
        checkNewPage(7);
        doc.text(item.servico, margin, yPos);
        doc.text(`R$ ${item.precoServico.toFixed(2).replace('.', ',')}`, margin + 150, yPos);
        yPos += 7;
    });
    yPos += 15;

    // Total
    checkNewPage(20);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin - 5, yPos - 5, 180, 7, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total do Orçamento: R$ ${orcamento.total.toFixed(2).replace('.', ',')}`, pageWidth - margin, yPos, { align: "right" });
    yPos += 20;

    // Informações Adicionais
    checkNewPage(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Informações Adicionais:", margin, yPos);
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Status: ${orcamento.status}`, margin, yPos);
    yPos += 7;
    doc.text(`Forma de Pagamento: ${orcamento.formaPagamento}`, margin, yPos);
    yPos += 15;

    // Observações
    checkNewPage(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Observações:", margin, yPos);
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const observacoes = orcamento.observacoes || 'Nenhuma observação';
    const observacoesHeight = addText(observacoes, margin, yPos, pageWidth - (margin * 2));
    yPos += observacoesHeight + 15;

    // Validade do Orçamento
    checkNewPage(20);
    const dataValidade = new Date();
    dataValidade.setDate(dataValidade.getDate() + 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Validade do Orçamento: ${dataValidade.toLocaleDateString('pt-BR')}`, margin, yPos);
    yPos += 15;

    // Mensagem de Agradecimento
    checkNewPage(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Agradecemos a Preferência!", pageWidth/2, yPos, { align: "center" });
    yPos += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const mensagemAgradecimento = "É uma honra ter a oportunidade de atender você. Nossa equipe está comprometida em oferecer o melhor serviço e qualidade. Conte conosco para todas as suas necessidades em tecnologia e comunicação.";
    const agradecimentoHeight = addText(mensagemAgradecimento, margin, yPos, pageWidth - (margin * 2));
    yPos += agradecimentoHeight + 15;

    // Rodapé
    checkNewPage(20);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Tech Cell Center Brasil - Soluções que conectam você ao futuro!", pageWidth/2, yPos, { align: "center" });
    yPos += 7;
    doc.text("Contato: (XX) XXXX-XXXX | Email: contato@techcellcenter.com.br", pageWidth/2, yPos, { align: "center" });

    // Salva o PDF
    doc.save(`Orcamento_${orcamento.id}.pdf`);
}

// Fecha o modal ao clicar no botão de fechar
document.getElementById('fecharModalOrcamento').addEventListener('click', function () {
    const modal = document.getElementById('modalOrcamento');
    modal.style.display = 'none';
});

window.addEventListener('click', function (event) {
    const modal = document.getElementById('modalOrcamento');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
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
