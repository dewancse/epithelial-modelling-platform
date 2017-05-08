/**
 * Created by dsar941 on 5/8/2017.
 */
var endpoint = require("../index.js").endpoint;
var svgepithelialHtml = require("../index.js").svgepithelialHtml;
var insertHtml = require("../utils/misc.js").insertHtml;
var solutesBouncing = require("./solutesBouncing.js").solutesBouncing;
var iteration = require("./utilities.js").iteration;
var model2DArray = require("../models/models.js").model2DArray;
var modelEntityNameArray = require("../utils/actions.js").modelEntityNameArray;
var modelEntityFullNameArray = require("../utils/actions.js").modelEntityFullNameArray;
var showsvgEpithelial = require("./svgEpithelial.js").showsvgEpithelial;

var loadEpithelialHtml = function () {

    $ajaxUtils.sendGetRequest(
        svgepithelialHtml,
        function (epithelialHtmlContent) {
            insertHtml("#home-content", epithelialHtmlContent);

            $ajaxUtils.sendGetRequest(svgepithelialHtml, showEpithelial, false);
        },
        false);
}

var showEpithelial = function (epithelialHtmlContent) {

    // remove model name, keep only solutes
    for (var i = 0; i < modelEntityNameArray.length; i++) {
        var indexOfHash = modelEntityNameArray[i].search("#");
        modelEntityNameArray[i] = modelEntityNameArray[i].slice(indexOfHash + 1);
    }

    // remove duplicate
    modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
        return modelEntityNameArray.indexOf(item) == pos;
    })

    // Temporary for testing
    for (var i = 0; i < modelEntityFullNameArray.length; i++) {
        var indexOfHash = modelEntityFullNameArray[i].search("#");
        if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "weinstein_1995")
            modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/16032017100850239p1300" + modelEntityFullNameArray[i].slice(indexOfHash);
        if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "mackenzie_1996")
            modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/mackenzie_1996" + modelEntityFullNameArray[i].slice(indexOfHash);
        if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "chang_fujita_b_1999")
            modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/17032017142614972p1300" + modelEntityFullNameArray[i].slice(indexOfHash);
        if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "wilkins_sneyd_1998")
            modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/21042017112802526p1200" + modelEntityFullNameArray[i].slice(indexOfHash);
        if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "warren_2010")
            modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/23042017142938531p1200" + modelEntityFullNameArray[i].slice(indexOfHash);
        if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "sneyd_1995")
            modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/20042017200857265p1200" + modelEntityFullNameArray[i].slice(indexOfHash);
        if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "bindschadler_sneyd_2001")
            modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/22042017214418158p1200" + modelEntityFullNameArray[i].slice(indexOfHash);
    }

    console.log("showEpithelial in model2DArr: ", model2DArray);
    console.log("showEpithelial in modelEntityNameArray: ", modelEntityNameArray);
    console.log("showEpithelial in modelEntityFullNameArray: ", modelEntityFullNameArray);

    var concentration_fma = [], source_fma = [], sink_fma = [], med_fma = [], med_pr = [];
    var source_fma2 = [], sink_fma2 = [];

    var apicalID = "http://identifiers.org/fma/FMA:84666";
    var basolateralID = "http://identifiers.org/fma/FMA:84669";
    var partOfProteinUri = "http://purl.obolibrary.org/obo/PR";
    var luminalID = "http://identifiers.org/fma/FMA:74550";
    var interstitialID = "http://identifiers.org/fma/FMA:9673";
    var partOfCHEBIUri = "http://identifiers.org/chebi/CHEBI";

    var index = 0, counter = 0;
    var membrane = [], apicalMembrane = [], basolateralMembrane = [];

    var testAJAX = function () {

        if (index == modelEntityFullNameArray.length) {

            // exceptional case: one flux is chosen
            if (membrane.length <= 1) {

                showsvgEpithelial(
                    concentration_fma,
                    source_fma2,
                    sink_fma2,
                    apicalMembrane,
                    basolateralMembrane,
                    membrane);
            }
            else {
                for (var i = 0; i < membrane.length; i++) {
                    for (var j = i + 1; j < membrane.length; j++) {
                        var apicalajax = function (membrane1, membrane2) {

                            // query for finding fluxes to make a cotransporter
                            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                                'SELECT ?med_entity_uri ?med_entity_uriCl ' +
                                'WHERE { GRAPH ?Workspace { ' +
                                '<' + membrane1.source_name + '> semsim:isComputationalComponentFor ?model_prop. ' +
                                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant. ' +
                                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. ' +
                                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                                '<' + membrane2.source_name + '> semsim:isComputationalComponentFor ?model_propCl. ' +
                                '?model_propCl semsim:physicalPropertyOf ?model_procCl. ' +
                                '?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. ' +
                                '?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. ' +
                                '?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl.' +
                                'FILTER (?med_entity_uri = ?med_entity_uriCl) . ' +
                                '}}'

                            $ajaxUtils.sendPostRequest(
                                endpoint,
                                query,
                                function (jsonObj) {
                                    var tempProtein = [], tempApical = [], tempBasolateral = [];

                                    for (var m = 0; m < jsonObj.results.bindings.length; m++) {
                                        var tmpPro = jsonObj.results.bindings[m].med_entity_uri.value;
                                        var tmpApi = jsonObj.results.bindings[m].med_entity_uri.value;
                                        var tmpBas = jsonObj.results.bindings[m].med_entity_uri.value;

                                        if (tmpPro.indexOf(partOfProteinUri) != -1) {
                                            tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                                        }

                                        if (tmpApi.indexOf(apicalID) != -1) {
                                            tempApical.push(jsonObj.results.bindings[m].med_entity_uri.value);
                                        }

                                        if (tmpBas.indexOf(basolateralID) != -1) {
                                            tempBasolateral.push(jsonObj.results.bindings[m].med_entity_uri.value);
                                        }
                                    }

                                    // remove duplicate of protein ID
                                    tempProtein = tempProtein.filter(function (item, pos) {
                                        return tempProtein.indexOf(item) == pos;
                                    })

                                    // remove duplicate of fma ID
                                    tempApical = tempApical.filter(function (item, pos) {
                                        return tempApical.indexOf(item) == pos;
                                    })

                                    // remove duplicate of fma ID
                                    tempBasolateral = tempBasolateral.filter(function (item, pos) {
                                        return tempBasolateral.indexOf(item) == pos;
                                    })

                                    // cotransporter in apical membrane
                                    if (tempProtein.length != 0 && tempApical.length != 0) {
                                        apicalMembrane.push(
                                            {
                                                source_text: membrane1.source_text,
                                                source_fma: membrane1.source_fma,
                                                sink_text: membrane1.sink_text,
                                                sink_fma: membrane1.sink_fma,
                                                source_text2: membrane2.source_text,
                                                source_fma2: membrane2.source_fma,
                                                sink_text2: membrane2.sink_text,
                                                sink_fma2: membrane2.sink_fma
                                            });
                                    }

                                    // cotransporter in basolateral membrane
                                    if (tempProtein.length != 0 && tempBasolateral.length != 0) {
                                        basolateralMembrane.push(
                                            {
                                                source_text: membrane1.source_text,
                                                source_fma: membrane1.source_fma,
                                                sink_text: membrane1.sink_text,
                                                sink_fma: membrane1.sink_fma,
                                                source_text2: membrane2.source_text,
                                                source_fma2: membrane2.source_fma,
                                                sink_text2: membrane2.sink_text,
                                                sink_fma2: membrane2.sink_fma
                                            });
                                    }

                                    counter++;

                                    if (counter == iteration(membrane.length)) {
                                        showsvgEpithelial(
                                            concentration_fma,
                                            source_fma2,
                                            sink_fma2,
                                            apicalMembrane,
                                            basolateralMembrane,
                                            membrane);
                                    }
                                },
                                true
                            );
                        }

                        apicalajax(membrane[i], membrane[j]);
                    }
                }
            }

            return;
        }

        var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
            'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
            'SELECT ?source_fma ?sink_fma ?med_entity_uri ' +
            'WHERE { ' +
            '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
            '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
            '?model_proc semsim:hasSourceParticipant ?model_srcparticipant. ' +
            '?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. ' +
            '?source_entity ro:part_of ?source_part_of_entity. ' +
            '?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. ' +
            '?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. ' +
            '?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. ' +
            '?sink_entity ro:part_of ?sink_part_of_entity. ' +
            '?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma.' +
            '?model_proc semsim:hasMediatorParticipant ?model_medparticipant.' +
            '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity.' +
            '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
            '}'

        $ajaxUtils.sendPostRequest(
            endpoint,
            query,
            function (jsonObjFlux) {

                for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {
                    if (jsonObjFlux.results.bindings[i].source_fma == undefined)
                        source_fma.push("");
                    else
                        source_fma.push(
                            {
                                name: modelEntityFullNameArray[index],
                                fma: jsonObjFlux.results.bindings[i].source_fma.value
                            }
                        );

                    if (jsonObjFlux.results.bindings[i].sink_fma == undefined)
                        sink_fma.push("");
                    else
                        sink_fma.push(
                            {
                                name: modelEntityFullNameArray[index],
                                fma: jsonObjFlux.results.bindings[i].sink_fma.value
                            }
                        );

                    if (jsonObjFlux.results.bindings[i].med_entity_uri == undefined) {
                        med_pr.push("");
                        med_fma.push("");
                    }
                    else {
                        var temp = jsonObjFlux.results.bindings[i].med_entity_uri.value;
                        if (temp.indexOf(partOfProteinUri) != -1 || temp.indexOf(partOfCHEBIUri) != -1) {
                            med_pr.push({
                                name: modelEntityFullNameArray[index],
                                fma: jsonObjFlux.results.bindings[i].med_entity_uri.value
                            });
                        }
                        else {
                            med_fma.push(
                                {
                                    name: modelEntityFullNameArray[index],
                                    fma: jsonObjFlux.results.bindings[i].med_entity_uri.value
                                }
                            );
                        }
                    }
                }

                // Remove duplicate links
                function uniqueify(es) {
                    var retval = [];
                    es.forEach(function (e) {
                        for (var j = 0; j < retval.length; j++) {
                            if (retval[j].name === e.name && retval[j].fma === e.fma)
                                return;
                        }
                        retval.push(e);
                    });
                    return retval;
                }

                source_fma = uniqueify(source_fma);
                sink_fma = uniqueify(sink_fma);
                med_pr = uniqueify(med_pr);
                med_fma = uniqueify(med_fma);

                var query2 = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                    'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                    'SELECT ?concentration_fma ' +
                    'WHERE { ' +
                    '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                    '?model_prop semsim:physicalPropertyOf ?source_entity. ' +
                    '?source_entity ro:part_of ?source_part_of_entity. ' +
                    '?source_part_of_entity semsim:hasPhysicalDefinition ?concentration_fma.' +
                    '}'

                $ajaxUtils.sendPostRequest(
                    endpoint,
                    query2,
                    function (jsonObjCon) {

                        for (var i = 0; i < jsonObjCon.results.bindings.length; i++) {
                            if (jsonObjCon.results.bindings[i].concentration_fma == undefined)
                                concentration_fma.push("");
                            else
                                concentration_fma.push(
                                    {
                                        name: modelEntityFullNameArray[index],
                                        fma: jsonObjCon.results.bindings[i].concentration_fma.value
                                    }
                                );
                        }

                        index++;

                        if (source_fma.length != 0) {
                            // keep only name of solutes
                            var indexOfHash = source_fma[0].name.search("#");
                            var srctext = source_fma[0].name.slice(indexOfHash + 1);
                            var indexOfdot = srctext.indexOf('.');
                            srctext = srctext.slice(indexOfdot + 1);

                            var indexOfHash = sink_fma[0].name.search("#");
                            var snktext = sink_fma[0].name.slice(indexOfHash + 1);
                            var indexOfdot = snktext.indexOf('.');
                            snktext = snktext.slice(indexOfdot + 1);

                            var indexOfHash = med_fma[0].name.search("#");
                            var medfmatext = med_fma[0].name.slice(indexOfHash + 1);
                            var indexOfdot = medfmatext.indexOf('.');
                            medfmatext = medfmatext.slice(indexOfdot + 1);

                            if (source_fma[0].fma == luminalID && sink_fma[0].fma == interstitialID) {
                                membrane.push({
                                    source_text: srctext,
                                    source_fma: source_fma[0].fma,
                                    source_name: source_fma[0].name,
                                    sink_text: snktext,
                                    sink_fma: sink_fma[0].fma,
                                    sink_name: sink_fma[0].name,
                                    med_text: "diffusive flux",
                                    med_fma: "diffusive flux",
                                    med_pr: "diffusive flux"
                                });
                            }
                            else {
                                if (med_pr[0] == undefined) { // temp solution
                                    membrane.push({
                                        source_text: srctext,
                                        source_fma: source_fma[0].fma,
                                        source_name: source_fma[0].name,
                                        sink_text: snktext,
                                        sink_fma: sink_fma[0].fma,
                                        sink_name: sink_fma[0].name,
                                        med_text: medfmatext,
                                        med_fma: med_fma[0].fma,
                                        med_pr: undefined
                                    });
                                }
                                else {
                                    membrane.push({
                                        source_text: srctext,
                                        source_fma: source_fma[0].fma,
                                        source_name: source_fma[0].name,
                                        sink_text: snktext,
                                        sink_fma: sink_fma[0].fma,
                                        sink_name: sink_fma[0].name,
                                        med_text: medfmatext,
                                        med_fma: med_fma[0].fma,
                                        med_pr: med_pr[0].fma
                                    });
                                }
                            }

                            source_fma2.push(source_fma[0]);
                            sink_fma2.push(sink_fma[0]);

                            source_fma = [];
                            sink_fma = [];
                            med_fma = [];
                            med_pr = [];
                        }
                        testAJAX(); // callback
                    },
                    true);
            },
            true);
    }

    testAJAX();
}

exports.loadEpithelialHtml = loadEpithelialHtml;