// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/* ----------------------------- Command Typings ---------------------------- */

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            loginAdvisor(): Chainable<void>;
            reportBug(comment: string): Chainable<void>;
            closeBugModal(): Chainable<void>;
            loginProfile2(): Chainable<void>;
            console(type: string);
            createActivity(
                type?: string,
                dueDate?: string,
                dueTime?: string,
                duration?: string,
                memberId?: string,
                userId?: string,
                applicationId?: number,
                description?: string,
                dueDateplugin?: string
            ): Chainable<void>;
            setPipelineView(
                pipelineType: string,
                visibility: "Organisation" | "Team" | "Member",
                visibilityId: string
            ): Chainable<void>;
            setContactView(adviserId: String): Chainable<void>;
            addOpportunity(
                adviserId: String,
                entityId: String,
                pipelineId: Number,
                oppType: string,
                stageId: Number
            ): Chainable<CreateOppRes>;
            visitPipeline(): Chainable<void>;
            clickCreateOpportunity(): Chainable<void>;
            clickAddOpportunity(): Chainable<void>;
        }
    }
}
/* -------------------------------------------------------------------------- */

//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => {
//   console.log('Custom command example: Login', email, password);
// });
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/* ----------------------------- Custom Commands ---------------------------- */

import "@testing-library/cypress/add-commands";
import { CreateOppRes } from "./models/createOppRes";

/**
 * Login as an adviser.
 *
 * Make sure there is a `cypress.env.json` file in the project folder with the
 * following values.
 *
 * {
 *    "advisor_username": "<USERNAME>",
 *    "advisor_password": "<PASSWORD>"
 * }
 */

Cypress.Commands.add("reportBug", (comment: string = null) => {
    cy.get("#dm-root").shadow().find("button").first().click();
    cy.get("#dm-root").shadow().find("[role=menuitem]").first().click();
    cy.get("#dm-root").shadow().find("textarea").type(comment);
    cy.get("#dm-root").shadow().find("textarea").next("button").click();
});

Cypress.Commands.add("closeBugModal", () => {
    cy.get("#dm-root").shadow().find(".z-top>button.p-1.text-gray-500").click();
    cy.get("#dm-root").shadow().find("button.p-1.text-gray-500").first().click();
});


Cypress.Commands.add("loginAdvisor", () => {
    const username = Cypress.env("advisor_username");
    const password = Cypress.env("advisor_password");
    const orgId = Cypress.env("OrgId");

    cy.session([username, password], () => {
        const getRequestToken = (body: string): string | undefined => {
            return body.match(
                /<input name="__RequestVerificationToken.*value="(.*)" \/>/
            )?.[1];
        };

        cy.request(`Account/Login?o=${orgId}`).then((response) => {
            const requestToken = getRequestToken(response.body);

            expect(requestToken).not.undefined;

            cy.request({
                method: "POST",
                url: "Account/Login",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    RequestVerificationToken: requestToken,
                },
                form: true,
                body: {
                    OrganisationId: orgId,
                    email: username,
                    password,
                },
                failOnStatusCode: false,
                timeout: 500000
            });
        });
    });
});

Cypress.Commands.add("loginProfile2", () => {
    const username = Cypress.env("profile2_username");
    const password = Cypress.env("profile2_password");
    cy.session([username, password], () => {
        const getRequestToken = (body: string): string | undefined => {
            return body.match(
                /<input name="__RequestVerificationToken.*value="(.*)" \/>/
            )?.[1];
        };

        cy.request("Account/Login?o=13").then((response) => {
            const requestToken = getRequestToken(response.body);

            expect(requestToken).not.undefined;

            cy.request({
                method: "POST",
                url: "Account/Login",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    RequestVerificationToken: requestToken,
                },
                form: true,
                body: {
                    OrganisationId: 13,
                    email: username,
                    password,
                },
                failOnStatusCode: false,
                timeout: 500000
            });
        });
    });
});

Cypress.Commands.add(
    "createActivity",
    (
        type: string = "Call - Call",
        dueDate: string = Date.now().toLocaleString(),
        dueTime: string = "11:00 AM",
        duration: string = "60",
        memberId: string = null,
        userId: string = null,
        applicationId: number = 0,
        description: string = null,
        dueDateplugin: string = null
    ) => {
        cy.request({
            method: "POST",
            url: "/Account/Create_Activity",
            headers: {
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
            },
            form: true,
            body: {
                Model: JSON.stringify({
                    type,
                    dueDate,
                    dueTime,
                    duration,
                    memberId,
                    userId,
                    applicationId,
                    description,
                    dueDateplugin,
                }),
                version: 1,
                Comments: null,
            },
        });
    }
);

Cypress.Commands.add(
    "setPipelineView",
    (
        pipelineType: string,
        visibility: "Organisation" | "Team" | "Member",
        visibilityId: string
    ) => {
        Cypress.log({
            displayName: `Set pipeline view`,
            message: `${pipelineType}-${visibility}-${visibilityId}`,
        });
        cy.request({
            method: "GET",
            url: `/api/opportunities/pipeline/${pipelineType}/`,
            form: true,
        }).then((response) => {
            expect(response).property("status").to.equal(200);
        });
        cy.request({
            method: "POST",
            url: `/api/opportunities/pipeline/${pipelineType}/settings`,
            form: true,
            body: {
                PipelineType: pipelineType,
                Visibility: visibility,
                VisibilityId: visibilityId,
            },
        }).then((response) => {
            expect(response).property("status").to.equal(200);
        });
    }
);

Cypress.Commands.add("setContactView", (adviserId: String) => {
    cy.request({
        method: "POST",
        url: `/Global/SaveValue`,
        form: true,
        body: {
            Value: `{"Min":0,"Max":50,"Visibility":"Organisation","Header":"Profile Name,dec","Opportunity":"All","ProfilesHeader":"Profile Name, Type, Status, Annual Review Date, Key Contact Name, Key Contact Email, Key Contact Phone Number, Key Contact Address, Key Contact Date Of Birth, Assigned To"}`,
            Section: "Member",
            Key: "DefaultProfileView",
            ID: adviserId,
        },
    }).then((response) => {
        expect(response).property("status").to.equal(200);
    });

    cy.request({
        method: "POST",
        url: `/Global/SaveValue`,
        form: true,
        body: {
            Value: ` {"Min":0,"Max":50,"Visibility":"Organisation","Header":"First Name,asc","ViewClient":true,"ContactsHeader":"First Name, Middle Name, Last Name, Primary Email, Primary Phone, Household Address"}`,
            Section: "Member",
            Key: "DefaultClientView",
            ID: adviserId,
        },
    }).then((response) => {
        expect(response).property("status").to.equal(200);
    });
});

Cypress.Commands.add(
    "addOpportunity",
    (
        adviserId: String,
        entityId: String,
        pipelineId: Number,
        oppType: string,
        stageId: Number
    ) => {
        const model = {
            Opportunityownership: adviserId,
            SubmittingAdviser: "",
            PipelineId: pipelineId,
            Type: oppType,
            OpportunityName: "",
            undefined: "false",
            OpportunityProductId: "",
            OpportunityLoanType: "Fixed",
            Value: "",
            OpportunityPolicyId: "",
            OpportunityInvestmentId: "",
            "Opportunity-Stage": "",
            StageId: stageId,
        };

        const body = {
            Model: JSON.stringify(model),
            Answers: "",
            Version: 1,
            Subadd: "Contact",
            IncludeDocuments: false,
            ProfileId: "New",
            EntityId: entityId,
            type: "Personal",
            Owner: adviserId,
            EntityIds: "",
            ShareholdingIds: "",
            CompanyId: "",
            NeedsAnalysis: true,
        };

        cy.request({
            method: "POST",
            url: "/Account/CreateOpportunity_Modal",
            form: true,
            body: body,
        }).then((response) => {
            assert.isTrue(response.isOkStatusCode);
            return {
                ApplicationId: response.body.ApplicationId,
                BaseType: response.body.BaseType,
                ProfileId: response.body.Id,
                IsInvite: response.body.Invite,
                ProfileName: response.body.Name,
                IsNewClient: response.body.Client,
                Commission: response.body.commission,
                Success: response.body.success,
            };
        });
    }
);

Cypress.Commands.add("visitPipeline", () => {
    cy.intercept("GET", "**/api/opportunities/stage/**/stats").as("loadStage");

    cy.intercept("**/api/opportunities/pipeline/**").as("getPipeline");
    cy.visit(`CRM/Pipeline`);
    cy.wait("@getPipeline");

    cy.get("h4[id^=StageName-]", { timeout: 50000 })
        .should("be.visible")
        .then(() => {
            const stageCount = Cypress.$("div#Pipeline-Div > .Stage").length;
            // Total aliases of load stage that need to be waited
            const loadStageAliases = Array.from(Array(stageCount * 3).keys()).map(_ => "@loadStage");
            cy.wait(loadStageAliases);
        });
});

Cypress.Commands.add("clickCreateOpportunity", () => {
    cy.intercept("POST", "**/CRM/Get_Opportunity_Partial").as("getOpportunityPartial");
    cy.get("button:contains(Create Opportunity)")
        .click()
        .wait("@getOpportunityPartial");
});

Cypress.Commands.add("clickAddOpportunity", () => {
    cy.intercept("POST", "**/CRM/Get_Opportunity_Screen").as("getOpportunityScreenPartial");
    cy.get("button:contains(Add Opportunity)")
        .click()
        .wait("@getOpportunityScreenPartial");
});