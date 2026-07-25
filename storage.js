//-------------Persistência--------------//
// Gerencia exclusivamente o LocalStorage
let products = JSON.parse(localStorage.getItem("pdv_products")) || {};
let salesHistory = JSON.parse(localStorage.getItem("pdv_sales_history")) || [];
let businessConfig = JSON.parse(localStorage.getItem("pdv_configs")) || {
    name: "Comércio Via Pix", key: "CHAVE_EXEMPLO", city: "Rio de Janeiro"
};

// Se for a primeira vez abrindo o app, cadastra produtos de teste
if (Object.keys(products).length === 0) {
    products = {
        "1": { name: "Capa de Celular", price: 25.00 },
        "2": { name: "Película de Vidro", price: 15.00 }
    };
    saveData();
}

function saveData() {
    localStorage.setItem("pdv_products", JSON.stringify(products));
    localStorage.setItem("pdv_sales_history", JSON.stringify(salesHistory));
    localStorage.setItem("pdv_configs", JSON.stringify(businessConfig));
}