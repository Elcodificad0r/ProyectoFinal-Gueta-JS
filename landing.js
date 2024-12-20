const dataCaller = async () => {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
        const productArray = await response.json();
        console.log("Productos cargados:", productArray); // Verifica los datos
        return productArray;
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
};

let products = [];
let currentIndex = 0;

const updateProduct = () => {
    const middleSection = document.getElementById("middleSection");

    if (products.length > 0) {
        const currentProduct = products[currentIndex];
        console.log("Producto actual:", currentProduct); // Verifica el producto

        middleSection.innerHTML = `
            <div class="product-info">
                <h2 id="productName">${currentProduct.name}</h2>
                <span id="productPrice">$${currentProduct.price}</span>
            </div>
        `;

        middleSection.style.backgroundImage = `url('${currentProduct.img}')`;
        middleSection.style.backgroundSize = "cover";
        middleSection.style.backgroundPosition = "center";

        currentIndex = (currentIndex + 1) % products.length;
    }
};

dataCaller().then((productArray) => {
    if (productArray) {
        products = productArray;
        setInterval(updateProduct, 3000); // Rotar cada 3 segundos
        updateProduct();
    }
});
