var jwt = localStorage.getItem("jwt");
if (jwt == null) {
    window.location.href = "./login.html";
}

// Cart
let cartIcon = document.querySelector("#cart-icon");
let logoutIcon = document.querySelector("#logout-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
let userIcon = document.querySelector("#user-icon");

cartIcon.onclick = () => {
    cart.classList.add("active");
};

closeCart.onclick = () => {
    cart.classList.remove("active");
};

logoutIcon.onclick = () => {
    logout();
};
userIcon.onclick = () => {
    profile();
};
//Cart working
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// Making function
function ready() {
    loadProducts();
    //Remove items from cart
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    console.log(removeCartButtons);
    for (let i = 0; i < removeCartButtons.length; i++) {
        const button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    // Quantity Changes
    var quantityInput = document.getElementsByClassName("cart-quantity");
    for (let i = 0; i < removeCartButtons.length; i++) {
        var input = quantityInput[i];
        input.addEventListener("change", quantityChanged);
    }
    //Add to cart
    var addCart = document.getElementsByClassName("add-cart");
    for (let i = 0; i < addCart.length; i++) {
        const button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }

    //buy button work
    document
        .getElementsByClassName("btn-buy")[0]
        .addEventListener("click", buyButtonClicked);
}

function loadProducts() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://cnshelados.tech:3001/api/icecreams");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("x-access-token", jwt);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            objects = JSON.parse(this.responseText);
            console.log(objects);

            var productItems =
                document.getElementsByClassName("shop-content")[0];
            for (let index = 0; index < objects.length; index++) {
                const element = objects[index];
                var productShopBox = document.createElement("div");
                productShopBox.classList.add("product-box");

                var productBoxContent = `
         <img src="${element.imgURL}" alt="" class="product-img">
                <h2 class="product-title" id="${element._id}">${element.name}</h2>
                <span class="price">$${element.price}</span>
                <i class="bx bx-shopping-bag add-cart"></i>

    `;
                productShopBox.innerHTML = productBoxContent;
                productItems.append(productShopBox);
                productShopBox
                    .getElementsByClassName("add-cart")[0]
                    .addEventListener("click", addCartClicked);
            }
        }
    };
}

// Buy button
function buyButtonClicked() {
    var items = new Array();
    var cartContent = document.getElementsByClassName("cart-content")[0];

    // alert("Your Order is Placed");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("detailbox");
    var total = document.getElementsByClassName("total-price")[0].innerText;
    total = total.replace("$", "");

    for (let i = 0; i < cartItemsNames.length; i++) {
        var element = cartItemsNames[i];
        var id = element.getElementsByClassName("cart-product-title")[0].id;
        var quantity = element.getElementsByClassName("cart-quantity")[0].value;
        var item = {
            item: id,
            quantity: quantity,
        };
        items.push(item);
    }

    updateTotal();
    var data = JSON.stringify({
        items: items,
        total: total,
    });
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://cnshelados.tech:3001/api/bills");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("x-access-token", jwt);
    xhttp.send(data);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            if (this.status == "201") {
                alert("compra realizada con exito");
                while (cartContent.hasChildNodes()) {
                    cartContent.removeChild(cartContent.firstChild);
                }
                updateTotal();
            } else {
                alert("su saldo es insuficiente");
            }
        }
    };
}
//Remove items from cart
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
}

// Quantity changes
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

// Add to cart
function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement;
    var title =
        shopProducts.getElementsByClassName("product-title")[0].innerText;
    var id = shopProducts.getElementsByClassName("product-title")[0].id;

    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;

    addProductToCart(title, price, productImg, id);
}

function addProductToCart(title, price, productImg, id) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert("you have already add this item to cart");
            const cart = cartItemsNames[i];
            return;
        }
    }
    var cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detailbox">
            <div class="cart-product-title" id="${id}">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <!-- Remove cart -->
        <i class="bx bxs-trash-alt cart-remove"></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
        .getElementsByClassName("cart-remove")[0]
        .addEventListener("click", removeCartItem);
    cartShopBox
        .getElementsByClassName("cart-quantity")[0]
        .addEventListener("click", quantityChanged);
    updateTotal();
}

//Update total
function updateTotal() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    // if (cartBoxes.length == 0) {
    //     document.getElementsByClassName("total-price")[0].innerText =
    //         "$" + total;
    //     return;
    // }

    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement =
            cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("$", ""));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }
    total = Math.round(total * 100) / 100;

    document.getElementsByClassName("total-price")[0].innerText = "$" + total;
}

// Breakpoints
function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    window.location.href = "../../index.html";
}

function profile() {
    var role = localStorage.getItem("role");
    console.log(role);
    if (role == "admin") window.location.href = "../profilea/profileA.html";
    else window.location.href = "../profileu/profile.html";
}
