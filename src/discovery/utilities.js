/**
 * Created by dsar941 on 5/8/2017.
 */
// extract species, gene, and protein names
var parseModelName = function (modelEntity) {
    var indexOfHash = modelEntity.search("#");
    var modelName = modelEntity.slice(0, indexOfHash);

    return modelName;
}

// process table headers
var headTitle = function (jsonModel, jsonSpecies, jsonGene, jsonProtein) {
    var head = [];

    for (var i = 0; i < jsonModel.head.vars.length; i++)
        head.push(jsonModel.head.vars[i]);

    head.push(jsonSpecies.head.vars[0]);
    head.push(jsonGene.head.vars[0]);
    head.push(jsonProtein.head.vars[0]);

    return head;
}

// remove duplicate model entity and biological meaning
function uniqueify(es) {
    var retval = [];
    es.forEach(function (e) {
        for (var j = 0; j < retval.length; j++) {
            if (retval[j].Model_entity === e.Model_entity &&
                retval[j].Biological_meaning === e.Biological_meaning)

                return;
        }
        retval.push(e);
    });
    return retval;
}

exports.parseModelName = parseModelName;
exports.headTitle = headTitle;
exports.uniqueify = uniqueify;

