document.addEventListener('DOMContentLoaded', function() {
    loadBudgets();
    setupEventListeners();
});

function loadBudgets() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const budgetTableBody = document.getElementById('budgetTableBody');
    budgetTableBody.innerHTML = '';

    budgets.forEach(budget => {
        budget.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${budget.client}</td>
                <td>${item.product}</td>
                <td>${item.quantity}</td>
                <td>${item.service}</td>
                <td>R$ ${item.price}</td>
                <td>${budget.status}</td>
                <td>${budget.observations || 'N/A'}</td>
                <td>
                    <button onclick="editBudget(${budget.id})">Editar</button>
                    <button onclick="deleteBudget(${budget.id})">Deletar</button>
                    <button onclick="generatePDF(${budget.id})">Gerar PDF</button>
                </td>
            `;
            budgetTableBody.appendChild(row);
        });
    });
}

function setupEventListeners() {
    // Adicione outros event listeners se necessário
}

function editBudget(id) {
    // Redirecionar para a página de edição de orçamento com o ID do orçamento
    window.location.href = `../cadastro_orçamento/orcamentos.html?edit=${id}`;
}

function deleteBudget(id) {
    let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    if (confirm('Tem certeza que deseja deletar este orçamento?')) {
        budgets = budgets.filter(budget => budget.id != id);
        localStorage.setItem('budgets', JSON.stringify(budgets));
        alert('Orçamento deletado com sucesso!');
        loadBudgets();
    }
}

function generatePDF(id) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const budgets = JSON.parse(localStorage.getItem('budgets')) || [];
    const budget = budgets.find(budget => budget.id == id);

    doc.text('Orçamento', 10, 10);
    doc.text(`Cliente: ${budget.client}`, 10, 20);
    let y = 30;

    budget.items.forEach(item => {
        doc.text(`Produto: ${item.product}`, 10, y);
        doc.text(`Quantidade: ${item.quantity}`, 60, y);
        doc.text(`Serviço: ${item.service}`, 110, y);
        doc.text(`Preço: R$ ${item.price}`, 160, y);
        y += 10;
    });

    doc.text(`Status: ${budget.status}`, 10, y);
    doc.text(`Observações: ${budget.observations || 'N/A'}`, 60, y);
    y += 20;

    doc.save(`orcamento_${budget.client}.pdf`);
}