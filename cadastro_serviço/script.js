// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarServicos();
    configurarOuvintesDeEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesDeEventos() {
    document.getElementById('botaoMostrarFormulario').addEventListener('click', function() {
        toggleFormulario(true);
    });

    const formularioServico = document.getElementById('formularioServico');
    formularioServico.removeEventListener('submit', lidarComSubmissaoFormulario);
    formularioServico.addEventListener('submit', lidarComSubmissaoFormulario);

    document.getElementById('inputBusca').addEventListener('input', filtrarServicos);

    document.querySelectorAll('input[name="statusServico"]').forEach(radio => {
        radio.addEventListener('change', filtrarServicos);
    });

    document.getElementById('preco').addEventListener('input', function() {
        this.value = formatarPreco(this.value);
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
    const termoPesquisa = document.getElementById('inputBusca').value.trim().toLowerCase();
    const statusFiltro = document.querySelector('input[name="statusServico"]:checked').value;
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaServicos');
    corpoTabela.innerHTML = '';

    servicos.forEach(servico => {
        const nomeIncluiTermo = servico.nomeServico.toLowerCase().includes(termoPesquisa);
        const descricaoIncluiTermo = servico.descricao.toLowerCase().includes(termoPesquisa);
        const statusCorreto = (statusFiltro === 'todos') ||
                              (statusFiltro === 'ativos' && servico.ativo === true) ||
                              (statusFiltro === 'inativos' && servico.ativo === false);

        if ((nomeIncluiTermo || descricaoIncluiTermo) && statusCorreto) {
            corpoTabela.appendChild(criarLinhaTabela(servico));
        }
    });
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    event.preventDefault();
    if (validarCampos()) {
        salvarServico();
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
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

// Função para salvar o serviço no localStorage
function salvarServico() {
    const servicoId = document.getElementById('idServico').value;
    const nomeServico = document.getElementById('nomeServico').value;
    const descricao = document.getElementById('descricao').value;
    let preco = document.getElementById('preco').value;
    const tempoBase = document.getElementById('tempoBase').value;
    const categoria = document.getElementById('categoria').value;

    if (!validarPreco(preco)) {
        alert('Por favor, insira um preço válido.');
        return;
    }

    preco = formatarPreco(preco);

    const dadosServico = {
        id: servicoId ? parseInt(servicoId) : gerarIdClienteUnico(),
        nomeServico,
        descricao,
        preco,
        tempoBase,
        categoria,
        ativo: true
    };

    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];

    if (servicoId) {
        const index = servicos.findIndex(servico => servico.id == servicoId);
        servicos[index] = dadosServico;
    } else {
        servicos.push(dadosServico);
    }

    localStorage.setItem('servicos', JSON.stringify(servicos));

    alert('Serviço salvo com sucesso!');
    document.getElementById('formularioServico').reset();
    toggleFormulario(false);
    carregarServicos();
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
function carregarServicos() {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaServicos');
    corpoTabela.innerHTML = '';

    servicos.forEach(servico => corpoTabela.appendChild(criarLinhaTabela(servico)));

    filtrarServicos(); // Aplica o filtro de status e pesquisa após carregar todos os serviços
}

// Função para criar uma linha na tabela
function criarLinhaTabela(servico) {
    const linha = document.createElement('tr');
    linha.innerHTML = `
        <td>${servico.id}</td>
        <td>${servico.nomeServico}</td>
        <td>${servico.descricao}</td>
        <td>${servico.preco}</td>
        <td>${servico.tempoBase}</td>
        <td>${servico.categoria}</td>
        <td class="acoes">
            ${servico.ativo ? `
                <button class="editar" onclick="editarServico(${servico.id})">Editar</button>
                <button class="inativar" onclick="inativarServico(${servico.id})">Inativar</button>
            ` : `
                <button class="ativar" onclick="ativarServico(${servico.id})">Ativar</button>
                <button class="deletar" onclick="deletarServico(${servico.id})">Excluir</button>
            `}
        </td>
    `;
    return linha;
}

// Função para editar um serviço
function editarServico(id) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const servico = servicos.find(servico => servico.id == id);

    if (!servico) return;

    document.getElementById('idServico').value = servico.id;
    document.getElementById('nomeServico').value = servico.nomeServico;
    document.getElementById('descricao').value = servico.descricao;
    document.getElementById('preco').value = servico.preco;
    document.getElementById('tempoBase').value = servico.tempoBase;
    document.getElementById('categoria').value = servico.categoria;

    toggleFormulario(true);
}

// Função para inativar um serviço
function inativarServico(id) {
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const index = servicos.findIndex(servico => servico.id == id);
    if (index !== -1) {
        servicos[index].ativo = false;
        localStorage.setItem('servicos', JSON.stringify(servicos));
        alert('Serviço inativado com sucesso!');
        carregarServicos();
    }
}

// Função para ativar um serviço
function ativarServico(id) {
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const index = servicos.findIndex(servico => servico.id == id);
    if (index !== -1) {
        servicos[index].ativo = true;
        localStorage.setItem('servicos', JSON.stringify(servicos));
        alert('Serviço ativado com sucesso!');
        carregarServicos();
    }
}

// Função para deletar um serviço (inativar)
function deletarServico(id) {
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const index = servicos.findIndex(servico => servico.id == id);
    if (index !== -1) {
        servicos.splice(index, 1);
        localStorage.setItem('servicos', JSON.stringify(servicos));
        alert('Serviço excluído com sucesso!');
        carregarServicos();
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