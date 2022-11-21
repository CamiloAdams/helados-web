var jwt = localStorage.getItem("jwt");
if (jwt == null) {
    window.location.href = "./login.html";
}
let logoutIcon = document.querySelector("#logout-icon");
let shopIcon = document.querySelector("#cart-icon");
logoutIcon.onclick = () => {
    logout();
};
shopIcon.onclick = () => {
    shop();
};

function loadUser() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://cnshelados.tech:3001/api/user");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("x-access-token", jwt);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);

            const user = document.getElementById("username");
            const email = document.getElementById("email");

            user.textContent = "Username: " + objects["username"];
            email.textContent = "Correo: " + objects["email"];
        }
    };
}

function loadAdminGraphs() {}

loadUser();

function logout() {
    localStorage.removeItem("jwt");
    window.location.href = "../../index.html";
}

function shop() {
    window.location.href = "../shop/index.html";
}
