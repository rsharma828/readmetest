This is the main Repo of primary backend for main flow works 
\
** File Structure and brief detail of file **

```
kalehq-retention-stack-backend/
├── .github/
│   └── workflows/
│       ├── pipeline_production.yml (Continuous Integration pipeline for Production)
│       └── pipeline-staging.yml ( Continous Integration pipeline for Staging)
│
├── config/
│   ├── email_templates/
│   │   ├── Email_Notification_RA.html 
│   │   ├── Email_Invitation_RE.html 
│   │   ├── Offer_Code.html 
│   │   └── Segmentation_Data_Refresh.html 
│   │
│   ├── apiVersions.js (version of code)
│   ├── conf.js (Configures various URLs, email templates, and event mappings for Slack, and WorkOS integration.)
│   ├── [constants.js] (Defines server constants like user roles, image MIME types, URLs, keys, email templates, and cron events for integration.)
│   └── http.js ( Defines server-level middlewares like body parsing, compression, CORS handling, and static file mappings for various UI builds.)
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
│   ├── Recurly.js ( Ticketing platform integration )
│   ├── Slack.js ( Slack integration )
│   ├── Stripe.js ( Payment Integration)
│   ├── Template.js 
│   ├── TemplateViewer.js 
│   ├── UserEvents.js 
│   ├── UserProfiles.js
│   ├── UserSession.js 
│   ├── Webhooks.js 
│   ├── Worker.js 
│   ├── WorkflowViewer.js 
│   ├── WorkOS.js 
│   ├── Zendesk.js ( Ticketing platform integration )
│   └── .gitkeep
│
├── dbConfig/
│   └── MongooseDBConnection.js ( Connection to MongoDB initialisation)
│   
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




# Project File Structure and Functionality

| Files          | Functionality |
|----------------|---------------|
| [.github](#github)        | Contains configuration files for GitHub workflows, actions, and settings. |
| [Controllers](#Controllers-Documentation)    | Handle HTTP requests and responses, process input, and call services to return data to the client. |
| [Services](#Services-Documentation)       | Contain the core business logic, data processing, and interactions with databases or external APIs. |
| [Models](#Models-Documentation)         | Define the structure and schema of the data, often used to interact with the database (e.g., Mongoose models for MongoDB). |
| [Middlewares](#Middlewares-Documentation)    | Functions that process requests before reaching the controller, handling tasks like authentication, validation, or logging. |
| Routes         | Define the URL paths and HTTP methods, linking them to corresponding controller actions. |
| [Utils](#Utils-Documentation)          | Contain utility functions and helper methods used across the project (e.g., logging, email sending, etc.). |
| [Config](#Config-Documentation)         | Store environment variables, settings, or constants used throughout the application for configuration purposes. |

#   .github Folder Structure and Functionality

| Files                | Functionality |
|----------------------|---------------|
| workflows/            | Contains YAML files for GitHub Actions workflows, automating tasks such as testing, deployments, or CI/CD processes. |
| ISSUE_TEMPLATE.md     | Provides a template for users to follow when submitting issues on GitHub repositories. |
| PULL_REQUEST_TEMPLATE.md | Provides a template for users to follow when submitting pull requests, ensuring necessary details are included. |
| config.yml            | Stores configuration settings for GitHub Actions or other automation tools integrated with the GitHub repository. |


# Controllers Documentation

| Controller | Functionality |
|------------|--------------|
| **Payment & Subscription Controllers** ||
| [Chargebee.js](/Controllers&Services_docs/Chargebee.md) | - Handles integration with Chargebee subscription billing platform<br>- Manages subscription lifecycle events<br>- Processes billing-related operations |
| [Stripe.js](/Controllers&Services_docs/Stripe.md) | - Manages payment processing through Stripe gateway<br>- Handles payment method storage and updates<br>- Processes refunds and payment disputes |
| [Recurly.js](/Controllers&Services_docs/Recurly.md) | - Manages subscription billing through Recurly<br>- Handles subscription plan changes and upgrades<br>- Processes billing events and notifications |
| **User Management Controllers** ||
| [UserProfiles.js](/Controllers&Services_docs/UserProfiles.md) | - Manages user profile data and updates<br>- Handles user preferences and settings<br>- Controls profile visibility and access |
| [UserSession.js](/Controllers&Services_docs/UserSession.md) | - Manages user authentication and sessions<br>- Handles login and logout operations<br>- Maintains session state and security |
| [UserEvents.js](/Controllers&Services_docs/UserEvents.md) | - Tracks user interactions and activities<br>- Manages event logging and processing<br>- Provides user activity analytics |
| **Customer Management Controllers** ||
| [CustomerData.js](/Controllers&Services_docs/CustomerData.md) | - Handles customer data management<br>- Processes customer information updates<br>- Manages customer data access and security |
| [Customers.js](/Controllers&Services_docs/Customers.md) | - Manages core customer operations<br>- Handles customer creation and updates<br>- Controls customer relationship management |
| **Support Integration Controllers** ||
| [Zendesk.js](/Controllers&Services_docs/Zendesk.md) | - Manages Zendesk support platform integration<br>- Handles ticket creation and updates<br>- Synchronizes support data between systems |
| [Freshdesk.js](/Controllers&Services_docs/Freshdesk.md) | - Controls Freshdesk support system integration<br>- Manages support ticket lifecycle<br>- Handles customer support communications |
| [Slack.js](/Controllers&Services_docs/Slack.md) | - Manages Slack messaging integration<br>- Handles notification delivery through Slack<br>- Controls message formatting and delivery |
| **Card and Template Controllers** ||
| [Cards.js](/Controllers&Services_docs/Cards.md) | - Manages card creation and updates<br>- Handles card data organization<br>- Controls card access and permissions |
| [CardElements.js](/Controllers&Services_docs/) | - Manages reusable card components<br>- Handles card element rendering<br>- Controls element behavior and interactions |
| [Template.js](/Controllers&Services_docs/Template.md) | - Manages template creation and storage<br>- Handles template versioning<br>- Controls template access and usage |
| [TemplateViewer.js](/Controllers&Services_docs/TemplateViewer.md) | - Provides template viewing functionality<br>- Manages template display options<br>- Handles template rendering and preview |
| **Workflow and Process Controllers** ||
| [Workflow.js](/Controllers&Services_docs/Workflow.md) | - Manages workflow definitions and logic<br>- Handles workflow execution and state<br>- Controls workflow transitions and rules |
| [WorkflowViewer.js](/Controllers&Services_docs/WorkflowViewer.md) | - Provides workflow visualization<br>- Manages workflow state display<br>- Handles workflow interaction interface |
| [Worker.js](/Controllers&Services_docs/Worker.md) | - Manages background processing tasks<br>- Handles asynchronous operations<br>- Controls job queuing and execution |
| **Analytics and Data Controllers** ||
| [Analytics.js](/Controllers&Services_docs/Analytics.md) | - Manages analytics data collection<br>- Handles reporting and metrics<br>- Provides data visualization support |
| [ProductUsageData.js](/Controllers&Services_docs/ProductUsageData.md) | - Tracks product usage metrics<br>- Manages usage data collection<br>- Provides usage analysis and reporting |
| **System Configuration Controllers** ||
| [GlobalConfig.js](/Controllers&Services_docs/GlobalConfig.md) | - Manages system-wide settings<br>- Handles configuration updates<br>- Controls feature flags and toggles |
| [WorkOS.js](/Controllers&Services_docs/WorkOS.md) | - Manages WorkOS integration<br>- Handles identity and access control<br>- Manages single sign-on operations |
| **Miscellaneous Controllers** ||
| [Notification.js](/Controllers&Services_docs/Notification.md) | - Manages system notifications<br>- Handles notification delivery<br>- Controls notification preferences |
| [Questionnaire.js](/Controllers&Services_docs/Questionnaire.md) | - Manages survey and questionnaire data<br>- Handles response collection<br>- Controls questionnaire flow |
| [OnboardingDetails.js](/Controllers&Services_docs/OnboardingDetails.md) | - Manages user onboarding process<br>- Handles onboarding step tracking<br>- Controls onboarding flow and progress |
| [Media.js](/Controllers&Services_docs/Media.md) | - Handles media file operations<br>- Manages file uploads and storage<br>- Controls media access and processing |
| [Webhooks.js](/Controllers&Services_docs/Webhooks.md) | - Manages webhook endpoints<br>- Handles webhook event processing<br>- Controls webhook security and validation |
| [Challenges.js](/Controllers&Services_docs/Challenges.md) | - Manages system challenges<br>- Handles challenge progression<br>- Controls challenge rewards and completion |




# Services Documentation

| Service | Functionality |
|---------|--------------|
| **Integration Services** ||
| Chargebee.js | - Manages Chargebee subscription billing operations<br>- Handles subscription lifecycle<br>- Processes billing events |
| Stripe.js | - Processes payments via Stripe gateway<br>- Manages payment methods<br>- Handles transaction operations |
| Recurly.js | - Manages subscription services through Recurly<br>- Handles billing cycles<br>- Processes subscription events |
| Zendesk.js | - Integrates with Zendesk support platform<br>- Manages support ticket operations<br>- Syncs customer support data |
| Freshdesk.js | - Handles Freshdesk support integration<br>- Manages customer support tickets<br>- Processes support communications |
| Slack.js | - Manages Slack platform integration<br>- Handles message delivery<br>- Processes notification events |
| WorkOS.js | - Integrates with WorkOS for identity management<br>- Handles access control<br>- Manages authentication services |
| AzureHelper.js | - Provides Azure services integration<br>- Manages cloud resource operations<br>- Handles Azure-specific functionality |
| **User Management Services** ||
| UserProfiles.js | - Manages user profile operations<br>- Handles profile updates<br>- Controls profile data access |
| UserSession.js | - Handles user session management<br>- Controls authentication flows<br>- Manages session state |
| UserEvents.js | - Tracks user activity and events<br>- Processes user interactions<br>- Manages event logging |
| UserEnrichmentData.js | - Processes user enrichment data<br>- Manages personalization features<br>- Handles user analytics |
| **Customer Management Services** ||
| CustomerData.js | - Manages customer data operations<br>- Handles customer record updates<br>- Controls data access and security |
| Customers.js | - Processes customer-related operations<br>- Manages customer relationships<br>- Handles customer data flow |
| Companies.js | - Manages company data and operations<br>- Handles organizational structure<br>- Controls company relationships |
| **Card and Template Services** ||
| Cards.js | - Manages card operations and data<br>- Handles card updates and retrieval<br>- Controls card functionality |
| CardElements.js | - Manages UI component operations<br>- Handles element rendering<br>- Controls component behavior |
| Template.js | - Manages template operations<br>- Handles template creation and updates<br>- Controls template versioning |
| **System Services** ||
| GlobalConfig.js | - Manages application configuration<br>- Handles system settings<br>- Controls feature toggles |
| Workflow.js | - Manages workflow operations<br>- Handles process flows<br>- Controls workflow states |
| Webworker.js | - Manages background processing<br>- Handles async operations<br>- Controls worker tasks |
| RequestHandler.js | - Processes service requests<br>- Manages request routing<br>- Handles request validation |
| RequestLock.js | - Provides request locking mechanisms<br>- Manages concurrent access<br>- Controls request synchronization |
| **Analytics and Monitoring** ||
| Analytics.js | - Processes analytics data<br>- Generates reports<br>- Manages metrics collection |
| ProductUsageData.js | - Tracks product usage<br>- Processes usage metrics<br>- Generates usage reports |
| **Utility Services** ||
| Utility.js | - Provides common utility functions<br>- Handles shared operations<br>- Manages helper methods |
| EmailSender.js | - Manages email operations<br>- Handles template processing<br>- Controls email delivery |
| Media.js | - Manages media operations<br>- Handles file processing<br>- Controls media storage |
| **Feature Services** ||
| Notification.js | - Manages notification system<br>- Handles notification delivery<br>- Controls notification preferences |
| Questionnaire.js | - Manages survey operations<br>- Handles response collection<br>- Controls questionnaire flow |
| OnboardingDetails.js | - Manages onboarding processes<br>- Handles user progression<br>- Controls onboarding state |
| Challenges.js | - Manages user challenges<br>- Handles challenge progression<br>- Controls reward systems |


# Models Documentation

| Model | Functionality |
|-------|---------------|
| **Core Models** ||
| [Cards.js](/models_docs/Cards.md) | - Defines schema for cards in the system<br>- Manages card-specific operations<br>- Provides validation for card data |
| [UserProfiles.js](/models_docs/UserProfiles.md) | - Handles user profile schema and logic<br>- Manages CRUD operations for user data<br>- Validates user-specific attributes |
| [Notification.js](/models_docs/Notification.md) | - Manages schema for notifications<br>- Handles notification data processing<br>- Provides delivery tracking for notifications |
| [PersonaCategory.js](/models_docs/PersonaCategory.md) | - Defines schema for categorizing personas<br>- Provides structure for persona-related features<br>- Manages hierarchy of persona categories |
| [OnboardingDetails.js](/models_docs/OnboardingDetails.md) | - Handles onboarding-related data schema<br>- Manages onboarding workflows and logic<br>- Ensures data consistency for new users |
| **Auxiliary Models** ||
| [Media.js](/models_docs/Media.md) | - Manages schema for media files<br>- Handles file metadata and processing<br>- Integrates with storage services |
| [GlobalConfig.js](/models_docs/GlobalConfig.md) | - Defines schema for application-wide configuration<br>- Manages settings for different environments<br>- Supports dynamic updates to configurations |
| [Challenges.js](/models_docs/Challenges.md) | - Defines schema for system challenges<br>- Manages gamification and task features<br>- Tracks user progress and completion |
| [RequestLock.js](/models_docs/RequestLock.md) | - Manages schema for locking mechanisms<br>- Prevents concurrent modification of resources<br>- Ensures request integrity |
| [Template.js](/models_docs/Template.md) | - Defines schema for templates<br>- Manages reusable design elements<br>- Supports template creation and updates |
| [PersonaConfig.js](/models_docs/PersonaConfig.md) | - Handles persona configuration schema<br>- Manages settings for personalization<br>- Supports customization for personas |


# Middlewares Documentation

| Middleware | Functionality |
|------------|---------------|
| CheckContentType.js | - Verifies the content type of incoming requests<br>- Ensures appropriate data formats are used |
| FileUpload.js | - Manages file upload operations<br>- Handles validation and storage of uploaded files |
| isProductUploadPermitted.js | - Checks if a user is authorized to upload products<br>- Enforces permissions for product uploads |
| isRetAdminOrRetExp.js | - Validates if the user is a retail admin or expert<br>- Restricts access to specific retail functionalities |
| isKaleAdmin.js | - Confirms if the user has Kale admin privileges<br>- Grants access to administrative features |
| isRetAdmin.js | - Checks if the user is a retail admin<br>- Restricts non-admins from accessing certain features |
| isLoggedIn.js | - Validates user login status<br>- Ensures that only authenticated users access certain routes |
| isKaleOrRetAdmin.js | - Verifies if the user is either Kale admin or retail admin<br>- Provides combined access control for multiple roles |
| validateUserEmail.js | - Validates the format and existence of user emails<br>- Ensures proper email formatting and uniqueness |




# Utils Documentation

| Utility | Functionality |
|---------|---------------|
| index.js | - Acts as the entry point for utility functions<br>- Aggregates and exports various helper methods |



# Config Documentation

| Configuration | Functionality |
|---------------|---------------|
| **Core Configurations** ||
| constants.js | - Defines constant values used across the application<br>- Ensures reusability and consistency of values |
| conf.js | - Manages environment-specific configurations<br>- Handles application-wide settings and parameters |
| apiVersions.js | - Defines supported API versions<br>- Manages version control for APIs in the system |
| http.js | - Configures HTTP client settings<br>- Manages request timeouts and headers<br>- Handles error management for HTTP calls |
| **Email Templates** ||
| Email_Notification_RA.html | - Template for resource availability notifications<br>- Customizable for various notification use cases |
| Segmentation_Data_Refresh.html | - Template for emails about segmentation data refresh<br>- Used for periodic updates to users |
| Offer_Code.html | - Template for promotional offer or discount codes<br>- Includes custom branding options |
| Email_Invitation_RE.html | - Template for email invitations<br>- Used for event or platform invitation communication |

