This is the main Repo of primary backend for main flow works 
\
** File Structure and brief detail of file **
[hello](#hello)
```
kalehq-retention-stack-backend/
├── .github/
│   └── workflows/
│       ├── pipeline_production.yml (Continuous Integration pipeline for Production)
│       └── pipeline-staging.yml ( Continous Integration pipeline for Staging)
│
├── config/
│   ├── email_templates/
│   │   ├── Email_Notification_RA.html ( html structure for Email notification for call-to-action )
│   │   ├── Email_Invitation_RE.html (html structure for Invitation to user)
│   │   ├── Offer_Code.html (Offers for User)
│   │   └── Segmentation_Data_Refresh.html ( Responsive HTML email template that notifies users about outdated segmentation data)
│   │
│   ├── apiVersions.js (version of code)
│   ├── conf.js (Configures various URLs, email templates, and event mappings for Slack, and WorkOS integration.)
│   ├── [constants.js] (Defines server constants like user roles, image MIME types, URLs, keys, email templates, and cron events for integration.)
│   └── http.js ( Defines server-level middlewares like body parsing, compression, CORS handling, and static file mappings for various UI builds.)
│
├── controllers/
│   ├── Analytics.js ( Routes for workflow analytics, including fetching, filtering, and exporting data, with request validation using Joi schemas.)
│   ├── CardElements.js ( Routes to manage card elements, supporting create, update, delete, and fetch operations with Joi validation and logging.)
│   ├── Cards.js ( Routes for managing cards, including CRUD operations, card duplication, and tree retrieval.)
│   ├── Challenges.js ( Routes for managing challenges, supporting CRUD operations with optional filtering, projection, and validation using Joi schemas.)
│   ├── Chargebee.js ( Routes for Chargebee integration, including connecting, fetching, and processing data, with logging and background task handling.)
│   ├── CustomerData.js ( Routes for customer data management, including CSV upload and customer mapping refresh, with validation and middleware integration.)
│   ├── Customers.js ( Routes for managing customers, including data retrieval, export, persona assignment, reassignment, and product tier management, with validation.)
│   ├── Freshdesk.js ( Routes for Freshdesk integration, supporting connection and data fetching with background processing, error handling, and input validation using Joi.)
│   ├── GlobalConfig.js ( Route for retrieving global configuration data based on the user's industry type, with optional field projection.)
│   ├── Media.js ( Routes for media management, including file upload, retrieval with filtering and sorting, and duplicating media files, with validation and error handling.)
│   ├── Notification.js ( Routes for managing notifications, including retrieving, inserting, and updating notifications, with validation for company ID, user email, and notification status.)
│   ├── OnboardingDetails.js (routes for onboarding details, including retrieving and updating user onboarding data, with validation and error handling.)
│   ├── Persona.js ( Routes for managing persona configurations, including retrieving categories, industry-wise personas, and updating configurations, with validation and error handling.)
│   ├── ProductUsageData.js ( Routes for uploading product usage data, refreshing customer mapping, and validating CSV file formats, with error handling and permissions.)
│   ├── Questionnaire.js ( Routes for managing questionnaires, including retrieving, adding, and updating questionnaire data, with email validation and error handling.)
│   ├── Recurly.js ( Ticketing platform integration )
│   ├── Slack.js ( Slack integration )
│   ├── Stripe.js ( Payment Integration)
│   ├── Template.js ( routes for managing templates, including CRUD operations, duplicating templates, and fetching analytics, with validation and error handling.)
│   ├── TemplateViewer.js ( routes for managing templates and cards, including retrieval, validation, and workflow fetching, with pagination, sorting, and error handling)
│   ├── UserEvents.js ( routes for managing user events, including retrieving, adding, updating, and adding multiple events, with validation for request body and query parameters.)
│   ├── UserProfiles.js ( routes for managing retention experts, including adding, deleting, fetching, and updating profiles, with email validation and error handling.)
│   ├── UserSession.js ( routes for managing user sessions, including starting, retrieving, and ending sessions, with validation and error handling.)
│   ├── Webhooks.js (webhook routes for handling events from Thrivestack, WorkOS, and Slack, including data validation, service handling, and logging.)
│   ├── Worker.js ( route for handling callback requests, logging the incoming data, and responding with an acknowledgment.)
│   ├── WorkflowViewer.js ( API routes and validation schemas for workflows, workflow cards, card elements, and analytics. Key functions include creating, updating, and duplicating workflows and cards.)
│   ├── WorkOS.js ( routes for interacting with WorkOS, including obtaining tokens, refreshing tokens, and fetching a login URL. It uses Joi for request validation, ensuring proper input for each route.)
│   ├── Zendesk.js ( Ticketing platform integration )
│   └── .gitkeep
│
├── dbConfig/
│   └── MongooseDBConnection.js ( Connection to MongoDB initialisation)
│   
│
├── middlewares/ 
│   ├── CheckContentType.js ( code parses incoming POST request data into JSON if not already set, handling errors gracefully before proceeding)
│   ├── FileUpload.js ( Max size of the file that can be uploaded)
│   ├── isKaleAdmin.js ( Validates if User is super admin or not)
│   ├── isKaleOrRetAdmin.js ( Validates if User is Kale or Retention admin as well)
│   ├── isLoggedIn.js ( Verifies the user's access token, fetches user data, and appends user info to the request object.)
│   ├── isProductUploadPermitted.js ( Validates if billing and ticketing data are uploaded; if not, it prevents access with an error message.)
│   ├── isRetAdmin.js ( Validates if Retention admin or not)
│   ├── isRetAdminOrRetExp.js ( Validates if Rentention admin or expert )
│   ├── validateUserEmail.js ( validates the user's email, fetches their company details, and verifies the user exists for further processing.)
│   └── .gitkeep
│
├── models/ ( Schema defination of different entities)
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
├── services/ (This folder contains helper for operations to be done by file in controller)
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

#   hello



# Project File Structure and Functionality

| Files          | Functionality |
|----------------|---------------|
| [github](#github)        | Contains configuration files for GitHub workflows, actions, and settings. |
| Controllers    | Handle HTTP requests and responses, process input, and call services to return data to the client. |
| Services       | Contain the core business logic, data processing, and interactions with databases or external APIs. |
| Models         | Define the structure and schema of the data, often used to interact with the database (e.g., Mongoose models for MongoDB). |
| Middlewares    | Functions that process requests before reaching the controller, handling tasks like authentication, validation, or logging. |
| Routes         | Define the URL paths and HTTP methods, linking them to corresponding controller actions. |
| Utils          | Contain utility functions and helper methods used across the project (e.g., logging, email sending, etc.). |
| Config         | Store environment variables, settings, or constants used throughout the application for configuration purposes. |

##  github
#   .github Folder Structure and Functionality

| Files                | Functionality |
|----------------------|---------------|
| workflows/            | Contains YAML files for GitHub Actions workflows, automating tasks such as testing, deployments, or CI/CD processes. |
| ISSUE_TEMPLATE.md     | Provides a template for users to follow when submitting issues on GitHub repositories. |
| PULL_REQUEST_TEMPLATE.md | Provides a template for users to follow when submitting pull requests, ensuring necessary details are included. |
| config.yml            | Stores configuration settings for GitHub Actions or other automation tools integrated with the GitHub repository. |


# Table of Contents

- [Introduction](#introduction)
- [GitHub Folder Structure](#github-folder-structure)

# Introduction

This is the introduction section.kansv avoabk viajkb vaisk vaikv aa
abvjifbviak vaihkv aiv aivav
vhajkv avhik avj av
avib virkv iaevbearva
rvarivrvbrv
rr
r
r

r
r
r
r

r

# GitHub Folder Structure

Here we explain the structure of the GitHub folder.

