document.getElementById("cartIcon").addEventListener("click",() => {
    document.getElementById("cartMenu").classList.toggle("active")
})

let carrito = JSON.parse(localStorage.getItem("carrito")) || []

const shoesProducts = [
    { 
        id: 1,
        name: "Sportiva Solution", 
        price: 120, 
        type: "Boulder",  
        img: "./media/la sportiva solution.jpg"
    },
    { 
        id: 2,
        name: "Scarpa Instinct", 
        price: 150, 
        type: "Deportivo",  
        img: "./media/scarpa instict.jpg"
    },
    { 
        id: 3,
        name: "Five Ten Anasazi", 
        price: 100, 
        type: "Trad", 
        img: "./media/five ten anasazi2.jpg"
    },
    { 
        id: 4,
        name: "Evolv Shaman", 
        price: 130, 
        type: "Boulder", 
        img: "./media/evolv shaman.jpg"
    }, 
    { 
        id: 5,
        name: "Butora Acro", 
        price: 110, 
        type: "Deportivo", 
        img: "./media/butora acro .webp"
    }
];


const products = document.getElementById("shopItems")
const carritoProducts = document.getElementById("productosCarrito")
const total = document.getElementById("total")
const cartIcon = document.getElementById("cartIcon")
const botonLimpiador = document.getElementById("botonLimpiador")
const botonComprador = document.getElementById("botonComprador")

const ejemplo = `
 <div class="productosCarrito">
                <h3>Título</h3>
                <p>Precio: $</p>
                <p>Cantidad: </p>
                <button class="botonEliminar">X</button>
        
            </div>
        `

function botonesComprar(){
        const botones = document.getElementsByClassName ("botonCompra")
        const arrayBotones = Array.from(botones)
        
        arrayBotones.forEach(element => {
                element.addEventListener("click", (evento)=> {
                    let name = evento.target.parentElement.children[1].innerText;
                    let price = Number(evento.target.parentElement.children[3].children[0].innerText);
                    let quantityInput = evento.target.parentElement.querySelector("#quantity"); 
            let quantity = Number(quantityInput.value) || 1; 


                    let productoABuscar = carrito.find(element => element.name == name)

                    if (productoABuscar) {
                        productoABuscar.quantity += quantity; 
                    } else {
                        carrito.push({
                            name: name,
                            price: price,
                            quantity: quantity 
                        });
                    }

                    actualizadorCarrito()
        })
    }) 
 }

 function eliminarProduct (){
    const botones = document.getElementsByClassName ("botonEliminar")
    const arrayBotones = Array.from(botones)

    

    arrayBotones.forEach(element =>{
        element.addEventListener("click", (evento) =>{
            let name = evento.target.parentElement.children[0].innerText;

            let productoABuscar = carrito.find(element => element.name == name)

            if (productoABuscar.quantity == 1) {
                let index = carrito.findIndex(element => element.name == name)

                carrito.splice(index, 1)

            } else {
                productoABuscar.quantity = productoABuscar.quantity - 1
            }
            actualizadorCarrito()

        })
    })
 }

 function actualizadorCarrito (){
    carritoProducts.innerHTML = ""
    carrito.forEach(element => {
        carritoProducts.innerHTML += `
 <div class="productosCarrito">
                <h3>${element.name}</h3>
                <p>Precio: $ ${element.price}</p>
                <p>Cantidad: ${element.quantity} </p>
                <button class="botonEliminar">X</button>
        
            </div>
        `
    })

    total.innerText = "TOTAL: $" + carrito.reduce ((acc, element) => {
        return acc + element.price * element.quantity
    },0)

    cartIcon.children[0].innerText = carrito.reduce ((acc, element) => {
        return acc + element.quantity
    },0)

    localStorage.setItem("carrito", JSON.stringify(carrito))

    eliminarProduct()

 }


botonLimpiador.addEventListener("click", () => {
 carrito = []
 localStorage.clear()
  actualizadorCarrito()
})

botonComprador.addEventListener("click", () => {
    botonComprador.innerHTML = "Gracias por tu compra!"
     actualizadorCarrito()
     setTimeout(() => {
        botonComprador.innerHTML = "Comprar";
    }, 3000);
});



document.addEventListener("DOMContentLoaded", ( ) => {
    shoesProducts.forEach(element => {
        products.innerHTML += `
                <div class="itemBox">
                    <img src="${element.img}" alt="">
                    <h3>${element.name}</h3>
                    <p>Estilo: ${element.type}</p>
                    <p>$ <span>${element.price}</span></p>
                    <label for="quantity">Cantidad:</label>
                    <input type="number" id="quantity" name="quantity" min="1" max="10"> 
                    <button class="botonCompra">Agregar al carrito</button>
                </div> 
                `
    })
    botonesComprar()

    actualizadorCarrito()
})
