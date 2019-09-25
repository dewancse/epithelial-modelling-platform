import requests
from libcellml import *
import lxml.etree as ET

# pre-generated model recipe in JSON format
model_recipe = [
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
        "med_pr": "http://purl.obolibrary.org/obo/PR_P26433",
        "med_pr_text": "sodium/hydrogen exchanger 3 (rat)",
        "med_pr_text_syn": "NHE3",
        "model_entity": "weinstein_1995.cellml#NHE3.J_NHE3_Na",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/PR_P26433",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma2": "",
        "sink_fma3": "",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29101",
        "solute_chebi2": "",
        "solute_chebi3": "",
        "solute_text": "Na+",
        "solute_text2": "",
        "solute_text3": "",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "",
        "source_fma3": "",
        "variable_text": "J_NHE3_Na",
        "variable_text2": "flux",
        "variable_text3": "flux"
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84669",
        "med_pr": "http://purl.obolibrary.org/obo/PR_Q9ET37",
        "med_pr_text": "low affinity sodium-glucose cotransporter (mouse)",
        "med_pr_text_syn": "Q9ET37",
        "model_entity": "mackenzie_1996-mouse-baso.cellml#NBC_current.J_Na",
        "model_entity2": "mackenzie_1996-mouse-baso.cellml#NBC_current.J_Na",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/PR_Q9ET37",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_9673",
        "sink_fma2": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma3": "",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29101",
        "solute_chebi2": "http://purl.obolibrary.org/obo/CHEBI_29101",
        "solute_chebi3": "",
        "solute_text": "Na+",
        "solute_text2": "Na+",
        "solute_text3": "",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "source_fma2": "http://purl.obolibrary.org/obo/FMA_9673",
        "source_fma3": "",
        "variable_text": "J_Na",
        "variable_text2": "J_Na",
        "variable_text3": ""
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
        "med_pr": "http://purl.obolibrary.org/obo/PR_P55018",
        "med_pr_text": "solute carrier family 12 member 3 (rat)",
        "med_pr_text_syn": "TSC",
        "model_entity": "chang_fujita_b_1999.cellml#total_transepithelial_sodium_flux.J_mc_Na",
        "model_entity2": "chang_fujita_b_1999.cellml#solute_concentrations.J_mc_Cl",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma2": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma3": "",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29101",
        "solute_chebi2": "http://purl.obolibrary.org/obo/CHEBI_17996",
        "solute_chebi3": "",
        "solute_text": "Na+",
        "solute_text2": "Cl-",
        "solute_text3": "",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma3": "",
        "variable_text": "J_mc_Na",
        "variable_text2": "J_mc_Cl",
        "variable_text3": ""
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
        "med_pr": "http://purl.obolibrary.org/obo/PR_Q63633",
        "med_pr_text": "solute carrier family 12 member 5 (rat)",
        "med_pr_text_syn": "Q63633",
        "model_entity": "chang_fujita_b_1999.cellml#solute_concentrations.J_mc_Cl",
        "model_entity2": "chang_fujita_b_1999.cellml#total_transepithelial_potassium_flux.J_mc_K",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma2": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma3": "",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_17996",
        "solute_chebi2": "http://purl.obolibrary.org/obo/CHEBI_29103",
        "solute_chebi3": "",
        "solute_text": "Cl-",
        "solute_text2": "K+",
        "solute_text3": "",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma3": "",
        "variable_text": "J_mc_Cl",
        "variable_text2": "J_mc_K",
        "variable_text3": ""
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
        "med_pr": "http://purl.obolibrary.org/obo/PR_P37089",
        "med_pr_text": "amiloride-sensitive sodium channel subunit alpha (rat)",
        "med_pr_text_syn": "RENAC",
        "model_entity": "chang_fujita_b_1999.cellml#mc_sodium_flux.G_mc_Na",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma2": "channel",
        "sink_fma3": "channel",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29101",
        "solute_chebi2": "channel",
        "solute_chebi3": "channel",
        "solute_text": "Na+",
        "solute_text2": "channel",
        "solute_text3": "channel",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "channel",
        "source_fma3": "channel",
        "variable_text": "G_mc_Na",
        "variable_text2": "channel",
        "variable_text3": "channel"
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
        "med_pr": "http://purl.obolibrary.org/obo/PR_Q06393",
        "med_pr_text": "chloride channel protein ClC-Ka (rat)",
        "med_pr_text_syn": "CLCNK1",
        "model_entity": "chang_fujita_b_1999.cellml#mc_chloride_flux.G_mc_Cl",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma2": "channel",
        "sink_fma3": "channel",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_17996",
        "solute_chebi2": "channel",
        "solute_chebi3": "channel",
        "solute_text": "Cl-",
        "solute_text2": "channel",
        "solute_text3": "channel",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "channel",
        "source_fma3": "channel",
        "variable_text": "G_mc_Cl",
        "variable_text2": "channel",
        "variable_text3": "channel"
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
        "med_pr": "http://purl.obolibrary.org/obo/PR_P15387",
        "med_pr_text": "potassium voltage-gated channel subfamily B member 1 (rat)",
        "med_pr_text_syn": "P15387",
        "model_entity": "chang_fujita_b_1999.cellml#mc_potassium_flux.G_mc_K",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma2": "channel",
        "sink_fma3": "channel",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29103",
        "solute_chebi2": "channel",
        "solute_chebi3": "channel",
        "solute_text": "K+",
        "solute_text2": "channel",
        "solute_text3": "channel",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "channel",
        "source_fma3": "channel",
        "variable_text": "G_mc_K",
        "variable_text2": "channel",
        "variable_text3": "channel"
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84669",
        "med_pr": "http://purl.obolibrary.org/obo/PR_P06685",
        "med_pr_text": "sodium/potassium-transporting ATPase subunit alpha-1 (rat)",
        "med_pr_text_syn": "P06685",
        "model_entity": "chang_fujita_b_1999.cellml#solute_concentrations.J_sc_Na",
        "model_entity2": "chang_fujita_b_1999.cellml#sc_potassium_flux.J_sc_K",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_9673",
        "sink_fma2": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma3": "",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29101",
        "solute_chebi2": "http://purl.obolibrary.org/obo/CHEBI_29103",
        "solute_chebi3": "",
        "solute_text": "Na+",
        "solute_text2": "K+",
        "solute_text3": "",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "source_fma2": "http://purl.obolibrary.org/obo/FMA_9673",
        "source_fma3": "",
        "variable_text": "J_sc_Na",
        "variable_text2": "J_sc_K",
        "variable_text3": ""
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84669",
        "med_pr": "http://purl.obolibrary.org/obo/PR_Q06393",
        "med_pr_text": "chloride channel protein ClC-Ka (rat)",
        "med_pr_text_syn": "CLCNK1",
        "model_entity": "chang_fujita_b_1999.cellml#sc_chloride_flux.G_sc_Cl",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma2": "channel",
        "sink_fma3": "channel",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_17996",
        "solute_chebi2": "channel",
        "solute_chebi3": "channel",
        "solute_text": "Cl-",
        "solute_text2": "channel",
        "solute_text3": "channel",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_9673",
        "source_fma2": "channel",
        "source_fma3": "channel",
        "variable_text": "G_sc_Cl",
        "variable_text2": "channel",
        "variable_text3": "channel"
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_84669",
        "med_pr": "http://purl.obolibrary.org/obo/PR_P15387",
        "med_pr_text": "potassium voltage-gated channel subfamily B member 1 (rat)",
        "med_pr_text_syn": "P15387",
        "model_entity": "chang_fujita_b_1999.cellml#sc_potassium_flux.G_sc_K",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        "sink_fma2": "channel",
        "sink_fma3": "channel",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29103",
        "solute_chebi2": "channel",
        "solute_chebi3": "channel",
        "solute_text": "K+",
        "solute_text2": "channel",
        "solute_text3": "channel",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_9673",
        "source_fma2": "channel",
        "source_fma3": "channel",
        "variable_text": "G_sc_K",
        "variable_text2": "channel",
        "variable_text3": "channel"
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_67394",
        "med_pr": "http://purl.obolibrary.org/obo/PR_Q9Z0S6",
        "med_pr_text": "claudin-10 (mouse)",
        "med_pr_text_syn": "CLDN10A",
        "model_entity": "chang_fujita_b_1999.cellml#ms_sodium_flux.G_ms_Na",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_9673",
        "sink_fma2": "diffusiveflux",
        "sink_fma3": "diffusiveflux",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29101",
        "solute_chebi2": "diffusiveflux",
        "solute_chebi3": "diffusiveflux",
        "solute_text": "Na+",
        "solute_text2": "diffusiveflux",
        "solute_text3": "diffusiveflux",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "diffusiveflux",
        "source_fma3": "diffusiveflux",
        "variable_text": "G_ms_Na",
        "variable_text2": "diffusiveflux",
        "variable_text3": "diffusiveflux"
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_67394",
        "med_pr": "http://purl.obolibrary.org/obo/PR_O35054",
        "med_pr_text": "claudin-4 (mouse)",
        "med_pr_text_syn": "CPETR1",
        "model_entity": "chang_fujita_b_1999.cellml#ms_chloride_flux.G_ms_Cl",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_9673",
        "sink_fma2": "diffusiveflux",
        "sink_fma3": "diffusiveflux",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_17996",
        "solute_chebi2": "diffusiveflux",
        "solute_chebi3": "diffusiveflux",
        "solute_text": "Cl-",
        "solute_text2": "diffusiveflux",
        "solute_text3": "diffusiveflux",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "diffusiveflux",
        "source_fma3": "diffusiveflux",
        "variable_text": "G_ms_Cl",
        "variable_text2": "diffusiveflux",
        "variable_text3": "diffusiveflux"
    },
    {
        "med_fma": "http://purl.obolibrary.org/obo/FMA_67394",
        "med_pr": "http://purl.obolibrary.org/obo/PR_F1LZ52",
        "med_pr_text": "kelch-like protein 3 (rat)",
        "med_pr_text_syn": "F1LZ52",
        "model_entity": "chang_fujita_b_1999.cellml#ms_potassium_flux.G_ms_K",
        "model_entity2": "",
        "model_entity3": "",
        "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        "sink_fma": "http://purl.obolibrary.org/obo/FMA_9673",
        "sink_fma2": "diffusiveflux",
        "sink_fma3": "diffusiveflux",
        "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29103",
        "solute_chebi2": "diffusiveflux",
        "solute_chebi3": "diffusiveflux",
        "solute_text": "K+",
        "solute_text2": "diffusiveflux",
        "solute_text3": "diffusiveflux",
        "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        "source_fma2": "diffusiveflux",
        "source_fma3": "diffusiveflux",
        "variable_text": "G_ms_K",
        "variable_text2": "diffusiveflux",
        "variable_text3": "diffusiveflux"
    }
]

# sparql endpoint in PMR
sparqlendpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search"

# workspace url where we have all models
workspaceURL = "https://models.physiomeproject.org/workspace/267/rawfile/HEAD/"

# reference URIs of anatomical locations
lumen_fma = "http://purl.obolibrary.org/obo/FMA_74550"
cytosol_fma = "http://purl.obolibrary.org/obo/FMA_66836"
interstitialfluid_fma = "http://purl.obolibrary.org/obo/FMA_9673"

# solutes dictionary to map URI to name
dict_solutes = [
    {
        "http://purl.obolibrary.org/obo/CHEBI_29101": "Na",
        "http://purl.obolibrary.org/obo/CHEBI_17996": "Cl",
        "http://purl.obolibrary.org/obo/CHEBI_29103": "K"
    }
]


# get channels and diffusive fluxes equations from source model
def getChannelsEquation(str_channel, v, compartment, importedModel, m, epithelial):
    # string index of "id=" and "</math>" inside MathML
    str_index = []
    # save here required variables to make channels and diffusive fluxes equations
    # e.g. ['C_c_Na', 'RT', 'psi_c', 'P_mc_Na', 'F', 'psi_m']
    list_of_variables = []
    # remove C_c_Na from here ['C_c_Na', 'RT', 'psi_c', 'P_mc_Na', 'F', 'psi_m'] and save in this variable
    list_of_variables_2 = []
    for i in range(len(str_channel)):
        if "id=" in str_channel[i]:
            str_index.append(i)  # insert variables equation
        elif "</math>" in str_channel[i]:
            str_index.append(i)  # insert math index to note end of math

    # print(str_index)
    for i in range(len(str_index)):
        flag = False
        if i + 1 == len(str_index):
            break
        else:
            my_str = str_channel[str_index[i]:str_index[i + 1] - 1]
            for i in range(len(my_str)):
                if "<eq/>" in my_str[i] and "<ci>" + v + "</ci>" in my_str[i + 1]:
                    channel_str = ""
                    for s in my_str:
                        channel_str += s
                    channel_str = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\">\n" + channel_str + "</apply>\n</math>\n"
                    # check that whether this channel already exists in this component
                    # we are doing this because G_mc_Na, etc comes twice in the epithelial component!
                    mth = compartment.math()
                    if channel_str not in mth:
                        compartment.appendMath(channel_str)
                    # extract variables from this math string
                    for i in range(len(my_str)):
                        if "<ci>" in my_str[i]:
                            start_index = my_str[i].find("<ci>")
                            end_index = my_str[i].find("</ci>")
                            if my_str[i][start_index + 4:end_index] != v:
                                list_of_variables.append(my_str[i][start_index + 4:end_index])
                    flag = True
                    break
        if flag == True:
            break

    # remove variables if already exists in the component
    for i in range(compartment.variableCount()):
        var = compartment.variable(i)
        # we will remove C_c_Na from the list below after constructing lumen, cytosol and interstitial fluid component
        # e.g. ['C_c_Na', 'RT', 'psi_c', 'P_mc_Na', 'F', 'psi_m']
        if var.name() in list_of_variables:
            list_of_variables.remove(var.name())

    # unique elements in the list
    list_of_variables = list(set(list_of_variables))

    # save all components including a parent component into a mycomponent variable
    # for now, we have considered 3 encapsulation stages: grandparent -> parent -> children
    mycomponent = Component()
    for i in range(importedModel.componentCount()):
        c = importedModel.component(i)
        mycomponent.addComponent(c)
        for j in range(c.componentCount()):
            c2 = c.component(j)
            mycomponent.addComponent(c2)
            for k in range(c2.componentCount()):
                c3 = c2.component(k)
                mycomponent.addComponent(c3)

    for item in list_of_variables:
        # iterate over components
        for i in range(mycomponent.componentCount()):
            c = mycomponent.component(i)
            # variables within a component
            for j in range(c.variableCount()):
                v = c.variable(j)
                if v.name() == item and v.initialValue() != "":
                    # add units
                    addUnitsModel(v.units(), importedModel, m)

                    if epithelial.variable(v.name()) == None:
                        v_epithelial = Variable()
                        # insert this variable in the epithelial component
                        createComponent(v_epithelial, v.name(), v.units(), "public_and_private",
                                        v.initialValue(), epithelial, v)

                    if compartment.variable(v.name()) == None:
                        v_compartment = Variable()
                        # insert this variable in the lumen/cytosol/interstitial fluid component
                        createComponent(v_compartment, v.name(), v.units(), "public", None, compartment, v)


# user-defined function to append a substring of ODE based equations
def subMath(sign, vFlux):
    return "            <apply>\n" \
           "                <" + sign + "/>\n" + \
           "                <ci>" + vFlux + "</ci>\n" + \
           "            </apply>"


# user-defined function to define ODE based equations
def fullMath(vConcentration, subMath):
    return "<math xmlns=\"http://www.w3.org/1998/Math/MathML\">\n" \
           "    <apply id=" + '"' + vConcentration + "_diff_eq" + '"' + ">\n" + \
           "        <eq/>\n" \
           "        <apply>\n" \
           "            <diff/>\n" \
           "            <bvar>\n" \
           "                <ci>time</ci>\n" \
           "            </bvar>\n" \
           "            <ci>" + vConcentration + "</ci>\n" + \
           "        </apply>\n" \
           "        <apply>\n" \
           "            <plus/>\n" \
           "" + subMath + "\n" + \
           "        </apply>\n" \
           "    </apply>\n" \
           "</math>\n"


# insert ODE equations for lumen, cytosol and interstitial fluid component
def insertODEMathEquation(math_dict, compartment, v_cons, v_flux, sign):
    # ODE equations for lumen
    if compartment.name() == "lumen":
        if v_cons.name() not in math_dict[0]["lumen"].keys():
            math_dict[0]["lumen"][v_cons.name()] = subMath(sign, v_flux.name())
        else:
            math_dict[0]["lumen"][v_cons.name()] = \
                math_dict[0]["lumen"][v_cons.name()] + "\n" + subMath(sign, v_flux.name())
    # ODE equations for cytosol
    if compartment.name() == "cytosol":
        if v_cons.name() not in math_dict[0]["cytosol"].keys():
            math_dict[0]["cytosol"][v_cons.name()] = subMath(sign, v_flux.name())
        else:
            math_dict[0]["cytosol"][v_cons.name()] = \
                math_dict[0]["cytosol"][v_cons.name()] + "\n" + subMath(sign, v_flux.name())
    # ODE equations for interstitial fluid
    if compartment.name() == "interstitialfluid":
        if v_cons.name() not in math_dict[0]["interstitialfluid"].keys():
            math_dict[0]["interstitialfluid"][v_cons.name()] = subMath(sign, v_flux.name())
        else:
            math_dict[0]["interstitialfluid"][v_cons.name()] = \
                math_dict[0]["interstitialfluid"][v_cons.name()] + "\n" + subMath(sign, v_flux.name())


# math for total fluxes in the lumen, cytosol and interstitial fluid component
def fullMathTotalFlux(vTotalFlux, sMath):
    return "<math xmlns=\"http://www.w3.org/1998/Math/MathML\">\n" \
           "    <apply id=" + '"' + vTotalFlux + "_calculation" + '"' + ">\n" + \
           "        <eq/>\n" \
           "        <ci>" + vTotalFlux + "</ci>\n" + \
           "        <apply>\n" \
           "            <plus/>\n" \
           "" + sMath + "\n" + \
           "        </apply>\n" \
           "    </apply>\n" \
           "</math>\n"


# user-defined function to append a substring of total fluxes and channels equations
def subMathTotalFluxAndChannel(sign, vFlux):
    return "            <apply>\n" \
           "                <" + sign + "/>\n" + \
           "                <ci>" + vFlux + "</ci>\n" + \
           "            </apply>"


# insert equations for total fluxes
def insertMathsForTotalFluxes(compartment, math_dict_Total_Flux, dict_solutes, chebi, sign, v_flux):
    if compartment.name() == "lumen":
        lumen_flux = "J_" + dict_solutes[0][chebi] + "_lumen"
        if lumen_flux not in math_dict_Total_Flux[0]["lumen"].keys():
            math_dict_Total_Flux[0]["lumen"][lumen_flux] = subMathTotalFluxAndChannel(sign, v_flux.name())
        else:
            math_dict_Total_Flux[0]["lumen"][lumen_flux] = \
                math_dict_Total_Flux[0]["lumen"][lumen_flux] + "\n" + \
                subMathTotalFluxAndChannel(sign, v_flux.name())

    if compartment.name() == "cytosol":
        cytosol_flux = "J_" + dict_solutes[0][chebi] + "_cytosol"
        if cytosol_flux not in math_dict_Total_Flux[0]["cytosol"].keys():
            math_dict_Total_Flux[0]["cytosol"][cytosol_flux] = \
                subMathTotalFluxAndChannel(sign, v_flux.name())
        else:
            math_dict_Total_Flux[0]["cytosol"][cytosol_flux] = \
                math_dict_Total_Flux[0]["cytosol"][cytosol_flux] + "\n" + \
                subMathTotalFluxAndChannel(sign, v_flux.name())

    if compartment.name() == "interstitialfluid":
        interstitialfluid_flux = "J_" + dict_solutes[0][chebi] + "_interstitialfluid"
        if interstitialfluid_flux not in math_dict_Total_Flux[0]["interstitialfluid"].keys():
            math_dict_Total_Flux[0]["interstitialfluid"][interstitialfluid_flux] = \
                subMathTotalFluxAndChannel(sign, v_flux.name())
        else:
            math_dict_Total_Flux[0]["interstitialfluid"][interstitialfluid_flux] = \
                math_dict_Total_Flux[0]["interstitialfluid"][interstitialfluid_flux] + "\n" + \
                subMathTotalFluxAndChannel(sign, v_flux.name())


# insert equations for channels and diffusive fluxes
def insertMathsForTotalChannels(compartment, math_dict_Total_Flux, dict_solutes, chebi, sign, flux_name):
    if compartment.name() == "lumen":
        lumen_flux = "J_" + dict_solutes[0][chebi] + "_lumen"
        if lumen_flux not in math_dict_Total_Flux[0]["lumen"].keys():
            math_dict_Total_Flux[0]["lumen"][lumen_flux] = subMathTotalFluxAndChannel(sign, flux_name)
        else:
            math_dict_Total_Flux[0]["lumen"][lumen_flux] = \
                math_dict_Total_Flux[0]["lumen"][lumen_flux] + "\n" + subMathTotalFluxAndChannel(sign, flux_name)

    if compartment.name() == "cytosol":
        cytosol_flux = "J_" + dict_solutes[0][chebi] + "_cytosol"
        if cytosol_flux not in math_dict_Total_Flux[0]["cytosol"].keys():
            math_dict_Total_Flux[0]["cytosol"][cytosol_flux] = subMathTotalFluxAndChannel(sign, flux_name)
        else:
            math_dict_Total_Flux[0]["cytosol"][cytosol_flux] = \
                math_dict_Total_Flux[0]["cytosol"][cytosol_flux] + "\n" + subMathTotalFluxAndChannel(sign, flux_name)

    if compartment.name() == "interstitialfluid":
        interstitialfluid_flux = "J_" + dict_solutes[0][chebi] + "_interstitialfluid"
        if interstitialfluid_flux not in math_dict_Total_Flux[0]["interstitialfluid"].keys():
            math_dict_Total_Flux[0]["interstitialfluid"][interstitialfluid_flux] = \
                subMathTotalFluxAndChannel(sign, flux_name)
        else:
            math_dict_Total_Flux[0]["interstitialfluid"][interstitialfluid_flux] = \
                math_dict_Total_Flux[0]["interstitialfluid"][interstitialfluid_flux] + "\n" + \
                subMathTotalFluxAndChannel(sign, flux_name)


# assign plus or minus sign in the equations
def odeSignNotation(compartment, source_fma, sink_fma):
    # lumen
    if compartment.name() == "lumen":
        if source_fma == lumen_fma and sink_fma == cytosol_fma:
            sign = "minus"
        elif source_fma == lumen_fma and sink_fma == interstitialfluid_fma:
            sign = "minus"
        elif source_fma == cytosol_fma and sink_fma == lumen_fma:
            sign = "plus"
        elif source_fma == interstitialfluid_fma and sink_fma == lumen_fma:
            sign = "plus"

    # cytosol
    if compartment.name() == "cytosol":
        if source_fma == cytosol_fma and sink_fma == lumen_fma:
            sign = "minus"
        elif source_fma == cytosol_fma and sink_fma == interstitialfluid_fma:
            sign = "minus"
        elif source_fma == lumen_fma and sink_fma == cytosol_fma:
            sign = "plus"
        elif source_fma == interstitialfluid_fma and sink_fma == cytosol_fma:
            sign = "plus"

    # interstitial fluid
    if compartment.name() == "interstitialfluid":
        if source_fma == interstitialfluid_fma and sink_fma == cytosol_fma:
            sign = "minus"
        elif source_fma == interstitialfluid_fma and sink_fma == lumen_fma:
            sign = "minus"
        elif source_fma == cytosol_fma and sink_fma == interstitialfluid_fma:
            sign = "plus"
        elif source_fma == lumen_fma and sink_fma == interstitialfluid_fma:
            sign = "plus"

    return sign


# user-defined function to instantiate a time component and its variable attributes
# if v2 == None then variable comes from this component, e.g. environment.time
# else variable comes from other component, e.g. lumen.P_mc_Na where P_mc_Na comes from a source model
def createComponent(v, name, unit, interface, initialvalue, component, v2):
    v.setName(name)
    v.setUnits(unit)
    v.setInterfaceType(interface)

    if initialvalue != None:
        v.setInitialValue(initialvalue)

    if v2 == None:
        v.setId(component.name() + "." + v.name())
    else:
        v.setId(component.name() + "." + v2.name())

    component.addVariable(v)


# concentration sparql query to get a list of concentration of solutes (chebi) in the (fma) compartment
# fma and chebi are two input values to this function
def concentrationSparql(fma, chebi):
    return "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>" \
           "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" \
           "PREFIX dcterms: <http://purl.org/dc/terms/>" \
           "SELECT ?modelEntity " \
           "WHERE { " \
           "?modelEntity semsim:isComputationalComponentFor ?model_prop. " \
           "?model_prop semsim:hasPhysicalDefinition <http://identifiers.org/opb/OPB_00340>. " \
           "?model_prop semsim:physicalPropertyOf ?source_entity. " \
           "?source_entity ro:part_of ?source_part_of_entity. " \
           "?source_part_of_entity semsim:hasPhysicalDefinition <" + fma + ">. " + \
           "?source_entity semsim:hasPhysicalDefinition <" + chebi + ">. " + \
           "}"


# add required units from the imported models
def addUnitsModel(unit_name, importedModel, m):
    i = 0
    while importedModel.units(i) != None:
        u = importedModel.units(i)
        # u.getUnitAttributes(reference, prefix, exponent, multiplier, id))
        if u.name() == unit_name:
            # if this unit not exists, then add in the model
            if m.units(unit_name) == None:
                m.addUnits(u)
                break
        i += 1


# instantiate source url and create an imported component in the import section of the new model
def instantiateImportedComponent(sourceurl, component, epithelial, m):
    imp = ImportSource()
    imp.setUrl(sourceurl)

    importedComponent = Component()
    importedComponent.setName(component)
    importedComponent.setSourceComponent(imp, component)

    # m.addComponent(importedComponent)
    if m.component(importedComponent.name()) is None:
        m.addComponent(importedComponent)

    # if epithelial.component(importedComponent.name()) == None:
    #     epithelial.addComponent(importedComponent)
    # making http request to the source model
    r = requests.get(sourceurl)

    # parse the string representation of the model to access by libcellml
    p = Parser()
    impModel = p.parseModel(r.text)

    # check a valid model
    if p.errorCount() > 0:
        for i in range(p.errorCount()):
            desc = p.error(i).description()
            cellmlNullNamespace = "Model element is in invalid namespace 'null'"
            cellml10Namespace = "Model element is in invalid namespace 'http://www.cellml.org/cellml/1.0#'"
            cellml11Namespace = "Model element is in invalid namespace 'http://www.cellml.org/cellml/1.1#'"

            if desc.find(cellmlNullNamespace) != -1:
                print("Error in miscellaneous.py: ", p.error(i).description())
                exit()
            elif desc.find(cellml10Namespace) != -1 or desc.find(cellml11Namespace) != -1:
                print("Msg in miscellaneous.py: ", p.error(i).description())

                # parsing cellml 1.0 or 1.1 to 2.0
                dom = ET.fromstring(r.text.encode("utf-8"))
                xslt = ET.parse("cellml1to2.xsl")
                transform = ET.XSLT(xslt)
                newdom = transform(dom)

                mstr = ET.tostring(newdom, pretty_print=True)
                mstr = mstr.decode("utf-8")

                # parse the string representation of the model to access by libcellml
                impModel = p.parseModel(mstr)
            else:
                print("Error in miscellaneous.py: ", p.error(i).description())
                exit()

    impComponent = impModel.component(importedComponent.name())

    # in order to later define the connections we need, we must make sure all the variables from
    # the source model are present in the imported component, we only need the name so just grab
    # that from the source.
    for i in range(impComponent.variableCount()):
        impVariable = impComponent.variable(i)
        v = Variable()
        v.setName(impVariable.name())
        importedComponent.addVariable(v)


# process model entities and source models' urls
def processModelEntity(modelentity, epithelial, m):
    cellml_model_name = modelentity[0:modelentity.find('#')]
    component_variable = modelentity[modelentity.find('#') + 1:len(modelentity)]
    component = component_variable[:component_variable.find('.')]
    sourceurl = workspaceURL + cellml_model_name
    instantiateImportedComponent(sourceurl, component, epithelial, m)
