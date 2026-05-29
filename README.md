# Realtime Incident Orchestration Platform

A realtime incident management and monitoring platform built using the MERN stack.

## Features

* JWT Authentication with HTTP-only Cookies
* Role Based Access Control (RBAC)
* Incident Classification Engine
* Automatic Team Assignment
* Least-Load Responder Assignment
* Realtime Updates using Socket.io
* Escalation Engine
* Simulated Alert Generator
* Email Notifications for High & Critical Incidents
* Incident Lifecycle Management
* Analytics Dashboard

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB
* Socket.io
* Nodemailer

## Incident Workflow

```txt
Alert Generated
↓
Incident Created
↓
Classification & Routing
↓
Assignment to Responder
↓
Realtime Dashboard Update
↓
Escalation (if unresolved)
↓
Resolution
```

## Roles

### ADMIN

* Access all incidents
* Manage all incidents

### RESPONDER

* Access only assigned incidents
* Manage assigned incidents

## Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Environment Variables

```env
PORT=
MONGO_URI=
JWT_SECRET=

EMAIL_USER=
EMAIL_PASS=
```
