# kalehq-retention-stack-backend
All things backend

Flow of the code - 
    Workos 
    Challenges 
    Questionnaire 
    OnboardingDetails 
    Integration path 1
        Billing
            Recurly
            Stripe
        Ticketing
            Zendesk
            Freshdesk
        CustomerData
            ProductUsage
    Integration Path 2
        CustomerData
    Only available in integration path 1 -> Persona
    UserProfile 
    UserSession 
    UserEvents
    CardElements
    Cards
    Template
    TemplateViewer
    workflow
    WorkFlowViewer


Async Activities
    Notification
    Webhooks

Additional features
    Analytics
    Media
    GlobalConfig



** File Structure and brief detail of file **

```
kalehq-retention-stack-backend/
├── .github/
│   └── workflows/
│       ├── pipeline_production.yml
│       └── pipeline-staging.yml
│
├── config/
│   ├── email_templates/
│   │   ├── Email_Notification_RA.html
│   │   ├── Email_Invitation_RE.html
│   │   ├── Offer_Code.html
│   │   └── Segmentation_Data_Refresh.html
│   │
│   ├── apiVersions.js
│   ├── conf.js
│   ├── constants.js
│   └── http.js
│
├── controllers/
│   ├── Analytics.js
│   ├── CardElements.js
│   ├── Cards.js
│   ├── Challenges.js
│   ├── Chargebee.js
│   ├── CustomerData.js
│   ├── Customers.js
│   ├── Freshdesk.js
│   ├── GlobalConfig.js
│   ├── Media.js
│   ├── Notification.js
│   ├── OnboardingDetails.js
│   ├── Persona.js
│   ├── ProductUsageData.js
│   ├── Questionnaire.js
│   ├── Recurly.js
│   ├── Slack.js
│   ├── Stripe.js
│   ├── Template.js
│   ├── TemplateViewer.js
│   ├── UserEvents.js
│   ├── UserProfiles.js
│   ├── UserSession.js
│   ├── Webhooks.js
│   ├── Worker.js
│   ├── WorkflowViewer.js
│   ├── WorkOS.js
│   ├── Zendesk.js
│   └── .gitkeep
│
├── dbConfig/
│   └── MongooseDBConnection.js
│
├── docs/
│   └── Analytics.md
│
├── middlewares/
│   ├── CheckContentType.js
│   ├── FileUpload.js
│   ├── isKaleAdmin.js
│   ├── isKaleOrRetAdmin.js
│   ├── isLoggedIn.js
│   ├── isProductUploadPermitted.js
│   ├── isRetAdmin.js
│   ├── isRetAdminOrRetExp.js
│   ├── validateUserEmail.js
│   └── .gitkeep
│
├── models/
│   ├── CardElements.js
│   ├── Cards.js
│   ├── Challenges.js
│   ├── Companies.js
│   ├── CronJobs.js
│   ├── GlobalConfig.js
│   ├── Media.js
│   ├── Notification.js
│   ├── OnboardingDetails.js
│   ├── PersonaCategory.js
│   ├── PersonaConfig.js
│   ├── Questionnaire.js
│   ├── RequestLock.js
│   ├── Template.js
│   ├── UserEnrichmentData.js
│   ├── UserProfiles.js
│   └── .gitkeep
│
├── services/
│   ├── Analytics.js
│   ├── AzureHelper.js
│   ├── CardElements.js
│   ├── Cards.js
│   ├── Challenges.js
│   ├── Chargebee.js
│   ├── Companies.js
│   ├── CustomerData.js
│   ├── Customers.js
│   ├── EmailSender.js
│   ├── Freshdesk.js
│   ├── GlobalConfig.js
│   ├── Media.js
│   ├── Notification.js
│   ├── OnboardingDetails.js
│   ├── Persona.js
│   ├── ProductUsageData.js
│   ├── Questionnaire.js
│   ├── Recurly.js
│   ├── RequestHandler.js
│   ├── RequestLock.js
│   ├── Slack.js
│   ├── Stripe.js
│   ├── Template.js
│   ├── UserEnrichmentData.js
│   ├── UserEvents.js
│   ├── UserProfiles.js
│   ├── UserSession.js
│   ├── Utility.js
│   ├── Webworker.js
│   ├── WorkOS.js
│   ├── Workflow.js
│   ├── Zendesk.js
│   └── .gitkeep
│
├── tests/
│   └── .gitkeep
│
├── utils/
│   └── index.js
```





[Staging_pipeline](.github/workflows/pipeline-staging.yml) (ldbsnjbskdnh)

