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

function displayPrice(collection, name, htmlElement, callback) {
    GM_xmlhttpRequest({
        withCredentials: true,
        method: "GET",
        url: "https://www.cardmarket.com/en/Magic/Products/Singles/" + collection + "/" + name + "?language=1&minCondition=3",
        onload: function (response) {
            try {
                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                const priceArray = doc.getElementById("table").getElementsByClassName("table-body")[0];
                const pricesToCheck = priceArray.children.length < 5 ? priceArray.children.length : 5;
                const lowestPrice = priceArray.children[0].getElementsByClassName("color-primary small text-end text-nowrap fw-bold")[1].innerHTML;
                const highestPrice = priceArray.children[pricesToCheck].getElementsByClassName("color-primary small text-end text-nowrap fw-bold")[1].innerHTML;
                const constCardNameElement = htmlElement.getElementsByClassName("name text-start d-none d-md-table-cell")[0].children[0];
                constCardNameElement.innerHTML = constCardNameElement.innerHTML.replace(/<br>\(\s\d+(?:,\d+)?\s€\s-\s\d+(?:,\d+)?\s€\s\)/g, '');
                constCardNameElement.innerHTML += "<br>( " + lowestPrice + " - " + highestPrice + " )";
                callback(true);
            } catch (e) {
                callback(false);
            }
        }
    });
}

function getPrices() {
    const shipments = document.getElementById("shipments-col").getElementsByClassName("table table-sm article-table mb-1 table-striped product-table");
    for (let indexShiplents = 0; indexShiplents < shipments.length; indexShiplents++) {
        let rows = shipments[indexShiplents].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (let indexRows = 0; indexRows < rows.length; indexRows++) {
            const collection = rows[indexRows].getAttribute("data-expansion-name").replace(/\s+/g, '-').replace(/:/g, '');
            const cardName = rows[indexRows].getAttribute("data-name").replace(/\s+/g, '-').replace(/,+/g, '').replace(/\.+/g, '').replace(/\(|\)/g, '').replace(/\/\//g, '').replace(/--/g, '-');
            console.log(cardName)
            displayPrice(collection, cardName.replace(/'+/g, ''), rows[indexRows], function (wasExecSuccessful) {
                if (!wasExecSuccessful) {
                    displayPrice(collection, cardName.replace(/'+/g, '-'), rows[indexRows], function (_unusedVar) { });
                }
            });
        }
    }
}

(function () {
    'use strict';
    let button = document.createElement("button");
    button.innerHTML = "Get Prices";
    button.classList += "btn btn-primary btn-sm btn-outline-primary";
    button.addEventListener("click", getPrices, false)
    document.getElementsByClassName("card-body d-flex flex-column")[1].insertBefore(button, document.getElementsByClassName("card-body d-flex flex-column")[1].children[2]);
})();

