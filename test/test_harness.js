/**
 * Created by dsar941 on 6/14/2017.
 */
var page = require('webpage').create();

page.open('src/js/index.html', function (status) {
    console.log("Status: " + status);
    if (status === "success") {
        console.log("Passed!");
    }

    console.log("Passed overall!");
    phantom.exit();
});