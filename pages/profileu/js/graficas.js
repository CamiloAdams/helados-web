google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
    const xhttp = new XMLHttpRequest();
    let objects;
    xhttp.open("GET", "https://cnshelados.tech:3001/api/stats/userstats");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("x-access-token", jwt);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            objects = JSON.parse(this.responseText);
            // const scoreAvg = document.getElementById("avg_score");

            // scoreAvg.textContent = objects["avg_score"];
            drawBoughtIceCreams(objects["bought_ice_creams"]);
        }
    };
}
function drawBoughtIceCreams(objects) {
    console.log(objects);
    let nameVsquantity = [["Nombre", "Cantidad"]];
    let index = 1;

    for (const key in objects) {
        const element = objects[key];
        nameVsquantity[index] = [key, objects[key]];
        index++;
    }
    var data = new google.visualization.DataTable();

    nameVsquantity.forEach(function (row, indexRow) {
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
        title: "Helados de cada tipo comprados",
    };

    var chart = new google.visualization.PieChart(
        document.getElementById("bought-ice-creams")
    );

    chart.draw(data, options);
}

function drawScoreMeanVsUsersMean(objects) {
    let agesVsHighScore = [["Usuario", "High Score"]];
    let index = 1;
    console.log(objects);

    var data = google.visualization.arrayToDataTable([
        ["Usuario", "Puntaje Promedio"],
        ["Puntaje promedio", objects.avg_score],
        ["Puntaje promedio usuarios", objects.users_avg],
    ]);
    var options = {
        title: "Puntaje promedio vs Puntaje Promedio Usuarios",
    };

    var chart = new google.visualization.ColumnChart(
        document.getElementById("s_vs_usrss")
    );

    chart.draw(data, options);
}
