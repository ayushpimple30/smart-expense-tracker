function ExpenseList({ expenses }) {
  return (
    <div>
      <h2>📋 Expense List</h2>
      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <ul>
          {expenses.map((exp, i) => (
            <li key={i}>
              ₹{exp.amount} - {exp.category} on {exp.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;
