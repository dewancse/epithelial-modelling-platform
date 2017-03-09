/**
 * Created by dsar941 on 3/9/2017.
 */
var SparqlParser = require('../node_modules/sparqljs/sparql').Parser;
var parser = new SparqlParser();

var query = 'SELECT ?Model_entity ?Protein ?Species ?Gene ?Compartment ' +
    'WHERE {' +
    '?Model_entity <http://purl.org/dc/terms/Protein> ?Protein.' +
    '?Model_entity <http://purl.org/dc/terms/Species> ?Species.' +
    '?Model_entity <http://purl.org/dc/terms/Gene> ?Gene.' +
    '?Model_entity <http://purl.org/dc/terms/Compartment> ?Compartment.' +
    'FILTER (?Model_entity = "weinstein_1995").' +
    '}';

var parsedQuery = parser.parse(query);

console.log(parsedQuery["where"][0].triples);

// var SparqlParser = require('sparqljs').Parser;
// var parser = new SparqlParser();

var query2 = 'PREFIX dcterms: <http://purl.org/dc/terms/>' +
    'SELECT ?sub ?obj ?obj2 ' +
    'WHERE {' +
    '?sub dcterms:Species ?obj.' +
    '?sub dcterms:Gene ?obj2.' +
    '}';

var parsedQuery2 = parser.parse(query2);

console.log(parsedQuery2["where"][0].triples);

module.exports.parsedQuery = parsedQuery;
module.exports.parsedQuery2 = parsedQuery2;