/**
 * Created by dsar941 on 6/20/2017.
 *
 * TODO: How to write test case
 * https://code.tutsplus.com/tutorials/testing-javascript-with-phantomjs--net-28243
 * http://mochajs.org/#getting-started
 * git commit and push; Travis will automate  continuous testing
 */
mocha.ui('bdd');
mocha.reporter('html');
var expect = chai.expect;
var assert = chai.assert;

describe("Modal Tests", function () {
    document.addEventListener('click', function (event) {

        // console.log("event in test_harness.js: ", event);

        // welcome Modal window
        if (($("#myWelcomeModal").data('bs.modal') || {}).isShown != undefined) {

            // $('#myWelcomeModal').hasClass('in')
            console.log("myWelcomeModal: ", ($("#myWelcomeModal").data('bs.modal') || {}).isShown);

            // welcome Modal close window
            if (event.srcElement.id == "closeID") {
                it("welcome Modal close window", function () {
                    console.log("welcome Modal close window: ", ($("#myWelcomeModal").data('bs.modal') || {}).isShown);
                    expect(false).to.equal(($("#myWelcomeModal").data('bs.modal') || {}).isShown);
                });

                // mocha run
                if (window.mochaPhantomJS) {
                    mochaPhantomJS.run();
                }
                else {
                    mocha.run();
                }
            }

            // welcome Modal save window
            if (event.srcElement.id == "saveID") {
                it("welcome Modal save window", function () {
                    console.log("welcome Modal save window: ", ($("#myWelcomeModal").data('bs.modal') || {}).isShown);
                    expect(false).to.equal(($("#myWelcomeModal").data('bs.modal') || {}).isShown);
                });
            }
        }

        // Modal window
        if (($("#myModal").data('bs.modal') || {}).isShown != undefined) {

            console.log("myModal: ", ($("#myModal").data('bs.modal') || {}).isShown);

            // Modal close window
            if (event.srcElement.id == "mcloseID") {
                it("Modal close window", function () {
                    console.log("Modal close window: ", ($("#myModal").data('bs.modal') || {}).isShown);
                    expect(false).to.equal(($("#myModal").data('bs.modal') || {}).isShown);
                });

                // mocha run
                if (window.mochaPhantomJS) {
                    mochaPhantomJS.run();
                }
                else {
                    mocha.run();
                }
            }

            // Modal save window
            if (event.srcElement.id == "msaveID") {
                it("Modal save window", function () {
                    console.log("Modal save window: ", ($("#myModal").data('bs.modal') || {}).isShown);
                    expect(false).to.equal(($("#myModal").data('bs.modal') || {}).isShown);
                });

                // mocha run
                if (window.mochaPhantomJS) {
                    mochaPhantomJS.run();
                }
                else {
                    mocha.run();
                }
            }
        }
    })
})