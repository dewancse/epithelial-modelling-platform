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
};

describe("link Tests", function () {
    document.addEventListener('click', function (event) {
        if (event.srcElement.localName == 'a') {
            if (event.srcElement.href == $('li#listDiscovery a')[0].href) {
                it("#listDiscovery", function () {
                    expect($('li#listDiscovery a')[0].href).to.equal(event.srcElement.href);
                });
                mochaRunFunc();
            }
            if (event.srcElement.href == $('li#listModels a')[0].href) {
                it("#listModels", function () {
                    expect($('li#listModels a')[0].href).to.equal(event.srcElement.href);
                });
                mochaRunFunc();
            }
            if (event.srcElement.href == $('li#documentation a')[0].href) {
                it("#documentation", function () {
                    expect($('li#documentation a')[0].href).to.equal(event.srcElement.href);
                });
                mochaRunFunc();
            }
        }
    });
});

describe("recommender window Tests", function () {
    document.addEventListener('click', function (event) {
        if (event.srcElement.id == "saveID") {
            it("#saveID", function () {
                expect(false).to.equal($("#myWelcomeModal").data('bs.modal').isShown);
            });
            mochaRunFunc();
        }
        if (event.srcElement.id == "closeID") {
            it("#closeID", function () {
                expect(false).to.equal($("#myWelcomeModal").data('bs.modal').isShown);
            });
            mochaRunFunc();
        }
        if (event.srcElement.id == "msaveID") {
            it("#msaveID", function () {
                expect(false).to.equal($("#myModal").data('bs.modal').isShown);
            });
            mochaRunFunc();
        }
        if (event.srcElement.id == "mcloseID") {
            it("#mcloseID", function () {
                expect(false).to.equal($("#myModal").data('bs.modal').isShown);
            });
            mochaRunFunc();
        }
    });
});