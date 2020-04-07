/**
 *   A tesing checklist for the Epithelial Modelling Platform
 *   Source: https://github.com/dewancse/epithelial-modelling-platform/blob/master/TESTING.md
 *   Framework: cypress, jest, mocha
 *
 *   Dewan Sarwar - PhD Student and Research Assistant
 *   Auckland Bioengineeing Institute, University of Auckland
 *
 *   March 09, 2020
 * */
describe("#Test 1", () => {
    it("HOME PAGE of the Epithelial Modelling Platform presented below in Figure 1.", () => {

        cy.wait(1000);

        cy.visit("/");
        cy.get("#title").should("contain", "Epithelial Modelling Platform");
    });

    it("#Test 1.1 Click on the image icon to reload the Figure 1.", () => {

        cy.wait(1000);

        cy.get("#home").click();
        cy.url().should("contain", "#home");
    });

    it("#Test 1.2 Slideshow component cycles through images (Carousel), as shown in Figure 1.", () => {

        cy.wait(1000);

        cy.get("#list0").click();
        cy.get("#div0 > .img-responsive").should("be.visible");

        cy.wait(1000);

        cy.get("#list1").click();
        cy.get("#div1 > .img-responsive").should("be.visible");

        cy.wait(1000);

        cy.get("#list2").click();
        cy.get("#div2 > .img-responsive").should("be.visible");

        cy.wait(1000);

        cy.get("#list3").click();
        cy.get("#div3 > .img-responsive").should("be.visible");

        cy.wait(1000);

        cy.get("#list4").click();
        cy.get("#div4 > .img-responsive").should("be.visible");

        // TODO: alternative solution without clicking. Here we need to click the 'arrow' to initializing the slideshow
        // cy.get("#div0 > .img-responsive").should("be.visible");
        // cy.wait(2000);
        // cy.get("#div1 > .img-responsive").should("be.visible");
        // cy.wait(2000);
        // cy.get("#div2 > .img-responsive").should("be.visible");
        // cy.wait(2000);
        // cy.get("#div3 > .img-responsive").should("be.visible");
        // cy.wait(2000);
        // cy.get("#div4 > .img-responsive").should("be.visible");
    });

    it("#Test 1.3 READ MORE links in the body section navigate to the associated page for detailed description (see Figure 1).", () => {

        cy.wait(1000);

        cy.get("#sub-discover-cellml").click();
        cy.url().should("contain", "/");
        cy.get("#sub-model-overlap").click();
        cy.url().should("contain", "/");
        cy.get("#sub-platform").click();
        cy.url().should("contain", "/");
        cy.get("#sub-recommender").click();
        cy.url().should("contain", "/");
    });
});

describe("#Test 2", () => {
    it("Click MODEL DISCOVERY, shown in Figure 2, to navigate to the MODEL DISCOVERY page.", () => {

        cy.wait(2000);

        cy.visit("/");

        cy.wait(2000);

        cy.get("#listDiscovery").click();

        cy.wait(2000);

        cy.url().should("contain", "#listDiscovery");
    });

    it("#Test 2.1 Figure 2.1 shows an empty search result for the initial instance.", () => {

        cy.wait(2000);

        cy.get("input[name='searchTxt']").type("{enter}");

        cy.wait(2000);

        cy.get("#searchList").should("contain", "Info! Please see input handling section at README.md in GitHub");
    });

    it("#Test 2.1.1 Click Search Everything to see a set of filter terms from the search result. Initially search " +
        "result is empty, therefore, Filter by Protein is empty, as shown in Figure 2.1.1.", () => {

        cy.wait(2000);

        cy.get("#btnText").click();

        cy.wait(2000);

        cy.get("#main-content").click(900, 50);
    });

    it("#Test 2.1.2 Discover epithelial transport model for a search text -- flux of sodium. Figure 2.1.2 illustrates " +
        "the search result from the annotated information in PMR.", () => {

        cy.wait(2000);

        cy.get("input[name='searchTxt']").type("flux of sodium{enter}");

        cy.wait(2000);

        cy.request("POST", "/.api/pmr/sparql")
            .then((response) => {
                expect(response.status).to.eq(200);
            });

        cy.wait(5000) // wait to load some models
    });

    it("#Test 2.1.2.1 Click Add to Model, shown in Figure 2.1.2.1, to make a short-list of models (similar to Figure 3.1) " +
        "for considering these in the new epithelial model.", () => {

        cy.wait(2000);

        cy.get('#weinstein_1995\\.cellml\\#NHE3\\.J_NHE3_Na').check();
        // cy.get("[type='checkbox']").first().check();

        cy.wait(2000);

        cy.get("#modelBtn").click();

        cy.wait(2000);

        cy.url().should("contain", "#listModels");

        cy.wait(5000) // wait to switch to Load Model page
    });

    it("#Test 2.1.2.2 Figure 2.1.2.2 shows detailed information of a selected model after clicking the View Model " +
        "in Figure 2.1.2.1.", () => {

        cy.wait(2000);

        cy.get("#listDiscovery").click();

        cy.wait(2000);

        cy.url().should("contain", "#listDiscovery");

        cy.wait(2000);

        cy.get("#chang_fujita_b_1999\\.cellml\\#ms_sodium_flux\\.G_ms_Na").check();
        // cy.get("[type='checkbox']").first().check();

        cy.wait(2000);

        cy.get("#viewBtn").click();

        cy.wait(2000);

        cy.url().should("contain", "#ViewModel");
    });

    it("#Test 2.1.2.2.3 Click DOCUMENTATION to get the documentation of this platform.", () => {

        cy.wait(2000);

        cy.get("#documentation").click();

        cy.wait(2000);

        cy.url().should("contain", "#documentation");
    });

    it("#Test 2.1.3 All the proteins in the search result will appear in the Filter by Protein, as shown in " +
        "Figure 2.1.3. Next, filter with sodium/glucose cotransporter 1 to narrow down the search result.", () => {

        cy.wait(2000);

        cy.get("#listDiscovery").click();

        cy.wait(2000);

        cy.url().should("contain", "#listDiscovery");

        cy.get("#btnText").click();

        cy.wait(2000);

        cy.get("#membraneId").select("solute carrier family 12 member 3 (rat)");

        cy.wait(2000);

        cy.get("#submitBtn").click();

        cy.wait(2000);

        cy.get("#main-content").click(900, 50);

        cy.wait(2000);

        cy.get("#btnText").click();

        cy.wait(2000);

        cy.get("#membraneId").select("select all");

        cy.wait(2000);

        cy.get("#submitBtn").click();

        cy.wait(2000);

        cy.get("#main-content").click(900, 50);
    });
});

describe("#Test 3", () => {
    it("#Test 3.1 Figure 3.1 shows short-listed models selected from the MODEL DISCOVERY page in Figure 2.1.2. " +
        "This short-listed models will be considered in an epithelial platform for visualization and graphical " +
        "editing.", () => {

        cy.wait(2000);

        cy.get("#chang_fujita_b_1999\\.cellml\\#solute_concentrations\\.J_sc_Na").check();

        cy.wait(2000);

        cy.get("#modelBtn").click();

        cy.wait(2000);

        cy.url().should("contain", "#listModels");

        cy.wait(20000); // 20000
    });

    it("#Test 3.4 Click Delete Model to remove the selected model(s).", () => {

        cy.wait(2000);

        cy.get("#chang_fujita_b_1999\\.cellml\\#solute_concentrations\\.J_sc_Na").check();

        cy.wait(2000);

        cy.get("#deleteBtn").click();

        cy.wait(2000);

        cy.url().should("contain", "#DeleteModel");
    });

    it("#Test 3.5 Click Model of Similarity to find similarity between models.", () => {

        cy.wait(2000);

        cy.get("#listDiscovery").click();

        cy.wait(2000);

        cy.url().should("contain", "#listDiscovery");
        // cy.get("#searchList").should("contain", "No search results!");

        cy.wait(2000);

        cy.get("input[name='searchTxt']").type("flux of sodium{enter}");

        cy.wait(10000); // wait to load some models

        cy.get("#weinstein_1995\\.cellml\\#NHE3\\.J_NHE3_Na").check();

        cy.wait(2000);

        cy.get("#modelBtn").click();

        cy.wait(2000);

        cy.url().should("contain", "#listModels");

        cy.wait(5000); // wait to switch to Load Model page

        cy.get("#Model_entity").check();

        cy.wait(2000);

        cy.get("#visualizationBtn").click();

        cy.wait(2000);

        cy.url().should("contain", "#ModelofSimilarity");
    });

    it("#Test 3.6 Click Epithelial Platform to semantically display the short-listed models (from the LOAD MODELS " +
        "page) in an epithelial modelling platform for visualization and graphical editing. If LOAD MODELS page is empty " +
        "then only the skeleton of the platform will be visualized.", () => {

        cy.wait(2000);

        cy.get("#listModels").click();

        cy.wait(2000);

        cy.url().should("contain", "#listModels");

        cy.wait(30000); // wait to switch to Load Model page

        cy.get("#Model_entity").check();

        cy.wait(2000);

        cy.get("#confirmBtn").click();

        cy.wait(2000);

        cy.url().should("contain", "#EpithelialPlatform");
    });
});

describe("#Test 6", () => {
    // TODO: manually hover over the circle to make this test pass!
    it("#Test 6.1 Hover over the mouse on the TSC cotransporter represented as CIRCLE with a bidirectional arrow " +
        "in Figure 6.1 in order to get a TOOLTIP.", () => {

        cy.wait(2000);

        cy.get("#circlewithtext0").trigger("mouseover");

        cy.wait(2000);

        cy.get("#divtooltip").should("be.visible");
    });

    it("#Test 6.1.1 Click the CellML image to navigate to the associated CellML model.", () => {
        cy.get("#cellimg").click();

        cy.wait(2000);

        cy.url().should("contain", "#EpithelialPlatform");
    });

    it("#Test 6.1.2 Click the SEDML image to navigate to the associated SEDML model.", () => {

        cy.wait(2000);

        cy.get("#sedmlimg").click();

        cy.wait(2000);

        cy.url().should("contain", "#EpithelialPlatform");
    });

    it("#Test 6.1.3 Click the MIDDLE MOUSE to close the tooltip.", () => {

        cy.wait(2000);

        cy.get("#circlewithtext0").trigger("mousedown", {which: 2});
    });
});

describe("#Test 7", () => {
    it("Click a checkbox to enable the associated flux or channel draggable (see Figure 7).", () => {
        cy.get("#checkbox0").click();
    });

    it("#Test 7.1 Drag and hover the CIRCLE over the basolateral membrane region and verify that membrane's color " +
        "appear as YELLOOW (see Figure 7). ", () => {
        cy.get("#circlewithtext0")
            .trigger('mousedown', { which: 1 })
            .trigger('mousemove', { pageX: 650, pageY: 220 })
            .trigger('mouseup', { force: true });
    });

    // it("#Test 7.2 Drop the CIRCLE on the basolateral membrane and make decision based on the information in the " +
    //     "modal window.", () => {
    //
    // });
    //
    // it("#Test 7.2.1 If NO is clicked in the modal window, then the TSC will return to its origin " +
    //     "(see Figure 6.1).", () => {
    //
    // });
    //
    // it("#Test 7.2.2 If YES is clicked in the modal window, then the annotation of TSC model and some " +
    //     "recommendations will appear (see Figure 7.1).", () => {
    //
    // });
    //
    // it("#Test 7.2.2.1 A brief description of the dragged model. As can be seen in Figure 7.1, " +
    //     "sodium/glucose cotransporter 1 is a Kidney model. It is located in distal convoluted tubule.", () => {
    //
    // });
    //
    // it("#Test 7.2.2.2 Model: -- name of the dragged CellML model entity (TSC) with the associated workspace URI " +
    //     "(see Figure 7.1 and the supplementary example in Test 8 section below.)", () => {
    //
    // });
    //
    // it("#Test 7.2.2.3 Biological Meaning: -- annotation of the TSC cotransporter deposited in PMR (see Figure 7.1 " +
    //     "and the supplementary example in Test 8 section below.)", () => {
    //
    // });
    //
    // it("#Test 7.2.2.4 Species: -- name of the species (see Figure 7.1 and the supplementary example in Test 8 " +
    //     "section below.)", () => {
    //
    // });
    //
    // it("#Test 7.2.2.5 Gene: -- name of the gene (see Figure 7.1 and the supplementary example in Test 8 section " +
    //     "below.)", () => {
    //
    // });
    //
    // it("#Test 7.2.2.6 Protein: -- name of the protein model (see Figure 7.1 and the supplementary example in " +
    //     "Test 8 section below.)", () => {
    //
    // });
    //
    // it("#Test 7.2.2.7 Basolateral membrane model -- recommendations of the existing annotated basolateral membrane " +
    //     "model in PMR. In this case, Not Exist because the modal window does not show already visualized model(s) in the " +
    //     "apical and basolateral membrane. (see Figure 7.1 and the supplementary example in Test 8 section below.)", () => {
    //
    // });
    //
    // it("#Test 7.2.2.8 Alternative model of sodium/glucose cotransporter 1 (or other dragged model!) -- alternative " +
    //     "recommendations on different species of the dragged model as well as from other workspaces (see Figure 7.1 and " +
    //     "the supplementary example in Test 8 section below.)", () => {
    //
    // });
    //
    // it("#Test 7.2.2.9 Kidney (or other organ!) model in PMR (see Figure 7.1 and the supplementary example in " +
    //     "Test 8 section below.)", () => {
    //
    // });
});