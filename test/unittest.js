/**
 * Created by dsar941 on 6/20/2017.
 *
 * TODO: How to write test case
 * https://code.tutsplus.com/tutorials/testing-javascript-with-phantomjs--net-28243
 * http://mochajs.org/#getting-started
 * git commit and push; Travis will automate  continuous testing
 */

describe("DOM Tests", function () {
    var el = document.createElement("div");
    el.id = "myDiv";
    el.innerHTML = "Hi there!";
    el.style.background = "#ccc";
    document.body.appendChild(el);

    var myEl = document.getElementById('myDiv');
    it("is in the DOM", function () {
        expect(myEl).to.not.equal(null);
    });

    it("is a child of the body", function () {
        expect(myEl.parentElement).to.equal(document.body);
    });

    it("has the right text", function () {
        expect(myEl.innerHTML).to.equal("Hi there!");
    });

    it("has the right background", function () {
        expect(myEl.style.background).to.equal("rgb(204, 204, 204)");
    });
});

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

// link tests for MODEL DISCOVERY, LOAD MODELS, and DOCUMENTATION
describe("link Tests", function () {
    document.addEventListener('click', function (event) {
        if (event.srcElement.localName == 'a') {
            if (event.srcElement.href == $('li#listDiscovery a')[0].href) {
                it("#listDiscovery", function () {
                    expect($('li#listDiscovery a')[0].href).to.equal(event.srcElement.href);
                    if ($('li#listDiscovery a')[0].href == event.srcElement.href) {
                        console.log("#listDiscovery: test passed");
                    }
                    else {
                        console.log("#listDiscovery: test failed");
                    }
                });
            }
            if (event.srcElement.href == $('li#listModels a')[0].href) {
                it("#listModels", function () {
                    expect($('li#listModels a')[0].href).to.equal(event.srcElement.href);
                    if ($('li#listModels a')[0].href == event.srcElement.href) {
                        console.log("#listModels: test passed");
                    }
                    else {
                        console.log("#listModels: test failed");
                    }
                });
            }
            if (event.srcElement.href == $('li#documentation a')[0].href) {
                it("#documentation", function () {
                    expect($('li#documentation a')[0].href).to.equal(event.srcElement.href);
                    if ($('li#documentation a')[0].href == event.srcElement.href) {
                        console.log("#documentation: test passed");
                    }
                    else {
                        console.log("#documentation: test failed");
                    }
                });
            }

            // mochaRunFunc();

            // // TODO: Test 6! first check that svg platform is fully loaded
            // // TODO: therefore, $('#newgid') is empty
            // if ($('button#confirmBtn a')[0] != undefined) {
            //     if (event.srcElement.href == $('button#confirmBtn a')[0].href) {
            //         console.log("event in unittest: ", event);
            //         console.log("('#newgid') in unittest: ", $('#newgid'));
            //
            //         it("#EpithelialPlatform", function () {
            //             expect($('button#confirmBtn a')[0].href).to.equal(event.srcElement.href);
            //         });
            //         mochaRunFunc();
            //     }
            // }
        }
    });
});

// recommender window tests when save/close clicked
describe("recommender window Tests", function () {
    document.addEventListener('click', function (event) {
        if (event.srcElement.id == "saveID") {
            it("#saveID", function () {
                expect(false).to.equal($("#myWelcomeModal").data('bs.modal').isShown);
                if ($("#myWelcomeModal").data('bs.modal').isShown == false) {
                    console.log("#saveID: test passed");
                }
                else {
                    console.log("#saveID: test failed");
                }
            });
            // mochaRunFunc();
        }
        if (event.srcElement.id == "closeID") {
            it("#closeID", function () {
                expect(false).to.equal($("#myWelcomeModal").data('bs.modal').isShown);
                if ($("#myWelcomeModal").data('bs.modal').isShown == false) {
                    console.log("#closeID: test passed");
                }
                else {
                    console.log("#closeID: test failed");
                }
            });
            // mochaRunFunc();
        }
        if (event.srcElement.id == "msaveID") {
            it("#msaveID", function () {
                expect(false).to.equal($("#myModal").data('bs.modal').isShown);
                if ($("#myModal").data('bs.modal').isShown == false) {
                    console.log("#msaveID: test passed");
                }
                else {
                    console.log("#msaveID: test failed");
                }
            });
            // mochaRunFunc();
        }
        if (event.srcElement.id == "mcloseID") {
            it("#mcloseID", function () {
                expect(false).to.equal($("#myModal").data('bs.modal').isShown);
                if ($("#myModal").data('bs.modal').isShown == false) {
                    console.log("#mcloseID: test passed");
                }
                else {
                    console.log("#mcloseID: test failed");
                }
            });
            // mochaRunFunc();
        }
    });
});