//-------------------Lógica de Negócios e Venda----------------------//

let currentSaleItems = [];

function addItemToCart(code, quantity) {
    const product = products[code];
    if (!product) return false;

    currentSaleItems.push({
        code: code,
        name: product.name,
        price: product.price,
        quantity: quantity,
    });
    return true;
}

function calculateTotal() {
    return currentSaleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function clearSale() {
    currentSaleItems = [];
}

function saveProductToCatalog(code, name, price) {
    if (!code || !name || isNaN(price)) return false;
    products[code] = { name: name, price: price };
    saveData();
    return true;
}

function deleteProductFromCatalog(code) {
    delete products[code];
    saveData();
}