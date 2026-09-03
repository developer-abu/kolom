<div align="center">

# ✍️ Kolom

### A Full-Stack Storytelling Platform

<p>
  A full-stack web application where users can create accounts,
  verify their email using OTP, manage their profiles,
  and publish their own stories with images.
</p>

<br />

<a href="https://kolom-omega.vercel.app/">
  <img src="https://img.shields.io/badge/🌐%20LIVE%20DEMO-Kolom-000000?style=for-the-badge" alt="Live Demo" />
</a>

<a href="https://github.com/developer-abu/kolom">
  <img src="https://img.shields.io/badge/💻%20SOURCE%20CODE-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
</a>

<br /><br />

<img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
<img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary" />

</div>

<br />

---

## 📖 About The Project

**Kolom** is a full-stack storytelling platform built as a practice and learning project.

The application allows users to:

- Create an account
- Verify their account using OTP
- Log in securely
- Manage their profile
- Upload profile images
- Write and publish stories
- Upload images with stories
- Store images securely using Cloudinary

The project was created to gain practical experience in building, connecting, and deploying a complete full-stack application.

---

## 🌐 Live Project

<div align="center">

### 🚀 Try Kolom

<a href="https://kolom-omega.vercel.app/">
  <img src="https://img.shields.io/badge/Visit%20Kolom-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Visit Kolom" />
</a>

<br /><br />

<a href="https://kolom-omega.vercel.app/">
  https://kolom-omega.vercel.app/
</a>

</div>

---

## 💻 Source Code

<div align="center">

<a href="https://github.com/developer-abu/kolom">
  <img src="https://img.shields.io/badge/View%20Source%20Code-GitHub-181717?style=for-the-badge&logo=github" alt="Source Code" />
</a>

<br /><br />

<a href="https://github.com/developer-abu/kolom">
  https://github.com/developer-abu/kolom
</a>

</div>

---

# ✨ Features

<table>
<tr>
<td width="50%" valign="top">

## 👤 Authentication

- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- User verification
- Profile management

</td>

<td width="50%" valign="top">

## 📧 OTP Verification

- OTP generation
- OTP email delivery
- OTP expiration
- OTP verification
- Account verification
- Unverified account protection

</td>
</tr>

<tr>
<td width="50%" valign="top">

## ✍️ Story Publishing

- Create stories
- Add story title
- Write story content
- Upload story images
- Store user-specific stories
- Display published stories

</td>

<td width="50%" valign="top">

## 🖼️ Image Upload

- Profile image upload
- Story image upload
- JPG support
- JPEG support
- PNG support
- File size validation
- Cloudinary integration

</td>
</tr>

<tr>
<td width="50%" valign="top">

## ☁️ Cloud Storage

- Cloudinary image storage
- Profile image storage
- Story image storage
- Image deletion
- Cloudinary public ID management

</td>

<td width="50%" valign="top">

## 🔐 Security

- JWT authentication
- bcrypt password hashing
- Protected API routes
- Environment variables
- OTP expiration
- File validation

</td>
</tr>
</table>

---

# 🛠️ Technology Stack

<div align="center">

| Layer | Technologies |
|:---:|:---|
| 🎨 **Frontend** | React, Vite, Tailwind CSS, JavaScript |
| ⚙️ **Backend** | Node.js, Express.js |
| 🗄️ **Database** | MongoDB, Mongoose |
| 🔐 **Authentication** | JWT, bcrypt |
| 📧 **Email** | Nodemailer |
| 📤 **File Upload** | Multer |
| ☁️ **Image Storage** | Cloudinary |
| 🚀 **Frontend Hosting** | Vercel |
| 🚀 **Backend Hosting** | Render |

</div>

---

# 🏗️ Application Architecture

<div align="center">

```text
                         ┌─────────────────┐
                         │      USER       │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ React + Vite    │
                         │    Frontend     │
                         └────────┬────────┘
                                  │
                              REST API
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Node.js +       │
                         │ Express.js      │
                         └───────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
             ┌──────────┐ ┌───────────┐ ┌────────────┐
             │ MongoDB  │ │Cloudinary │ │   Resend │
             │ Database │ │   Images  │ │   Email    │
             └──────────┘ └───────────┘ └────────────┘