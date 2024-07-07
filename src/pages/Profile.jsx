import React, { useEffect, useState } from 'react';
import { aggregateTransactionByMonth } from '../utils/aggregateTransactionByMonth';
import TransactionChart from '../components/TransactionChart';
import transactionService from "../utils/transactionService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState('AllTime');

  useEffect(() => {
    const fetchData = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions(user.email).then((filteredTransactions) => {
        setTransactions(filteredTransactions.reverse());
      });
    }
  }, [user]);

  useEffect(() => {
    filterTransactions(filter);
  }, [transactions, filter]);

  async function checkAuthStatus() {
    try {
      const url = import.meta.env.VITE_REACT_APP_API_URL + "/check-auth";
      const response = await fetch(url, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.status === 'ok') {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setUser(null);
    }
  }

  async function fetchTransactions(email) {
    try {
      const transactions = await transactionService.getTransactions({ email });
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  function filterTransactions(filter) {
    const now = new Date();
    let startDate;
    let endDate = new Date(now); 
    switch (filter) {
      case '3months':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        setFilteredTransactions(transactions);
        return;
    }
  
    const filtered = transactions.filter(transaction => {
      const date = new Date(transaction.datetime);
      return date >= startDate && date <= endDate; 
    });
  
    setFilteredTransactions(filtered);
  }

  const aggregatedData = aggregateTransactionByMonth(filteredTransactions);
  const labels = Object.keys(aggregatedData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });
  const data = Object.values(aggregatedData);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome {user?.name}</h1>
      <h2>Net value of transactions over each month</h2>
      <div className="filter-buttons">
        <button className="btn" onClick={() => setFilter('3months')}>3 Months</button>
        <button className="btn" onClick={() => setFilter('6months')}>6 Months</button>
        <button className="btn" onClick={() => setFilter('1year')}>1 Year</button>
        <button className="btn" onClick={() => setFilter('AllTime')}>All Time</button>
      </div>
      <TransactionChart data={data} labels={labels} />
    </div>
  );
}

export default Profile;
