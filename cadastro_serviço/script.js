// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    carregarServicos(); // Carrega os serviços ao carregar a página
    configurarOuvintesDeEventos(); // Configura os eventos
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesDeEventos() {
    document.getElementById('botaoMostrarFormulario').addEventListener('click', function () {
        toggleFormulario(true);
    });

    const formularioServico = document.getElementById('formularioServico');
    formularioServico.addEventListener('submit', salvarServico);

    document.getElementById('entradaPesquisa').addEventListener('input', filtrarServicos);

    document.querySelectorAll('input[name="statusFiltroServico"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const filtro = this.value; // "ativos" ou "inativos"
            carregarServicos(filtro);
        });
    });
}

// Função para alternar a exibição do formulário
function toggleFormulario(mostrar) {
    document.getElementById('secaoFormularioServico').style.display = mostrar ? 'block' : 'none';
    document.querySelector('.tabela-servico').style.display = mostrar ? 'none' : 'block';
    document.getElementById('botaoMostrarFormulario').style.display = mostrar ? 'none' : 'block';
}

// Função para filtrar os serviços
function filtrarServicos() {
    const termoPesquisa = document.getElementById('entradaPesquisa').value.trim().toLowerCase();
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaServicos');

    // Verifica o status atual (ativos ou inativos)
    const statusAtual = document.querySelector('input[name="statusFiltroServico"]:checked').value;

    // Filtra os serviços com base no status e no termo de pesquisa
    const servicosFiltrados = servicos.filter(servico => {
        const correspondeStatus = statusAtual === 'ativos' ? servico.ativo : !servico.ativo;
        const correspondePesquisa = servico.nomeServico.toLowerCase().includes(termoPesquisa);
        return correspondeStatus && correspondePesquisa;
    });

    // Limpa a tabela antes de preenchê-la
    corpoTabela.innerHTML = '';

    // Exibe uma mensagem se não houver serviços no filtro atual
    if (servicosFiltrados.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.innerHTML = `<td colspan="7" style="text-align: center;">Nenhum serviço encontrado.</td>`;
        corpoTabela.appendChild(linhaVazia);
        return;
    }

    // Adiciona os serviços filtrados na tabela
    servicosFiltrados.forEach(servico => {
        const linha = criarLinhaTabela(servico);
        if (linha) {
            corpoTabela.appendChild(linha);
        }
    });
}

// Função para salvar o serviço no localStorage
function salvarServico(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    const idServico = document.getElementById('idServico').value.trim();
    const nomeServico = document.getElementById('nomeServico').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const preco = parseFloat(document.getElementById('preco').value.replace(/[^\d,]/g, "").replace(",", "."));
    if (isNaN(preco) || preco <= 0) {
        alert("Por favor, insira um preço válido.");
        return;
    }
    const tempoBase = parseInt(document.getElementById('tempoBase').value.trim());
    const categoria = document.getElementById('categoria').value.trim();
    const status = document.querySelector('input[name="statusFiltroServico"]:checked').value; // Obtém o status selecionado

    // Validação dos campos
    if (!nomeServico || !descricao || isNaN(preco) || isNaN(tempoBase) || !categoria) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Criação do objeto do serviço
    const dadosServico = {
        id: idServico ? parseInt(idServico) : gerarIdClienteUnico(),
        nomeServico,
        descricao,
        preco,
        tempoBase,
        categoria,
        ativo: status === 'ativo' // Define o status como booleano
    };

    // Recupera os serviços do localStorage
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];

    if (idServico) {
        // Atualiza o serviço existente
        const index = servicos.findIndex(servico => servico.id == idServico);
        if (index !== -1) {
            servicos[index] = dadosServico;
        }
    } else {
        // Adiciona um novo serviço
        servicos.push(dadosServico);
    }

    // Salva os serviços atualizados no localStorage
    localStorage.setItem('servicos', JSON.stringify(servicos));
    alert('Serviço salvo com sucesso!');

    // Reseta o formulário e oculta
    document.getElementById('formularioServico').reset();
    toggleFormulario(false);

    // Recarrega a tabela e a página
    carregarServicos();
    location.reload(); // Recarrega a página
}

// Função para validar todos os campos do formulário
function validarCampos() {
    const nomeServico = document.getElementById('nomeServico').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const preco = document.getElementById('preco').value.trim();
    const tempoBase = document.getElementById('tempoBase').value.trim();
    const categoria = document.getElementById('categoria').value.trim();

    return nomeServico && descricao && preco && tempoBase && categoria;
}

// Função para gerar um ID único para o serviço
function gerarIdClienteUnico() {
    let clientes = JSON.parse(localStorage.getItem('servicos')) || [];
    let novoId;

    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000); // Gera número de 11 dígitos
    } while (clientes.some(servico => servico.id === novoId)); // Garante que o ID seja único

    return novoId;
}

// Função para carregar os serviços
function carregarServicos(filtro = 'ativos') {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaServicos');

    // Filtra os serviços com base no status
    const servicosFiltrados = servicos.filter(servico => {
        return filtro === 'ativos' ? servico.ativo : !servico.ativo;
    });

    // Limpa a tabela antes de preenchê-la
    corpoTabela.innerHTML = '';

    // Adiciona os serviços filtrados na tabela
    servicosFiltrados.forEach(servico => {
        const linha = criarLinhaTabela(servico);
        if (linha) {
            corpoTabela.appendChild(linha);
        }
    });

    // Exibe uma mensagem se não houver serviços no filtro atual
    if (servicosFiltrados.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.innerHTML = `<td colspan="7" style="text-align: center;">Nenhum serviço encontrado.</td>`;
        corpoTabela.appendChild(linhaVazia);
    }
}

// Função para criar uma linha na tabela
function criarLinhaTabela(servico) {
    const linha = document.createElement('tr');
    linha.innerHTML = `
        <td>${servico.id}</td>
        <td>${servico.nomeServico}</td>
        <td>R$ ${servico.preco.toFixed(2).replace(".", ",")}</td>
        <td>${servico.tempoBase} dias</td>
        <td>${servico.categoria}</td>
        <td class="acoes">
            <button class="editar" onclick="editarServico('${servico.id}')">Editar</button>
            <button class="deletar" onclick="deletarServico('${servico.id}')">Excluir</button>
        </td>
    `;
    return linha;
}

// Função para editar um serviço
function editarServico(id) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const servico = servicos.find(servico => servico.id == id);

    if (!servico) return;

    // Preenche os campos do formulário com os dados do serviço
    document.getElementById('idServico').value = servico.id;
    document.getElementById('nomeServico').value = servico.nomeServico;
    document.getElementById('descricao').value = servico.descricao;

    // Exibe o preço formatado no campo
    document.getElementById('preco').value = servico.preco.toFixed(2).replace(".", ",");

    // Exibe o tempoBase como número
    document.getElementById('tempoBase').value = servico.tempoBase;

    document.getElementById('categoria').value = servico.categoria;

    // Define o status do serviço
    if (servico.ativo) {
        document.getElementById('statusAtivo').checked = true;
    } else {
        document.getElementById('statusInativo').checked = true;
    }

    // Exibe o formulário para edição
    toggleFormulario(true);
}

// Função para alterar o status de um serviço
function alterarStatusServico(id, ativo) {
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const index = servicos.findIndex(servico => servico.id == id);
    if (index !== -1) {
        servicos[index].ativo = ativo;
        localStorage.setItem('servicos', JSON.stringify(servicos));
        alert(`Serviço ${ativo ? 'ativado' : 'inativado'} com sucesso!`);
        carregarServicos(); // Recarrega a tabela com o filtro atual
    } else {
        alert('Serviço não encontrado.');
    }
}

// Função para inativar um serviço
function inativarServico(id) {
    alterarStatusServico(id, false);
}

// Função para ativar um serviço
function ativarServico(id) {
    alterarStatusServico(id, true);
}

// Função para deletar um serviço (inativar)
function deletarServico(id) {
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const index = servicos.findIndex(servico => servico.id == id);
    if (index !== -1) {
        servicos.splice(index, 1); // Remove o serviço do array
        localStorage.setItem('servicos', JSON.stringify(servicos));
        alert('Serviço excluído com sucesso!');
        carregarServicos(); // Recarrega a tabela
    } else {
        alert('Serviço não encontrado.');
    }
}

// Função para formatar o preço
function formatarPreco(preco) {
    preco = preco.replace(/\D/g, ""); // Remove caracteres não numéricos
    preco = (preco / 100).toFixed(2) + ""; // Divide por 100 para obter o valor correto
    preco = preco.replace(".", ","); // Substitui ponto por vírgula
    preco = preco.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // Adiciona pontos como separadores de milhar
    return "R$ " + preco;
}

// Função para validar o preço
function validarPreco(preco) {
    const precoNumerico = parseFloat(preco.replace(/\D/g, "")) / 100;
    return !isNaN(precoNumerico) && precoNumerico > 0;
}

// Função para cancelar o formulário
function cancelarFormulario() {
    document.getElementById('formularioServico').reset(); // Reseta os campos do formulário
    toggleFormulario(false); // Oculta o formulário e exibe a tabela
}

function aplicarMascaraPreco(campo) {
    let valor = campo.value.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    valor = (parseFloat(valor) / 100).toFixed(2) + ""; // Converte para número e fixa duas casas decimais
    valor = valor.replace(".", ","); // Substitui ponto por vírgula
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona pontos como separadores de milhar
    campo.value = "R$ " + valor; // Adiciona o prefixo "R$"
}