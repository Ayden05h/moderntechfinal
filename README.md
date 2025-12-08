# moderntechfinal

## Project Description
The Small Business Data Visualizer is a web application that helps small business owners, entrepreneurs, and analysts quickly turn their sales and expense data into actionable insights. Many small business owners struggle to interpret raw data, and this tool bridges the gap by providing intuitive dashboards, KPI tracking, and AI-powered trend predictions.

## Target Users
- Small business owners
- Entrepreneurs
- Business analysts

## Core Features
- **Data Upload**: Import CSV or Excel files for analysis
- **KPI Tracker**: Automatic calculation of revenue growth, profit margin, and other key metrics
- **Visualization**: Interactive charts and dashboards for easy insights
- **AI Insights**: Trend predictions and actionable recommendations

## Technology Stack
- **Frontend**: React
- **Backend**: Python (Flask/FastAPI)
- **Database**: SQLite/PostgreSQL
- **Deployment**: Google Cloud Run / Docker

## AI Integration
- Predictive analytics using linear regression or time series models
- Recommendations based on KPI thresholds

## Project Status
- **Sprint 1 (MVP)**: Data upload, KPI calculations, basic charts
- **Sprint 2 (Full Project)**: AI predictions, dashboard summary, export reports, KPI customization

## (MVP)
- Upload CSV file
- Preview first 5 rows of data
- Automatic KPI calculation:
- Total revenue
- Total expenses
- Profit
- Revenue line chart
- Basic next-month revenue prediction using Linear Regression
- Fully containerized (frontend + backend)
## Technology Stack
- Frontend
- React
- Axios
- Chart.js
- Backend
- FastAPI
- Pandas
- scikit-learn
- Uvicorn
- Infrastructure
- Docker
- Docker Compose
- Google Cloud Run

## AI Tools Used
This project used AI tools like:
ChatGPT for backend design, React UI, Dockerfiles
GitHub Copilot for autocompleting functions and debugging
AI assistance logged for transparency

### Additional Features

- Predict next month expenses
- Download KPI report as CSV
- Color-coded chart with improved visualization
- Error handling for invalid CSV uploads

## Setup & Installation

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js & npm](https://nodejs.org/) (optional for local development)

### Running Locally

1. Clone the repository:

```bash
git clone https://github.com/Ayden05h/moderntechfinal.git
cd moderntechfinal
