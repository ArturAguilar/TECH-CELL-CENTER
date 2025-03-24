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
    formularioCliente.removeEventListener('submit', lidarComSubmissaoFormulario);
    formularioCliente.addEventListener('submit', lidarComSubmissaoFormulario);

    document.getElementById('entradaPesquisa').addEventListener('input', filtrarClientes);
}

// Função para alternar a exibição do formulário
function toggleFormulario(mostrar) {
    document.getElementById('secaoFormularioCliente').style.display = mostrar ? 'block' : 'none'; 
    document.querySelector('.tabela-clientes').style.display = mostrar ? 'none' : 'block';
    document.getElementById('mostrarFormularioBotao').style.display = mostrar ? 'none' : 'block';
}

// Função para filtrar os clientes
function filtrarClientes() {
    const termoPesquisa = this.value.toLowerCase();
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const corpoTabela = document.getElementById('corpoTabelaClientes');
    corpoTabela.innerHTML = '';

    clientes.forEach(cliente => {
        if (cliente.nome.toLowerCase().includes(termoPesquisa)) {
            corpoTabela.appendChild(criarLinhaTabela(cliente));
        }
    });
}

// Função para lidar com a submissão do formulário
function lidarComSubmissaoFormulario(event) {
    event.preventDefault();
    salvarCliente();
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
        id: gerarIdClienteUnico(),
        nome,
        cpfCnpj,
        telefone,
        endereco
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

function gerarIdClienteUnico() {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    let novoId;

    do {
        novoId = Math.floor(10000000000 + Math.random() * 90000000000).toString(); // Gera número de 11 dígitos
    } while (clientes.some(cliente => cliente.id === novoId)); // Garante que o ID seja único

    return novoId;
}

// Função para carregar os clientes
function carregarClientes() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const corpoTabela = document.getElementById('corpoTabelaClientes');
    corpoTabela.innerHTML = '';

    clientes.forEach(cliente => corpoTabela.appendChild(criarLinhaTabela(cliente)));
}

// Função para criar uma linha na tabela
function criarLinhaTabela(cliente) {
    const linha = document.createElement('tr');
    linha.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.cpfCnpj}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.endereco}</td>
        <td class="acoes">
            <button class="editar" onclick="editarCliente('${cliente.id}')">Editar</button>
            <button class="deletar" onclick="deletarCliente('${cliente.id}')">Deletar</button>
        </td>
    `;
    return linha;
}

// Função para editar um cliente
function editarCliente(id) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(cliente => cliente.id == id);

    if (!cliente) return;

    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('nome').value = cliente.nome;
    document.getElementById('cpfCnpj').value = cliente.cpfCnpj;
    document.getElementById('telefone').value = cliente.telefone;

    const [rua, numero, bairro, cidade] = cliente.endereco.split(', ');
    document.getElementById('rua').value = rua;
    document.getElementById('numero').value = numero;
    document.getElementById('bairro').value = bairro;
    document.getElementById('cidade').value = cidade;

    toggleFormulario(true);
}

// Função para deletar um cliente
function deletarCliente(id) {
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    if (confirm('Você tem certeza que deseja excluir esse cliente?')) {
        clientes = clientes.filter(cliente => cliente.id !== id);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        alert('Cliente deletado com sucesso!');
        carregarClientes();
    }
}