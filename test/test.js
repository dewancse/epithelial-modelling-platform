/**
 * Created by Dewan Sarwar on 18/12/2017.
 * Automated test cases by Selenium
 */
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    // until = webdriver.until,
    browser = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

var baseUrl = 'http://localhost:63342/epithelial-modelling-platform/src/index.html';

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