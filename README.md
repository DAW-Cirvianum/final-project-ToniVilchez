[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/nMSQJoxi)
# **Final Project: Build a Full-Stack Web Application** 
## **Introduction**

In this project, you will use everything you have learned in the course to create a modern web application. You will work with tools like **React+Vite** (for the front-end) and **Laravel** (for the back-end) to build a complete application. The project will also focus on **user experience (UX)** and **user interface (UI)** design, making sure the application is easy to use, looks good, and works well for everyone.

## **Goals** 

- **Learn MVC (Model-View-Controller)**:  
   Understand how the MVC structure works by using **Laravel**. You will organize the code into models, views, and controllers to keep everything clear and easy to manage.  
- **Connect Front-End and Back-End**:  
   Combine the **React \+ Vite**(for the user interface) with **Laravel** (for the database and server logic) to create a full-stack application.  
- **Work with Databases**:  
   Add a database to your project to save and manage data. You will use Laravel to create tables, store data, and handle CRUD operations (Create, Read, Update, Delete).  
- **Modern Front-End Development**:  
   Use advanced front-end techniques like server-side rendering, dynamic routing, and state management with React+Vite. Create a website that works well on all devices.  
- **Improve Usability and Accessibility**:  
   Make sure your application is user-friendly, easy to navigate, and accessible to everyone, including people with disabilities.  
- **Internationalization (i18n)**  
   Make the application adapt to the user’s language and, if not defined, to the browser’s default language.

## **What You Will Create** 

At the end of the project, you will have:

- A working web application where the **front-end (Vite+React)** and **back-end (Laravel)** work together.  
- Experience in creating features like user login, saving data to a database, and showing information on the website.  
- A clean and responsive design that looks good and works well on mobile devices and desktop computers.  
- A document explaining how your project works, the challenges you faced, and how you solved them.

## **Backend project** 

The **back-end** of your project must operate as an **API** that provides several **endpoints** to the **front-end**.  
 This means your application must define **how data is exchanged** between the client and the server. The most common format is **JSON**, but you may also return **arrays**, **objects**, or any other structure that fits your application’s logic.

The goal is that the front-end can *request data* or *send information* through HTTP methods (GET, POST, PUT, DELETE), and the back-end responds in a **consistent**, **structured**, and **predictable** way.

However, an API must also ensure that **only authorized users** can access certain functionalities. For this reason, you must implement:

- **Authentication** (verifying the identity of the user),  
- **Route protection** (blocking access to restricted areas for unauthenticated users).

These mechanisms can be implemented in several ways, such as:

- Using **tokens** (e.g., Laravel Sanctum or JWT),  
- Using **session-based** authentication handled by the server,

The important part is that the **data flow** between the back-end and the front-end remains secure, well-structured, and easy to maintain.

## Backend \- Requirements 

### **DataBase ** 

The application's database must manage a minimum of 7 entities or tables, and all must be properly related:  
Remember:

- Table names should be in plural and lowercase.  
- Model names should be singular and start with an uppercase letter.  
- Fields in the tables that establish relationships should be named user\_id, ticket\_id, image\_id, etc.

A database schema must be provided, including the fields or columns of the tables and their relationships.Additionally, a brief explanation of the schema must be included with the database schema. 

Your project must include at least one migration for each model. Additionally, there should be two or more migrations that add fields or modify fields in a previous migration.

Your code must include factories and seed to fill the database with fake data.

### **Authentication** 

- The application's routes must be protected except for those that are not necessary, such as home, login, or register.  
 The authentication must manage two types of users roles, for example, admin and user. You can manage authentication using differents ways:  
  - Inside the controller  
  - With middleware  
  - With token abilities  
- User authentication must be possible using either a username or an email address.  
- Password recovery must be implemented through email.  
- Bearer Token

### **API Documentation ** 

- It’s necessary swagger documentation for each endpoint  
- API must return combinated select. For example:  
  - The tasks from an specific user  
  - Appointments between two dates  
  - Best rated books

### **Functionality ** 

- The user with the "user" role must be able to perform CRUD operations on the application's items (images, products, etc.).(1p)  
- The admin must be able to edit the application's users, such as changing roles, updating names, emails, etc., in addition to managing other functionalities of the application

**Admin Functionality**

At least **one of the administrator features** must be managed **from the back-end** using **Blade views**. This means that even though your project includes an API for communication with the front-end, the admin area can work in a more traditional server-rendered way.

A common example is **user management**:

- The admin can view the list of users.  
- Update user data.  
- Activate, deactivate or delete accounts.  
- Access protected pages rendered with Blade.

This requirement demonstrates your ability to combine:

- API \+ front-end (for the public/user-facing part),  
- Back-end with Blade (for internal tools and administration).

### **Extra Features:** 

- Use of an external API 
- Mail verification  
- Authentication with Google. 

## Front\-End Requirements

### **Routes and Navigation** 

- The application must include **nested and dynamic routes**, using React routing system effectively:  
   Example:  
    - `/products`: Displays a list of products.  
    - `/products/:id`: Displays detailed information about a single product.  
    - `/dashboard`: A protected route with nested child routes like `/dashboard/settings` or `/dashboard/reports`.  
- **Error boundaries** must be implemented for all routes, providing clear feedback for missing data (e.g., "Product not found").

### **State Management** 

- Use **Actions** to handle state and data operations:  
  - Implement a **global notification system** for success/error messages after actions (e.g., "Product saved successfully").  
  - Example:  
    - Submitting a form to update product information triggers a success notification displayed across the app.  
  - Ensure temporary UI states like **modals** or **dropdowns** are managed effectively. 


### **Forms and Validations** 

- Create at least **two advanced forms**:  
  - Example 1: A product creation form with:  
    - **Server-side validation**: Ensure fields like `price` and `name` are valid before saving.  
    - Dynamic field generation: Allow adding/removing tags or categories dynamically.  
  - Example 2: A search filter form with:  
    - **Client-side validation** for instant feedback.  
    - Integration with React to filter results (e.g., filter products by price range, category, or availability).

### **Data Fetching and Mutations** 

- Perform **CRUD operations**:  
  - Example: A "Product" entity and an "Order" entity.  
    - Users must be able to:  
      - Create, view, edit, and delete products.  
      - Place and manage orders.  
  - Ensure loaders handle pagination for large datasets (e.g., display products 10 at a time with navigation).

### **Responsive and Accessible Design** 

- The application must be **responsive** and tested on various devices:  
  - Example: A mobile-friendly navigation bar that becomes a hamburger menu on smaller screens.  
- Ensure **accessibility standards**:  
  - All interactive elements (buttons, links, forms) must be keyboard-accessible.  
  - Include ARIA attributes for modals and dropdowns.  
  - Use a tool like Lighthouse to ensure a score of at least **90%** for accessibility.

### **UX/UI Elements** 

- Include at least **two modern UX/UI elements**:  
  - Example:  
    - A **drag-and-drop interface** for reordering items in a list (e.g., reorder product categories).  
    - A **modal dialog** for editing items without leaving the page.  
  - Ensure smooth animations and transitions for a polished look.  


### **Code Quality and Organization \+ Documentation** 
- Organize your code clearly:  
  - Example:  
    - Create a folder structure that separates components, routes, and utility functions.  
    - Use reusable components for shared UI elements (e.g., buttons, modals, form inputs).  
  - Add meaningful comments for complex sections of the code.

### **Extra: Advanced Features.**  

- **Ex: File Upload and Display**:  
  - Example: A user can upload a product image. The image preview is shown immediately, and the file is stored in the backend.  
    - **Dark Mode Toggle**:  
      - Example: Allow users to switch between light and dark themes. Persist the theme in localStorage or the database.  
    - **Dashboard Analytics**:  
      - Example: Create a dashboard with charts and graphs showing key statistics (e.g., total sales, top products). Use a library like Chart.js or D3.js.  
    - **Real-Time Data**:  
      - Example: Use a WebSocket or a polling strategy to update data in real-time (e.g., show live updates of orders being placed).  

## Delivery requirements

- The project must be delivered through a GitHub repository.  
  - There is one repo for all the project  
- The project must include a link in Readme with   
  - the database schema  
  - Description of the project functionality, explaining controllers, models and views.  
- One chapter for server and one for client
- Installation instructions  
  - Instruction to set your project into production  
- Delivery date: **16-01-26.** 

