/**
 * Created by Dewan Sarwar on 14/02/2019
 * SPARQL queries to fetch metadata from PMR
 */
var makecotransporterSPARQL = function (membrane1, membrane2) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT ?med_entity_uri ?med_entity_uriCl ?med_entity_uriFMA ?med_entity_uriClFMA " +
        "WHERE { GRAPH ?Workspace { " +
        "<" + membrane1 + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:physicalPropertyOf ?model_proc. " +
        "?model_proc semsim:hasMediatorParticipant ?model_medparticipant. " +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. " +
        "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri. " +
        "?med_entity ro:part_of ?medEntityPartOf. " +
        "?medEntityPartOf semsim:hasPhysicalDefinition ?med_entity_uriFMA. " +
        "<" + membrane2 + "> semsim:isComputationalComponentFor ?model_propCl. " +
        "?model_propCl semsim:physicalPropertyOf ?model_procCl. " +
        "?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. " +
        "?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. " +
        "?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl. " +
        "?med_entityCl ro:part_of ?medEntityPartOfCl. " +
        "?medEntityPartOfCl semsim:hasPhysicalDefinition ?med_entity_uriClFMA. " +
        "FILTER (?med_entity_uri = ?med_entity_uriCl && ?med_entity_uriFMA = ?med_entity_uriClFMA) . " +
        "}}";

    return query;
};

var maketritransporterSPARQL = function (membrane1, membrane2, membrane3) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT ?med_entity_uri ?med_entity_uriFMA ?med_entity_uriCl ?med_entity_uriClFMA ?med_entity_uriK ?med_entity_uriKFMA " +
        "WHERE { GRAPH ?Workspace { " +
        "<" + membrane1 + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:physicalPropertyOf ?model_proc. " +
        "?model_proc semsim:hasMediatorParticipant ?model_medparticipant. " +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. " +
        "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri. " +
        "?med_entity ro:part_of ?medEntityPartOf. " +
        "?medEntityPartOf semsim:hasPhysicalDefinition ?med_entity_uriFMA. " +
        "<" + membrane2 + "> semsim:isComputationalComponentFor ?model_propCl. " +
        "?model_propCl semsim:physicalPropertyOf ?model_procCl. " +
        "?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. " +
        "?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. " +
        "?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl. " +
        "?med_entityCl ro:part_of ?medEntityPartOfCl. " +
        "?medEntityPartOfCl semsim:hasPhysicalDefinition ?med_entity_uriClFMA. " +
        "<" + membrane3 + "> semsim:isComputationalComponentFor ?model_propK. " +
        "?model_propK semsim:physicalPropertyOf ?model_procK. " +
        "?model_procK semsim:hasMediatorParticipant ?model_medparticipantK. " +
        "?model_medparticipantK semsim:hasPhysicalEntityReference ?med_entityK. " +
        "?med_entityK semsim:hasPhysicalDefinition ?med_entity_uriK. " +
        "?med_entityK ro:part_of ?medEntityPartOfK. " +
        "?medEntityPartOfK semsim:hasPhysicalDefinition ?med_entity_uriKFMA. " +
        "FILTER (?med_entity_uri = ?med_entity_uriCl && ?med_entity_uri = ?med_entity_uriK && ?med_entity_uriFMA = ?med_entity_uriClFMA && ?med_entity_uriFMA = ?med_entity_uriKFMA). " +
        "}}";

    return query;
}

var mediatorSPARQL = function (modelEntity) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "SELECT ?mediator " +
        "WHERE { " +
        "<" + modelEntity + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:physicalPropertyOf ?model_proc. " +
        "?model_proc semsim:hasMediatorParticipant ?model_medparticipant. " +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. " +
        "?med_entity semsim:hasPhysicalDefinition ?mediator. " +
        "}";

    return query;
}

var srcDescMediatorOfFluxesSPARQL = function (cellmlModelEntity, model) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT ?source_fma ?sink_fma ?med_entity_uriPR ?med_entity_uriFMA ?solute_chebi ?protein " +
        "WHERE { " +
        "<" + cellmlModelEntity + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:physicalPropertyOf ?model_proc. " +
        "?model_proc semsim:hasSourceParticipant ?model_srcparticipant. " +
        "?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. " +
        "?source_entity ro:part_of ?source_part_of_entity. " +
        "?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. " +
        "?source_entity semsim:hasPhysicalDefinition ?solute_chebi. " +
        "?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. " +
        "?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. " +
        "?sink_entity ro:part_of ?sink_part_of_entity. " +
        "?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma." +
        "?model_proc semsim:hasMediatorParticipant ?model_medparticipant." +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity." +
        "?med_entity semsim:hasPhysicalDefinition ?med_entity_uriPR." +
        "?med_entity ro:part_of ?medEntityPartOf." +
        "?medEntityPartOf semsim:hasPhysicalDefinition ?med_entity_uriFMA." +
        "<" + model + ">  <http://www.obofoundry.org/ro/ro.owl#modelOf> ?protein. " +
        "}";

    return query;
};

var opbSPARQL = function (cellmlModelEntity) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "SELECT ?opb WHERE { " +
        "<" + cellmlModelEntity + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:hasPhysicalDefinition ?opb. " +
        "}";

    return query;
};

var concentrationOPBSPARQL = function (cellmlModelEntity, model) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT ?concentration_fma ?solute_chebi ?protein " +
        "WHERE { " +
        "<" + cellmlModelEntity + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:physicalPropertyOf ?source_entity. " +
        "?source_entity ro:part_of ?source_part_of_entity. " +
        "?source_part_of_entity semsim:hasPhysicalDefinition ?concentration_fma." +
        "?source_entity semsim:hasPhysicalDefinition ?solute_chebi. " +
        "<" + model + ">  <http://www.obofoundry.org/ro/ro.owl#modelOf> ?protein. " +
        "}";

    return query;
};

var discoveryWithFlux = function (uriOPB) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX dcterms: <http://purl.org/dc/terms/>" +
        "SELECT ?Model_entity ?Biological_meaning " +
        "WHERE { " +
        "?property semsim:hasPhysicalDefinition " + uriOPB + ". " +
        "?Model_entity semsim:isComputationalComponentFor ?property. " +
        "?Model_entity dcterms:description ?Biological_meaning." +
        "}";

    return query;
};

var discoveryWithFluxOfSolute = function (uriCHEBI) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX dcterms: <http://purl.org/dc/terms/>" +
        "SELECT DISTINCT ?g ?Model_entity ?Biological_meaning " +
        "WHERE { GRAPH ?g { " +
        "?entity semsim:hasPhysicalDefinition " + uriCHEBI + ". " +
        "?source semsim:hasPhysicalEntityReference ?entity. " +
        "?process semsim:hasSourceParticipant ?source. " +
        "?property semsim:physicalPropertyOf ?process. " +
        "?Model_entity semsim:isComputationalComponentFor ?property. " +
        "?Model_entity dcterms:description ?Biological_meaning." +
        "}}";

    return query;
};

var discoveryWithFluxOfSoluteFMA = function (uriCHEBI, uriFMA) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX dcterms: <http://purl.org/dc/terms/>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT DISTINCT ?g ?Model_entity ?Biological_meaning " +
        "WHERE { GRAPH ?g { " +
        "?entity semsim:hasPhysicalDefinition " + uriCHEBI + ". " +
        "?source semsim:hasPhysicalEntityReference ?entity. " +
        "?process semsim:hasSourceParticipant ?source. " +
        "?property semsim:physicalPropertyOf ?process. " +
        "?Model_entity semsim:isComputationalComponentFor ?property. " +
        "?Model_entity dcterms:description ?Biological_meaning." +
        "?process semsim:hasMediatorParticipant ?model_medparticipant." +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity." +
        "?med_entity ro:part_of ?medEntityPartOf." +
        "?medEntityPartOf semsim:hasPhysicalDefinition " + uriFMA + "." +
        "}}";

    return query;
};

var discoveryWithConcentrationOfSolute = function (uriCHEBI) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX dcterms: <http://purl.org/dc/terms/>" +
        "SELECT ?Model_entity ?Biological_meaning " +
        "WHERE { " +
        "?entity semsim:hasPhysicalDefinition " + uriCHEBI + ". " +
        "?property semsim:physicalPropertyOf ?entity. " +
        "?Model_entity semsim:isComputationalComponentFor ?property. " +
        "?Model_entity dcterms:description ?Biological_meaning." +
        "}";

    return query;
};

var discoveryWithConcentrationOfSoluteFMA = function (uriCHEBI, uriFMA) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "PREFIX dcterms: <http://purl.org/dc/terms/>" +
        "SELECT ?Model_entity ?Biological_meaning " +
        "WHERE { " +
        "?entity semsim:hasPhysicalDefinition " + uriCHEBI + ". " +
        "?property semsim:physicalPropertyOf ?entity. " +
        "?Model_entity semsim:isComputationalComponentFor ?property. " +
        "?Model_entity dcterms:description ?Biological_meaning." +
        "?property semsim:physicalPropertyOf ?source_entity." +
        "?source_entity ro:part_of ?source_part_of_entity." +
        "?source_part_of_entity semsim:hasPhysicalDefinition " + uriFMA + "." +
        "}";

    return query;
};

var loadViewHtmlSPARQL = function (cellmlModel) {
    var query = "SELECT ?Workspace ?Model_entity ?Title ?Author ?Abstract ?Keyword ?Protein ?Compartment " +
        "?Located_in ?DOI WHERE { GRAPH ?Workspace { " +
        "<" + cellmlModel + "> <http://purl.org/dc/terms/title> ?Title . " +
        "?Model_entity <http://purl.org/dc/terms/title> ?Title . " +
        "OPTIONAL { <" + cellmlModel + "> <http://www.w3.org/2001/vcard-rdf/3.0#FN> ?Author } . " +
        "OPTIONAL { <" + cellmlModel + "> <http://purl.org/dc/terms/abstract> ?Abstract } . " +
        "OPTIONAL { <" + cellmlModel + "> <http://purl.org/dc/terms/keyword> ?Keyword } . " +
        "OPTIONAL { <" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein } . " +
        "OPTIONAL { <" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#compartmentOf> ?Compartment } . " +
        "OPTIONAL { <" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in } . " +
        "OPTIONAL { <" + cellmlModel + "> <http://biomodels.net/model-qualifiers/isDescribedBy> ?DOI } . " +
        "}}";

    return query;
};

var circleIDmyWelcomeWindowFluxSPARQL = function (circleID, cellmlModel) {
    var query;
    if (circleID[1] == "" && circleID[2] == "") {
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "SELECT ?Protein ?Biological_meaning ?chebi_uri " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "<" + circleID[0] + "> semsim:isComputationalComponentFor ?property . " +
            "?property semsim:physicalPropertyOf ?process. " +
            "?process semsim:hasSourceParticipant ?source. " +
            "?source semsim:hasPhysicalEntityReference ?entity. " +
            "?entity semsim:hasPhysicalDefinition ?chebi_uri. " +
            "}}";
    }
    else if (circleID[1] != "" && circleID[2] == "") { // (circleID[1] != "")
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ?chebi_uri " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "<" + circleID[1] + "> <http://purl.org/dc/terms/description> ?Biological_meaning2 . " +
            "<" + circleID[0] + "> semsim:isComputationalComponentFor ?property . " +
            "?property semsim:physicalPropertyOf ?process. " +
            "?process semsim:hasSourceParticipant ?source. " +
            "?source semsim:hasPhysicalEntityReference ?entity. " +
            "?entity semsim:hasPhysicalDefinition ?chebi_uri. " +
            "}}";
    }
    else if (circleID[1] != "" && circleID[2] != "") { // (circleID[1] != "")
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ?Biological_meaning3 ?chebi_uri " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "<" + circleID[1] + "> <http://purl.org/dc/terms/description> ?Biological_meaning2 . " +
            "<" + circleID[2] + "> <http://purl.org/dc/terms/description> ?Biological_meaning3 . " +
            "<" + circleID[0] + "> semsim:isComputationalComponentFor ?property . " +
            "?property semsim:physicalPropertyOf ?process. " +
            "?process semsim:hasSourceParticipant ?source. " +
            "?source semsim:hasPhysicalEntityReference ?entity. " +
            "?entity semsim:hasPhysicalDefinition ?chebi_uri. " +
            "}}";
    }
    return query;
};

var circleIDmyWelcomeWindowConSPARQL = function (circleID, cellmlModel) {
    var query;
    if (circleID[1] == "" && circleID[2] == "") {
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "SELECT ?Protein ?Biological_meaning ?chebi_uri " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "<" + circleID[0] + "> semsim:isComputationalComponentFor ?property . " +
            "?property semsim:physicalPropertyOf ?entity. " +
            "?entity semsim:hasPhysicalDefinition ?chebi_uri. " +
            "}}";
    }
    else if (circleID[1] != "" && circleID[2] == "") { // (circleID[1] != "")
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ?chebi_uri " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "<" + circleID[1] + "> <http://purl.org/dc/terms/description> ?Biological_meaning2 . " +
            "?property semsim:physicalPropertyOf ?entity. " +
            "?entity semsim:hasPhysicalDefinition ?chebi_uri. " +
            "}}";
    }
    else if (circleID[1] != "" && circleID[2] != "") { // (circleID[1] != "")
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ?Biological_meaning3 ?chebi_uri " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "<" + circleID[1] + "> <http://purl.org/dc/terms/description> ?Biological_meaning2 . " +
            "<" + circleID[2] + "> <http://purl.org/dc/terms/description> ?Biological_meaning3 . " +
            "?property semsim:physicalPropertyOf ?entity. " +
            "?entity semsim:hasPhysicalDefinition ?chebi_uri. " +
            "}}";
    }
    return query;
};

var relatedMembraneSPARQL = function (fstCHEBI, sndCHEBI, membrane) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT ?Model_entity ?Model_entity2 " +
        "WHERE { GRAPH ?g { " +
        "?entity semsim:hasPhysicalDefinition <" + fstCHEBI + ">. " +
        "?source semsim:hasPhysicalEntityReference ?entity. " +
        "?process semsim:hasSourceParticipant ?source. " +
        "?property semsim:physicalPropertyOf ?process. " +
        "?Model_entity semsim:isComputationalComponentFor ?property." +
        "?process semsim:hasMediatorParticipant ?model_medparticipant." +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity." +
        "?med_entity ro:part_of ?medEntityPartOf." +
        "?medEntityPartOf semsim:hasPhysicalDefinition <" + membrane + ">." +
        "?entity2 semsim:hasPhysicalDefinition <" + sndCHEBI + ">. " +
        "?source2 semsim:hasPhysicalEntityReference ?entity2. " +
        "?process2 semsim:hasSourceParticipant ?source2. " +
        "?property2 semsim:physicalPropertyOf ?process2. " +
        "?Model_entity2 semsim:isComputationalComponentFor ?property2." +
        "?process2 semsim:hasMediatorParticipant ?model_medparticipant2." +
        "?model_medparticipant2 semsim:hasPhysicalEntityReference ?med_entity2." +
        "?med_entity2 ro:part_of ?medEntityPartOf2." +
        "?medEntityPartOf2 semsim:hasPhysicalDefinition <" + membrane + ">." +
        "}}";

    return query;
};

var relatedMembraneModelSPARQL = function (model_entity, model_entity2, model_entity3) {
    var query;
    if (model_entity2 == "" && model_entity3 == "") {
        console.log("relatedMembraneModel: model_entity");
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
            "SELECT ?source_fma ?sink_fma ?med_entity_uriPR ?med_entity_uriFMA ?solute_chebi ?solute_chebi2 ?solute_chebi3 " +
            "WHERE { " +
            "<" + model_entity + "> semsim:isComputationalComponentFor ?model_prop. " +
            "?model_prop semsim:physicalPropertyOf ?model_proc. " +
            "?model_proc semsim:hasSourceParticipant ?model_srcparticipant. " +
            "?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. " +
            "?source_entity ro:part_of ?source_part_of_entity. " +
            "?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. " +
            "?source_entity semsim:hasPhysicalDefinition ?solute_chebi. " +
            "?source_entity semsim:hasPhysicalDefinition ?solute_chebi2. " + // change this later
            "?source_entity semsim:hasPhysicalDefinition ?solute_chebi3. " + // change this later
            "?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. " +
            "?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. " +
            "?sink_entity ro:part_of ?sink_part_of_entity. " +
            "?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma." +
            "?model_proc semsim:hasMediatorParticipant ?model_medparticipant." +
            "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity." +
            "?med_entity semsim:hasPhysicalDefinition ?med_entity_uriPR." +
            "?med_entity ro:part_of ?medEntityPartOf." +
            "?medEntityPartOf semsim:hasPhysicalDefinition ?med_entity_uriFMA." +
            "}";
    }
    else if (model_entity3 == "") {
        console.log("relatedMembraneModel: ELSE model_entity and model_entity2");
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
            "SELECT ?source_fma ?sink_fma ?med_entity_uriPR ?med_entity_uriFMA ?solute_chebi ?source_fma2 ?sink_fma2 ?med_entity_uri2PR ?med_entity_uri2FMA ?solute_chebi2 ?solute_chebi3 " +
            "WHERE { " +
            "<" + model_entity + "> semsim:isComputationalComponentFor ?model_prop. " +
            "?model_prop semsim:physicalPropertyOf ?model_proc. " +
            "?model_proc semsim:hasSourceParticipant ?model_srcparticipant. " +
            "?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. " +
            "?source_entity ro:part_of ?source_part_of_entity. " +
            "?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. " +
            "?source_entity semsim:hasPhysicalDefinition ?solute_chebi. " +
            "?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. " +
            "?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. " +
            "?sink_entity ro:part_of ?sink_part_of_entity. " +
            "?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma." +
            "?model_proc semsim:hasMediatorParticipant ?model_medparticipant." +
            "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity." +
            "?med_entity semsim:hasPhysicalDefinition ?med_entity_uriPR." +
            "?med_entity ro:part_of ?medEntityPartOf." +
            "?medEntityPartOf semsim:hasPhysicalDefinition ?med_entity_uriFMA." +
            "<" + model_entity2 + "> semsim:isComputationalComponentFor ?model_prop2. " +
            "?model_prop2 semsim:physicalPropertyOf ?model_proc2. " +
            "?model_proc2 semsim:hasSourceParticipant ?model_srcparticipant2. " +
            "?model_srcparticipant2 semsim:hasPhysicalEntityReference ?source_entity2. " +
            "?source_entity2 ro:part_of ?source_part_of_entity2. " +
            "?source_part_of_entity2 semsim:hasPhysicalDefinition ?source_fma2. " +
            "?source_entity2 semsim:hasPhysicalDefinition ?solute_chebi2. " +
            "?source_entity2 semsim:hasPhysicalDefinition ?solute_chebi3. " + // change this later
            "?model_proc2 semsim:hasSinkParticipant ?model_sinkparticipant2. " +
            "?model_sinkparticipant2 semsim:hasPhysicalEntityReference ?sink_entity2. " +
            "?sink_entity2 ro:part_of ?sink_part_of_entity2. " +
            "?sink_part_of_entity2 semsim:hasPhysicalDefinition ?sink_fma2." +
            "?model_proc2 semsim:hasMediatorParticipant ?model_medparticipant2." +
            "?model_medparticipant2 semsim:hasPhysicalEntityReference ?med_entity2." +
            "?med_entity2 semsim:hasPhysicalDefinition ?med_entity_uri2PR." +
            "?med_entity2 ro:part_of ?medEntityPartOf2." +
            "?medEntityPartOf2 semsim:hasPhysicalDefinition ?med_entity_uri2FMA." +
            "}";
    }
    else {
        console.log("relatedMembraneModel: ELSE model_entity and model_entity2 and model_entity3");
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
            "SELECT ?source_fma ?sink_fma ?med_entity_uriPR ?med_entity_uriFMA ?solute_chebi ?source_fma2 ?sink_fma2 ?med_entity_uri2PR ?med_entity_uri2FMA ?solute_chebi2 ?source_fma3 ?sink_fma3 ?med_entity_uri3PR ?med_entity_uri3FMA ?solute_chebi3 " +
            "WHERE { " +
            "<" + model_entity + "> semsim:isComputationalComponentFor ?model_prop. " +
            "?model_prop semsim:physicalPropertyOf ?model_proc. " +
            "?model_proc semsim:hasSourceParticipant ?model_srcparticipant. " +
            "?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. " +
            "?source_entity ro:part_of ?source_part_of_entity. " +
            "?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. " +
            "?source_entity semsim:hasPhysicalDefinition ?solute_chebi. " +
            "?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. " +
            "?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. " +
            "?sink_entity ro:part_of ?sink_part_of_entity. " +
            "?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma." +
            "?model_proc semsim:hasMediatorParticipant ?model_medparticipant." +
            "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity." +
            "?med_entity semsim:hasPhysicalDefinition ?med_entity_uriPR." +
            "?med_entity ro:part_of ?medEntityPartOf." +
            "?medEntityPartOf semsim:hasPhysicalDefinition ?med_entity_uriFMA." +
            "<" + model_entity2 + "> semsim:isComputationalComponentFor ?model_prop2. " +
            "?model_prop2 semsim:physicalPropertyOf ?model_proc2. " +
            "?model_proc2 semsim:hasSourceParticipant ?model_srcparticipant2. " +
            "?model_srcparticipant2 semsim:hasPhysicalEntityReference ?source_entity2. " +
            "?source_entity2 ro:part_of ?source_part_of_entity2. " +
            "?source_part_of_entity2 semsim:hasPhysicalDefinition ?source_fma2. " +
            "?source_entity2 semsim:hasPhysicalDefinition ?solute_chebi2. " +
            "?model_proc2 semsim:hasSinkParticipant ?model_sinkparticipant2. " +
            "?model_sinkparticipant2 semsim:hasPhysicalEntityReference ?sink_entity2. " +
            "?sink_entity2 ro:part_of ?sink_part_of_entity2. " +
            "?sink_part_of_entity2 semsim:hasPhysicalDefinition ?sink_fma2." +
            "?model_proc2 semsim:hasMediatorParticipant ?model_medparticipant2." +
            "?model_medparticipant2 semsim:hasPhysicalEntityReference ?med_entity2." +
            "?med_entity2 semsim:hasPhysicalDefinition ?med_entity_uri2PR." +
            "?med_entity2 ro:part_of ?medEntityPartOf2." +
            "?medEntityPartOf2 semsim:hasPhysicalDefinition ?med_entity_uri2FMA." +
            "<" + model_entity3 + "> semsim:isComputationalComponentFor ?model_prop3. " +
            "?model_prop3 semsim:physicalPropertyOf ?model_proc3. " +
            "?model_proc3 semsim:hasSourceParticipant ?model_srcparticipant3. " +
            "?model_srcparticipant3 semsim:hasPhysicalEntityReference ?source_entity3. " +
            "?source_entity3 ro:part_of ?source_part_of_entity3. " +
            "?source_part_of_entity3 semsim:hasPhysicalDefinition ?source_fma3. " +
            "?source_entity3 semsim:hasPhysicalDefinition ?solute_chebi3. " +
            "?model_proc3 semsim:hasSinkParticipant ?model_sinkparticipant3. " +
            "?model_sinkparticipant3 semsim:hasPhysicalEntityReference ?sink_entity3. " +
            "?sink_entity3 ro:part_of ?sink_part_of_entity3. " +
            "?sink_part_of_entity3 semsim:hasPhysicalDefinition ?sink_fma3." +
            "?model_proc3 semsim:hasMediatorParticipant ?model_medparticipant3." +
            "?model_medparticipant3 semsim:hasPhysicalEntityReference ?med_entity3." +
            "?med_entity3 semsim:hasPhysicalDefinition ?med_entity_uri3PR." +
            "?med_entity3 ro:part_of ?medEntityPartOf3." +
            "?medEntityPartOf3 semsim:hasPhysicalDefinition ?med_entity_uri3FMA." +
            "}";
    }

    return query;
};

var modalWindowToAddModelsSPARQL = function (located_in) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT ?modelEntity ?biological " +
        "WHERE { GRAPH ?g { " +
        "?entity semsim:hasPhysicalDefinition <" + located_in + ">." +
        "?entity2 ro:part_of ?entity." +
        "?mediator semsim:hasPhysicalEntityReference ?entity2." +
        "?process semsim:hasMediatorParticipant ?mediator." +
        "?property semsim:physicalPropertyOf ?process." +
        "?modelEntity semsim:isComputationalComponentFor ?property." +
        "?modelEntity <http://purl.org/dc/terms/description> ?biological. " +
        "}}";

    return query;
};

var locatedInSPARQL = function (cellmlModel) {
    var query = "SELECT ?located_in " +
        "WHERE { GRAPH ?g { <" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in . " +
        "}}";

    return query;
};

var locatedInCellMLModelSPARQL = function () {
    var query = "SELECT ?cellmlmodel ?located_in " +
        "WHERE { GRAPH ?g { ?cellmlmodel <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in. " +
        "}}";

    return query;
};

var medEntityUriAndPr = function (cellmlModelEntity) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#> " +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#> " +
        "SELECT ?med_entity_uri ?med_entity_uriPr " +
        "WHERE { " +
        "<" + cellmlModelEntity + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:physicalPropertyOf ?model_proc. " +
        "?model_proc semsim:hasMediatorParticipant ?model_medparticipant. " +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. " +
        "?med_entity semsim:hasPhysicalDefinition ?med_entity_uriPr. " +
        "?med_entity ro:part_of ?medEntityPartOf." +
        "?medEntityPartOf semsim:hasPhysicalDefinition ?med_entity_uri." +
        "}";

    return query;
};

var proteinSPARQL = function (modelname) {
    var query = "SELECT ?Protein ?workspaceName " +
        "WHERE { GRAPH ?workspaceName { <" + modelname + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
        "}}";

    return query;
};

var relatedMembraneModelModelOf = function (tempmembraneModel) {
    var query = "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "PREFIX dcterms: <http://purl.org/dc/terms/>" +
        "SELECT ?Protein WHERE { <" + tempmembraneModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. " +
        "}";

    return query;
};