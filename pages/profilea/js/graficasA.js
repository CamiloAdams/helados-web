google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
    const xhttp = new XMLHttpRequest();
    let objects;
    xhttp.open("GET", "https://cnshelados.tech:3001/api/stats/adminstats");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("x-access-token", jwt);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            objects = JSON.parse(this.responseText);
            const avgSpentMoney = document.getElementById("avg_spent_money");
            const profitTotal = document.getElementById("total_profit");
            avgSpentMoney.textContent =
                "Dinero promedio gastado por usuarios: " +
                objects["avg_spent_money"];

            profitTotal.textContent =
                "Total de ganancias: " + objects["total_profit"];
            drawTotalBoughtProfit(objects["ice_cream_profit"]);
            drawIceCreamSolds(objects["total_bought_ice_creams"]);
        }
    };
}
function drawTotalBoughtProfit(objects) {
    let boughtProfit = [["Nombre", "Ganancia"]];
    let index = 1;

    for (const key in objects) {
        const element = objects[key];
        boughtProfit[index] = [key, objects[key]];
        index++;
    }
    var data = new google.visualization.DataTable();

    boughtProfit.forEach(function (row, indexRow) {
        if (indexRow === 0) {
            row.forEach(function (column, indexCol) {
                if (indexCol === 0) {
                    data.addColumn("string", column);
                } else {
                    data.addColumn("number", column);
                }
            });
        } else {
            data.addRow(row);
        }
    });

    var options = {
        title: "Ganancias por helados",
    };

    var chart = new google.visualization.PieChart(
        document.getElementById("ice-cream-profit")
    );

    chart.draw(data, options);
}
function drawIceCreamSolds(objects) {
    let boughtProfit = [["Nombre", "Cantidad"]];
    let index = 1;

    for (const key in objects) {
        const element = objects[key];
        boughtProfit[index] = [key, objects[key]];
        index++;
    }
    var data = new google.visualization.DataTable();

    boughtProfit.forEach(function (row, indexRow) {
        if (indexRow === 0) {
            row.forEach(function (column, indexCol) {
                if (indexCol === 0) {
                    data.addColumn("string", column);
                } else {
                    data.addColumn("number", column);
                }
            });
        } else {
            data.addRow(row);
        }
    });

    var options = {
        title: "Número de ventas por helados",
    };

    var chart = new google.visualization.PieChart(
        document.getElementById("total_bought_ice_creams")
    );

    chart.draw(data, options);
}
