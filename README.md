# CS5200 ReMo Final Project

## Project Overview
This project is designed for the Remo database to create a Pipeline that takes in book data from multiple sources and puts it into one central database. It includes:
- **Frontend**: Built with React/Next.js for the user interface.
- **Backend**: Built with Node.js and Express for the API services.
- **Database**: MongoDB is used to store and manage the centralized book data.
- **Data Files**: MARC, ONIX, and CSV files for book data resources.
- **ER Diagram**: A visual representation of the database structure (located in the `diagram` folder).
- **Slides**: The slides to demonstrate our work and how to process different forms of book data to JSON and insert into MongoDB.
  - [Slides Link](https://docs.google.com/presentation/d/19rLKKA48c1Xn4Cw7Xue8VtIwqmbSotrfEWQ1UJVZCp0/edit#slide=id.g258719f2195_0_0)

## Repository Structure
- `frontend/`: Frontend application
- `backend/`: Backend API services
- `diagram/`: Contains the ER Diagram of the database structure.

## Team Member
- Rong Huang
- Jianyu She
- Xin Jiang

## How to Run the Project
We have already deployed it on Vercel, you can directly visit our website using this link: [CS5200 Final Project](https://cs5200final.vercel.app/)

You should also run it on your local machine as follows:

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or later)
- npm

### Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
2. Install dependencies:
   ```bash
   npm install
3.  Start the backend server:
   ```bash
  node storeData.js
   ```

### frontend
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3.  Start the development server:
   ```bash
   npm run dev
   ```

## Environment Configuration
Create a `.env` file in the `frontend` directory with the following variables:
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password

**Important**: 
- Keep your `.env` file private
- Do not commit it to version control
- Each team member should create their own `.env` file locally

## Notes
Configure .env files as necessary for frontend.
