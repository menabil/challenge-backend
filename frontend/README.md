# Smart Auth & Doctor Appointment System

Node.js + Express + MongoDB (Mongoose) + Cloudinary ব্যাকএন্ড, আর React (Vite) + Tailwind (dark theme) ফ্রন্টএন্ড।

**Note:** এই ভার্সনে client এর অনুরোধ অনুযায়ী JWT token এবং bcryptjs ব্যবহার করা হয়নি — password plain text এ সেভ হয় এবং login state ফ্রন্টএন্ডে (localStorage) সরাসরি email দিয়ে track করা হয়। Medical report image local disk এর বদলে Cloudinary তে আপলোড হয়।

## Folder Structure

```
project/
├── backend/
│   ├── config/
│   │   ├── db.js            -> MongoDB connection (username/password/dbname দিয়ে)
│   │   ├── cloudinary.js     -> Cloudinary config
│   │   └── mailer.js         -> Nodemailer transporter
│   ├── models/
│   │   ├── User.js
│   │   └── Appointment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── appointmentController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── appointmentRoutes.js
│   ├── middleware/
│   │   └── upload.js          -> Multer + Cloudinary storage
│   ├── utils/
│   │   └── sendEmail.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthFlow.jsx        -> Email -> Password ধাপে ধাপে login/register
    │   │   ├── AppointmentForm.jsx -> নতুন appointment বুকিং ফর্ম
    │   │   └── AppointmentList.jsx -> Serial number ticket style card list
    │   ├── api.js                  -> সব backend API call এক জায়গায়
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html                  -> Tailwind CDN + dark theme + fonts
    ├── package.json
    └── .env.example
```

## Backend Setup

1. `backend` ফোল্ডারে গিয়ে dependencies install করুন:
   ```
   cd backend
   npm install
   ```
2. `.env.example` কপি করে `.env` বানান এবং নিজের তথ্য বসান:
   ```dotenv
   MONGODB_USERNAME=""
   MONGODB_PASSWORD=""
   MONGODB_DBNAME=""
   MONGODB_CLUSTER=""   # Atlas হলে cluster address, local হলে খালি রাখুন

   CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""

   EMAIL_USER=""
   EMAIL_PASS=""
   ```
3. সার্ভার চালু করুন:
   ```
   npm run dev
   ```
   ডিফল্টভাবে `http://localhost:5000` এ চলবে।

## Frontend Setup

1. `frontend` ফোল্ডারে গিয়ে dependencies install করুন:
   ```
   cd frontend
   npm install
   ```
2. `.env.example` কপি করে `.env` বানান (backend যদি অন্য পোর্টে চলে তবে বদলে দিন):
   ```dotenv
   VITE_API_URL=http://localhost:5000/api
   ```
3. Dev server চালু করুন:
   ```
   npm run dev
   ```
   ডিফল্টভাবে `http://localhost:5173` এ চলবে এবং সরাসরি backend এর সাথে connected থাকবে।

## API Endpoints

### Auth (`/api/auth`)

| Method | Route         | Body                              | কাজ |
|--------|----------------|-------------------------------------|-----|
| POST   | /check-email   | `{ "email": "" }`                  | Account আছে কি না চেক করে |
| POST   | /register      | `{ "email": "", "password": "" }`  | নতুন account তৈরি |
| POST   | /login         | `{ "email": "", "password": "" }`  | Login করে |

### Appointments (`/api/appointments`)

| Method | Route              | Body (form-data)                                                          | কাজ |
|--------|---------------------|------------------------------------------------------------------------------|-----|
| POST   | /                  | email, phone, age, doctorName, appointmentDate, medicalReportImage (file)     | নতুন appointment বুকিং, Serial Number auto জেনারেট, confirmation email |
| GET    | /:email            | -                                                                              | ওই email এর সব appointment লিস্ট |
| PATCH  | /:id/status        | `{ "status": "Approved" }`                                                    | Status update |
| DELETE | /:id               | -                                                                              | Appointment + Cloudinary image delete |

## Flow Summary

1. ফ্রন্টএন্ড প্রথমে শুধু email দিয়ে `/api/auth/check-email` কল করে।
2. নতুন ইউজার হলে password set করার ফর্ম, পুরাতন হলে password দেওয়ার ফর্ম দেখায়।
3. Login/Register সফল হলে email টা localStorage এ রেখে দেওয়া হয় (JWT ছাড়া simple login state)।
4. Appointment বুকিং এর সময় email সহ সব তথ্য এবং ছবি Cloudinary তে আপলোড হয়ে সেভ হয়।
5. একই ডাক্তার + একই তারিখে ইউজারের আগের বুকিং থাকলে error দেখায়, না থাকলে Serial Number অটো generate করে সেভ করে এবং confirmation email পাঠায়।
6. Appointment delete করলে DB record এর পাশাপাশি Cloudinary থেকেও ছবি মুছে যায়।
