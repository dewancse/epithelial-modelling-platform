###Epithelial Modelling Platform (EPM)
This application allows users to discover computational models for investigating their experimental or clinical hypotheses. Specifically, this can aid biologists and clinicians to test their clinical or experimental hypotheses for a given collection of disparate mechanisms and/or observations such as diseases, drug actions and clinical observations.

###EPM workflow

####Discover CellML Models
In this step user will search models of interest. Presented below screenshot is an example of discovered models from the annotated information in the Physiome Model Repository (PMR) for a search term “flux of sodium”. From this, user can investigate various options such as CellML model entity which consists of name of the model, component name and variable name; biological annotation deposited in PMR; protein name; and species and genes used during the experiments. Two options have been provided here: "view" option to explore more information for a specific model and “Add to Model” option to include a list of models to be considered for next round. However, user can come back and rediscover more models in this “Discover models” page.

####Input requirements
We have maintained a static dictionary as name and value pairs to map searched text with URIs, without applying Natural Language Processing technique. This would be integrated later to enable this process dynamic.

Therefore, mapping follows exact match and it is case insenstitive. Users have to include the following terms when searching for a model:

| Physical entity | Physical process | Solutes |
| --- | --- | --- |
| `git status` | `git status` | sodium, hydrogen, chloride, potassium |

<center><img src=src/img/modeldiscovery-main.png /></center>

####Load Discovered Models
After discovering a range of models, user will select some models and store these into a separate list, as presented below in the screenshoot. We have provided here various options: “view” option to get more information of a seleted model, “delete” option to delete model(s) if user is not happy with that list, “visualisation” option to get a comparison between models, and finally “Epithelial Platform” option to visualize the selected models as SVG in the epithelial platform.

<center><img src=src/img/loadmodel-main.png /></center>

####Models of Similarity
Using this feature, user can easily find similar component between models. From the screenshot below, user can see that weinstein and mackenzie models have common compartment.

<center><img src=src/img/modelsimilarity-main.png /></center>

####Modelling Platform
This platform has been generated from the discovered models in the “Load Models” page. Following screenshoot illustrates semantically generated models’ component as circles, polygons and line with arrows. It has two memebranes – apical and basolateral, and four compartments – luminal, cytosol, ineterstitial fluid, and paracellular pathway. Each of this has been depicted with a unique color on the top right corner.

Concentrations will be floating around on a specific compartment and the fluxes will be placed on a specific membrane based on the annotation in PMR. For example, Na+ and Cl- are flowing from luminal to cytosol compartment across apical membrane and NaCl cotransporter in the screenshot presented below. In order to make distinction, we have represented fluxes and cotransporters with circles, channels with polygons, and diffusive fluxes in the paracellular pathway with a text followed by an arrow. On the right side, we have generated checkboxes for each of these representations. User can drag and drop fluxes across membranes. For example, user can drag and drop the NaCl cotransporeter, shown in the screenshot, on the basolateral membrane in order to get some some useful suggestion,  discussed below in the Recommender System section.

<center><img src=src/img/epithelial-main.png /></center>

####Recommender System
This system will appear as a window when user will drag and drop a model across the apical or basolateral. Presented below is an example of “flux of sodium” in the weinstein model dragging from apical to basolateral membrane. Initially this system gives a brief description of the dragged model followed by some suggestions from the annotation in PMR. By using this system, user will get existing basolateral membranes with the sodium solute. Also, alternative models of this model from various workspaces, and related kidney models have been provided for further exploration. User can choose one of the models from this system as a repalcement of the dragged model and this change will be reflected in the SVG epithelial platform.

<center><img src=src/img/recommender-main.png /></center>

###Accessibility
The application is accessible by navigating::
```
  https://dewancse.github.io/epithelial-modelling-platform/src/index.html
```

###Quality control
We have testing in place to make sure the code is functioning as expected (TODOs). In addition, the code allows reproducibility and reuse of modules (TODOs). 

###Programming Language
- JavaScript
- SPARQL

###Limitations
Need to solve the TODOs under the Quality control section.

###List of contributors
- Dewan Sarwar
- Tommy Yu
- David Nickerson

###Licencing
MIT license!

###Acknowledgements
This project is supported by the MedTech Centre of Research Excellence (MedTech CoRE) and the Auckland Bioengineering Institute.