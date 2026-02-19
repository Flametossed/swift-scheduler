# SwiftSchedule

SwiftSchedule is a smart, responsive employee scheduling application designed for small businesses to manage staff shifts, track weekly hours, and export schedules efficiently.

## 🚀 Features

* **Weekly Scheduling**: Easily assign, edit, and delete shifts across a standard work week.
* **Staff Management**: Add and manage staff members with specific positions and preferred maximum weekly hours.
* **Operating Hours Configuration**: Customize business hours for each day of the week, including setting days as closed.
* **Automated Hour Tracking**: Real-time calculation of total weekly hours per employee, with visual alerts for staff exceeding their preferred capacity.
* **CSV Export**: Export the finalized weekly schedule to a CSV file for physical distribution or record-keeping.
* **Dark Mode Support**: A fully responsive interface with a built-in dark and light mode toggle for better accessibility.
* **Local Persistence**: Automatically saves your schedule, staff, and settings to local storage so your data remains intact between sessions.

## 🛠️ Tech Stack

* **Frontend**: React (v18)
* **Styling**: Tailwind CSS with PostCSS
* **Icons**: Lucide React
* **Build Tool**: Vite
* **Deployment**: Optimized for Vercel

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/swift-scheduler.git
cd swift-scheduler

```


2. **Install dependencies:**
```bash
npm install

```


3. **Run the development server:**
```bash
npm run dev

```


4. **Build for production:**
```bash
npm run build

```



## 📂 Project Structure

* `src/App.jsx`: The main application logic, including state management for shifts, staff, and business settings.
* `src/main.jsx`: Application entry point.
* `src/index.css`: Global styles and Tailwind CSS directives.
* `public/`: Static assets including the application favicon.
* `vercel.json`: Configuration for seamless deployment on Vercel.

## 📄 License

This project is open-source and available under the **ISC License**.
