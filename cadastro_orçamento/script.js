// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarOrcamentos();
    configurarOuvintesEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesEventos() {
    // Mostra o formulário de adicionar orçamento e esconde a tabela de orçamentos
    document.getElementById('botaoMostrarFormularioOrcamento').addEventListener('click', function() {
        document.getElementById('secaoFormularioOrcamento').style.display = 'block';
        document.querySelector('.tabela-orcamento').style.display = 'none';
        document.getElementById('botaoMostrarFormularioOrcamento').style.display = 'none';
    });

    // Adiciona um evento para salvar o orçamento
    document.getElementById('botaoSalvarOrcamento').addEventListener('click', salvarOrcamento);

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

// Função para salvar o orçamento no localStorage
function salvarOrcamento() {
    const idOrcamento = document.getElementById('idOrcamento').value;
    const cliente = document.getElementById('cliente').value;
    const status = document.getElementById('status').value;
    const observacoes = document.getElementById('observacoes').value;
    const total = document.getElementById('total').value;

    const dadosOrcamento = {
        id: idOrcamento || new Date().getTime(), // Se o campo id for preenchido, usa esse valor, caso contrário, gera um id único com base no tempo atual
        cliente: cliente,
        status: status,
        observacoes: observacoes,
        total: total
    };

    console.log('Salvando orçamento:', dadosOrcamento);

    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];

    if (idOrcamento) { // Se o campo id for preenchido, atualiza o orçamento existente com os novos dados
        const index = orcamentos.findIndex(orcamento => orcamento.id == idOrcamento); 
        orcamentos[index] = dadosOrcamento; // Atualiza o orçamento existente com os novos dados
    } else {
        orcamentos.unshift(dadosOrcamento); // Adiciona o novo orçamento no início da lista
    }

    localStorage.setItem('orcamentos', JSON.stringify(orcamentos));

    alert('Orçamento salvo com sucesso!');

    document.getElementById('formularioOrcamento').reset(); // Limpa o formulário após salvar o orçamento
    document.getElementById('secaoFormularioOrcamento').style.display = 'none';
    document.querySelector('.tabela-orcamento').style.display = 'block';
    document.getElementById('botaoMostrarFormularioOrcamento').style.display = 'block';

    carregarOrcamentos();
}

// Função para carregar os orçamentos do localStorage e preencher a tabela de orçamentos
function carregarOrcamentos() { 
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaOrcamentos');
    corpoTabela.innerHTML = '';

    orcamentos.forEach(orcamento => { // Percorre cada orçamento armazenado no localStorage e exibe na tabela de orçamentos na página HTML
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

// Função para editar um orçamento
function editarOrcamento(id) {
    const orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    const orcamento = orcamentos.find(orcamento => orcamento.id == id); // Encontra o orçamento a ser editado no array de orçamentos com base no ID do orçamento fornecido

    document.getElementById('idOrcamento').value = orcamento.id;
    document.getElementById('cliente').value = orcamento.cliente;
    document.getElementById('status').value = orcamento.status;
    document.getElementById('observacoes').value = orcamento.observacoes;
    document.getElementById('total').value = orcamento.total;

    document.getElementById('secaoFormularioOrcamento').style.display = 'block';
    document.querySelector('.tabela-orcamento').style.display = 'none';
    document.getElementById('botaoMostrarFormularioOrcamento').style.display = 'none';
}

// Função para deletar um orçamento
function deletarOrcamento(id) {
    let orcamentos = JSON.parse(localStorage.getItem('orcamentos')) || [];
    if (confirm('Você tem certeza que deseja excluir esse orçamento?')) {
        orcamentos = orcamentos.filter(orcamento => orcamento.id != id); // Remove o orçamento a ser deletado do array de orçamentos com base no ID do orçamento fornecido  
        localStorage.setItem('orcamentos', JSON.stringify(orcamentos));
        alert('Orçamento deletado com sucesso!');
        carregarOrcamentos();
    }
}