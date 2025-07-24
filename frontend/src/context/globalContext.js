import React, { useContext, useState } from "react";
import axios from "axios";


const BASE_URL = process.env.REACT_APP_BASE_URL || "https://expensetracker-mern-a3tv.onrender.com/api/v1/";

// const BASE_URL = "http://localhost:5000/api/v1/";

console.log("BASE_URL:", BASE_URL);
console.log("Environment BASE_URL:", process.env.REACT_APP_BASE_URL);

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Incomes
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add income.");
            console.error("Add Income Error:", err);
        }
    };

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
            console.log("Incomes fetched:", response.data);
        } catch (err) {
            setError("Failed to fetch incomes.");
            console.error("Get Incomes Error:", err);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError("Failed to delete income.");
            console.error("Delete Income Error:", err);
        }
    };

    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };

    // Expenses
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add expense.");
            console.error("Add Expense Error:", err);
        }
    };

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
            console.log("Expenses fetched:", response.data);
        } catch (err) {
            setError("Failed to fetch expenses.");
            console.error("Get Expenses Error:", err);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError("Failed to delete expense.");
            console.error("Delete Expense Error:", err);
        }
    };

    const totalExpenses = () => {
        return expenses.reduce((acc, expense) => acc + expense.amount, 0);
    };

    // Balance and History
    const totalBalance = () => totalIncome() - totalExpenses();

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);