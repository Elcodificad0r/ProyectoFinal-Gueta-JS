const dataCaller = async () => {
    const response = await fetch("./data.json");
    const productArray = await response.json();
    return productArray;
};

let products = [];

const updateProduct = () => {
    const middleSection = document.getElementById("middleSection");
    const productInfo = document.querySelector(".product-info");
    const productName = document.getElementById("productName");
    const productPrice = document.getElementById("productPrice");

    // Verifica si los productos están cargados
    if (products.length > 0) {
        middleSection.style.backgroundImage = `url('${products[currentIndex].image}')`;
        productName.textContent = products[currentIndex].name;
        productPrice.textContent = products[currentIndex].price;

        currentIndex = (currentIndex + 1) % products.length;
    }
};

let currentIndex = 0;

// Llamada a la función para cargar los productos
dataCaller().then((productArray) => {
    products = productArray;  // Asigna el array de productos
    setInterval(updateProduct, 3000);  // Rotar cada 3 segundos
    updateProduct();  // Llamar a la función de inicio
});
