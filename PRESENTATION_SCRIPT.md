# Healthcare Management System - Presentation Script

## Introduction (30 seconds)
"Hello everyone. Today I'm presenting my Healthcare Management System, a full-stack React application for managing patients, doctors, appointments, and prescriptions. This system demonstrates CRUD operations, authentication, and modern UI patterns using React 19 and Vite."

## Application Architecture - App.jsx (1 minute)
"Let's start with the App component, which is the foundation of our application. Here we have our routing structure using React Router 7. The app is wrapped in an AuthProvider for authentication state management, and a SidebarProvider for our navigation UI.

I've implemented animated route transitions using a custom AnimatedRoutes wrapper. Every time you navigate between pages, you'll see a smooth fade-in and slide-up animation, which gives the app a polished, professional feel.

The routing structure includes four main resource types: Patients, Doctors, Appointments, and Prescriptions. Each has full CRUD functionality - Create, Read, Update, and Delete operations."

## Authentication Hook - useAuth.jsx (45 seconds)
"The authentication is managed through a custom React hook called useAuth. This hook provides our entire application with auth state using React's Context API.

When a user logs in, the token and user data are stored in both React state and localStorage, so authentication persists across browser refreshes. The hook provides three main functions: onLogin for authentication, onRegister for new users, and onLogout to clear the session.

The token is automatically injected into all API requests through an Axios interceptor, so we don't have to manually add it to every request."

## Home Page (30 seconds)
"The Home page is our landing page, featuring login and register forms side by side. I've also added a holiday widget that fetches upcoming US holidays from the Calendarific API, displaying them in a clean card format. This demonstrates external API integration alongside our core authentication features."

## CRUD Operations - Prescriptions Example (2 minutes)
"Now let's walk through a complete CRUD implementation using Prescriptions as our example.

**Index Page**: This is our list view. It fetches all prescriptions from the API and enriches the data by making parallel requests to get patient and doctor names. Each row displays the medication, patient name, doctor name, and action buttons. We have skeleton loading states while data fetches, and the delete button includes instant UI updates without requiring a page refresh.

**Show Page**: The detail view displays all information about a single prescription. We handle date formatting gracefully - the API sometimes returns different field names like 'issue_date' versus 'start_date', so we've built fallback logic to handle both. Dates are formatted in a user-friendly format like 'Dec 17, 2025'.

**Create Page**: Our creation form includes dropdown selects for patients and doctors, which are fetched and populated when the component loads. All required fields are validated before submission. We handle multiple error response formats from the API - whether it returns Zod validation issues, simple error messages, or error objects, our error handling displays user-friendly toast notifications.

One important note: the diagnosis_id field is required because it has a foreign key constraint in the database. This ensures data integrity - you can only create a prescription linked to an existing diagnosis record.

**Edit Page**: The edit form pre-populates with existing data, and we've added skeleton loaders so users see a loading state rather than an empty form. We include comprehensive error handling for 404 errors if a record doesn't exist, network errors, and validation errors. The form tries PATCH first and falls back to PUT if the endpoint doesn't support PATCH.

Throughout all CRUD operations, we use the Sonner library for toast notifications, giving users immediate feedback on success or failure."

## Key Technical Features (45 seconds)
"Some key technical features worth highlighting:

- **Parallel Data Fetching**: When loading lists, we fetch the main resource then use Promise.all to enrich data with related resources simultaneously, which is much faster than sequential requests.

- **Error Boundaries**: We have comprehensive error handling with specific messages for validation errors, authentication errors, and network failures.

- **Form Validation**: Client-side validation prevents invalid submissions before they reach the API.

- **Loading States**: Skeleton loaders and loading indicators provide better UX during data fetching.

- **Responsive Design**: The UI uses Tailwind CSS and shadcn components, ensuring it works on mobile, tablet, and desktop screens."

## Conclusion (15 seconds)
"In summary, this Healthcare Management System demonstrates a complete full-stack React application with authentication, full CRUD operations, external API integration, and modern UI/UX patterns. Thank you for your attention, and I'm happy to answer any questions."

---

## Quick Reference - Demo Flow
1. Show Home page (login/register + holiday widget)
2. Navigate to Prescriptions Index
3. Click "View" on a prescription (Show page)
4. Click "Edit" (Edit page with skeleton loaders)
5. Go back and click "Create New Prescription"
6. Walk through the form fields
7. Briefly show Patients or Appointments to demonstrate consistency across resources
8. Show the sidebar navigation
9. Demonstrate logout functionality

**Total Time**: ~5-6 minutes
