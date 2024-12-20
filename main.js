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

let filteredProducts = []; // Para almacenar los productos filtrados
let currentFilterType = "Todos"; // Valor del filtro por tipo
let currentSort = "Todos"; // Valor del filtro por precio

function botonesComprar() {
    const botones = document.getElementsByClassName("botonCompra");
    const arrayBotones = Array.from(botones);

    function manejarInteraccion(evento) {
        evento.preventDefault();
        evento.stopPropagation();

        let name = evento.target.parentElement.children[1].innerText;
        let price = Number(evento.target.parentElement.children[3].children[0].innerText);
        let imgSrc = evento.target.parentElement.children[0].src; // Captura la imagen
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
                img: imgSrc, 
            });
        }

        Swal.fire({
            icon: "success",
            position: "bottom-end",
            title: "Se agregó el producto",
            showConfirmButton: false,
            timer: 800,
            backdrop: false
        });

        actualizadorCarrito();
    }

    arrayBotones.forEach(element => {
        element.addEventListener("click", manejarInteraccion);
        element.addEventListener("touchstart", manejarInteraccion, { passive: false });
    });
}

function actualizadorCarrito() {
    carritoProducts.innerHTML = "";
    carrito.forEach((element, index) => {
        carritoProducts.innerHTML += `
        <div class="productosCarrito">
            <h3>${element.name} <button class="botonEliminar" data-index="${index}">X</button></h3> 
            <img src="${element.img}" alt="${element.name}" class="imagenCarrito"> 
            <p>Precio: $${element.price}</p>
            <p>Cantidad: 
                <button class="decrementarCantidad" data-index="${index}">-</button>
                ${element.quantity}
                <button class="incrementarCantidad" data-index="${index}">+</button>
            </p>
        </div>
        `;
    });

    total.innerText = "TOTAL: $" + carrito.reduce((acc, element) => acc + element.price * element.quantity, 0);
    cartIcon.children[0].innerText = carrito.reduce((acc, element) => acc + element.quantity, 0);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    agregarEventListenersCarrito();
}

function agregarEventListenersCarrito() {
    const incrementarBotones = document.getElementsByClassName("incrementarCantidad");
    Array.from(incrementarBotones).forEach(button => {
        button.addEventListener("click", (evento) => {
            const index = evento.target.dataset.index;
            carrito[index].quantity += 1;
            actualizadorCarrito();
        });
    });

    const decrementarBotones = document.getElementsByClassName("decrementarCantidad");
    Array.from(decrementarBotones).forEach(button => {
        button.addEventListener("click", (evento) => {
            const index = evento.target.dataset.index;
            if (carrito[index].quantity > 1) {
                carrito[index].quantity -= 1;
            } else {
                carrito.splice(index, 1);
            }
            actualizadorCarrito();
        });
    });

    const botonesEliminar = document.getElementsByClassName("botonEliminar");
    Array.from(botonesEliminar).forEach(button => {
        button.addEventListener("click", (evento) => {
            const index = evento.target.dataset.index;
            carrito.splice(index, 1);
            actualizadorCarrito();
        });
    });
}

botonLimpiador.addEventListener("click", () => {
    Swal.fire({
        title: "Seguro que quieres vaciar tu carrito?",
        text: "No podras revertir tu acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Borrado!",
            text: "Tu carrito ha sido borrado.",
            icon: "success"
          });
        carrito = [];
        localStorage.clear();
        actualizadorCarrito();
        }
      });
});

botonComprador.addEventListener("click", () => {
    if (carrito.length > 0) {
        Swal.fire({
            title: "Información de Envío",
            html: `
                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" class="swal2-input" placeholder="correo@example.com">
                <label for="username">Usuario:</label>
                <input type="text" id="username" class="swal2-input" placeholder="Nombre de usuario">
                <label for="address">Dirección:</label>
                <input type="text" id="address" class="swal2-input" placeholder="Dirección de envío">
            `,
            width: '400px', 
            focusConfirm: false,
            preConfirm: () => {
                const email = document.getElementById("email").value;
                const username = document.getElementById("username").value;
                const address = document.getElementById("address").value;
        
                if (!email || !username || !address) {
                    Swal.showValidationMessage("Por favor, completa todos los campos");
                    return false;
                }
                return { email, username, address };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { email, username, address } = result.value;
                Swal.fire({
                    icon: "success",
                    title: "Información Guardada",
                    html: `
                        <p><strong>Correo:</strong> ${email}</p>
                        <p><strong>Usuario:</strong> ${username}</p>
                        <p><strong>Dirección:</strong> ${address}</p>
                    `,
                    confirmButtonText: "Aceptar"
                });
            }
        });
        
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
    filteredProducts = dataArray; // Inicializa los productos filtrados con todos los productos

    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filterContainer");
    filterContainer.innerHTML = `
        <button id="filterType">Tipo: Todos</button>
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
                <p>$ <span class="priceSpan">${element.price}</span></p>
                <input type="number" id="quantity" name="quantity" min="1" max="10" value="1"> 
                <button class="botonCompra">Agregar</button>
            </div> 
            `;
        });
        botonesComprar();
    };

   // Filtro por tipo
document.getElementById("filterType").addEventListener("click", () => {
    // Obtener los tipos únicos de productos, incluyendo "Todos" como opción inicial
    const types = ["Todos", ...new Set(dataArray.map(product => product.type))];

    // Encontrar el siguiente tipo en la lista que no sea el actual
    const currentIndex = types.indexOf(currentFilterType);
    const nextType = types[(currentIndex + 1) % types.length];  // Esto recorre cíclicamente los tipos

    currentFilterType = nextType;  // Actualizar el filtro actual
    document.getElementById("filterType").innerText = `Tipo: ${currentFilterType}`;

    // Filtrar los productos según el tipo seleccionado
    if (currentFilterType === "Todos") {
        filteredProducts = dataArray;  // Mostrar todos los productos
    } else {
        filteredProducts = dataArray.filter(product => product.type === currentFilterType);
    }

    // Renderizar los productos filtrados
    renderProducts(filteredProducts);
});
    // Ordenar por precio
document.getElementById("sortPrice").addEventListener("click", () => {
    // Definir los estados de ordenación
    const sortOptions = ["Todos", "Costoso > Barato", "Barato > Costoso"];

    // Encontrar el siguiente estado de ordenación en la lista
    const currentIndex = sortOptions.indexOf(currentSort);
    currentSort = sortOptions[(currentIndex + 1) % sortOptions.length];  // Alterna entre los tres estados

    // Actualizar el texto del botón según el estado
    document.getElementById("sortPrice").innerText = `Ordenar: ${currentSort}`;

    if (currentSort === "Todos") {
        filteredProducts = dataArray;  // Mostrar los productos sin ordenar
    } else if (currentSort === "Barato > Costoso") {
        filteredProducts.sort((a, b) => a.price - b.price);  // Ordenar de barato a costoso
    } else if (currentSort === "Costoso > Barato") {
        filteredProducts.sort((a, b) => b.price - a.price);  // Ordenar de costoso a barato
    }

    renderProducts(filteredProducts);  // Renderizar los productos ordenados
});


    renderProducts(filteredProducts); // Renderiza los productos iniciales
    actualizadorCarrito();
});
