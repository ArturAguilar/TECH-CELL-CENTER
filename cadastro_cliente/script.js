// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", function () {
    carregarClientes();
    configurarOuvintesDeEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesDeEventos() {
    document
        .getElementById("mostrarFormularioBotao")
        .addEventListener("click", function () {
            toggleFormulario(true);
        });

    const formularioCliente = document.getElementById("formularioCliente");
    formularioCliente.addEventListener("submit", lidarComSubmissaoFormulario);

    document
        .getElementById("entradaPesquisa")
        .addEventListener("input", filtrarClientes);
    document.querySelectorAll('input[name="statusCliente"]').forEach((radio) => {
        radio.addEventListener("change", filtrarClientes);
    });

    document.getElementById("cpfCnpj").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    });

    document.getElementById("cpfCnpj").addEventListener("blur", function () {
        const cpfCnpj = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
            alert("CPF ou CNPJ inválido.");
        }
    });

    document.getElementById("telefone").addEventListener("input", function () {
        this.value = formatarTelefone(this.value);
    });

    document.getElementById("cep").addEventListener("input", function () {
        this.value = formatarCEP(this.value);
        buscarEnderecoPorCEP(this.value);
    });

    document
        .querySelectorAll('.filtro-status input[name="statusCliente"]')
        .forEach((radio) => {
            radio.addEventListener("change", function () {
                const filtro = this.value; // "ativos" ou "inativos"
                carregarClientes(filtro);
            });
        });
}

// Função para alternar a exibição do formulário
function toggleFormulario(mostrar) {
    document.getElementById("secaoFormularioCliente").style.display = mostrar
        ? "block"
        : "none";
    document.getElementsByClassName("tabela-clientes")[0].style.display = mostrar
        ? "none"
        : "block";
    document.getElementById("mostrarFormularioBotao").style.display = mostrar
        ? "none"
        : "block";
}

// Função para filtrar os clientes
function filtrarClientes() {
    const termoPesquisa = document
        .getElementById("entradaPesquisa")
        .value.trim()
        .toLowerCase();
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const corpoTabela = document.getElementById("corpoTabelaClientes");

    // Verifica o status atual (ativos ou inativos)
    const statusAtual = document.querySelector(
        'input[name="statusFiltro"]:checked'
    ).value;

    // Filtra os clientes com base no status e no termo de pesquisa
    const clientesFiltrados = clientes.filter((cliente) => {
        const correspondeStatus =
            statusAtual === "ativos" ? cliente.ativo : !cliente.ativo;
        const correspondePesquisa = cliente.nome
            .toLowerCase()
            .includes(termoPesquisa);
        return correspondeStatus && correspondePesquisa;
    });

    // Limpa a tabela antes de preenchê-la
    corpoTabela.innerHTML = "";

    // Exibe uma mensagem se não houver clientes no filtro atual
    if (clientesFiltrados.length === 0) {
        const linhaVazia = document.createElement("tr");
        linhaVazia.innerHTML = `<td colspan="6" style="text-align: center;">Nenhum cliente encontrado.</td>`;
        corpoTabela.appendChild(linhaVazia);
        return;
    }

    // Adiciona os clientes filtrados na tabela
    clientesFiltrados.forEach((cliente) => {
        const linha = criarLinhaTabela(cliente);
        if (linha) {
            corpoTabela.appendChild(linha);
        }
    });
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    event.preventDefault();
    if (validarCampos()) {
        salvarCliente(event);
    }
}

// Função para salvar o cliente no localStorage
function salvarCliente(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    const clienteId = document.getElementById("clienteId").value;
    const nome = document.getElementById("nome").value;
    const cpfCnpj = document.getElementById("cpfCnpj").value.replace(/\D/g, ""); // Remove caracteres não numéricos
    const telefone = document.getElementById("telefone").value.replace(/\D/g, ""); // Remove caracteres não numéricos
    const cep = document.getElementById("cep").value;
    const cidade = document.getElementById("cidade").value;
    const bairro = document.getElementById("bairro").value;
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value;
    const email = document.getElementById("email").value;
    const endereco = `${rua}, ${numero}, ${bairro}, ${cidade}`;
    const ultimaAtualizacao = new Date().toLocaleString(); // Data e hora da última atualização

    // Obtém o status do cliente com base no botão de rádio selecionado
    const status = document.querySelector(
        'input[name="statusCliente"]:checked'
    ).value;

    const dadosCliente = {
        id: clienteId ? parseInt(clienteId) : gerarIdClienteUnico(),
        nome,
        cpfCnpj: Number(cpfCnpj),
        telefone: Number(telefone),
        cep,
        endereco,
        email,
        ativo: status === "ativo", // Define o status como booleano
        ultimaAtualizacao,
    };

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    if (clienteId) {
        const index = clientes.findIndex((cliente) => cliente.id == clienteId);
        clientes[index] = dadosCliente;
    } else {
        clientes.push(dadosCliente);
    }

    localStorage.setItem("clientes", JSON.stringify(clientes));
    alert("Cliente salvo com sucesso!");
    document.getElementById("formularioCliente").reset();
    toggleFormulario(false);

    location.reload();
}

// Função para gerar um ID auto-incrementado
function gerarIdClienteUnico() {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    let novoId;
    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000); // Gera número de 11 dígitos
    } while (clientes.some((cliente) => cliente.id === novoId)); // Garante que o ID seja único
    return novoId;
}

// Função para carregar os clientes
function carregarClientes(filtro = "ativos") {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const corpoTabela = document.getElementById("corpoTabelaClientes");

    // Filtra os clientes com base no status
    const clientesFiltrados = clientes.filter((cliente) => {
        return filtro === "ativos" ? cliente.ativo : !cliente.ativo;
    });

    // Limpa a tabela antes de preenchê-la
    corpoTabela.innerHTML = "";

    // Adiciona os clientes filtrados na tabela
    clientesFiltrados.forEach((cliente) => {
        const linha = criarLinhaTabela(cliente);
        if (linha) {
            corpoTabela.appendChild(linha);
        }
    });

    // Exibe uma mensagem se não houver clientes no filtro atual
    if (clientesFiltrados.length === 0) {
        const linhaVazia = document.createElement("tr");
        linhaVazia.innerHTML = `<td colspan="6" style="text-align: center;">Nenhum cliente encontrado.</td>`;
        corpoTabela.appendChild(linhaVazia);
    }
}

// Função para criar uma linha na tabela
function criarLinhaTabela(cliente) {
    if (!cliente || !cliente.id || !cliente.nome) {
        console.error("Dados do cliente inválidos:", cliente);
        return null;
    }

    const linha = document.createElement("tr");
    const cpfCnpjFormatado =
        cliente.cpfCnpj.toString().length <= 11
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
            <button class="detalhes" onclick="abrirModalCliente(${cliente.id})">Ver Detalhes</button>
            <button class="editar" onclick="editarCliente(${cliente.id})">Editar</button>
            <button class="deletar" onclick="excluirCliente(${cliente.id})">Excluir</button>
        </td>
    `;
    return linha;
}

// Função para ativar um cliente
function ativarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const index = clientes.findIndex((cliente) => cliente.id == id);
    if (index !== -1) {
        clientes[index].ativo = true;
        localStorage.setItem("clientes", JSON.stringify(clientes));
        alert("Cliente ativado com sucesso!");
        carregarClientes("inativos"); // Atualiza a exibição dos inativos
    }
}

// Função para excluir um cliente
function excluirCliente(id) {
    // Recupera os clientes do localStorage
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    // Filtra os clientes para remover o cliente com o ID especificado
    clientes = clientes.filter((cliente) => cliente.id != id);

    // Atualiza o localStorage com a lista de clientes atualizada
    localStorage.setItem("clientes", JSON.stringify(clientes));

    // Exibe uma mensagem de sucesso
    alert("Cliente excluído com sucesso!");

    // Recarrega a página para atualizar a tabela
    location.reload();
}

// Função para editar um cliente
function editarCliente(id) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const cliente = clientes.find((cliente) => cliente.id == id);
    if (!cliente) return;

    // Preenche os campos do formulário com os dados do cliente
    document.getElementById("clienteId").value = cliente.id;
    document.getElementById("nome").value = cliente.nome || "";
    document.getElementById("cpfCnpj").value =
        cliente.cpfCnpj.toString().length <= 11
            ? formatarCPF(cliente.cpfCnpj.toString())
            : formatarCNPJ(cliente.cpfCnpj.toString());
    document.getElementById("telefone").value = formatarTelefone(
        cliente.telefone.toString()
    );
    document.getElementById("cep").value = formatarCEP(cliente.cep);
    document.getElementById("rua").value = cliente.endereco.split(", ")[0];
    document.getElementById("numero").value = cliente.endereco.split(", ")[1];
    document.getElementById("bairro").value = cliente.endereco.split(", ")[2];
    document.getElementById("cidade").value = cliente.endereco.split(", ")[3];
    document.getElementById("email").value = cliente.email;

    // Define o status do cliente
    if (cliente.ativo) {
        document.getElementById("statusAtivo").checked = true;
    } else {
        document.getElementById("statusInativo").checked = true;
    }

    // Exibe o formulário para edição
    toggleFormulario(true);
}

// Função para inativar um cliente
function inativarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const index = clientes.findIndex((cliente) => cliente.id == id);
    if (index !== -1) {
        clientes[index].ativo = false;
        localStorage.setItem("clientes", JSON.stringify(clientes));
        alert("Cliente inativado com sucesso!");
        carregarClientes("ativos"); // Atualiza a exibição dos ativos
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
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
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

// Função para validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cnpj.length !== 14) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
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

    const loading = document.getElementById("loading");
    loading.style.display = "flex"; // Exibe o indicador de carregamento

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
            if (data.erro) {
                alert("CEP não encontrado.");
                return;
            }
            document.getElementById("rua").value = data.logradouro || "";
            document.getElementById("bairro").value = data.bairro || "";
            document.getElementById("cidade").value = data.localidade || "";
        })
        .catch((error) => console.error("Erro ao buscar CEP:", error))
        .finally(() => {
            loading.style.display = "none"; // Oculta o indicador de carregamento
        });
}

// Função para validar Email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para validar todos os campos do formulário
function validarCampos() {
    const nome = document.getElementById("nome").value.trim();
    const cpfCnpj = document.getElementById("cpfCnpj").value.replace(/\D/g, ""); // Remove caracteres não numéricos
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const cidade = document.getElementById("cidade").value.trim();

    // Validação de CPF ou CNPJ
    if (cpfCnpj.length === 11) {
        if (!validarCPF(cpfCnpj)) {
            alert("CPF inválido.");
            return false;
        }
    } else if (cpfCnpj.length === 14) {
        if (!validarCNPJ(cpfCnpj)) {
            alert("CNPJ inválido.");
            return false;
        }
    } else {
        return false; // Remove o alerta e apenas retorna false
    }

    // Validação de email
    if (!validarEmail(email)) {
        alert("Email inválido.");
        return false;
    }

    return true;
}

// Função para abrir o modal com informações do cliente
function abrirModalCliente(clienteId) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const cliente = clientes.find((c) => c.id === clienteId);

    if (!cliente) {
        alert("Cliente não encontrado.");
        return;
    }

    // Preenche as informações do cliente no modal
    document.getElementById("modalCodigoCliente").textContent = cliente.id;
    document.getElementById("modalNome").textContent = cliente.nome;
    document.getElementById("modalCpfCnpj").textContent =
        cliente.cpfCnpj.toString().length <= 11
            ? formatarCPF(cliente.cpfCnpj.toString())
            : formatarCNPJ(cliente.cpfCnpj.toString());
    document.getElementById("modalTelefone").textContent = formatarTelefone(
        cliente.telefone.toString()
    );
    document.getElementById("modalEmail").textContent = cliente.email;
    document.getElementById("modalEndereco").textContent = cliente.endereco;
    document.getElementById("modalCep").textContent = cliente.cep;
    document.getElementById("modalStatus").textContent = cliente.ativo
        ? "Ativo"
        : "Inativo";
    document.getElementById("modalUltimaAtualizacao").textContent =
        cliente.ultimaAtualizacao || "Não disponível";

    // Exibe o modal
    document.getElementById("modalCliente").style.display = "flex";
}

// Fecha o modal ao clicar no botão de fechar
document.getElementById("fecharModal").addEventListener("click", function () {
    document.getElementById("modalCliente").style.display = "none";
});

// Função para cancelar o formulário
function cancelarFormulario() {
    document.getElementById("formularioCliente").reset(); // Reseta os campos do formulário
    toggleFormulario(false); // Oculta o formulário e exibe a tabela
}
