/**
 * Created by Dewan Sarwar on 18/12/2017.
 *
 * Automated test cases by Selenium
 */
"use strict";

var webdriver = require('selenium-webdriver');

var browser = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

searchTest(browser);

function searchTest(browser) {
    browser.get('http://localhost:63342/epithelial-modelling-platform/src/index.html');
    browser.sleep(3000).then(function () {
        browser.getTitle().then(function (title) {
            console.log("title: ", title);
            if (title === 'Epithelial Modelling Platform') {
                console.log('Test passed');
            } else {
                console.log('Test failed');
            }
        })
    })

    browser.findElement(webdriver.By.tagName('#listDiscovery')).click();
    browser.sleep(3000).then(function () {

        browser.findElement(webdriver.By.css('li#listDiscovery > a')).then(function (link) {
            console.log("link: ", link);
        })

        // console.log("$(#listDiscovery): ", document.getElementById("#listDiscovery"));
        // console.log("$(#listDiscovery): ", $("#listDiscovery").prop("baseURI"));
    })

    browser.findElement(webdriver.By.tagName('#listModels')).click();
    browser.sleep(3000).then(function () {

        console.log("listModels!");

    })

    browser.findElement(webdriver.By.tagName('#documentation')).click();
    browser.sleep(3000).then(function () {

        console.log("documentation!");

    })

    browser.findElement(webdriver.By.tagName('#home')).click();
    browser.sleep(3000).then(function () {

        console.log("home!");

    })

    browser.quit();
}