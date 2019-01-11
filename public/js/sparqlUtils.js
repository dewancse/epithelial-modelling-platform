/**
 * Created by Dewan Sarwar on 14/01/2018.
 */
// var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
var nginx_proxy = "/.api/pmr/sparql",
    endpoint = nginx_proxy;


// var abiOntoEndpoint = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies";
var abiOntoEndpoint = "/.api/ols/ontologies";

var bioportalPrEndpoint = "http://data.bioontology.org/search?apikey=fc5d5241-1e8e-4b44-b401-310ca39573f6&q=";

var bioportalAnnotatorEndpoint = "http://data.bioontology.org/annotator?apikey=fc5d5241-1e8e-4b44-b401-310ca39573f6&text=";

var organ = [
    {
        "key": [
            {
                "key": "http://purl.obolibrary.org/obo/FMA_7203",
                "value": "kidney"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_84666",
                "value": "apical plasma membrane"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_70973",
                "value": "epithelial cell of proximal tubule"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_70981",
                "value": "epithelial cell of Distal tubule"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_17693",
                "value": "proximal convoluted tubule"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_17721",
                "value": "distal convoluted tubule"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_66836",
                "value": "portion of cytosol"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_84669",
                "value": "basolateralMembrane plasma membrane"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_17716",
                "value": "proximal straight tubule"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_17717",
                "value": "ascending limb of loop of Henle"
            },
            {
                "key": "http://purl.obolibrary.org/obo/FMA_17705",
                "value": "descending limb of loop of Henle"
            },
            {
                "key": "http://identifiers.org/go/GO:0072061",
                "value": "inner medullary collecting duct development"
            },
            {
                "key": "http://identifiers.org/ma/MA:0002595",
                "value": "renal medullary capillary"
            },
            {
                "key": "http://identifiers.org/uberon/UBERON:0004726",
                "value": "vasa recta"
            },
            {
                "key": "http://identifiers.org/uberon/UBERON:0009091",
                "value": "vasa recta ascending limb"
            },
            {
                "key": "http://identifiers.org/uberon/UBERON:0004775",
                "value": "outer renal medulla vasa recta"
            },
            {
                "key": "http://identifiers.org/uberon/UBERON:0004776",
                "value": "inner renal medulla vasa recta"
            }
        ],

        "value": "Kidney"
    }
];

var dictionary = [
    {
        "key1": "flux", "key2": "", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00593>", "chebi": "", "fma": ""
    },
    {
        "key1": "flux", "key2": "sodium", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29101>",
        "fma": ""
    },
    {
        "key1": "flux", "key2": "hydrogen", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_15378>",
        "fma": ""
    },
    {
        "key1": "flux", "key2": "ammonium", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_28938>",
        "fma": ""
    },
    {
        "key1": "flux", "key2": "chloride", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17996>",
        "fma": ""
    },
    {
        "key1": "flux", "key2": "potassium", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29103>",
        "fma": ""
    },
    {
        "key1": "flux", "key2": "bicarbonate", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17544>",
        "fma": ""
    },
    {
        "key1": "flux", "key2": "glucose", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17234>",
        "fma": ""
    },
    {
        "key1": "flux", "key2": "sodium", "key3": "apical plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29101>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84666>"
    },
    {
        "key1": "flux", "key2": "hydrogen", "key3": "apical plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_15378>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84666>"
    },
    {
        "key1": "flux", "key2": "ammonium", "key3": "apical plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_28938>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84666>"
    },
    {
        "key1": "flux", "key2": "chloride", "key3": "apical plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17996>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84666>"
    },
    {
        "key1": "flux", "key2": "potassium", "key3": "apical plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29103>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84666>"
    },
    {
        "key1": "flux", "key2": "bicarbonate", "key3": "apical plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17544>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84666>"
    },
    {
        "key1": "flux", "key2": "glucose", "key3": "apical plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17234>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84666>"
    },
    {
        "key1": "flux", "key2": "sodium", "key3": "basolateral plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29101>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84669>"
    },
    {
        "key1": "flux", "key2": "hydrogen", "key3": "basolateral plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_15378>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84669>"
    },
    {
        "key1": "flux", "key2": "ammonium", "key3": "basolateral plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_28938>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84669>"
    },
    {
        "key1": "flux", "key2": "chloride", "key3": "basolateral plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17996>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84669>"
    },
    {
        "key1": "flux", "key2": "potassium", "key3": "basolateral plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29103>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84669>"
    },
    {
        "key1": "flux", "key2": "bicarbonate", "key3": "basolateral plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17544>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84669>"
    },
    {
        "key1": "flux", "key2": "glucose", "key3": "basolateral plasma membrane",
        "opb": "<http://identifiers.org/opb/OPB_00593>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17234>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_84669>"
    },
    {
        "key1": "concentration", "key2": "", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00340>", "chebi": "", "fma": ""
    },
    {
        "key1": "concentration", "key2": "sodium", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29101>",
        "fma": ""
    },
    {
        "key1": "concentration", "key2": "hydrogen", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_15378>",
        "fma": ""
    },
    {
        "key1": "concentration", "key2": "ammonium", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_28938>",
        "fma": ""
    },
    {
        "key1": "concentration", "key2": "chloride", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17996>",
        "fma": ""
    },
    {
        "key1": "concentration", "key2": "potassium", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29103>",
        "fma": ""
    },
    {
        "key1": "concentration", "key2": "bicarbonate", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17544>",
        "fma": ""
    },
    {
        "key1": "concentration", "key2": "glucose", "key3": "",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17234>",
        "fma": ""
    },
    {
        "key1": "concentration", "key2": "sodium", "key3": "luminal",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29101>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_74550>"
    },
    {
        "key1": "concentration", "key2": "hydrogen", "key3": "luminal",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_15378>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_74550>"
    },
    {
        "key1": "concentration", "key2": "ammonium", "key3": "luminal",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_28938>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_74550>"
    },
    {
        "key1": "concentration", "key2": "chloride", "key3": "luminal",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17996>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_74550>"
    },
    {
        "key1": "concentration", "key2": "potassium", "key3": "luminal",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29103>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_74550>"
    },
    {
        "key1": "concentration", "key2": "bicarbonate", "key3": "luminal",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17544>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_74550>"
    },
    {
        "key1": "concentration", "key2": "glucose", "key3": "luminal",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17234>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_74550>"
    },
    {
        "key1": "concentration", "key2": "sodium", "key3": "cytosol",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29101>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_66836>"
    },
    {
        "key1": "concentration", "key2": "hydrogen", "key3": "cytosol",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_15378>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_66836>"
    },
    {
        "key1": "concentration", "key2": "ammonium", "key3": "cytosol",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_28938>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_66836>"
    },
    {
        "key1": "concentration", "key2": "chloride", "key3": "cytosol",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17996>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_66836>"
    },
    {
        "key1": "concentration", "key2": "potassium", "key3": "cytosol",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29103>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_66836>"
    },
    {
        "key1": "concentration", "key2": "bicarbonate", "key3": "cytosol",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17544>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_66836>"
    },
    {
        "key1": "concentration", "key2": "glucose", "key3": "cytosol",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17234>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_66836>"
    },
    {
        "key1": "concentration", "key2": "sodium", "key3": "interstitial fluid",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29101>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
    },
    {
        "key1": "concentration", "key2": "hydrogen", "key3": "interstitial fluid",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_15378>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
    },
    {
        "key1": "concentration", "key2": "ammonium", "key3": "interstitial fluid",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_28938>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
    },
    {
        "key1": "concentration", "key2": "chloride", "key3": "interstitial fluid",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17996>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
    },
    {
        "key1": "concentration", "key2": "potassium", "key3": "interstitial fluid",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29103>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
    },
    {
        "key1": "concentration", "key2": "bicarbonate", "key3": "interstitial fluid",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17544>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
    },
    {
        "key1": "concentration", "key2": "glucose", "key3": "interstitial fluid",
        "opb": "<http://identifiers.org/opb/OPB_00340>",
        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17234>",
        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
    }
];

var homeHtml = "./snippets/home-snippet.html";
var viewHtml = "./snippets/view-snippet.html";
var modelHtml = "./snippets/model-snippet.html";
var searchHtml = "./snippets/search-snippet.html";
var usecaseHtml = "./snippets/usecase-snippet.html";
var similarityHtml = "./snippets/similarity-snippet.html";
var epithelialHtml = "./snippets/epithelial-snippet.html";
var addmodelHtml = "./snippets/addmodel-snippet.html";
var modelXML = "./snippets/newmodel.xml";

var epithelialcellID = "http://purl.obolibrary.org/obo/CL_0000066";
var apicalID = "http://purl.obolibrary.org/obo/FMA_84666";
var basolateralID = "http://purl.obolibrary.org/obo/FMA_84669";
var partOfProteinUri = "http://purl.obolibrary.org/obo/PR";
var partOfCellUri = "http://purl.obolibrary.org/obo/CL";
var partOfGOUri = "http://purl.obolibrary.org/obo/GO";
var partOfCHEBIUri = "http://purl.obolibrary.org/obo/CHEBI";
var fluxOPB = "http://identifiers.org/opb/OPB_00593";
var concentrationOPB = "http://identifiers.org/opb/OPB_00340";

var paracellularID = "http://purl.obolibrary.org/obo/FMA_67394";
var luminalID = "http://purl.obolibrary.org/obo/FMA_74550";
var cytosolID = "http://purl.obolibrary.org/obo/FMA_66836";
var interstitialID = "http://purl.obolibrary.org/obo/FMA_9673";
var Nachannel = "http://purl.obolibrary.org/obo/PR_000014527";
var Clchannel = "http://purl.obolibrary.org/obo/PR_Q06393";
var Kchannel = "http://purl.obolibrary.org/obo/PR_P15387";
var partOfFMAUri = "http://purl.obolibrary.org/obo/FMA";

var naENaC = "http://purl.obolibrary.org/obo/PR_P37089";
var clChannel = "http://purl.obolibrary.org/obo/PR_P35524";
var kChannel = "http://purl.obolibrary.org/obo/PR_000001916";
var bloodCapillary = "http://purl.obolibrary.org/obo/FMA_263901";
var capillaryID = "http://purl.obolibrary.org/obo/FMA_63194";
var nkcc1 = "http://purl.obolibrary.org/obo/PR_P55012";

// var myWorkspaceName = cors_api_url + "https://models.physiomeproject.org/workspace/267";
var myWorkspaceName = "https://models.physiomeproject.org/workspace/267";
var uriSEDML = "https://sed-ml.github.io/index.html";

var makecotransporterSPARQL = function (membrane1, membrane2) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT ?med_entity_uri ?med_entity_uriCl " +
        "WHERE { GRAPH ?Workspace { " +
        "<" + membrane1 + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:physicalPropertyOf ?model_proc. " +
        "?model_proc semsim:hasMediatorParticipant ?model_medparticipant. " +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. " +
        "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri." +
        "<" + membrane2 + "> semsim:isComputationalComponentFor ?model_propCl. " +
        "?model_propCl semsim:physicalPropertyOf ?model_procCl. " +
        "?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. " +
        "?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. " +
        "?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl." +
        "FILTER (?med_entity_uri = ?med_entity_uriCl) . " +
        "}}";

    return query;
};

var maketritransporterSPARQL = function (membrane1, membrane2, membrane3) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
        "SELECT ?med_entity_uri ?med_entity_uriCl ?med_entity_uriK " +
        "WHERE { GRAPH ?Workspace { " +
        "<" + membrane1 + "> semsim:isComputationalComponentFor ?model_prop. " +
        "?model_prop semsim:physicalPropertyOf ?model_proc. " +
        "?model_proc semsim:hasMediatorParticipant ?model_medparticipant. " +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. " +
        "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri. " +
        "<" + membrane2 + "> semsim:isComputationalComponentFor ?model_propCl. " +
        "?model_propCl semsim:physicalPropertyOf ?model_procCl. " +
        "?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. " +
        "?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. " +
        "?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl. " +
        "<" + membrane3 + "> semsim:isComputationalComponentFor ?model_propK. " +
        "?model_propK semsim:physicalPropertyOf ?model_procK. " +
        "?model_procK semsim:hasMediatorParticipant ?model_medparticipantK. " +
        "?model_medparticipantK semsim:hasPhysicalEntityReference ?med_entityK. " +
        "?med_entityK semsim:hasPhysicalDefinition ?med_entity_uriK. " +
        "FILTER (?med_entity_uri = ?med_entity_uriCl && ?med_entity_uri = ?med_entity_uriK). " +
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
        "SELECT ?source_fma ?sink_fma ?med_entity_uri ?solute_chebi ?protein " +
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
        "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri." +
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
        "?med_entity semsim:hasPhysicalDefinition " + uriFMA + "." +
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

var circleIDmyWelcomeWindowSPARQL = function (circleID, cellmlModel) {
    var query;
    if (circleID[1] == "" && circleID[2] == "") {
        query = "SELECT ?Protein ?Biological_meaning " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "}}";
    }
    else if (circleID[1] != "" && circleID[2] == "") { // (circleID[1] != "")
        query = "SELECT ?Protein ?Biological_meaning ?Biological_meaning2 " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "<" + circleID[1] + "> <http://purl.org/dc/terms/description> ?Biological_meaning2 . " +
            "}}"
    }
    else if (circleID[1] != "" && circleID[2] != "") { // (circleID[1] != "")
        query = "SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ?Biological_meaning3 " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + circleID[0] + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "<" + circleID[1] + "> <http://purl.org/dc/terms/description> ?Biological_meaning2 . " +
            "<" + circleID[2] + "> <http://purl.org/dc/terms/description> ?Biological_meaning3 . " +
            "}}"
    }
    return query;
};

var relatedMembraneSPARQL = function (fstCHEBI, sndCHEBI, membrane) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "SELECT ?Model_entity ?Model_entity2 " +
        "WHERE { GRAPH ?g { " +
        "?entity semsim:hasPhysicalDefinition <" + fstCHEBI + ">. " +
        "?source semsim:hasPhysicalEntityReference ?entity. " +
        "?process semsim:hasSourceParticipant ?source. " +
        "?property semsim:physicalPropertyOf ?process. " +
        "?Model_entity semsim:isComputationalComponentFor ?property." +
        "?process semsim:hasMediatorParticipant ?model_medparticipant." +
        "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity." +
        "?med_entity semsim:hasPhysicalDefinition <" + membrane + ">." +
        "?entity2 semsim:hasPhysicalDefinition <" + sndCHEBI + ">. " +
        "?source2 semsim:hasPhysicalEntityReference ?entity2. " +
        "?process2 semsim:hasSourceParticipant ?source2. " +
        "?property2 semsim:physicalPropertyOf ?process2. " +
        "?Model_entity2 semsim:isComputationalComponentFor ?property2." +
        "?process2 semsim:hasMediatorParticipant ?model_medparticipant2." +
        "?model_medparticipant2 semsim:hasPhysicalEntityReference ?med_entity2." +
        "?med_entity2 semsim:hasPhysicalDefinition <" + membrane + ">." +
        "}}";

    return query;
};

var relatedMembraneModelSPARQL = function (model_entity, model_entity2, model_entity3) {
    var query;
    if (model_entity2 == "" && model_entity3 == "") {
        console.log("relatedMembraneModel: model_entity");
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
            "SELECT ?source_fma ?sink_fma ?med_entity_uri ?solute_chebi ?solute_chebi2 ?solute_chebi3 " +
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
            "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri." +
            "}";
    }
    else if (model_entity3 == "") {
        console.log("relatedMembraneModel: ELSE model_entity and model_entity2");
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
            "SELECT ?source_fma ?sink_fma ?med_entity_uri ?solute_chebi ?source_fma2 ?sink_fma2 ?med_entity_uri2 ?solute_chebi2 ?solute_chebi3 " +
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
            "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri." +
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
            "?med_entity2 semsim:hasPhysicalDefinition ?med_entity_uri2." +
            "}";
    }
    else {
        console.log("relatedMembraneModel: ELSE model_entity and model_entity2 and model_entity3");
        query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
            "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
            "SELECT ?source_fma ?sink_fma ?med_entity_uri ?solute_chebi ?source_fma2 ?sink_fma2 ?med_entity_uri2 ?solute_chebi2 ?source_fma3 ?sink_fma3 ?med_entity_uri3 ?solute_chebi3 " +
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
            "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri." +
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
            "?med_entity2 semsim:hasPhysicalDefinition ?med_entity_uri2." +
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
            "?med_entity3 semsim:hasPhysicalDefinition ?med_entity_uri3." +
            "}";
    }

    return query;
};

var modalWindowToAddModelsSPARQL = function (located_in) {
    var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" +
        "SELECT ?modelEntity ?biological " +
        "WHERE { GRAPH ?g { " +
        "?entity semsim:hasPhysicalDefinition <" + located_in + ">." +
        "?mediator semsim:hasPhysicalEntityReference ?entity." +
        "?process semsim:hasMediatorParticipant ?mediator." +
        "?property semsim:physicalPropertyOf ?process." +
        "?modelEntity semsim:isComputationalComponentFor ?property." +
        "?modelEntity <http://purl.org/dc/terms/description> ?biological. " +
        "}}";

    return query;
};

var processCombinedMembrane = function (apicalMembrane, basolateralMembrane, capillaryMembrane, membrane, combinedMembrane) {

    var tempapical = [],
        tempBasolateral = [],
        tempCapillary = [],
        paracellularMembrane = [];

    // Extract apical fluxes
    for (var i in apicalMembrane) {
        tempapical.push({
            srctext: apicalMembrane[i].variable_text,
            srcfma: apicalMembrane[i].source_fma,
            snkfma: apicalMembrane[i].sink_fma
        });

        tempapical.push({
            srctext: apicalMembrane[i].variable_text2,
            srcfma: apicalMembrane[i].source_fma2,
            snkfma: apicalMembrane[i].sink_fma2
        });

        tempapical.push({
            srctext: apicalMembrane[i].variable_text3,
            srcfma: apicalMembrane[i].source_fma3,
            snkfma: apicalMembrane[i].sink_fma3
        });
    }

    // Extract basolateral fluxes
    for (var i in basolateralMembrane) {
        tempBasolateral.push({
            srctext: basolateralMembrane[i].variable_text,
            srcfma: basolateralMembrane[i].source_fma,
            snkfma: basolateralMembrane[i].sink_fma
        });

        tempBasolateral.push({
            srctext: basolateralMembrane[i].variable_text2,
            srcfma: basolateralMembrane[i].source_fma2,
            snkfma: basolateralMembrane[i].sink_fma2
        });

        tempBasolateral.push({
            srctext: basolateralMembrane[i].variable_text3,
            srcfma: basolateralMembrane[i].source_fma3,
            snkfma: basolateralMembrane[i].sink_fma3
        });
    }

    // Extract capillary fluxes
    for (var i in capillaryMembrane) {
        tempCapillary.push({
            srctext: capillaryMembrane[i].variable_text,
            srcfma: capillaryMembrane[i].source_fma,
            snkfma: capillaryMembrane[i].sink_fma
        });

        tempCapillary.push({
            srctext: capillaryMembrane[i].variable_text2,
            srcfma: capillaryMembrane[i].source_fma2,
            snkfma: capillaryMembrane[i].sink_fma2
        });

        tempCapillary.push({
            srctext: capillaryMembrane[i].variable_text3,
            srcfma: capillaryMembrane[i].source_fma3,
            snkfma: capillaryMembrane[i].sink_fma3
        });
    }

    // remove apical fluxes from membrane array
    for (var i in tempapical) {
        for (var j in membrane) {
            if (tempapical[i].srctext == membrane[j].variable_text &&
                tempapical[i].srcfma == membrane[j].source_fma &&
                tempapical[i].snkfma == membrane[j].sink_fma) {

                membrane.splice(j, 1);
            }
        }
    }

    // remove basolateral fluxes from membrane array
    for (var i in tempBasolateral) {
        for (var j in membrane) {
            if (tempBasolateral[i].srctext == membrane[j].variable_text &&
                tempBasolateral[i].srcfma == membrane[j].source_fma &&
                tempBasolateral[i].snkfma == membrane[j].sink_fma) {

                membrane.splice(j, 1);
            }
        }
    }

    // remove capillary fluxes from membrane array
    for (var i in tempCapillary) {
        for (var j in membrane) {
            if (tempCapillary[i].srctext == membrane[j].variable_text &&
                tempCapillary[i].srcfma == membrane[j].source_fma &&
                tempCapillary[i].snkfma == membrane[j].sink_fma) {

                membrane.splice(j, 1);
            }
        }
    }

    // abp - apical, basolateral and paracellular membrane
    var abpmembraneObject = function (abpmembrane, type, membrane) {
        abpmembrane.push(
            {
                solute_chebi: membrane.solute_chebi,
                solute_text: membrane.solute_text,
                variable_text: membrane.variable_text,
                source_fma: membrane.source_fma,
                sink_fma: membrane.sink_fma,
                solute_chebi2: type,
                solute_text2: type,
                variable_text2: type,
                source_fma2: type,
                sink_fma2: type,
                solute_chebi3: type,
                solute_text3: type,
                variable_text3: type,
                source_fma3: type,
                sink_fma3: type,
                model_entity: membrane.model_entity,
                model_entity2: "",
                model_entity3: "",
                med_fma: membrane.med_fma,
                med_pr: membrane.med_pr,
                med_pr_text: membrane.med_pr_text,
                med_pr_text_syn: membrane.med_pr_text_syn,
                protein_name: membrane.protein_name
            });

        membrane.solute_chebi2 = type;
        membrane.solute_text2 = type;
        membrane.variable_text2 = type;
        membrane.source_fma2 = type;
        membrane.sink_fma2 = type;
        membrane.solute_chebi3 = type;
        membrane.solute_text3 = type;
        membrane.variable_text3 = type;
        membrane.source_fma3 = type;
        membrane.sink_fma3 = type;
    }

    // Nachannel, Clchannel, Kchannel
    for (var i in membrane) {
        if (membrane[i].med_fma == apicalID && (membrane[i].med_pr == Nachannel ||
            membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel ||
            membrane[i].med_pr == naENaC || membrane[i].med_pr == clChannel || membrane[i].med_pr == kChannel)) {
            abpmembraneObject(apicalMembrane, "channel", membrane[i]);
        }

        if (membrane[i].med_fma == basolateralID && (membrane[i].med_pr == Nachannel ||
            membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel ||
            membrane[i].med_pr == naENaC || membrane[i].med_pr == clChannel || membrane[i].med_pr == kChannel)) {
            abpmembraneObject(basolateralMembrane, "channel", membrane[i]);
        }

        if (membrane[i].med_fma == capillaryID && (membrane[i].med_pr == Nachannel ||
            membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel ||
            membrane[i].med_pr == naENaC || membrane[i].med_pr == clChannel || membrane[i].med_pr == kChannel)) {
            abpmembraneObject(capillaryMembrane, "channel", membrane[i]);
        }

        if (membrane[i].source_fma == luminalID && membrane[i].sink_fma == interstitialID) {
            abpmembraneObject(paracellularMembrane, "diffusiveflux", membrane[i]);
        }
    }

    // flux
    var apicalbasoMembraneObj;
    for (var i in membrane) {
        if (membrane[i].variable_text2 != "channel" && membrane[i].variable_text2 != "diffusiveflux") {

            if (membrane[i].med_fma == apicalID)
                apicalbasoMembraneObj = apicalMembrane;
            else if (membrane[i].med_fma == basolateralID)
                apicalbasoMembraneObj = basolateralMembrane;
            else if (membrane[i].med_fma == capillaryID)
                apicalbasoMembraneObj = capillaryMembrane;

            apicalbasoMembraneObj.push({
                solute_chebi: membrane[i].solute_chebi,
                solute_text: membrane[i].solute_text,
                variable_text: membrane[i].variable_text,
                source_fma: membrane[i].source_fma,
                sink_fma: membrane[i].sink_fma,
                solute_chebi2: "",
                solute_text2: "",
                variable_text2: "flux",
                source_fma2: "",
                sink_fma2: "",
                solute_chebi3: "",
                solute_text3: "",
                variable_text3: "flux",
                source_fma3: "",
                sink_fma3: "",
                model_entity: membrane[i].model_entity,
                model_entity2: "",
                model_entity3: "",
                med_fma: membrane[i].med_fma,
                med_pr: membrane[i].med_pr,
                med_pr_text: membrane[i].med_pr_text,
                med_pr_text_syn: membrane[i].med_pr_text_syn,
                protein_name: membrane[i].protein_name
            });
        }
    }

    for (var i in apicalMembrane)
        combinedMembrane.push(apicalMembrane[i]);
    for (var i in basolateralMembrane)
        combinedMembrane.push(basolateralMembrane[i]);
    for (var i in capillaryMembrane)
        combinedMembrane.push(capillaryMembrane[i]);
    for (var i in paracellularMembrane)
        combinedMembrane.push(paracellularMembrane[i]);

    return combinedMembrane;
};