# Employee Section Redesign & Interconnectivity Plan

## 1. Database Enhancements
To properly track and manage employees, we will expand the `employees` table natively to include:
* **Status**: (Active, On Leave, Inactive) so you know who is available to be assigned work.
* **Contact Information**: Phone number and join date strictly integrated with their account profile.

## 2. The Command Center (List View)
The main Employee list page will be redesigned to mirror the power of your CRM Leads/Projects modules:
* Live table showing Name, Role, Department, Contact, and Status.
* Smart filtering so you can instantly filter by Department (e.g. Sales, Execution) or Status.
* A robust "Add Employee / Onboarding" modal that collects their full profile (Role, Contact, Password) in one clean interface.

## 3. Deep Profile View (EmployeeDetail)
When you click on an employee, it will open a dedicated profile screen mirroring the `LeadDetail` layout:

### Tab 1: Overview
* **Personal & Professional Information**: Real-time snapshot of their role, department, join date, and contact details.

### Tab 2: Assigned Workload (Total Interconnectivity)
* A live table that automatically queries your **Leads**, **Clients**, **Design Services**, and **Execution Projects** databases.
* It will consolidate and display every single item across the entire CRM that is currently assigned to this specific employee.
* Clicking any item will instantly transport you to that specific lead or project.

### Tab 3: Tasks & Notifications
* A centralized list of all automated notifications (like the ones we just created for assignments) and specific tasks assigned to them across all projects and leads.

## 4. System-Wide Status Awareness
* When an employee is marked as "Inactive", the system will gracefully handle their profile without deleting their historical work (so your past projects still show who worked on them).
