# 🧬 VitalSource Frontend

**VitalSource** is an interactive full-stack simulation platform that visualizes the genetic and cellular impact of medical treatments on human lifespan and population dynamics. This is the frontend portion of the project, built with modern technologies to support real-time updates and rich data visualization.

### 🔗 Live URL
Frontend: [https://vital-source-front-end-ariw-git-01ef6e-lucas-projects-f61d5cb5.vercel.app/]([https://vitalsource-frontend.vercel.app](https://vital-source-front-end-ariw-git-01ef6e-lucas-projects-f61d5cb5.vercel.app/))

Backend: [https://vitalcore.onrender.com](https://vitalsource-backend.onrender.com)

---

## 🚀 Features

- 🧾 **Signup & Login** with secure authentication (JWT)
- 🧬 **Create & Edit Genes** that influence lifespan by %
- 📊 **View Cells** displaying lifespan and genetic data
- 📈 **Aging Trends Chart** powered by Chart.js
- 🧑‍🤝‍🧑 **Population Effects Simulation** to show how treatment scales
- 🧪 **Boost Treatment**: apply a 10% innovation bonus and watch the population/lifespan grow
- 🔁 **Real-time updates** with `socket.io`

---

## 🧱 Tech Stack

### 🖥 Frontend
- **Next.js 15**
- **React 18 + TypeScript**
- **Tailwind CSS** for utility-first styling
- **Chart.js** via `react-chartjs-2`
- **GraphQL** via `graphql-request`
- **Socket.IO Client** for real-time events

### 🔧 Backend (connected)
- **Node.js + Express**
- **MySQL + Sequelize**
- **JWT + Bcrypt** for authentication
- **Socket.IO** for real-time data
- **GraphQL endpoint** for queries & mutations

---

## 📦 Installation

```bash
git clone https://github.com/lyepez-glitch/VitalSource-FrontEnd.git
cd VitalSource-FrontEnd
npm install
npm run dev

Project Structure

/app
  ├── components     // Reusable UI pieces
  ├── charts         // Chart-specific components
  ├── graphql        // Queries and mutations
  ├── pages          // Next.js routing structure
  ├── styles         // Tailwind and custom CSS
Demo Use Case
Register and log in

View your cell population and average lifespan

Create a new gene that increases lifespan

See the effects reflected in charts

Apply a 10% innovation bonus to simulate new treatment breakthroughs

🛠 Build Info
Built With: create-next-app

TypeScript-first

Deployed on: Vercel

Real-time simulation powered by: socket.io-client

🧪 Future Enhancements
Admin dashboard for simulation control

Export results to CSV or PDF

Enhanced genetic editing visualization

Global leaderboard of top treatments

📬 Contact
Built by Lucas Yepez
📫 LinkedIn
🌐 Portfolio

📝 License
This project is licensed under the ISC License.









