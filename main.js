
document.getElementById("cart-icon").addEventListener("click", () => {
    document.getElementById("cart-menu").classList.toggle("active");
});

document.getElementById("close-cart").addEventListener("click", () => {
    document.getElementById("cart-menu").classList.remove("active");
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const dataCaller = async () => {
    const response = await fetch("./data.json");
    const productArray = await response.json();
    return productArray;
};

const products = document.getElementById("shopItems");
const carritoProducts = document.getElementById("productosCarrito");
const total = document.getElementById("total");
const cartIcon = document.getElementById("cart-icon");
const botonLimpiador = document.getElementById("botonLimpiador");
const botonComprador = document.getElementById("botonComprador");

function botonesComprar() {
    const botones = document.getElementsByClassName("botonCompra");
    const arrayBotones = Array.from(botones);

    function manejarInteraccion(evento) {
        evento.preventDefault();
        evento.stopPropagation();

        let name = evento.target.parentElement.children[1].innerText;
        let price = Number(evento.target.parentElement.children[3].children[0].innerText);
        let quantityInput = evento.target.parentElement.querySelector("#quantity");
        let quantity = Number(quantityInput.value) || 1;

        let productoABuscar = carrito.find(element => element.name === name);

        if (productoABuscar) {
            productoABuscar.quantity += quantity;
        } else {
            carrito.push({
                name: name,
                price: price,
                quantity: quantity,
            });
        }

        Swal.fire({
            icon: "error",
            position: "bottom-end",
            title: "Se agrego el producto",
            showConfirmButton: false,
            timer: 1111500,
            backdrop: false
          });

        actualizadorCarrito();
    }

    arrayBotones.forEach(element => {
        element.addEventListener("click", manejarInteraccion);
        element.addEventListener("touchstart", manejarInteraccion, { passive: false });
    });
}

function eliminarProduct() {
    const botones = document.getElementsByClassName("botonEliminar");
    const arrayBotones = Array.from(botones);

    arrayBotones.forEach(element => {
        element.addEventListener("click", (evento) => {
            let name = evento.target.parentElement.children[0].innerText;
            let productoABuscar = carrito.find(element => element.name === name);

            if (productoABuscar.quantity === 1) {
                let index = carrito.findIndex(element => element.name === name);
                carrito.splice(index, 1);
            } else {
                productoABuscar.quantity -= 1;
            }
            actualizadorCarrito();
        });
    });
}

function actualizadorCarrito() {
    carritoProducts.innerHTML = "";
    carrito.forEach(element => {
        carritoProducts.innerHTML += `
        <div class="productosCarrito">
            <h3>${element.name}</h3>
            <p>Precio: $ ${element.price}</p>
            <p>Cantidad: ${element.quantity}</p>
            <button class="botonEliminar">X</button>
        </div>
        `;
    });

    total.innerText = "TOTAL: $" + carrito.reduce((acc, element) => acc + element.price * element.quantity, 0);
    cartIcon.children[0].innerText = carrito.reduce((acc, element) => acc + element.quantity, 0);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    eliminarProduct();
}

botonLimpiador.addEventListener("click", () => {
    carrito = [];
    localStorage.clear();
    actualizadorCarrito();
});

botonComprador.addEventListener("click", () => {
    if (carrito.length > 0) {
        botonComprador.innerHTML = "Gracias por tu compra!";
        carrito = [];
        actualizadorCarrito();
        setTimeout(() => {
            botonComprador.innerHTML = "Comprar";
        }, 3000);
    } else {
        botonComprador.innerHTML = "El carrito está vacío";
        setTimeout(() => {
            botonComprador.innerHTML = "Comprar";
        }, 3000);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const dataArray = await dataCaller();

    //para filtrar y ordenar
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filterContainer");
    filterContainer.innerHTML = `
        <button id="filterType">Filtrar: Todos</button>
        <button id="sortPrice">Ordenar: Todos</button>
    `;
    document.getElementById("mainContent").insertBefore(filterContainer, products);

    const renderProducts = (items) => {
        products.innerHTML = "";
        items.forEach(element => {
            products.innerHTML += `
            <div class="itemBox">
                <img src="${element.img}" alt="">
                <h3>${element.name}</h3>
                <p>Estilo: ${element.type}</p>
                <p>$ <span>${element.price}</span></p>
                <label for="quantity">Cantidad:</label>
                <input type="number" id="quantity" name="quantity" min="1" max="10"> 
                <button class="botonCompra">Agregar</button>
            </div> 
            `;
        });
        botonesComprar();
    };

    renderProducts(dataArray);

   
    let typeFilterIndex = 0;
    let priceSortDirection = 0;

    const types = ["Todos", "Boulder", "Trad", "Deportivo"];
    const priceSortLabels = ["Todos", "Barato > Costoso", "Costoso > Barato"];

    // filtro por tipo
    document.getElementById("filterType").addEventListener("click", () => {
        typeFilterIndex = (typeFilterIndex + 1) % types.length;
        const filterType = types[typeFilterIndex];

        const filteredProducts = filterType === "Todos"
            ? dataArray
            : dataArray.filter(product => product.type === filterType);

        document.getElementById("filterType").innerText = `Filtrar: ${filterType}`;
        renderProducts(filteredProducts);
    });

    //por precio
    document.getElementById("sortPrice").addEventListener("click", () => {
        priceSortDirection = (priceSortDirection + 1) % priceSortLabels.length;
        const sortDirection = priceSortLabels[priceSortDirection];

        let sortedProducts;
        if (sortDirection === "Barato -> Caro") {
            sortedProducts = [...dataArray].sort((a, b) => a.price - b.price);
        } else if (sortDirection === "Caro -> Barato") {
            sortedProducts = [...dataArray].sort((a, b) => b.price - a.price);
        } else {
            sortedProducts = dataArray;
        }

        document.getElementById("sortPrice").innerText = `Ordenar: ${sortDirection}`;
        renderProducts(sortedProducts);
    });

    actualizadorCarrito();
});


//js para landing page

