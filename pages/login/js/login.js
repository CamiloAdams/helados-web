var jwt = localStorage.getItem("jwt");
if (jwt != null) {
    window.location.href = "../shop/index.html";
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://cnshelados.tech:3001/api/auth/login");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({
            email: email,
            password: password,
        })
    );
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            if (this.status == "200") {
                localStorage.setItem("jwt", objects["token"]);
                Swal.fire({
                    text: "Inicio Exitoso",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        const rol = objects["roles"];
                        if (rol.indexOf("user") != -1) {
                            localStorage.setItem("role", "user");
                        } else if (rol.indexOf("admin") != -1) {
                            localStorage.setItem("role", "admin");
                        } else {
                            window.location.href = "./login.html";
                        }
                        window.location.href = "../shop/index.html";
                    }
                });
            } else {
                Swal.fire({
                    text: "Credenciales Erroneas",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };
    return false;
}
