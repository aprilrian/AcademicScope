# AcademicScope

This repository contains the source code for the AcademicScope, developed as a university assignment for the Software Project subject at Universitas Diponegoro, is a comprehensive web application. It employs Next.js for the frontend and Express.js for the backend, facilitating efficient tracking of students' grades and academic progress.

## Features

AcademicScope offers the following features:

1. New Student Data Entry (Upload): Upload new student data using the provided template, including fields such as Student ID (NIM), name, year of enrollment, advisor code, and status (ACTIVE). Ability to batch upload data via .csv file. Account access is automatically generated for each student upon upload .
2. Self-Update Personal Data: Students can independently update their personal data, excluding Student ID and year of enrollment. Upon initial login, completion of all required data elements is mandatory. Access to other features is restricted until all necessary information is provided.
3. Semesterly Course Registration (IRS): Record the courses taken by students each semester.
4. Academic Achievement Entry (KHS): Input academic achievements and grades for each semester.
5. Internship Progress Entry (PKL): Document the progress of students during internships.
6. Thesis Progress Entry: Record the progress of thesis work, including the defense date and study duration in semesters.
7. Study Progress Verification: Verify study progress, including IRS, KHS, PKL, and Thesis. Approval can be granted directly if the data is accurate; otherwise, updates are required based on supporting documents.
8. Student Study Progress Search: Search for student study progress for each semester based on Student ID and/or name.
9. Program Operator Profile and Dashboard: Access to profile and dashboard features for program operators.
10. Student Profile and Dashboard: Access to profile and dashboard features for students.
11. Advisor Profile and Dashboard: Access to profile and dashboard features for academic advisors.
12. Department Profile and Dashboard: Access to profile and dashboard features for departments.
13. Summary of Graduated Students without Internship for All Cohorts: Compilation of students who have graduated but haven't completed internships for all cohorts.
14. List of Graduated Students without Internship for All Cohorts: Detailed list of students who have graduated but haven't completed internships for all cohorts.
15. Summary of Graduated Students without Thesis for All Cohorts: Compilation of students who have graduated but haven't completed the thesis for all cohorts.
16. List of Graduated Students without Thesis for All Cohorts: Detailed list of students who have graduated but haven't completed the thesis for all cohorts.
17. Cohort-wise Summary of Students Based on Status: Summary of students based on their status presented per cohort, with an accompanying list of students.

## Technologies Used

AcademicScope is developed using the following technologies:

- Frontend (client):
  - Next.js: A React-based framework for building server-side rendered and static websites.
  - React: A JavaScript library for building user interfaces.
  - HTML, CSS, and JavaScript: Standard web development technologies for creating interactive web pages.

- Backend (server):
  - Express.js: A flexible Node.js framework for building web applications and APIs.
  - PostgreSQL:  An open-source relational database management system (RDBMS) known for its extensibility, robustness, and support for advanced data types and features.

## Installation and Setup

To run the AcademicScope locally, follow these steps:

1. Clone this repository to your local machine.
2. Make sure you have Node.js and npm (Node Package Manager) installed.
3. Install the project dependencies by running the following command in your terminal:
   ```
   npm install
   ```
4. Set up the PostgreSQL database and obtain the necessary connection credentials.
5. Create a `.env` file in the project root directory and populate it with the MongoDB connection details. You can refer to the `.env.example` file for the required variables.
6. Start the development server by running the following command:
   ```
   npm run dev
   ```
7. Access the application locally in your browser at `http://localhost:3000`.

Please note that the above steps assume you have already set up a PostgreSQL database and configured it properly. If you haven't done so, please refer to the PostgreSQL documentation for guidance.

## Deployment

AcademicScope can be deployed to various hosting platforms that support Next.js applications. Some popular options include Vercel, Netlify, and Heroku.

To deploy the application, follow the hosting platform's instructions for deploying Next.js applications. Make sure to set up the necessary environment variables and configure the PostgreSQL connection details accordingly.

## Contributing

Contributions to the AcademicScope project are welcome! If you find any issues or want to propose new features, please open an issue in this repository. You can also submit pull requests to contribute directly to the codebase.

When contributing, please follow the existing code style and conventions. Ensure that your changes are well-tested and provide clear documentation.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute the code as per the terms of the license.
