## 1. Overview
**Product Management**  **server-side rendering** web app for managing product categories and items. It uses Pug templates to render HTML on the server, alongside full CRUD, pagination, search & filter, and user authentication/authorization.

## 2. Tech Stack
- **Language & Runtime:** JavaScript (Node.js ≥14.x)
- **Web Framework:** Express.js
- **Rendering:** Server-Side Rendering (Pug)
- **Database:** MongoDB (Mongoose)
- **Email Service:** Nodemailer (OTP & notifications)
- **Deployment:** Vercel

  ## 3. Key Features
- **User Auth:**  
  - Register & login with email OTP verification  
- **Category Management:**  
  - Create, read, update, delete categories  
- **Product Management:**  
  - Create, read, update, delete products  
  - Link products to categories  
- **Search & Filter:**  
  - Keyword search by name  
  - Filter by price, category, status  
- **Pagination:**  
  - Page & limit support for lists  
- **Status Control:**  
  - Activate/deactivate products & categories
  
  ## 4. Installation & Usage
  
  1. **Clone the repository**  
     ```bash
     git clone https://github.com/PhatNgo03/BE-Production
     cd product-management
   npm install
   npm run dev    # Development mode with nodemon
   npm start      # Production mode
