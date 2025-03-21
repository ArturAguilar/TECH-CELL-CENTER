// Adiciona um evento para carregar os dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    carregarClientes();
    configurarOuvintesDeEventos();
});

// Função para configurar os ouvintes de eventos
function configurarOuvintesDeEventos() {
    // Mostra o formulário de registro de cliente e esconde a tabela de clientes
    document.getElementById('mostrarFormularioBotao').addEventListener('click', function() {
        document.getElementById('secaoFormularioCliente').style.display = 'block';
        document.querySelector('.tabela-clientes').style.display = 'none';
        document.getElementById('mostrarFormularioBotao').style.display = 'none';
    });

    // Remova qualquer evento de submissão existente antes de adicionar um novo
    const formularioCliente = document.getElementById('formularioCliente');
    formularioCliente.removeEventListener('submit', lidarComSubmissaoFormulario); // Remove o evento de submissão existente para evitar a duplicação de eventos
    formularioCliente.addEventListener('submit', lidarComSubmissaoFormulario); // Adiciona um novo evento de submissão para lidar com a submissão do formulário

    // Adiciona um evento para filtrar os clientes com base na entrada de pesquisa
    document.getElementById('entradaPesquisa').addEventListener('input', function() {
        const termoPesquisa = this.value.toLowerCase(); // Obtém o termo de pesquisa digitado pelo usuário em letras minúsculas para facilitar a comparação de string
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const corpoTabela = document.getElementById('corpoTabelaClientes');
        corpoTabela.innerHTML = '';

        clientes.forEach(cliente => { // Percorre cada cliente armazenado no localStorage
            if (cliente.nome.toLowerCase().includes(termoPesquisa)) { // Verifica se o nome do cliente inclui o termo de pesquisa digitado
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.cpfCnpj}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.endereco}</td>
                    <td class="acoes">
                        <button class="editar" onclick="editarCliente(${cliente.id})">Editar</button>
                        <button class="deletar" onclick="deletarCliente(${cliente.id})">Deletar</button>
                    </td>
                `;
                corpoTabela.appendChild(linha);
            }
        });
    });
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    event.preventDefault(); // Previne a ação padrão do formulário (enviar a página)
    salvarCliente(); // Chama a função para salvar o cliente
}

function carrgarClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}

// Função para salvar o cliente no localStorage
function salvarCliente() {
    const clienteId = document.getElementById('clienteId').value;
    const nome = document.getElementById('nome').value;
    const cpfCnpj = document.getElementById('cpfCnpj').value;
    const telefone = document.getElementById('telefone').value;
    const cidade = document.getElementById('cidade').value;
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;

    const endereco = `${rua}, ${numero}, ${bairro}, ${cidade}`;

    const dadosCliente = {
        id: clienteId || new Date().getTime(), // Se o clienteId não for fornecido, gera um novo id baseado no timestamp atual para o novo cliente
        nome: nome,
        cpfCnpj: cpfCnpj,
        telefone: telefone,
        endereco: endereco
    };

    let clientes = carrgarClientes();

    if (clienteId) { // Se o clienteId for fornecido, atualiza o cliente existente com os novos dados do cliente
        clientes = atualizarClientes(clientes, dadosCliente);
    } else {
        clientes.push(dadosCliente); // Adiciona o novo cliente ao array de clientes se o clienteId não for fornecido (ou seja, é um novo cliente)
    }

    localStorage.setItem('clientes', JSON.stringify(clientes)); // Salva o array de clientes atualizado no localStorage para persistência dos dados entre as sessões do navegador

    alert('Cliente salvo com sucesso!');

    document.getElementById('formularioCliente').reset(); // Limpa o formulário após salvar o cliente
    document.getElementById('secaoFormularioCliente').style.display = 'none'; // Esconde o formulário de registro de cliente após salvar o cliente
    document.querySelector('.tabela-clientes').style.display = 'block'; // Mostra a tabela de clientes após salvar o cliente para visualizar os clientes salvos
    document.getElementById('mostrarFormularioBotao').style.display = 'block'; // Mostra o botão para mostrar o formulário de registro de cliente após salvar o cliente para adicionar um novo cliente

    carregarClientes(clientes); // Carrega os clientes salvos no localStorage para atualizar a tabela de clientes
}

function atualizarClientes(clientes, dadosCliente) {
    const index = clientes.findIndex(cliente => cliente.id == clienteId); // Encontra o índice do cliente existente no array de clientes com base no clienteId
    clientes[index] = dadosCliente; // Substitui o cliente existente com os novos dados do cliente no array de clientes
    return clientes;
}

// Função para carregar os clientes do localStorage e preencher a tabela de clientes
function carregarClientes(clientesEmMemoria) {
    const clientes = clientesEmMemoria || JSON.parse(localStorage.getItem('clientes')) || [];
    const corpoTabela = document.getElementById('corpoTabelaClientes');
    corpoTabela.innerHTML = '';

    clientes.forEach(cliente => { // Itera sobre a lista de clientes e adiciona cada cliente como uma nova linha na tabela de clientes
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.cpfCnpj}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.endereco}</td>
            <td class="acoes">
                <button class="editar" onclick="editarCliente(${cliente.id})">Editar</button>
                <button class="deletar" onclick="deletarCliente(${cliente.id})">Deletar</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    });
}

// Função para editar um cliente
function editarCliente(id) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(cliente => cliente.id == id); // Encontra o cliente a ser editado no array de clientes com base no clienteId fornecido

    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('nome').value = cliente.nome;
    document.getElementById('cpfCnpj').value = cliente.cpfCnpj;
    document.getElementById('telefone').value = cliente.telefone;

    const partesEndereco = cliente.endereco.split(', '); // Divide o endereço do cliente em partes separadas (rua, número, bairro, cidade) com base na vírgula e espaço em branco como separador
    document.getElementById('rua').value = partesEndereco[0];
    document.getElementById('numero').value = partesEndereco[1];
    document.getElementById('bairro').value = partesEndereco[2];
    document.getElementById('cidade').value = partesEndereco[3];

    document.getElementById('secaoFormularioCliente').style.display = 'block';
    document.querySelector('.tabela-clientes').style.display = 'none';
    document.getElementById('mostrarFormularioBotao').style.display = 'none';
}

// Função para deletar um cliente
function deletarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    if (confirm('Você tem certeza que deseja excluir esse cliente?')) {
        clientes = clientes.filter(cliente => cliente.id != id); // Filtra os clientes para excluir o cliente com o id fornecido da lista de clientes
        localStorage.setItem('clientes', JSON.stringify(clientes));
        alert('Cliente Deletado com Sucesso!');
        carregarClientes();
    }
}