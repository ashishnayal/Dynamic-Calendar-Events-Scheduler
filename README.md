# Nettu Scheduler (Enterprise Edition)

A dynamic, large-scale scheduling application inspired by the incredible open-source project [Nettu Scheduler](https://github.com/fmeringdal/nettu-scheduler). 

**All credit for the original concept and architecture goes to the Nettu Scheduler team.** 

While the original Nettu Scheduler is beautifully built using Rust and PostgreSQL, many large enterprise organizations rely heavily on Java ecosystems and NoSQL databases for massive scale. This project provides a reference implementation utilizing **Spring Boot** and **MongoDB**, tailored for developers and companies looking for an enterprise-grade scheduler built with these specific technologies.

## Architecture & Tech Stack

This project is separated into two main microservices:

1. **Backend (Spring Boot + MongoDB)**
   - Exposes RESTful APIs (`/api/v1/...`) for managing accounts, users, calendars, schedules, services, and bookings.
   - Built with Java 17 and Spring Boot.
   - Uses MongoDB for highly scalable, schema-less document storage.
   - Containerized via Docker.

2. **Frontend (Next.js + React)**
   - A modern, glassmorphism-styled UI designed for testing the backend endpoints.
   - Contains an **API Tester** for calling individual routes manually with a dynamic UI.
   - Features an **End-to-End Workflow** wizard that orchestrates step-by-step entity creation to test the entire scheduling flow automatically.

## Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose must be installed on your machine.

## How to Run the Project

The entire system is orchestrated via Docker Compose, which spins up the Next.js Frontend, Spring Boot Backend, and MongoDB Database automatically.

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd nettu-scheduler-master
   ```

2. **Run Docker Compose:**
   Run the following command in the root directory:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the Application:**
   Once the containers are successfully built and running:
   - **Frontend UI**: Open [http://localhost:3001](http://localhost:3001) in your browser.
   - **Backend API**: Running on `http://localhost:8081` (The frontend communicates with this internally).
   - **MongoDB**: Exposed on port `27017`.

## Features
- **Accounts & Users**: Multi-tenant structure.
- **Calendars & Schedules**: Custom timezones, week starts, and configurable availability rules.
- **Services**: Define bookable events (e.g., "15 Min Meeting").
- **Booking Intents**: Lock in timeslots efficiently based on live calendar availability.
- **Interactive UI**: The included Next.js frontend lets you test these flows seamlessly without using external tools like Postman.

## Acknowledgements
Once again, a massive shoutout to the original [Nettu Scheduler](https://github.com/fmeringdal/nettu-scheduler) for the inspiration and structure that paved the way for this enterprise adaptation.
