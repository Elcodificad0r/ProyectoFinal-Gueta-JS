
const dataCaller = async () => {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
        const productArray = await response.json();
        return productArray;
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
};


let products = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let currentIndex = 0;


const updateProduct = () => {
    const middleSection = document.getElementById("middleSection");

    if (products.length > 0) {
        const currentProduct = products[currentIndex];

        
        middleSection.innerHTML = `
            <div class="product-info">
                <span id="productPrice">$${currentProduct.price}</span>
                <h2 id="productName">${currentProduct.name}</h2>
            </div>
        `;
        middleSection.style.backgroundImage = `url('${currentProduct.img}')`;
        middleSection.style.backgroundSize = "cover";
        middleSection.style.backgroundPosition = "center";

        
        currentIndex = (currentIndex + 1) % products.length;
    }
};


const agregarAlCarrito = () => {
    if (products.length > 0) {
        
        const currentProduct = products[(currentIndex - 1 + products.length) % products.length];
        const productoExistente = carrito.find(item => item.name === currentProduct.name);

        if (productoExistente) {
           
            productoExistente.quantity += 1;
        } else {
           
            carrito.push({
                name: currentProduct.name,
                price: currentProduct.price,
                quantity: 1,
                img: currentProduct.img
            });
        }

       
        Swal.fire({
            icon: "success",
            position: "bottom-end",
            title: "Producto añadido al carrito",
            showConfirmButton: false,
            timer: 800,
            backdrop: false
        });

       
        actualizadorCarrito();
    }
};


const actualizadorCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};


const inicializarBotonCarrito = () => {
    const bottomSectionButton = document.querySelector(".bottomSection img");
    if (bottomSectionButton) {
        bottomSectionButton.addEventListener("click", agregarAlCarrito);
    }
};


const injectCountryInput = () => {
    const topSection = document.querySelector(".topSection");

    topSection.innerHTML = `
        <div class="country-input-wrapper">
            <input type="text" id="countryInput" placeholder="Ingresa tu país" />
            <span id="countryIcon" style="display: none;">✅</span>
        </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
        .country-input-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #countryInput {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 200px;
        }
        #countryIcon {
            font-size: 18px;
            color: green;
        }
    `;
    document.head.appendChild(style);

    const countryInput = document.getElementById("countryInput");
    countryInput.addEventListener("change", async (event) => {
        const countryName = event.target.value.trim();
        if (countryName) {
            try {
                const API_URL = "https://restcountries.com/v3.1/name/";
                const response = await fetch(`${API_URL}${countryName}`);
                if (!response.ok) throw new Error("No se pudo obtener la bandera del país.");
                const [countryData] = await response.json();
                const countryFlag = countryData.flags.png;

                Swal.fire({
                    title: `Envíos disponibles a ${countryData.name.common}`,
                    text: "¡Hacemos envíos a tu país!",
                    imageUrl: countryFlag,
                    imageWidth: 100,
                    imageHeight: 60,
                    imageAlt: `Bandera de ${countryData.name.common}`,
                    confirmButtonText: "¡Genial!"
                });

                const countryIcon = document.getElementById("countryIcon");
                countryIcon.style.display = "inline";
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "País no encontrado",
                    text: "No hacemos envíos a este país o el nombre es incorrecto.",
                    confirmButtonText: "Intentar de nuevo"
                });

                const countryIcon = document.getElementById("countryIcon");
                countryIcon.style.display = "none";
            }
        }
    });
};


dataCaller().then((productArray) => {
    if (productArray) {
        products = productArray;
        setInterval(updateProduct, 3000);
        updateProduct();
        inicializarBotonCarrito();
    }
});

injectCountryInput();
