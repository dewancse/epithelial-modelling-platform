/**
 * Created by Dewan Sarwar on 18/12/2017.
 *
 * Automated test cases by Selenium
 */

var webdriver = require('selenium-webdriver');
var $ = require('jquery');

var driver_chr = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

searchTest(driver_chr);

function searchTest(driver) {
    driver.get('http://localhost:63342/epithelial-modelling-platform/src/index.html');

    driver.sleep(3000).then(function () {

        driver.getTitle().then(function (title) {
            console.log("title: ", title);
            if (title === 'Epithelial Modelling Platform') {
                console.log('Test passed');
            } else {
                console.log('Test failed');
            }
        })

    })

    driver.quit();
}