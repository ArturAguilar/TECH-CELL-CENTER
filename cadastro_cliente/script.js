// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarClientes();
    configurarOuvintesDeEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesDeEventos() {
    document.getElementById('mostrarFormularioBotao').addEventListener('click', function() {
        toggleFormulario(true);
    });

    const formularioCliente = document.getElementById('formularioCliente');
    formularioCliente.addEventListener('submit', lidarComSubmissaoFormulario);

    document.getElementById('entradaPesquisa').addEventListener('input', filtrarClientes);

    document.getElementById('cpfCnpj').addEventListener('input', function() {
        const valor = this.value.replace(/\D/g, '');
        this.value = valor.length <= 11 ? formatarCPF(valor) : formatarCNPJ(valor);
    });

    document.getElementById('cpfCnpj').addEventListener('blur', function() {
        buscarDadosPorCnpj(this.value);
    });

    document.getElementById('telefone').addEventListener('input', function() {
        this.value = formatarTelefone(this.value);
    });

    document.getElementById('cep').addEventListener('input', function() {
        this.value = formatarCEP(this.value);
        buscarEnderecoPorCEP(this.value);
    });

    document.getElementById('email').addEventListener('input', function() {
        if (!validarEmail(this.value)) {
            alert("Email inválido.");
        }
    });

    document.querySelectorAll('input[name="statusCliente"]').forEach(radio => {
        radio.addEventListener('change', filtrarClientes);
    });

    
}

// Função para alternar a exibição do formulário
function toggleFormulario(mostrar) {
    document.getElementById('secaoFormularioCliente').style.display = mostrar ? 'block' : 'none'; 
    document.getElementsByClassName('tabela-clientes')[0].style.display = mostrar ? 'none' : 'block';
    document.getElementById('mostrarFormularioBotao').style.display = mostrar ? 'none' : 'block';
}

// Função para filtrar os clientes
function filtrarClientes() {
    const termoPesquisa = document.getElementById('entradaPesquisa').value.trim().toLowerCase();
    const statusFiltro = document.querySelector('input[name="statusCliente"]:checked').value;
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const corpoTabela = document.getElementById('corpoTabelaClientes');
    if (!corpoTabela) {
        console.error('Elemento corpoTabelaClientes não encontrado no DOM.');
        return;
    }

    clientes.forEach(cliente => {
        const nomeIncluiTermo = cliente.nome.toLowerCase().includes(termoPesquisa);
        const statusCorreto = (statusFiltro === 'todos') ||
                              (statusFiltro === 'ativos' && cliente.ativo !== false) ||
                              (statusFiltro === 'inativos' && cliente.ativo === false);

        if (nomeIncluiTermo && statusCorreto) {
            corpoTabela.appendChild(criarLinhaTabela(cliente));
        }
    });
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    event.preventDefault();
    if (validarCampos()) {
        salvarCliente();
    }
}

// Função para salvar o cliente no localStorage
function salvarCliente() {
    const clienteId = document.getElementById('clienteId').value;
    const nome = document.getElementById('nome').value;
    const cpfCnpj = document.getElementById('cpfCnpj').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const telefone = document.getElementById('telefone').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const cep = document.getElementById('cep').value; // Inclui o CEP
    const cidade = document.getElementById('cidade').value;
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const email = document.getElementById('email').value;

    const endereco = `${rua}, ${numero}, ${bairro}, ${cidade}`; // Inclui o CEP no endereço
    const dadosCliente = {
        id: clienteId ? parseInt(clienteId) : gerarIdClienteUnico(),
        nome,
        cpfCnpj: Number(cpfCnpj),
        telefone: Number(telefone),
        endereco,
        email,
        ativo: true
    };

    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    if (clienteId) {
        const index = clientes.findIndex(cliente => cliente.id == clienteId);
        clientes[index] = dadosCliente;
    } else {
        clientes.push(dadosCliente);
    }

    localStorage.setItem('clientes', JSON.stringify(clientes));

    alert('Cliente salvo com sucesso!');
    document.getElementById('formularioCliente').reset();
    toggleFormulario(false);
    carregarClientes();
}

// Função para gerar um ID auto-incrementado
function gerarIdClienteUnico() {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    let novoId;

    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000); // Gera número de 11 dígitos
    } while (clientes.some(cliente => cliente.id === novoId)); // Garante que o ID seja único

    return novoId;
}

// Função para carregar os clientes
function carregarClientes(filtro = 'ativos') {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    if (!Array.isArray(clientes)) {
        console.error('Os dados no localStorage não são um array válido.');
        return;
    }

    const corpoTabela = document.getElementById('corpoTabelaClientes');
    if (!corpoTabela) {
        console.error('Elemento corpoTabelaClientes não encontrado no DOM.');
        return;
    }

    // Limpa a tabela antes de preenchê-la
    corpoTabela.innerHTML = '';

    clientes.forEach(cliente => {
        const linha = criarLinhaTabela(cliente);
        if (!linha) {
            console.error('Erro ao criar linha para o cliente:', cliente);
            return;
        }

        // Exibe apenas os clientes que correspondem ao filtro
        if ((filtro === 'ativos' && cliente.ativo) || (filtro === 'inativos' && !cliente.ativo)) {
            corpoTabela.appendChild(linha);
        }
    });
}

// Função para criar uma linha na tabela
function criarLinhaTabela(cliente) {
    if (!cliente || !cliente.id || !cliente.nome) {
        console.error('Dados do cliente inválidos:', cliente);
        return null;
    }

    const linha = document.createElement('tr');
    const cpfCnpjFormatado = cliente.cpfCnpj.toString().length <= 11
        ? formatarCPF(cliente.cpfCnpj.toString())
        : formatarCNPJ(cliente.cpfCnpj.toString());
    const telefoneFormatado = formatarTelefone(cliente.telefone.toString());

    linha.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nome}</td>
        <td>${cpfCnpjFormatado}</td>
        <td>${telefoneFormatado}</td>
        <td>${cliente.endereco}</td>
        <td class="acoes">
            ${cliente.ativo ? `
                <button class="editar" onclick="editarCliente('${cliente.id}')">Editar</button>
                <button class="inativar" onclick="inativarCliente('${cliente.id}')">Inativar</button>
            ` : `
                <button class="ativar" onclick="ativarCliente('${cliente.id}')">Ativar</button>
                <button class="deletar" onclick="excluirCliente('${cliente.id}')">Excluir</button>
            `}
        </td>
    `;
    return linha;
}

// Função para ativar um cliente
function ativarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const index = clientes.findIndex(cliente => cliente.id == id);
    if (index !== -1) {
        clientes[index].ativo = true;
        localStorage.setItem('clientes', JSON.stringify(clientes));
        alert('Cliente ativado com sucesso!');
        carregarClientes('inativos'); // Atualiza a exibição dos inativos
    }
}

// Função para excluir um cliente
function excluirCliente(id) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes = clientes.filter(cliente => cliente.id != id);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    alert('Cliente excluído com sucesso!');
    carregarClientes();
}

// Função para editar um cliente
function editarCliente(id) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(cliente => cliente.id == id);

    if (!cliente) return;

    if (!cliente.ativo) {
        alert('Não é possível editar um cliente inativo.');
        return;
    }

    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('nome').value = cliente.nome || cliente.fantasia || '';
    document.getElementById('cpfCnpj').value = cliente.cpfCnpj;
    document.getElementById('telefone').value = cliente.telefone;

    // Extrai o CEP e os outros campos do endereço
    const [cep, rua, numero, bairro, cidade] = cliente.endereco.split(', ');
    document.getElementById('cep').value = cep; // Preenche o CEP
    document.getElementById('rua').value = rua;
    document.getElementById('numero').value = numero;
    document.getElementById('bairro').value = bairro;
    document.getElementById('cidade').value = cidade;
    document.getElementById('email').value = cliente.email;

    toggleFormulario(true);
}

// Função para inativar um cliente
function inativarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const index = clientes.findIndex(cliente => cliente.id == id);
    if (index !== -1) {
        clientes[index].ativo = false;
        localStorage.setItem('clientes', JSON.stringify(clientes));
        alert('Cliente inativado com sucesso!');
        carregarClientes('ativos'); // Atualiza a exibição dos ativos
    }
}

// Função para formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cpf.length !== 11) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Função para formatar CNPJ
function formatarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos
    cnpj = cnpj.replace(/(\d{2})(\d)/, "$1.$2");
    cnpj = cnpj.replace(/(\d{3})(\d)/, "$1.$2");
    cnpj = cnpj.replace(/(\d{3})(\d)/, "$1/$2");
    cnpj = cnpj.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    return cnpj;
}

// Função para formatar Telefone
function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
    telefone = telefone.replace(/(\d{2})(\d)/, "($1) $2");
    telefone = telefone.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
    return telefone;
}

// Função para formatar CEP
function formatarCEP(cep) {
    cep = cep.replace(/\D/g, ""); // Remove caracteres não numéricos
    cep = cep.replace(/(\d{5})(\d)/, "$1-$2");
    return cep;
}

// Função para buscar endereço pelo CEP usando a API ViaCEP
function buscarEnderecoPorCEP(cep) {
    cep = cep.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado.");
                return;
            }
            document.getElementById('rua').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('cidade').value = data.localidade;
        })
        .catch(error => console.error("Erro ao buscar CEP:", error));
}

// Função para buscar dados de CPF ou CNPJ usando a API ReceitaWS (apenas para CNPJ)
function buscarDadosPorCpfCnpj(cpfCnpj) {
    cpfCnpj = cpfCnpj.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpfCnpj.length === 11) {
        // Caso seja CPF, apenas valida o formato (não há busca na API)
        if (!validarCPF(cpfCnpj)) {
            alert("CPF inválido.");
            return;
        }
        alert("CPF válido, mas não há integração com API para CPF.");
    } else if (cpfCnpj.length === 14) {
        // Caso seja CNPJ, faz a busca na API ReceitaWS
        fetch(`https://www.receitaws.com.br/v1/cnpj/{Cnpj}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "ERROR") {
                    alert("CNPJ não encontrado.");
                    return;
                }

                // Preenche os campos com os dados retornados
                document.getElementById('nome').value = data.nome || data.fantasia || '';
                document.getElementById('email').value = data.email || '';
                document.getElementById('telefone').value = data.telefone || '';
                document.getElementById('rua').value = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro || '';
                document.getElementById('cidade').value = data.municipio || '';
                document.getElementById('cep').value = data.cep || '';
            })
    } else {
        alert("CPF ou CNPJ inválido.");
    }
}

// Função para buscar dados de CNPJ usando a API ReceitaWS
function buscarDadosPorCnpj(cnpj) {
    cnpj = cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cnpj.length !== 14) {
        alert("CNPJ inválido.");
        return;
    }

    // Faz a busca na API ReceitaWS
    fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ERROR") {
                alert("CNPJ não encontrado.");
                return;
            }

            // Preenche os campos com os dados retornados
            document.getElementById('nome').value = data.nome || data.fantasia || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('telefone').value = data.telefone || '';
            document.getElementById('rua').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('cidade').value = data.municipio || '';
            document.getElementById('cep').value = data.cep || '';
        })
        .catch(error => {
            console.error("Erro ao buscar CNPJ:", error);
            alert("Erro ao buscar CNPJ. Tente novamente mais tarde.");
        });
}

// Função para validar Email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para validar todos os campos do formulário
function validarCampos() {
    const nome = document.getElementById('nome').value.trim();
    const cpfCnpj = document.getElementById('cpfCnpj').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const cep = document.getElementById('cep').value.trim();
    const rua = document.getElementById('rua').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();

    console.log({ nome, cpfCnpj, telefone, email, cep, rua, numero, bairro, cidade });

    if (!nome || !cpfCnpj || !telefone || !email || !cep || !rua || !numero || !bairro || !cidade) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }

    if (!validarEmail(email)) {
        alert('Email inválido.');
        return false;
    }

    return true;
}