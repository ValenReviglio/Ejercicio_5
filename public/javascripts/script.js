var request = new XMLHttpRequest();
request.open('GET', 'https://api.mercadolibre.com/sites', true);
request.onload = function () {

    // Begin accessing JSON data here
    var sites = JSON.parse(this.response);
    console.log(sites)
    if (request.status >= 200 && request.status < 400) {
        sites.forEach(function(s) {
            console.log(s);
            var sitesOption = document.getElementById('sitesOption');
            var option = document.createElement("option");
            option.value = s.id;
            option.text = s.name;
            sitesOption.appendChild(option);
        })
    }
}
request.send()

function onChange() {
    var select = document.getElementById("sitesOption");
    var selectedSite = select.options[select.selectedIndex].value;
    var catRequest = new XMLHttpRequest();
    console.log(selectedSite)
    catRequest.open('GET', 'https://api.mercadolibre.com/sites/'+selectedSite+'/categories', true);
    catRequest.onload = function () {

        // Begin accessing JSON data here
        var categories = JSON.parse(this.response);
        if (catRequest.status >= 200 && catRequest.status < 400) {
            categories.forEach(function(c) {
                var categoriesOption= document.getElementById('categoriesOption');
                categoriesOption.removeAttribute('disabled');
                var option = document.createElement("option");
                option.value = c.id;
                option.text = c.name;
                categoriesOption.appendChild(option);
            })
        }
    }
    catRequest.send()
}

function changePage() {
    console.log("HJOla")
    var sitesOption = document.getElementById("sitesOption");
    var selectedSite = sitesOption.options[sitesOption.selectedIndex].value;
    var categoriesOption = document.getElementById('categoriesOption');
    var selectedSite = categoriesOption.options[categoriesOption.selectedIndex].value;
    var rowsOption = document.getElementById("sitesOption");
    var rows = sitesOption.options[sitesOption.selectedIndex].value;
    var columnsOption = document.getElementById('categoriesOption');
    var columns = categoriesOption.options[categoriesOption.selectedIndex].value;
    document.location.href = "/trends/";
}