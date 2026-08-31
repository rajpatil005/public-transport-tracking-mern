import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


// post http://localhost:5000/api/email/test
// {
//   "email": "aryanpatil7050@gmail.com"
// } 
// python -m uvicorn app.main:app --reload --port 8000

// backend url - https://public-transport-tracking-mern-1.onrender.com/api
