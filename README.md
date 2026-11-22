
# StudioSpace

### Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

StudioSpace is a full-stack marketplace that connects creative professionals with studio owners. Users can discover, explore, and book photography studios, film production spaces, podcast studios, music studios, and other creative workspaces.

The platform offers secure authentication, studio management, image galleries, and a streamlined booking experience.


## Live Website

**Live Site:** https://studiospace-client-tan.vercel.app/

**Frontend Repository:** https://github.com/Junaid-redart/studiospace-client

**Backend Repository:** https://github.com/Junaid-redart/studiospace-server

**Backend API:** https://studiospace-server-wheat.vercel.app/


## Key Features

1. **User Authentication:** Secure email/password and Google authentication using Better Auth.

2. **Studio Discovery:** Explore available studios with category filtering and search functionality.

3. **Studio Management:** Authenticated users can create, edit, and delete their own studio listings.

4. **Image Upload & Gallery:** Upload multiple studio images through ImgBB, manage gallery photos, and browse images using a carousel.

5. **Studio Booking:** Request studio bookings by selecting dates and time slots with automatic pricing calculations.

6. **Booking Management:** View booking history, track reservation status, and cancel pending bookings.

7. **Personal Dashboard:** View studio listings and booking statistics with quick navigation.

8. **Responsive Design:** A responsive interface for desktop, tablet, and mobile devices.

9. **Dark/Light Theme:** Switch between light and dark themes with persistent theme preferences.

10. **Feedback & Navigation:** Toast notifications, confirmation dialogs, loading states, and a custom 404 page.

## Technology Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Lucide React
- Sonner
- Next Themes

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Better Auth
- MongoDB Adapter
- Multer
- ImgBB API

## Project Structure

The project uses separate frontend and backend repositories.

**Frontend:** `studiospace-client`

**Backend:** `studiospace-server`

## Installation & Local Setup

### Prerequisites

- Node.js
- npm
- MongoDB database
- Google OAuth credentials
- ImgBB API key

### 1. Clone the repositories

Clone the frontend and backend repositories into separate folders.

### 2. Setup the Backend

Navigate to the backend directory:

```bash
cd studiospace-server
npm install
```

Create a `.env` file with the required configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
IMGBB_API_KEY=your_imgbb_api_key
```

Use the actual environment variable names configured in your backend.

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

Navigate to the frontend directory:

```bash
cd studiospace-client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AUTH_URL=http://localhost:5000
```

Use only the environment variables required by your frontend authentication configuration.

Start the frontend:

```bash
npm run dev
```

Open:

http://localhost:3000

## Application Routes

| Route | Description |
|---|---|
| `/` | Home |
| `/studios` | Explore Studios |
| `/studios/[id]` | Studio Details |
| `/login` | User Login |
| `/register` | User Registration |
| `/dashboard` | User Dashboard |
| `/add-studio` | Add New Studio |
| `/my-listings` | Manage Studio Listings |
| `/studios/edit/[id]` | Edit Studio |
| `/my-bookings` | Booking History |
| `/about` | About StudioSpace |

## Authentication & Authorization

StudioSpace uses Better Auth with MongoDB for user authentication and session management.

Protected operations require an authenticated user. Studio modifications are restricted to their respective owners.

## Booking System

Users can request studio reservations by selecting a booking date, start time, and end time.

The platform calculates the rental cost based on the hourly rate and selected duration, including the applicable security deposit.

New reservations are created with a Pending status. Users can cancel eligible pending bookings.

The backend checks booking conflicts against existing Confirmed reservations.

## Examiner Test Credentials

A dedicated demo account will be provided before submission.

**Email:** examiner.demo@example.com

**Password:** Password123

Use a dedicated test account rather than a personal account.

## Future Improvements

- Advanced studio availability calendar
- Online payments

**Studio Reviews & Ratings:** Authenticated guests can submit ratings and reviews. Average ratings and review counts appear on studio cards and details pages.
- Host-side booking confirmation workflow

## Author

Developed as a full-stack web development assignment.

## License

Created for educational and academic evaluation purposes.
