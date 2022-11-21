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
            const name = document.getElementById("nombres");
            const birthday = document.getElementById("fecha_nacimiento");
            const email = document.getElementById("email");
            const saldo = document.getElementById("saldo");

            user.textContent = "Username: " + objects["username"];
            name.textContent =
                "Nombre: " + objects["nombres"] + " " + objects["apellidos"];
            email.textContent = "Correo: " + objects["email"];
            saldo.textContent = "Saldo: " + objects["balance"];
            birthday.textContent =
                "Fecha de nacimiento: " +
                objects["fecha_nacimiento"].split("T")[0];
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
