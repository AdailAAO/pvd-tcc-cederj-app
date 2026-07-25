//-----------------Manipulação de Tela------------------//
// Manipulação de Tela (Visual e Modais)
function switchTab(tabId) {
    const tabs = ["pdv", "gerente", "historico", "config"];
    
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.remove("text-blue-600", "border-blue-600", "font-bold");
        document.getElementById(`section-${t}`).classList.add("hidden");
    });
    
    document.getElementById(`tab-${tabId}`).classList.add("text-blue-600", "border-blue-600", "font-bold");
    document.getElementById(`section-${tabId}`).classList.remove("hidden");

    if (tabId === "gerente") renderProductsTable();
    if (tabId === "historico") renderSalesHistory();
    if (tabId === "config") {
        document.getElementById("cfg-name").value = businessConfig.name || "";
        document.getElementById("cfg-key").value = businessConfig.key || "";
        document.getElementById("cfg-city").value = businessConfig.city || "";
    }
}

function renderItemList() {
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";
    currentSaleItems.forEach((item) => {
        itemList.innerHTML += `
            <div class="flex justify-between items-center bg-white p-3 rounded shadow-sm border mb-2">
                <div>
                    <p class="font-bold text-sm text-gray-800">${item.name}</p>
                    <p class="text-xs text-gray-500">R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="font-bold text-blue-600">R$ ${(item.price * item.quantity).toFixed(2)}</div>
            </div>`;
    });
    document.getElementById("total-price").textContent = `R$ ${calculateTotal().toFixed(2)}`;
}

function renderProductsTable() {
    const tbody = document.querySelector("#products-table tbody");
    tbody.innerHTML = "";
    for (const code in products) {
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="p-2 text-xs font-mono">${code}</td>
                <td class="p-2 text-xs">${products[code].name}</td>
                <td class="p-2 text-xs font-bold text-green-600">R$ ${products[code].price.toFixed(2)}</td>
                <td class="p-2 text-xs text-red-500 cursor-pointer font-bold hover:underline" 
                    onclick="deleteProductFromCatalog('${code}'); renderProductsTable();">Excluir</td>
            </tr>`;
    }
}

function renderSalesHistory() {
    const tbody = document.getElementById("history-table-body");
    tbody.innerHTML = "";
    
    [...salesHistory].reverse().forEach((sale, index) => {
        const realIndex = salesHistory.length - 1 - index;
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="p-2 text-xs text-gray-600">${realIndex + 1}</td>
                <td class="p-2 text-[10px] text-gray-500">${sale.date}</td>
                <td class="p-2 text-xs font-bold text-blue-600">R$ ${sale.total.toFixed(2)}</td>
                <td class="p-2 text-xs text-blue-500 font-bold">Registro TCC</td>
            </tr>`;
    });
}

function showMessage(msg) {
    document.getElementById("message-text").textContent = msg;
    document.getElementById("message-box").classList.remove("hidden");
    document.getElementById("message-box").classList.add("flex");
}

document.getElementById("message-ok-btn").addEventListener("click", () => {
    document.getElementById("message-box").classList.add("hidden");
    document.getElementById("message-box").classList.remove("flex");
});

// FUNÇÕES DE EXIBIÇÃO DE MODAIS (MOCK ACADÊMICO)

function generateAndShowInvoice(sale) {
    let invoiceText = `------------ NOTA FISCAL ------------\n`;
    invoiceText += `LOJA: ${businessConfig.name || "Comércio Acadêmico"}\n`;
    invoiceText += `DATA: ${sale.date}\n`;
    invoiceText += `PAGTO: ${sale.paymentMethod}\n`;
    invoiceText += `-------------------------------------\n`;
    invoiceText += `PRODUTOS:\n`;
    
    sale.items.forEach((item) => {
        invoiceText += `${item.name.padEnd(20)} x${item.quantity}\n`;
        invoiceText += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    invoiceText += `-------------------------------------\n`;
    invoiceText += `TOTAL GERAL: R$ ${sale.total.toFixed(2)}\n`;

    if (sale.paymentMethod === "Dinheiro" && sale.amountPaid) {
        invoiceText += `RECEBIDO: R$ ${sale.amountPaid.toFixed(2)}\n`;
        invoiceText += `TROCO: R$ ${sale.change.toFixed(2)}\n`;
    }

    invoiceText += `-------------------------------------\n`;
    invoiceText += `Obrigado pela preferência!\n`;

    document.getElementById("invoice-content").textContent = invoiceText;
    
    const invoiceModal = document.getElementById("invoice-modal");
    invoiceModal.classList.remove("hidden");
    invoiceModal.classList.add("flex");
}

// Fechar modal da Nota Fiscal
document.getElementById("close-invoice-modal-btn").addEventListener("click", () => {
    document.getElementById("invoice-modal").classList.add("hidden");
    document.getElementById("invoice-modal").classList.remove("flex");
});

// Bloquear envio via WhatsApp na apresentação
document.getElementById("send-whatsapp-btn").addEventListener("click", () => {
    showMessage("Função de envio via WhatsApp desativada no ambiente acadêmico para proteção de dados.");
});

function checkoutPIX(total) {
    // 1. Atualiza valor na tela
    document.getElementById("pix-amount").innerText = `R$ ${total.toFixed(2)}`;
    
    // 2. Limpa o QR Code antigo
    const qrcodeContainer = document.getElementById("qrcode-container");
    qrcodeContainer.innerHTML = "";

    // 3. Gera um QR Code com texto falso/seguro (NÃO é a sua payload real)
    new QRCode(qrcodeContainer, {
        text: "TCC_SIMULACAO_PIX_TEXTO_GENERICO_SEM_VALOR_REAL",
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: 0
    });

    // 4. Mostra o modal (Exatamente igual ao seu print)
    const pixModal = document.getElementById("pix-modal");
    pixModal.classList.remove("hidden");
    pixModal.classList.add("flex");
}

// Fechar modal PIX
document.getElementById("close-pix-modal-btn").addEventListener("click", () => {
    document.getElementById("pix-modal").classList.add("hidden");
    document.getElementById("pix-modal").classList.remove("flex");
});

/*

// Manipulação de Tela (Visual)
function switchTab(tabId) {
    const tabs = ["pdv", "gerente", "historico", "config"];
    
    // Esconde todas as abas
    tabs.forEach(t => {
        document.getElementById(`tab-${t}`).classList.remove("text-blue-600", "border-blue-600", "font-bold");
        document.getElementById(`section-${t}`).classList.add("hidden");
    });
    
    // Mostra a aba selecionada
    document.getElementById(`tab-${tabId}`).classList.add("text-blue-600", "border-blue-600", "font-bold");
    document.getElementById(`section-${tabId}`).classList.remove("hidden");

    // Ações específicas ao abrir abas
    if (tabId === "gerente") renderProductsTable();
    if (tabId === "historico") renderSalesHistory();
    if (tabId === "config") {
        document.getElementById("cfg-name").value = businessConfig.name || "";
        document.getElementById("cfg-key").value = businessConfig.key || "";
        document.getElementById("cfg-city").value = businessConfig.city || "";
    }
}

function renderItemList() {
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";
    currentSaleItems.forEach((item) => {
        itemList.innerHTML += `
            <div class="flex justify-between items-center bg-white p-3 rounded shadow-sm border mb-2">
                <div>
                    <p class="font-bold text-sm text-gray-800">${item.name}</p>
                    <p class="text-xs text-gray-500">R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="font-bold text-blue-600">R$ ${(item.price * item.quantity).toFixed(2)}</div>
            </div>`;
    });
    document.getElementById("total-price").textContent = `R$ ${calculateTotal().toFixed(2)}`;
}

function renderProductsTable() {
    const tbody = document.querySelector("#products-table tbody");
    tbody.innerHTML = "";
    for (const code in products) {
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="p-2 text-xs font-mono">${code}</td>
                <td class="p-2 text-xs">${products[code].name}</td>
                <td class="p-2 text-xs font-bold text-green-600">R$ ${products[code].price.toFixed(2)}</td>
                <td class="p-2 text-xs text-red-500 cursor-pointer font-bold hover:underline" 
                    onclick="deleteProductFromCatalog('${code}'); renderProductsTable();">Excluir</td>
            </tr>`;
    }
}

function renderSalesHistory() {
    const tbody = document.getElementById("history-table-body");
    tbody.innerHTML = "";
    
    // Exibe do mais recente pro mais antigo
    [...salesHistory].reverse().forEach((sale, index) => {
        const realIndex = salesHistory.length - 1 - index;
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="p-2 text-xs text-gray-600">${realIndex + 1}</td>
                <td class="p-2 text-[10px] text-gray-500">${sale.date}</td>
                <td class="p-2 text-xs font-bold text-blue-600">R$ ${sale.total.toFixed(2)}</td>
                <td class="p-2 text-xs text-blue-500 font-bold">Registro TCC</td>
            </tr>`;
    });
}

function showMessage(msg) {
    document.getElementById("message-text").textContent = msg;
    document.getElementById("message-box").classList.remove("hidden");
    document.getElementById("message-box").classList.add("flex");
}

// Fechar modal de mensagem
document.getElementById("message-ok-btn").addEventListener("click", () => {
    document.getElementById("message-box").classList.add("hidden");
    document.getElementById("message-box").classList.remove("flex");
});
*/