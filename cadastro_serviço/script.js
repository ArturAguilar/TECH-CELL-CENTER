// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarServicos();
    configurarOuvintesEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesEventos() {
    // Mostra o formulário de adicionar serviço e esconde a tabela de serviços
    document.getElementById('botaoMostrarFormulario').addEventListener('click', function() {
        document.getElementById('secaoFormularioServico').style.display = 'block';
        document.querySelector('.tabela-servico').style.display = 'none';
        document.getElementById('botaoMostrarFormulario').style.display = 'none';
    });

    // Remova qualquer evento de submissão existente antes de adicionar um novo
    const formularioServico = document.getElementById('formularioServico');
    formularioServico.removeEventListener('submit', lidarComSubmissaoFormulario); // Remove o evento de submissão existente para evitar a duplicação de eventos
    formularioServico.addEventListener('submit', lidarComSubmissaoFormulario); // Adiciona um novo evento de submissão para lidar com a submissão do formulário

    // Adiciona um evento para filtrar os serviços com base na entrada de pesquisa
    document.getElementById('inputBusca').addEventListener('input', function() {
        const termoBusca = this.value.toLowerCase(); // Obtem o valor da entrada de pesquisa em minúsculas para facilitar a comparação de string
        const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
        const corpoTabela = document.getElementById('corpoTabelaServicos');
        corpoTabela.innerHTML = '';

        servicos.forEach(servico => { // Percorre cada serviço armazenado no localStorage
            if (servico.nomeServico.toLowerCase().includes(termoBusca) || servico.descricao.toLowerCase().includes(termoBusca)) { // Verifica se o nome ou a descrição do serviço contém o termo de busca digitado pelo usuário
                const row = document.createElement('tr');
                row.innerHTML = `
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
                corpoTabela.appendChild(row);
            }
        });
    });
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) { 
    event.preventDefault(); // Previne a ação padrão do formulário (enviar a página)
    salvarServico(); // Chama a função para salvar o serviço
} 

// Função para salvar o serviço no localStorage
function salvarServico() {
    const idServico = document.getElementById('idServico').value;
    const nomeServico = document.getElementById('nomeServico').value;
    const descricao = document.getElementById('descricao').value;
    const preco = document.getElementById('preco').value;
    const tempoBase = document.getElementById('tempoBase').value;
    const categoria = document.getElementById('categoria').value;

    const dadosServico = {
        id: idServico || new Date().getTime(), // Gera um ID único para o serviço se não for fornecido 
        nomeServico: nomeServico,
        descricao: descricao,
        preco: preco,
        tempoBase: tempoBase,
        categoria: categoria
    };

    console.log('Salvando serviço:', dadosServico);

    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];

    if (idServico) { // Verifica se o ID do serviço já existe no localStorage
        const index = servicos.findIndex(servico => servico.id == idServico);
        servicos[index] = dadosServico; // Atualiza o serviço existente com os novos dados do serviço
    } else {
        servicos.unshift(dadosServico); // Adiciona o novo serviço no início da lista
    }

    localStorage.setItem('servicos', JSON.stringify(servicos)); // Salva o array de serviços atualizado no localStorage para persistência 

    alert('Serviço salvo com sucesso!');

    document.getElementById('formularioServico').reset(); // Limpa o formulário após salvar o serviço
    document.getElementById('secaoFormularioServico').style.display = 'none';
    document.querySelector('.tabela-servico').style.display = 'block';
    document.getElementById('botaoMostrarFormulario').style.display = 'block';

    carregarServicos();
}

// Função para carregar os serviços do localStorage e preencher a tabela de serviços
function carregarServicos() {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const corpoTabela = document.getElementById('corpoTabelaServicos');
    corpoTabela.innerHTML = '';

    servicos.forEach(servico => { // Percorre a lista de serviços armazenados no localStorage e exibe na tabela de serviços na página HTML
        const row = document.createElement('tr');
        row.innerHTML = `
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
        corpoTabela.appendChild(row);
    });

    console.log('Serviços carregados:', servicos);
}

// Função para editar um serviço
function editarServico(id) {
    const servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    const servico = servicos.find(servico => servico.id == id); // Encontra o serviço a ser editado no array de serviços com base no ID do serviço fornecido

    document.getElementById('idServico').value = servico.id;
    document.getElementById('nomeServico').value = servico.nomeServico;
    document.getElementById('descricao').value = servico.descricao;
    document.getElementById('preco').value = servico.preco;
    document.getElementById('tempoBase').value = servico.tempoBase;
    document.getElementById('categoria').value = servico.categoria;

    document.getElementById('secaoFormularioServico').style.display = 'block';
    document.querySelector('.tabela-servico').style.display = 'none';
    document.getElementById('botaoMostrarFormulario').style.display = 'none';
}

// Função para deletar um serviço
function deletarServico(id) {
    let servicos = JSON.parse(localStorage.getItem('servicos')) || [];
    if (confirm('Você tem certeza que deseja excluir esse serviço?')) {
        servicos = servicos.filter(servico => servico.id != id); // Remove o serviço com o ID fornecido do array de serviços 
        localStorage.setItem('servicos', JSON.stringify(servicos));
        alert('Serviço deletado com sucesso!');
        carregarServicos();
    }
}