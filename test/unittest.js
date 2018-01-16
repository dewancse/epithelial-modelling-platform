/**
 * Created by dsar941 on 6/20/2017.
 *
 * TODO: How to write test case
 * https://code.tutsplus.com/tutorials/testing-javascript-with-phantomjs--net-28243
 * http://mochajs.org/#getting-started
 * git commit and push; Travis will automate  continuous testing
 */
// mocha.ui('bdd');
// mocha.reporter('html');
// var expect = chai.expect;
// var assert = chai.assert;
//
// var mochaRunFunc = function () {
//     if (window.mochaPhantomJS) {
//         mochaPhantomJS.run();
//     }
//     else {
//         mocha.run();
//     }
// };

// link tests for MODEL DISCOVERY, LOAD MODELS, and DOCUMENTATION
describe("link Tests", function () {
    document.addEventListener('click', function (event) {
        if (event.srcElement.localName == 'a') {
            if (event.srcElement.href == $('li#listDiscovery a')[0].href) {
                it("#listDiscovery", function () {
                    expect($('li#listDiscovery a')[0].href).to.equal(event.srcElement.href);
                });
            }
            if (event.srcElement.href == $('li#listModels a')[0].href) {
                it("#listModels", function () {
                    expect($('li#listModels a')[0].href).to.equal(event.srcElement.href);
                });
            }
            if (event.srcElement.href == $('li#documentation a')[0].href) {
                it("#documentation", function () {
                    expect($('li#documentation a')[0].href).to.equal(event.srcElement.href);
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

// // TODO: Test 2.1.3! Page reloads after selecting a dropdown item
// describe("filter Tests", function () {
//     document.addEventListener('click', function (event) {
//     });
// });
//
// // recommender window tests when save/close clicked
// describe("recommender window Tests", function () {
//     document.addEventListener('click', function (event) {
//         if (event.srcElement.id == "saveID") {
//             it("#saveID", function () {
//                 expect(false).to.equal($("#myWelcomeModal").data('bs.modal').isShown);
//             });
//             mochaRunFunc();
//         }
//         if (event.srcElement.id == "closeID") {
//             it("#closeID", function () {
//                 expect(false).to.equal($("#myWelcomeModal").data('bs.modal').isShown);
//             });
//             mochaRunFunc();
//         }
//         if (event.srcElement.id == "msaveID") {
//             it("#msaveID", function () {
//                 expect(false).to.equal($("#myModal").data('bs.modal').isShown);
//             });
//             mochaRunFunc();
//         }
//         if (event.srcElement.id == "mcloseID") {
//             it("#mcloseID", function () {
//                 expect(false).to.equal($("#myModal").data('bs.modal').isShown);
//             });
//             mochaRunFunc();
//         }
//     });
// });
//
// // Test 7 - drag a circle from apical to basolateral membrane
// describe("Test 7", function () {
//     document.addEventListener('click', function (event) {
//     });
// });
//
// // Test 8 - drag a circle from apical to basolateral membrane
// describe("Test 8", function () {
//     document.addEventListener('click', function (event) {
//     });
// });