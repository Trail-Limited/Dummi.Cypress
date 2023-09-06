import { CypressPrefix, Profile } from "../../support/constants";
beforeEach(() => {
    cy.loginAdvisor();
    cy.on("uncaught:exception", (err, runnable) => {
        if (err.message.includes("trim") ||
            err.message.includes("replace")
             || err.message.includes("ServiceWorker")
             || err.message.includes("400")
             || err.message.includes("Replayer need at least 2 events")
             ) {
            return false;
        }

        throw err;
    });
});

describe("Opportunity", () => {
    it("Should be able to create a new insurance app", () => {
        cy.setPipelineView("InsuranceAdvice", "Organisation", Cypress.env("OrgId")).then(() => { });
        cy.intercept("GET", "**/api/opportunities/stage/**/stats").as("loadStage");

        cy.intercept("**/api/opportunities/pipeline/**").as("getPipeline");
        cy.intercept("**/api/opportunities/pipeline/InsuranceAdvice").as("insuranceAdvice");
        cy.visit(`CRM/Pipeline`);
        cy.wait("@getPipeline");
        cy.wait("@insuranceAdvice");

        cy.findByText("New Lead", { timeout: 50000 })
            .should("be.visible")
            .then(() => {
                const stageCount = Cypress.$("div#Pipeline-Div > .Stage").length;
                // Total aliases of load stage that need to be waited
                const loadStageAliases = Array.from(Array(stageCount * 3).keys()).map(_ => "@loadStage");
                cy.wait(loadStageAliases);
            });

        cy.intercept("GET", "**/Account/CreateOpportunity_Modal?**").as("createOpportunity");

        cy.get("div[id^=Stage-Opportunities-Container-] ul li")
            .should("exist")
            .then(() => {
                cy.get("button:contains(Create Opportunity)").click();
                cy.findByText("New Opportunity");
                cy.findByText("New Contact (Person)")
                    .closest(".content-body > div")
                    .click();
                cy.get("input[id=name]").type(Profile.Name, {force: true});
                cy.findByText("Next", { selector: ".stage1buttons" }).click();
                cy.get('#Pipeline').select("Insurance Advice", {force: true});
                cy.get("#Type-Input").click();
                cy.get('div:visible>[data-type="Personal Risk"]').click();
                cy.get('#Type-Input').click();
                cy.get('#NeedsAnalysis').select("true", {force: true});

                cy.intercept("GET", "**/api/opportunities/stage/**/stats").as("loadStage");
                cy.findByText("Next", { selector: "button" }).click();
            });
        
        // Report bug FIRST TIME
        cy.reportBug("Report first time!");
        cy.wait(5000);
        cy.closeBugModal();

        // Second time
        cy.findByText("Enter Application Editor", { selector: "h5" }).click();
        cy.url().then(url => {
        const oppId = url.split("Insurance/")[1];
        const getRequests = [
            { alias: "loadPeople", url: `**/Insurance/People/${oppId}?ApplicationViewType=AdviserView` },
            { alias: "loadAssets", url: `**/Insurance/Assets/${oppId}?ApplicationViewType=AdviserView` },
            { alias: "loadHouseholds", url: `**/Insurance/Households/${oppId}?ApplicationViewType=AdviserView` },
            { alias: "loadCashflow", url: `**/Insurance/Cashflow/${oppId}?ApplicationViewType=AdviserView` },
            { alias: "loadNatureOfAdvice", url: `**/Insurance/NatureOfAdvice/${oppId}?ApplicationViewType=AdviserView` },
            { alias: "loadLife", url: `**/Insurance/NeedsAnalysis?Id=${oppId}&Page=Life&ApplicationViewType=AdviserView`, group: "NeedsAnalysis" },
            { alias: "loadTPD", url: `**/Insurance/NeedsAnalysis?Id=${oppId}&Page=TPD&ApplicationViewType=AdviserView`, group: "NeedsAnalysis" },
            { alias: "loadTrauma", url: `**/Insurance/NeedsAnalysis?Id=${oppId}&Page=Trauma&ApplicationViewType=AdviserView`, group: "NeedsAnalysis" },
            { alias: "loadIncome", url: `**/Insurance/NeedsAnalysis?Id=${oppId}&Page=Income&ApplicationViewType=AdviserView`, group: "NeedsAnalysis" },
            { alias: "loadMedical", url: `**/Insurance/NeedsAnalysis?Id=${oppId}&Page=medical&ApplicationViewType=AdviserView`, group: "NeedsAnalysis" }
        ];

        const updateAppStatusRequests = [
            { alias: "updateExpenses", url: `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=expenses&**` },
            { alias: "updateLife", url: `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=Life&**` },
            { alias: "updateTrauma", url: `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=Trauma&**` },
            { alias: "updateTPD", url: `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=TPD&**` },
            { alias: "updateIncome", url: `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=Income&**` },
            { alias: "updateHealth", url: `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=Health&**` },
            { alias: "updateExpenses", url: `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=expenses&**` },
            { alias: "updateRecommendedcover", url: `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=recommendedcover&**` },

        ];

        getRequests.forEach(request => {
            cy.intercept("GET", request.url).as(request.alias);
        });

        updateAppStatusRequests.forEach(request => {
            cy.intercept("GET", request.url).as(request.alias);
        });

        cy.visit(`Application/Insurance/${oppId}`)

        getRequests.forEach(request => {
            cy.wait(`@${request.alias}`);
        });

        cy.intercept("POST", "**/Global/Save_Session").as("saveSession");
        cy.intercept("POST", "**/Global/SaveValue").as("saveValue");
        //#region Nature and Scope of Advice
        // Click on Client Interview
        cy.get("#scopeofservice-menu li[data-id='ClientInterview']").click();
        cy.wait("@saveSession");

        //#region CLIENT INTERVIEW
        // Update goals
        cy.get("#ClientInterview-Div #goalNotes .fr-view:first").clear({force: true}).type(`${CypressPrefix}: Update insurance goals ${Date.now()}`, {force: true}).wait(200);
        cy.wait("@saveValue").then(res => {
            assert.isTrue(res.response.body.success);
            assert.equal(res.response.statusCode, 200);
        });

        // Update plan
        cy.get("#ClientInterview-Div #planNotes .fr-view:first").clear({force: true}).type(`${CypressPrefix}: Update insurance plan ${Date.now()}`, {force: true}).wait(200);
        cy.wait("@saveValue").then(res => {
            assert.isTrue(res.response.body.success);
            assert.equal(res.response.statusCode, 200);
        });

        // Update challenges
        cy.get("#ClientInterview-Div #challengesNotes .fr-view:first").clear({force: true}).type(`${CypressPrefix}: Update insurance challenges ${Date.now()}`, {force: true}).wait(200);
        cy.wait("@saveValue").then(res => {
            assert.isTrue(res.response.body.success);
            assert.equal(res.response.statusCode, 200);
        });

        // Update timing
        cy.get("#ClientInterview-Div #timingNotes .fr-view:first").clear({force: true}).type(`${CypressPrefix}: Update insurance timing ${Date.now()}`, {force: true}).wait(200);
        cy.wait("@saveValue").then(res => {
            assert.isTrue(res.response.body.success);
            assert.equal(res.response.statusCode, 200);
        });
        //#endregion

        // Complete Nature and Scope of Advice
        // Click on Nature and Scope of Advice
        cy.get("#scopeofservice-menu li[data-id='ScopeOfService']").click();
        cy.wait("@saveSession");
        // Click complete radio
        cy.intercept("GET", `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&**`).as("updateApplicationSectionStatus");
        cy.get("#scopeofservice-menu li[data-id='ScopeOfService'] span[id='Service-Tick']").click();
        cy.wait("@updateApplicationSectionStatus").then(res => assert.isTrue(res.response.body.success));
        //#endregion

        //#region Fact Find
        // Complete People
        cy.intercept("GET", `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=Applicants&completed=true&**`).as("updateApplicantsTrue");
        cy.get("ul#Fact-Find-Menu li[data-id='Applicants']").click().wait("@saveSession");
        cy.get("ul#Fact-Find-Menu li[data-id='Applicants'] span#Applicants-Tick")
            .click();
        // Complete Assert & Liabilities
        cy.intercept("GET", `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=OtherAssets&completed=true&**`).as("updateOtherAssets");
        cy.get("ul#Fact-Find-Menu li[data-id='OtherAssets']").click().wait("@saveSession");
        cy.get("ul#Fact-Find-Menu li[data-id='OtherAssets'] span#OtherAssets-Tick").click();
        cy.wait("@updateOtherAssets").then(res => assert.isTrue(res.response.body.success));
        // Medical Details for Integration

        // Households
        cy.intercept("GET", `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=Households&completed=true&**`).as("updateHouseholds");
        cy.get("ul#Fact-Find-Menu li[data-id='Households']").click().wait("@saveSession");
        cy.get("ul#Fact-Find-Menu li[data-id='Households'] span#Households-Tick").click();
        cy.wait("@updateHouseholds").then(res => assert.isTrue(res.response.body.success));

        // Cash Flow
        cy.intercept("GET", `**/Insurance/UpdateApplicationSectionStatus?applicationId=${oppId}&sectionName=Expenses&completed=true&**`).as("updateExpenses");
        cy.get("ul#Fact-Find-Menu li[data-id='Expenses']").click().wait("@saveSession");
        cy.get("ul#Fact-Find-Menu li[data-id='Expenses'] span#Expenses-Tick").click();
        cy.wait("@updateExpenses").then(res => assert.isTrue(res.response.body.success));
        //#endregion
        
    });
        // Report bug SECOND TIME
        cy.reportBug("Report second time!");
        cy.wait(5000);
        cy.closeBugModal();
    });
});