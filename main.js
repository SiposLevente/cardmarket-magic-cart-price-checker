// ==UserScript==
// @name         Cardmarket shopping cart price checker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.cardmarket.com/en/Magic/ShoppingCart
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';
    const shipments = document.getElementById("shipments-col").getElementsByClassName("table table-sm article-table mb-1 table-striped product-table");
    function displayPrice(collection, name, htmlElement) {
        GM_xmlhttpRequest({
            withCredentials: true,
            method: "GET",
            url: "https://www.cardmarket.com/en/Magic/Products/Singles/" + collection + "/" + name + "?language=1&minCondition=3",
            onload: function (response) {
                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                const priceArray = doc.getElementById("table").getElementsByClassName("table-body")[0];
                const pricesToCheck = priceArray.children.length < 5 ? priceArray.children.length : 5;
                const lowestPrice = priceArray.children[0].getElementsByClassName("color-primary small text-end text-nowrap fw-bold")[1].innerHTML;
                const highestPrice = priceArray.children[pricesToCheck].getElementsByClassName("color-primary small text-end text-nowrap fw-bold")[1].innerHTML;
                const originalCardName = htmlElement.getElementsByClassName("name text-start d-none d-md-table-cell")[0].children[0].innerHTML;
                htmlElement.getElementsByClassName("name text-start d-none d-md-table-cell")[0].children[0].innerHTML += "<br>(" + lowestPrice + "-" + highestPrice + ")";
            }
        });
    }

    for (let indexShiplents = 0; indexShiplents < shipments.length; indexShiplents++) {
        let rows = shipments[indexShiplents].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (let indexRows = 0; indexRows < rows.length; indexRows++) {
            const cardName = rows[indexRows].getAttribute("data-name").replace(/\s+/g, '-');
            const collection = rows[indexRows].getAttribute("data-expansion-name").replace(/\s+/g, '-');
            displayPrice(collection, cardName, rows[indexRows]);
        }
    }
})();

