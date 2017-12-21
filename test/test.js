/**
 * Created by Dewan Sarwar on 18/12/2017.
 * Automated test cases by Selenium
 */
// var sendGetRequest = require("../src/libs/ajax-utils.js").sendGetRequest;
// var sendPostRequest = require("../src/libs/ajax-utils").sendPostRequest;
// TODO: Fix this later!! Window call is not working!!
function getRequestObject() {
    if (window.XMLHttpRequest) {
        return (new XMLHttpRequest());
    }
    else if (window.ActiveXObject) {
        // For very old IE browsers (optional)
        return (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else {
        alert("Ajax is not supported!");
        return (null);
    }
}
var sendPostRequest = function (requestUrl, query, responseHandler, isJsonResponse) {
    var request = getRequestObject();

    request.onreadystatechange = function () {
        handleResponse(request, responseHandler, isJsonResponse);
    };

    request.open("POST", requestUrl, true);

    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.setRequestHeader("Accept", "application/sparql-results+json");

    request.send(query); // for POST only
};
function handleResponse(request, responseHandler, isJsonResponse) {
    if ((request.readyState == 4) && (request.status == 200)) {

        // Default to isJsonResponse = true
        if (isJsonResponse == undefined) {
            isJsonResponse = true;
        }

        if (isJsonResponse) {
            responseHandler(JSON.parse(request.responseText));
        }
        else {
            responseHandler(request.responseText);
        }
    }

    else if (request.readyState == 4) {
        console.log("ERROR!");
        console.error(request.responseText);
    }
}

// var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
var pmrEndpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search",
    cors_api_url = 'http://localhost:8080/',
    endpoint = cors_api_url + pmrEndpoint;

var baseUrl = 'http://localhost:63342/epithelial-modelling-platform/src/index.html';

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    key = webdriver.Key,
    // until = webdriver.until,
    browser = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

searchTest(browser);

function searchTest(browser) {
    browser.get(baseUrl);
    // browser.wait(until.titleIs('Epithelial Modelling Platform'), 1000);

    browser.sleep(1000).then(function () {
        browser.getTitle().then(function (title) {
            console.log("title: ", title);
            if (title === 'Epithelial Modelling Platform') {
                console.log('title: Test passed');
            } else {
                console.log('title: Test failed');
            }
        })
    })

    browser.findElement(By.id('listDiscovery')).click();
    browser.sleep(1000).then(function () {
            console.log("listDiscovery !!!");

            browser.findElement(By.css('li#listDiscovery a')).then(function (link) {
                link.getAttribute('onclick').then(function (onclick) {
                    console.log("listDiscovery onclick: ", onclick);
                })

                link.getAttribute('href').then(function (href) {
                    console.log("listDiscovery href: ", href);
                    if (href === baseUrl + '#listDiscovery') {
                        console.log('listDiscovery: Test passed');
                    } else {
                        console.log('listDiscovery: Test failed');
                    }
                })
            })

            // search 'Flux of Sodium'
            browser.findElement(By.name('searchTxt')).sendKeys('Flux of Sodium');
            // press Enter key
            browser.actions().sendKeys(key.ENTER).perform();
            // TODO: wait until full page loads
            // browser.wait(until.titleIs('Epithelial Modelling Platform'), 2000);

            var query = 'SELECT ?Protein ' +
                'WHERE { <weinstein_1995.cellml#weinstein_1995> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }';

            console.log("query: ", query);
            console.log("endpoint: ", endpoint);
            sendPostRequest(
                endpoint,
                query,
                function (jsonProtein) {
                    console.log("jsonProtein: ", jsonProtein);
                },
                true);

            // console.log("$(#listDiscovery): ", document.getElementById("#listDiscovery"));
            // console.log("$(#listDiscovery): ", $("#listDiscovery").prop("baseURI"));
        }
    )

    browser.findElement(By.id('listModels')).click();
    browser.sleep(1000).then(function () {
        console.log("listModels !!!");

        browser.findElement(By.css('li#listModels a')).then(function (link) {
            link.getAttribute('onclick').then(function (onclick) {
                console.log("listModels onclick: ", onclick);
            })

            link.getAttribute('href').then(function (href) {
                console.log("listModels href: ", href);
                if (href === baseUrl + '#listModels') {
                    console.log('listModels: Test passed');
                } else {
                    console.log('listModels: Test failed');
                }
            })
        })
    })

    browser.findElement(By.id('documentation')).click();
    browser.sleep(1000).then(function () {
        console.log("documentation!!!");

        browser.findElement(By.css('li#documentation a')).then(function (link) {
            link.getAttribute('onclick').then(function (onclick) {
                console.log("onclick: ", onclick);
            })

            link.getAttribute('href').then(function (href) {
                console.log("documentation href: ", href);
                if (href === baseUrl + '#documentation') {
                    console.log('documentation: Test passed');
                } else {
                    console.log('documentation: Test failed');
                }
            })
        })
    })

    browser.findElement(By.id('home')).click();
    browser.sleep(1000).then(function () {
        console.log("home!!!");

        browser.findElement(By.css('div#home a')).then(function (link) {
            link.getAttribute('onclick').then(function (onclick) {
                console.log("home onclick: ", onclick);
            })

            link.getAttribute('href').then(function (href) {
                console.log("home href: ", href);
                if (href === baseUrl + '#home') {
                    console.log('home: Test passed');
                } else {
                    console.log('home: Test failed');
                }
            })
        })
    })

    browser.quit();
}