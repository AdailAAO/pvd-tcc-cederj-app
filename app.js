
// A Integração - Controla todos os eventos de cliques e botões
window.onload = () => switchTab("pdv");

document.getElementById("tab-pdv").addEventListener("click", () => switchTab("pdv"));
document.getElementById("tab-gerente").addEventListener("click", () => switchTab("gerente"));
document.getElementById("tab-historico").addEventListener("click", () => switchTab("historico"));
document.getElementById("tab-config").addEventListener("click", () => switchTab("config"));

// Lógica de exibição do campo de Dinheiro/Troco
document.getElementById("payment-method").addEventListener("change", (e) => {
    const cashContainer = document.getElementById("cash-payment-container");
    if (e.target.value === "Dinheiro") {
        cashContainer.classList.remove("hidden");
    } else {
        cashContainer.classList.add("hidden");
    }
});

document.getElementById("add-item-btn").addEventListener("click", () => {
    const code = document.getElementById("product-code").value.trim();
    const qty = parseInt(document.getElementById("quantity").value);
    
    if(addItemToCart(code, qty)) {
        renderItemList();
        document.getElementById("product-code").value = "";
        document.getElementById("quantity").value = "1";
    } else {
        showMessage("Produto não encontrado. Tente os códigos de teste 1 ou 2.");
    }
});

document.getElementById("save-prod-btn").addEventListener("click", () => {
    const code = document.getElementById("prod-code-input").value.trim();
    const name = document.getElementById("prod-name-input").value.trim();
    const price = parseFloat(document.getElementById("prod-price-input").value);
    
    if (saveProductToCatalog(code, name, price)) {
        showMessage("✅ Produto salvo no catálogo!");
        renderProductsTable();
        document.getElementById("prod-code-input").value = "";
        document.getElementById("prod-name-input").value = "";
        document.getElementById("prod-price-input").value = "";
    } else {
        showMessage("⚠️ Preencha todos os campos corretamente.");
    }
});

document.getElementById("finalize-btn").addEventListener("click", () => {
    const total = calculateTotal();
    const paymentMethod = document.getElementById("payment-method").value;

    if (total <= 0) {
        showMessage("⚠️ O carrinho está vazio!");
        return;
    }

    let amountPaid = 0;
    let change = 0;

    // Lógica do Troco
    if (paymentMethod === "Dinheiro") {
        amountPaid = parseFloat(document.getElementById("amount-paid-input").value);
        if (isNaN(amountPaid) || amountPaid < total) {
            showMessage("❌ Valor recebido insuficiente ou inválido.");
            return;
        }
        change = amountPaid - total;
    } else if (paymentMethod === "PIX") {
        // Exibe o QR Code Mockado
        checkoutPIX(total); 
    }

    // Salva a venda no histórico
    const sale = {
        date: new Date().toLocaleString(),
        total: total,
        paymentMethod: paymentMethod,
        items: [...currentSaleItems],
        amountPaid: amountPaid,
        change: change
    };
    
    salesHistory.push(sale);
    saveData();
    clearSale();
    renderItemList();

    // Limpa campo de dinheiro
    if(document.getElementById("amount-paid-input")) {
        document.getElementById("amount-paid-input").value = "";
    }

    // Se for dinheiro, já mostra a nota direto
    if (paymentMethod === "Dinheiro") {
        generateAndShowInvoice(sale);
    }
});

document.getElementById("cancel-btn").addEventListener("click", () => {
    if (currentSaleItems.length > 0) {
        clearSale();
        renderItemList();
        showMessage("🗑️ Venda cancelada e carrinho limpo.");
    } else {
        showMessage("O carrinho já está vazio.");
    }
});

document.getElementById("save-config-btn").addEventListener("click", () => {
    businessConfig.name = document.getElementById("cfg-name").value.trim();
    businessConfig.key = document.getElementById("cfg-key").value.trim();
    businessConfig.city = document.getElementById("cfg-city").value.trim();
    
    saveData();
    showMessage("⚙️ Configurações salvas no armazenamento local.");
});


/*
// Ao iniciar a página, abre a aba de PDV
window.onload = () => switchTab("pdv");

// Eventos de troca de Abas
document.getElementById("tab-pdv").addEventListener("click", () => switchTab("pdv"));
document.getElementById("tab-gerente").addEventListener("click", () => switchTab("gerente"));
document.getElementById("tab-historico").addEventListener("click", () => switchTab("historico"));
document.getElementById("tab-config").addEventListener("click", () => switchTab("config"));

// Evento: Adicionar Item ao Carrinho
document.getElementById("add-item-btn").addEventListener("click", () => {
    const code = document.getElementById("product-code").value.trim();
    const qty = parseInt(document.getElementById("quantity").value);
    
    if(addItemToCart(code, qty)) {
        renderItemList();
        // Limpa os campos após adicionar
        document.getElementById("product-code").value = "";
        document.getElementById("quantity").value = "1";
    } else {
        showMessage("Produto não encontrado. Tente os códigos de teste 1 ou 2.");
    }
});

// Evento: Salvar Novo Produto no Catálogo (Gerenciar)
document.getElementById("save-prod-btn").addEventListener("click", () => {
    const code = document.getElementById("prod-code-input").value.trim();
    const name = document.getElementById("prod-name-input").value.trim();
    const price = parseFloat(document.getElementById("prod-price-input").value);
    
    if (saveProductToCatalog(code, name, price)) {
        showMessage("✅ Produto salvo no catálogo!");
        renderProductsTable();
        // Limpa os campos
        document.getElementById("prod-code-input").value = "";
        document.getElementById("prod-name-input").value = "";
        document.getElementById("prod-price-input").value = "";
    } else {
        showMessage("⚠️ Preencha todos os campos corretamente.");
    }
});

// Evento: Finalizar Venda
document.getElementById("finalize-btn").addEventListener("click", () => {
    const total = calculateTotal();
    const paymentMethod = document.getElementById("payment-method").value;

    if (total <= 0) {
        showMessage("⚠️ O carrinho está vazio!");
        return;
    }

    // VERSÃO ACADÊMICA: Simulação do PIX sem gerar QR Code real
    if (paymentMethod === "PIX") {
        showMessage("✅ Pagamento via PIX selecionado. Venda Registrada no Histórico (Simulação Acadêmica).");
    } else {
        showMessage("✅ Venda em Dinheiro registrada.");
    }

    // Salva a venda no histórico
    const sale = {
        date: new Date().toLocaleString(),
        total: total,
        paymentMethod: paymentMethod,
        items: [...currentSaleItems]
    };
    
    salesHistory.push(sale);
    saveData();
    clearSale();
    renderItemList();
});

// Evento: Cancelar Venda
document.getElementById("cancel-btn").addEventListener("click", () => {
    if (currentSaleItems.length > 0) {
        clearSale();
        renderItemList();
        showMessage("🗑️ Venda cancelada e carrinho limpo.");
    } else {
        showMessage("O carrinho já está vazio.");
    }
});

// Evento: Salvar Configurações (Ajustes)
document.getElementById("save-config-btn").addEventListener("click", () => {
    businessConfig.name = document.getElementById("cfg-name").value.trim();
    businessConfig.key = document.getElementById("cfg-key").value.trim();
    businessConfig.city = document.getElementById("cfg-city").value.trim();
    
    saveData();
    showMessage("⚙️ Configurações salvas no armazenamento local.");
});
*/