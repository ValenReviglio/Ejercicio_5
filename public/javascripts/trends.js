var urlParams = new URLSearchParams(window.location.search);
var site = urlParams.get('site');
var category = urlParams.get('category');
var rows = urlParams.get('rows');
var columns = urlParams.get('columns');
var type = urlParams.get('type');
var trends = [];
var url = 'https://api.mercadolibre.com/trends/' + site;

if (category != null) {
    url = url + '/' + category
}

var request = new XMLHttpRequest();
request.open('GET', url, true);
request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        console.log(data);
        if (data != null) {
            data.forEach(function (d) {
                var keyword = d.keyword
                if (type == 'Nombre') {
                    trends.push(keyword.charAt(0).toUpperCase() + keyword.slice(1))
                } else {
                }
            })

            var container = document.body;

            // slide options
            var slideEase = function (t) {
                    return t * t * t;
                },
                slideDuration = 1000;

            // text options
            var delay = {
                before: 300,
                between: 200,
                after: 2500
            };

// trends snapshot (can't think of a JS only way to load these dynamically)

            function randomTrend() {
                return trends[Math.floor(trends.length * Math.random())];
            }

// colors
            var colors = ['#EA4335', '#34A852', '#4285F4', '#FABB05'];


            function randomColor() {
                return colors[Math.floor(colors.length * Math.random())];
            }

            var Cell = function (x, y) {
                // create the node
                var node = document.createElement('div');
                var width = 100 / columns;
                var height = 100 / rows;
                node.className = 'cell';

                node.style.left = x * width + '%';
                node.style.top = y * height + '%';
                node.style.width = width + '%';
                node.style.height = height + '%';
                this.node = node;

                // create and add the panes
                var panes = [new Pane(this), new Pane(this)];
                node.appendChild(panes[0].node);
                node.appendChild(panes[1].node);
                panes[0].setOtherNode(panes[1].node);
                panes[1].setOtherNode(panes[0].node);

                // handles sliding in next pane
                var currentPane = 0;
                this.nextPane = function () {
                    // swap z-indexes
                    panes[currentPane].node.style.zIndex = '-1';
                    currentPane = ++currentPane % 2;
                    panes[currentPane].node.style.zIndex = '1';

                    panes[currentPane].init();
                }

                // quickstart
                panes[0].quickStart();
                panes[0].node.style.zIndex = '1';
            }

            var Pane = function (cell) {
                var otherNode;
                this.setOtherNode = function (other) {
                    otherNode = other;
                }

                // create the node
                var node = document.createElement('div');
                node.className = 'pane';
                this.node = node;

                // a place to write the trends
                var trend = document.createElement('a');
                trend.className = 'trend';
                node.appendChild(trend);

                // (re-)initialize pane when sliding in
                this.init = function () {
                    var dir = Math.floor(4 * Math.random());
                    switch (dir) {
                        case 0:
                            slideStart = {left: 0, top: -100};
                            break;
                        case 1:
                            slideStart = {left: 100, top: 0};
                            break;
                        case 2:
                            slideStart = {left: 0, top: 100};
                            break;
                        case 3:
                            slideStart = {left: -100, top: 0};
                            break;
                    }
                    // make sure it's a different background color
                    do
                        node.style.backgroundColor = randomColor();
                    while (node.style.backgroundColor == otherNode.style.backgroundColor);

                    trend.title = randomTrend();
                    trend.innerHTML = '';

                    // start sliding in
                    slideValue = 0;
                    slideIn();
                }

                // handles sliding in
                var slideStart,
                    slideValue;
                var slideIn = function () {
                    slideValue += 20 / slideDuration;
                    if (slideValue >= 1) {
                        // end of sliding in
                        slideValue = 1;
                        setTimeout(nextChar, delay.before);
                    } else {
                        setTimeout(slideIn, 20);
                    }
                    node.style.left = slideEase(1 - slideValue) * slideStart.left + '%';
                    node.style.top = slideEase(1 - slideValue) * slideStart.top + '%';
                    // push other node away
                    otherNode.style.left =
                        (slideEase(1 - slideValue) - 1) * slideStart.left + '%';
                    otherNode.style.top =
                        (slideEase(1 - slideValue) - 1) * slideStart.top + '%';
                }

                // handles text
                var nextChar = function () {
                    if (trend.innerHTML.length < trend.title.length) {
                        trend.innerHTML =
                            trend.title.slice(0, trend.innerHTML.length + 1);
                        setTimeout(nextChar, delay.between);
                    } else {
                        setTimeout(cell.nextPane, delay.after);
                    }
                }

                // initial start
                this.quickStart = function () {
                    node.style.backgroundColor = colors[3];
                    trend.title = randomTrend();
                    nextChar();
                }
            }

// create the cells
            var cells = [];
            console.log(rows);
            console.log(columns)
            for (var i = 0; i < (columns * rows); i++) {
                cells[i] = new Cell(i % columns, Math.floor(i / columns));
                container.appendChild(cells[i].node);
            }

// handles font size on resize
// quick and dirty, needs a fix
            function calcFontsize() {
                var fontSize = Math.min(
                    container.clientHeight / 18,
                    container.clientWidth / 46
                );
                fontSize = Math.floor(fontSize);
                container.style.fontSize = fontSize + 'px';
            }

            calcFontsize();
            window.onresize = calcFontsize;
        } else {
            var container = document.body;
            var alert = document.createElement("div");
            alert.setAttribute('class', 'alert alert-secondary alerta');
            alert.setAttribute('id', 'alerta');
            alert.innerText = 'No se encontraron resultados';
            container.appendChild(alert);
        }
    }
}
request.send();


