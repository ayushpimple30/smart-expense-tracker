// src/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Category → Icon mapping
const categoryIcons = {
  food: "🍔",
  travel: "✈️",
  shopping: "🛍️",
  bills: "💡",
  rent: "🏠",
  entertainment: "🎬",
  health: "💊",
  salary: "💼",
  other: "📝",
};

const Dashboard = () => {
  const [income, setIncome] = useState(2000);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: "", amount: "" });
  const [tips, setTips] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedIncome = localStorage.getItem("income");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedIncome) setIncome(parseFloat(savedIncome));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("income", income);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [income, expenses]);

  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  // Bar chart data
  const barData = {
    labels: expenses.map((exp) => getCategoryLabel(exp.category)),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map((exp) => exp.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Pie chart data
  const pieData = {
    labels: expenses.map((exp) => getCategoryLabel(exp.category)),
    datasets: [
      {
        data: expenses.map((exp) => exp.amount),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Format category with icon
  const getCategoryLabel = (category) => {
    const key = category.toLowerCase();
    return `${categoryIcons[key] || categoryIcons["other"]} ${category}`;
  };

  // Add new expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.category || !newExpense.amount) return;

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
      },
    ]);

    setNewExpense({ category: "", amount: "" });
  };

  // Update income
  const handleIncomeChange = (e) => {
    setIncome(parseFloat(e.target.value) || 0);
  };

  // Delete expense
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Clear all
  const handleClearData = () => {
    localStorage.removeItem("income");
    localStorage.removeItem("expenses");
    setIncome(2000);
    setExpenses([]);
    setTips([]);
  };

  // AI Tips
  useEffect(() => {
    let newTips = [];
    const food = expenses.find((e) => e.category.toLowerCase() === "food");
    const travel = expenses.find((e) => e.category.toLowerCase() === "travel");
    const shopping = expenses.find((e) => e.category.toLowerCase() === "shopping");

    if (food && food.amount > income * 0.3) {
      newTips.push("🍔 Too much on Food. Try cooking at home more often.");
    }
    if (travel && travel.amount > income * 0.2) {
      newTips.push("✈️ High Travel costs. Use public transport or ride-share.");
    }
    if (shopping && shopping.amount > income * 0.25) {
      newTips.push("🛍️ Shopping is high! Set a monthly budget cap.");
    }
    if (totalExpenses > income * 0.8) {
      newTips.push("⚠️ Expenses too close to income. Save at least 20%.");
    }
    if (income - totalExpenses > income * 0.3) {
      newTips.push("✅ Great! You are saving more than 30% of your income.");
    }

    setTips(newTips);
  }, [expenses, income]);

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
      <h1 style={{ color: "#2c3e50" }}>💰 Smart Expense Tracker</h1>

      {/* Income */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold" }}>Set Income:</label>
        <input
          type="number"
          value={income}
          onChange={handleIncomeChange}
          style={{
            marginLeft: "10px",
            padding: "6px 10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
      </div>

      <h3 style={{ color: "#27ae60" }}>Total Expenses: ₹{totalExpenses}</h3>
      <h3 style={{ color: "#2980b9" }}>Savings: ₹{income - totalExpenses}</h3>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Category (e.g. Food, Travel)"
          value={newExpense.category}
          onChange={(e) =>
            setNewExpense({ ...newExpense, category: e.target.value })
          }
          required
          style={{
            marginRight: "10px",
            padding: "6px 10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          required
          style={{
            marginRight: "10px",
            padding: "6px 10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "6px 14px",
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ➕ Add Expense
        </button>
      </form>

      {/* Expense List Table */}
      {expenses.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#34495e", color: "white" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr
                key={exp.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#f9f9f9" : "#ffffff")
                }
              >
                <td style={{ padding: "10px" }}>{getCategoryLabel(exp.category)}</td>
                <td style={{ padding: "10px" }}>₹{exp.amount}</td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    style={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Clear Data */}
      <button
        onClick={handleClearData}
        style={{
          backgroundColor: "#e67e22",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        🗑️ Clear All Data
      </button>

      {/* Charts */}
      <div style={{ maxWidth: "600px", marginBottom: "30px" }}>
        <Bar data={barData} />
      </div>
      <div style={{ maxWidth: "400px" }}>
        <Pie data={pieData} />
      </div>

      {/* AI Tips */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ color: "#8e44ad" }}>🤖 Smart AI Tips</h2>
        {tips.length > 0 ? (
          <ul>
            {tips.map((tip, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                {tip}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tips yet. Add some expenses to get insights!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
