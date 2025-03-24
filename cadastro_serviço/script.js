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
}

// Função para alternar a exibição do formulário
function toggleFormulario(mostrar) {
    document.getElementById('secaoFormularioServico').style.display = mostrar ? 'block' : 'none';
    document.querySelector('.tabela-servico').style.display = mostrar ? 'none' : 'block';
    document.getElementById('botaoMostrarFormulario').style.display = mostrar ? 'none' : 'block';
}

// Função para filtrar os serviços
function filtrarServicos() {
    const termoPesquisa = this.value.toLowerCase();
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaServicos');
    corpoTabela.innerHTML = '';

    servicos.forEach(servico => {
        if (servico.nomeServico.toLowerCase().includes(termoPesquisa) || servico.descricao.toLowerCase().includes(termoPesquisa)) {
            corpoTabela.appendChild(criarLinhaTabela(servico));
        }
    });
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    event.preventDefault();
    salvarServico();
}

// Função para salvar o serviço no localStorage
function salvarServico() {
    const servicoId = document.getElementById('idServico').value;
    const nomeServico = document.getElementById('nomeServico').value;
    const descricao = document.getElementById('descricao').value;
    const preco = document.getElementById('preco').value;
    const tempoBase = document.getElementById('tempoBase').value;
    const categoria = document.getElementById('categoria').value;

    const dadosServico = {
        id: gerarIdClienteUnico(), // Gera um ID único para o serviço
        nomeServico,
        descricao,
        preco,
        tempoBase,
        categoria
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

function gerarIdClienteUnico() {
    let clientes = JSON.parse(localStorage.getItem('servicos')) || [];
    let novoId;

    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000).toString(); // Gera número de 11 dígitos
    } while (clientes.some(servico => servico.id === novoId)); // Garante que o ID seja único

    return novoId;
}

// Função para carregar os serviços
function carregarServicos() {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaServicos');
    corpoTabela.innerHTML = '';

    servicos.forEach(servico => corpoTabela.appendChild(criarLinhaTabela(servico)));
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
            <button class="editar" onclick="editarServico(${servico.id})">Editar</button>
            <button class="deletar" onclick="deletarServico(${servico.id})">Deletar</button>
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

// Função para deletar um serviço
function deletarServico(id) {
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    if (confirm('Você tem certeza que deseja excluir esse serviço?')) {
        servicos = servicos.filter(servico => servico.id != id);
        localStorage.setItem('servicos', JSON.stringify(servicos));
        alert('Serviço deletado com sucesso!');
        carregarServicos();
    }
}