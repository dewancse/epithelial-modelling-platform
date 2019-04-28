import requests
import lxml.etree as ET
from libcellml import *
from miscellaneous import *
from SPARQLWrapper import SPARQLWrapper, JSON


def modelAssemblyService(model_recipe):
    # Instantiate a model
    m = Model()

    # model ID
    modelId = "epithelialModelID"
    m.setId(modelId)

    # model name
    modelName = "epithelialModel"
    m.setName(modelName)

    # print("Model: ", m, "\nModel Id: ", m.getId(), "\nModel Name: ", m.getName())

    # epithelial component which encapsulates other components
    epithelial = Component()
    epithelial.setName("epithelial")
    m.addComponent(epithelial)

    # iterate through model recipe to import components from source models
    for item in model_recipe:
        if item["model_entity"] != "":
            print("model_entity: ", item["model_entity"])
            processModelEntity(item["model_entity"], epithelial, m)
        if item['model_entity2'] != "":
            print("model_entity2: ", item["model_entity2"])
            processModelEntity(item["model_entity2"], epithelial, m)
        if item["model_entity3"] != "":
            print("model_entity3: ", item["model_entity3"])
            processModelEntity(item["model_entity3"], epithelial, m)

    # math dictionary to store ODE based equations for lumen, cytosol and interstitial fluid component
    math_dict = [
        {
            "lumen": {},
            "cytosol": {},
            "interstitialfluid": {}
        }
    ]

    # dictionary to store equations of total fluxes, channels and diffusive fluxes
    # for lumen, cytosol and interstitial fluid component
    math_dict_Total_Flux = [
        {
            "lumen": {},
            "cytosol": {},
            "interstitialfluid": {}
        }
    ]

    # add components from model recipe to this new model
    # @fma - to get concentration of solutes for fluxes in the model recipe
    # @source_fma2 - to identify channels and diffusive fluxes
    # @source_fma and @sink_fma - to get direction of fluxes, either plus or minus
    # @chebi_for_channel - to get name of solutes when calculating total channels and diffusive fluxes equations
    def addComponentFromModelRecipe(modelentity, fma, chebi, compartment, source_fma2, source_fma, sink_fma, epithelial,
                                    chebi_for_channel):
        # component and variable for fluxes
        component_variable_flux = modelentity[modelentity.find('#') + 1:len(modelentity)]
        name_of_component_flux = component_variable_flux[:component_variable_flux.find('.')]
        name_of_variable_flux = component_variable_flux[component_variable_flux.find('.') + 1:]

        # add this flux's component in the lumen/cytosol/interstitial fluid component
        # compartment.addComponent(m.getComponent(name_of_component_flux))
        if epithelial.getComponent(name_of_component_flux) == None:
            epithelial.addComponent(m.getComponent(name_of_component_flux))

        print("\n")
        print("MODELENTITY FLUX:", modelentity)

        # sparql
        query = concentrationSparql(fma, chebi)
        print("query: ", query)
        sparql = SPARQLWrapper(sparqlendpoint)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()

        # load this cellml model
        model_name_flux = modelentity[0:modelentity.find('#')]
        print("Model_Name_Flux: ", model_name_flux)

        # making http request to the source model
        r = requests.get(workspaceURL + model_name_flux)

        # parse the string representation of the model to access by libcellml
        p = Parser()
        importedModel = p.parseModel(r.text)

        # check a valid model
        if p.errorCount() > 0:
            for i in range(p.errorCount()):
                desc = p.getError(i).getDescription()
                cellmlNullNamespace = "Model element is in invalid namespace 'null'"
                cellml10Namespace = "Model element is in invalid namespace 'http://www.cellml.org/cellml/1.0#'"
                cellml11Namespace = "Model element is in invalid namespace 'http://www.cellml.org/cellml/1.1#'"

                if desc.find(cellmlNullNamespace) != -1:
                    print("Error in main.py: ", p.getError(i).getDescription())
                    exit()
                elif desc.find(cellml10Namespace) != -1 or desc.find(cellml11Namespace) != -1:
                    print("Msg in main.py: ", p.getError(i).getDescription())

                    # parsing cellml 1.0 or 1.1 to 2.0
                    dom = ET.fromstring(r.text.encode("utf-8"))
                    xslt = ET.parse("cellml1to2.xsl")
                    transform = ET.XSLT(xslt)
                    newdom = transform(dom)

                    mstr = ET.tostring(newdom, pretty_print=True)
                    mstr = mstr.decode("utf-8")

                    # parse the string representation of the model to access by libcellml
                    importedModel = p.parseModel(mstr)
                else:
                    print("Error in main.py: ", p.getError(i).getDescription())
                    exit()

        # iterate over the sparql's each result in the results
        for result in results["results"]["bindings"]:
            model_entity_cons = result["modelEntity"]["value"]
            model_name_cons = model_entity_cons[0:model_entity_cons.find('#')]

            print("MODELENTITY CONCENTRATION:", modelentity)
            print("MODELENTITY CONCENTRATION model_entity_cons:", model_entity_cons)

            # flags to keep track of flux and concentration in the same component
            flag = False
            if model_name_cons == model_name_flux:
                # component and variable for concentrations
                component_variable_cons = model_entity_cons[model_entity_cons.find('#') + 1:len(model_entity_cons)]
                name_of_component_cons = component_variable_cons[:component_variable_cons.find('.')]
                name_of_variable_cons = component_variable_cons[component_variable_cons.find('.') + 1:]

                print("component_variable_cons: ", component_variable_cons)
                print("name_of_component_cons: ", name_of_component_cons)
                print("name_of_variable_cons: ", name_of_variable_cons)

                # iteratively checking a flux variable
                c = importedModel.getComponent(name_of_component_flux)
                for i in range(c.variableCount()):
                    v_flux = c.getVariable(i)
                    # if flux variable exists then find its associated concentration variable
                    if v_flux.getName() == name_of_variable_flux:
                        break

                # iteratively checking a concentration variable
                c = importedModel.getComponent(name_of_component_cons)
                for i in range(c.variableCount()):
                    v_cons = c.getVariable(i)
                    if v_cons.getName() == name_of_variable_cons and model_name_cons == model_name_flux and v_cons.getInitialValue() != "":
                        # add units of concentration and flux variables
                        addUnitsModel(v_cons.getUnits(), importedModel, m)
                        addUnitsModel(v_flux.getUnits(), importedModel, m)

                        # concentration variable
                        if compartment.getVariable(v_cons.getName()) == None:
                            v_cons_compartment = Variable()
                            createComponent(v_cons_compartment, v_cons.getName(), v_cons.getUnits(), "public",
                                            v_cons.getInitialValue(), compartment, v_cons)

                        # flux variable
                        if compartment.getVariable(v_flux.getName()) == None:
                            v_flux_compartment = Variable()
                            createComponent(v_flux_compartment, v_flux.getName(), v_flux.getUnits(), "public",
                                            v_flux.getInitialValue(), compartment, v_flux)

                        # assign plus or minus sign in the ODE based equations
                        sign = odeSignNotation(compartment, source_fma, sink_fma)

                        # exclude ODE based equations for channels and diffusive fluxes
                        if source_fma2 != "channel" and source_fma2 != "diffusiveflux":
                            # insert ODE math equations of lumen, cytosol and interstitial fluid component
                            insertODEMathEquation(math_dict, compartment, v_cons, v_flux, sign)
                            # insert equations for total fluxes
                            insertMathsForTotalFluxes(compartment, math_dict_Total_Flux, dict_solutes, chebi, sign,
                                                      v_flux)

                        flag = True
                        break

                # if flux and concentration variables are found then exit from the loop to iterate next item from the recipe
                if flag == True:
                    break

        # ODE equations for channels and diffusive fluxes
        # Include all variables that are in the channels and diffusive fluxes equations
        if source_fma2 == "channel" or source_fma2 == "diffusiveflux":
            c = importedModel.getComponent(name_of_component_flux)
            getChannelsEquation(c.getMath().splitlines(), name_of_variable_flux, compartment, importedModel, m,
                                epithelial)
            # assign plus or minus sign in the equations
            sign = odeSignNotation(compartment, source_fma, sink_fma)
            # insert equations for total channels and diffusive fluxes
            insertMathsForTotalChannels(compartment, math_dict_Total_Flux, dict_solutes, chebi_for_channel, sign,
                                        name_of_variable_flux)

    # environment component
    environment = Component()
    environment.setName("environment")
    v_e = Variable()
    createComponent(v_e, "time", "second", "public", None, environment, None)
    epithelial.addComponent(environment)

    # lumen component
    lumen = Component()
    lumen.setName("lumen")

    # cytosol component
    cytosol = Component()
    cytosol.setName("cytosol")

    # interstitial fluid component
    interstitialfluid = Component()
    interstitialfluid.setName("interstitialfluid")

    # iterate over model recipe to build up lumen component
    for item in model_recipe:
        if item["source_fma"] == lumen_fma:
            addComponentFromModelRecipe(item["model_entity"], item["source_fma"], item["solute_chebi"], lumen,
                                        item["source_fma2"],
                                        item["source_fma"], item["sink_fma"], epithelial, item["solute_chebi"])
        if item["sink_fma"] == lumen_fma:
            addComponentFromModelRecipe(item["model_entity"], item["sink_fma"], item["solute_chebi"], lumen,
                                        item["source_fma2"],
                                        item["source_fma"], item["sink_fma"], epithelial, item["solute_chebi"])
        if item["source_fma2"] != "" and item["source_fma2"] == lumen_fma:
            addComponentFromModelRecipe(item["model_entity2"], item["source_fma2"], item["solute_chebi2"], lumen,
                                        item["source_fma2"], item["source_fma2"], item["sink_fma2"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma2"] != "" and item["sink_fma2"] == lumen_fma:
            addComponentFromModelRecipe(item["model_entity2"], item["sink_fma2"], item["solute_chebi2"], lumen,
                                        item["source_fma2"], item["source_fma2"], item["sink_fma2"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma3"] != "" and item["source_fma3"] == lumen_fma:
            addComponentFromModelRecipe(item["model_entity3"], item["source_fma3"], item["solute_chebi3"], lumen,
                                        item["source_fma2"], item["source_fma3"], item["sink_fma3"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma3"] != "" and item["sink_fma3"] == lumen_fma:
            addComponentFromModelRecipe(item["model_entity3"], item["sink_fma3"], item["solute_chebi3"], lumen,
                                        item["source_fma2"], item["source_fma3"], item["sink_fma3"], epithelial,
                                        item["solute_chebi"])

    # iterate over model recipe to build up cytosol component
    for item in model_recipe:
        if item["source_fma"] == cytosol_fma:
            addComponentFromModelRecipe(item["model_entity"], item["source_fma"], item["solute_chebi"], cytosol,
                                        item["source_fma2"], item["source_fma"], item["sink_fma"], epithelial,
                                        item["solute_chebi"])
        if item["sink_fma"] == cytosol_fma:
            addComponentFromModelRecipe(item["model_entity"], item["sink_fma"], item["solute_chebi"], cytosol,
                                        item["source_fma2"],
                                        item["source_fma"], item["sink_fma"], epithelial, item["solute_chebi"])
        if item["source_fma2"] != "" and item['source_fma2'] == cytosol_fma:
            addComponentFromModelRecipe(item["model_entity2"], item["source_fma2"], item["solute_chebi2"], cytosol,
                                        item["source_fma2"], item["source_fma2"], item["sink_fma2"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma2"] != "" and item['sink_fma2'] == cytosol_fma:
            addComponentFromModelRecipe(item["model_entity2"], item["sink_fma2"], item["solute_chebi2"], cytosol,
                                        item["source_fma2"], item["source_fma2"], item["sink_fma2"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma3"] != "" and item["source_fma3"] == cytosol_fma:
            addComponentFromModelRecipe(item["model_entity3"], item["source_fma3"], item["solute_chebi3"], cytosol,
                                        item["source_fma2"], item["source_fma3"], item["sink_fma3"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma3"] != "" and item["sink_fma3"] == cytosol_fma:
            addComponentFromModelRecipe(item["model_entity3"], item["sink_fma3"], item["solute_chebi3"], cytosol,
                                        item["source_fma2"], item["source_fma3"], item["sink_fma3"], epithelial,
                                        item["solute_chebi"])

    # iterate over model recipe to build up interstitial fluid component
    for item in model_recipe:
        if item["source_fma"] == interstitialfluid_fma:
            addComponentFromModelRecipe(item["model_entity"], item["source_fma"], item["solute_chebi"],
                                        interstitialfluid,
                                        item["source_fma2"], item["source_fma"], item["sink_fma"], epithelial,
                                        item["solute_chebi"])
        if item["sink_fma"] == interstitialfluid_fma:
            addComponentFromModelRecipe(item["model_entity"], item["sink_fma"], item["solute_chebi"], interstitialfluid,
                                        item["source_fma2"], item["source_fma"], item["sink_fma"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma2"] != "" and item["source_fma2"] == interstitialfluid_fma:
            addComponentFromModelRecipe(item["model_entity2"], item["source_fma2"], item["solute_chebi2"],
                                        interstitialfluid,
                                        item["source_fma2"], item["source_fma2"], item["sink_fma2"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma2"] != "" and item["sink_fma2"] == interstitialfluid_fma:
            addComponentFromModelRecipe(item["model_entity2"], item["sink_fma2"], item["solute_chebi2"],
                                        interstitialfluid,
                                        item["source_fma2"], item["source_fma2"], item["sink_fma2"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma3"] != "" and item["source_fma3"] == interstitialfluid_fma:
            addComponentFromModelRecipe(item["model_entity3"], item["source_fma3"], item["solute_chebi3"],
                                        interstitialfluid,
                                        item["source_fma2"], item["source_fma3"], item["sink_fma3"], epithelial,
                                        item["solute_chebi"])
        if item["source_fma3"] != "" and item["sink_fma3"] == interstitialfluid_fma:
            addComponentFromModelRecipe(item["model_entity3"], item["sink_fma3"], item["solute_chebi3"],
                                        interstitialfluid,
                                        item["source_fma2"], item["source_fma3"], item["sink_fma3"], epithelial,
                                        item["solute_chebi"])

    # append ODE based equations in the lumen, cytosol and interstitial fluid component
    # ODE equations in the lumen component
    lumen_math = ""
    for key in math_dict[0]["lumen"].keys():
        lumen_math += fullMath(key, math_dict[0]["lumen"][key])
    lumen.appendMath(lumen_math)

    # ODE equations in the cytosol component
    cytosol_math = ""
    for key in math_dict[0]["cytosol"].keys():
        cytosol_math += fullMath(key, math_dict[0]["cytosol"][key])
    cytosol.appendMath(cytosol_math)

    # ODE equations in the interstitialfluid component
    interstitialfluid_math = ""
    for key in math_dict[0]["interstitialfluid"].keys():
        interstitialfluid_math += fullMath(key, math_dict[0]["interstitialfluid"][key])
    interstitialfluid.appendMath(interstitialfluid_math)

    # append equations for total fluxes, channels and diffusive fluxes
    # equations in the lumen component
    for key in math_dict_Total_Flux[0]["lumen"].keys():
        lumen.appendMath(fullMathTotalFlux(key, math_dict_Total_Flux[0]["lumen"][key]))

    # equations in the cytosol component
    for key in math_dict_Total_Flux[0]["cytosol"].keys():
        cytosol.appendMath(fullMathTotalFlux(key, math_dict_Total_Flux[0]["cytosol"][key]))

    # equations in the interstitial fluid component
    for key in math_dict_Total_Flux[0]["interstitialfluid"].keys():
        interstitialfluid.appendMath(fullMathTotalFlux(key, math_dict_Total_Flux[0]["interstitialfluid"][key]))

    # include time variable to lumen, cytosol, and interstitial fluid
    if "time" in lumen.getMath():
        v_lumen = Variable()
        createComponent(v_lumen, "time", "second", "public", None, lumen, None)

    if "time" in cytosol.getMath():
        v_cytosol = Variable()
        createComponent(v_cytosol, "time", "second", "public", None, cytosol, None)

    if "time" in interstitialfluid.getMath():
        v_interstitial = Variable()
        createComponent(v_interstitial, "time", "second", "public", None, interstitialfluid, None)

    # find name of solutes from the model recipe and define corresponding
    # variables in the lumen, cytosol and interstitial fluid component
    list_of_solutes = []
    for item in model_recipe:
        # remove + or - sign of the solutes, so str[0:len(str) - 1]
        if item["solute_text"] != "" and item["solute_text"] != "channel" and item["solute_text"] != "diffusiveflux":
            list_of_solutes.append(item["solute_text"][0:len(item["solute_text"]) - 1])
        if item["solute_text2"] != "" and item["solute_text2"] != "channel" and item["solute_text2"] != "diffusiveflux":
            list_of_solutes.append(item["solute_text2"][0:len(item["solute_text2"]) - 1])
        if item["solute_text3"] != "" and item["solute_text3"] != "channel" and item["solute_text3"] != "diffusiveflux":
            list_of_solutes.append(item["solute_text3"][0:len(item["solute_text3"]) - 1])

    # unique elements in the list_of_solutes
    list_of_solutes = list(set(list_of_solutes))

    # insert list_of_solutes variables in the lumen component
    for item in list_of_solutes:
        if "J_" + item + "_" + lumen.getName() in lumen.getMath():
            v = Variable()
            createComponent(v, "J_" + item + "_" + lumen.getName(), "flux", "public", None, lumen, None)

    # insert list_of_solutes variables in the cytosol component
    for item in list_of_solutes:
        if "J_" + item + "_" + cytosol.getName() in cytosol.getMath():
            v = Variable()
            createComponent(v, "J_" + item + "_" + cytosol.getName(), "flux", "public", None, cytosol, None)

    # insert list_of_solutes variables in the interstitial fluid component
    for item in list_of_solutes:
        if "J_" + item + "_" + interstitialfluid.getName() in interstitialfluid.getMath():
            v = Variable()
            createComponent(v, "J_" + item + "_" + interstitialfluid.getName(), "flux", "public", None,
                            interstitialfluid,
                            None)

    # add lumen, cytosol, interstitial fluid, and imported components to epithelial component
    for i in range(m.componentCount()):
        c = m.getComponent(i)
        if c.getName() != "epithelial":
            if epithelial.getComponent(c.getName()) == None:
                epithelial.addComponent(c)

    epithelial.addComponent(lumen)
    epithelial.addComponent(cytosol)
    epithelial.addComponent(interstitialfluid)

    # remove concentration of solutes variable from the epithelial component which are
    # in the lumen/cytosol/interstitial fluid component with initial value.
    # Initially, make a list of epithelial component's variables
    epithelial_var_list = []
    for i in range(epithelial.variableCount()):
        v = epithelial.getVariable(i)
        epithelial_var_list.append(v.getName())

    # Iterate over lumen, cytosol and interstitial fluid component
    # for example, remove C_c_Na from ['C_c_Na', 'RT', 'psi_c', 'P_mc_Na', 'F', 'psi_m']
    for i in range(epithelial.componentCount()):
        compName = epithelial.getComponent(i)
        if compName.getName() == "lumen" or compName.getName() == "cytosol" or compName.getName() == "interstitialfluid":
            for j in range(compName.variableCount()):
                varName = compName.getVariable(j)
                if varName.getName() in epithelial_var_list and varName.getInitialValue() != "":
                    epithelial.removeVariable(varName.getName())

    # remove multiple instances of MathML tag in the lumen, cytosol and interstitial fluid component
    for i in range(epithelial.componentCount()):
        c = epithelial.getComponent(i)
        str_math = c.getMath().splitlines()
        str_math_2 = ""
        for j in range(len(str_math)):
            if "<math xmlns=\"http://www.w3.org/1998/Math/MathML\">" in str_math[j] or "</math>" in str_math[j]:
                if j != 0 and j != len(str_math) - 1:
                    continue
            str_math_2 += str_math[j]
        c.setMath(str_math_2)

    # Mapping connection between epithelial and its encapsulated components
    for i in range(epithelial.componentCount()):
        c = epithelial.getComponent(i)
        for j in range(epithelial.variableCount()):
            v1 = epithelial.getVariable(j)
            for k in range(c.variableCount()):
                v2 = c.getVariable(k)
                if v1.getName() == v2.getName():
                    variable = Variable()
                    variable.addEquivalence(v1, v2)

    # Mapping connection between siblings of epithelial component
    for i in range(epithelial.componentCount()):
        if i == epithelial.componentCount() - 1:
            break
        c1 = epithelial.getComponent(i)
        for j in range(epithelial.componentCount()):
            if j + i == epithelial.componentCount():
                break
            c2 = epithelial.getComponent(j + i)
            if c1.getName() == c2.getName():
                continue
            for k in range(c1.variableCount()):
                v_c1 = c1.getVariable(k)
                for l in range(c2.variableCount()):
                    v_c2 = c2.getVariable(l)
                    if v_c1.getName() == v_c2.getName():
                        # print(c1.getName(), c2.getName(), v_c1.getName(), v_c2.getName())
                        variable = Variable()
                        variable.addEquivalence(v_c1, v_c2)

    # serialize and print this new model
    printer = Printer()
    model = printer.printModel(m)

    print("\nModel:", model)

    # write this new model in a file
    f = open("model.xml", "w")
    f.write(model)
