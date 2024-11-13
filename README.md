# React-Ecommerce
Overview
This project is a full-stack admin console application built with React, Redux, and Firebase. It allows users to manage categories and products, view statistics, and access personalized dashboards. The application is designed with a clean and responsive UI, using Material-UI and Bootstrap.

Features
User Authentication: Secure login and registration with Firebase Authentication.
Category and Product Management: Add, edit, delete categories and products with real-time updates.
User Dashboard: Individualized dashboards with user-specific data and order histories.
Data Visualization: Statistics on products and purchases, visualized with Material-UI charts.
Responsive Design: Optimized for various screen sizes with Bootstrap and Material-UI.
Technologies Used
Frontend: React, Redux, Axios
Database: Firebase Firestore for data persistence
Authentication: Firebase Authentication for secure access
Styling: Bootstrap, Material-UI
Data Fetching: Axios for API requests
Getting Started
Prerequisites
Node.js (v14+)
Firebase account with Firestore and Authentication configured
Installation
Clone the repository:

git clone https://github.com/your-username/admin-console.git
cd admin-console
Install dependencies:


npm install
Set up Firebase:

In your Firebase console, create a new project and enable Firestore and Authentication.
Obtain your Firebase configuration details and create a .env file in the root of your project:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
Run the development server:


npm start
Open http://localhost:3000 to view it in the browser.

Usage
Login/Register: Create an account or log in with Firebase Authentication.
Manage Categories: Add, edit, and delete categories, which are organized as arrays of objects.
Manage Products: Add products, view product stats, and track inventory.
View Dashboard: View statistics and order details in user-specific dashboards.
Project Structure
src/components: Contains reusable UI components.
src/pages: Different pages for the application (e.g., Dashboard, Product Management).
src/redux: Redux slices and store configuration.
src/services: API calls and Firebase configuration.
src/styles: Custom styling and theme configurations.
License
This project is licensed under the MIT License.


