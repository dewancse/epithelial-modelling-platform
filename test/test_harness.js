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

var mochaRunFunc = function () {
    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    }
    else {
        mocha.run();
    }
}

describe("Modal Window Tests", function () {

    document.addEventListener('click', function (event) {

        console.log("event.srcElement.id: ", event.srcElement.id);

        if (event.srcElement.id == "closeID") {
            it("closeID", function () {
                console.log("closeID: ", $("#myWelcomeModal").data('bs.modal').isShown);
                expect(false).to.equal($("#myWelcomeModal").data('bs.modal').isShown);
            });

            mochaRunFunc();
        }

        if (event.srcElement.id == "saveID") {
            it("saveID", function () {
                console.log("saveID: ", $("#myModal").data('bs.modal').isShown);
                expect(true).to.equal($("#myModal").data('bs.modal').isShown);
            });

            mochaRunFunc();
        }
    })
})