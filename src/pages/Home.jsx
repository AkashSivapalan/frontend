import React, { useEffect, useState } from "react";
import "./Home.css";
import { formatDate } from '../utils/formatDate'; 
import transactionService from "../utils/transactionService";

function Home() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [fraction, setFraction] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      await checkAuthStatus();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions(user.email);
    }
  }, [user]);

  const fetchTransactions = async (email) => {
    try {
      const transactions = await transactionService.getTransactions({ email });
      setTransactions(transactions.reverse());

      const { balance, fraction } = transactionService.getBalance(transactions);
      setBalance(balance);
      setFraction(fraction);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  async function checkAuthStatus() {
    try {
      const url = import.meta.env.VITE_REACT_APP_API_URL + '/check-auth';
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

  function handleSubmit(ev) {
    ev.preventDefault();

    if (
      datetime === "" ||
      description === "" ||
      name.split(" ").length < 2 ||
      isNaN(+name.split(" ")[0])
    ) {
      setError(true);
      return;
    }

    const price = name.split(" ")[0];
    const email = user.email;

    transactionService.postTransaction(price, name, description, datetime, email)
      .then(response => {
        if (response.ok) {
          response.json().then(() => {
            setName("");
            setDatetime("");
            setDescription("");
            setError(false);

            fetchTransactions(email);
          });
        } else {
          console.error('Transaction failed:', response.statusText);
          setError(true);
        }
      })
      .catch(error => {
        console.error('Transaction error:', error);
        setError(true);
      });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>
        ${balance}
        <span>.{fraction}</span>
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"+/-200 new tv"}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          />
        </div>

        <div className="description">
          <input
            type="text"
            placeholder={"description"}
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
        </div>
        <button type="submit">Add new transaction</button>
        {error ? (
          <label>Enter information in the correct fields before saving</label>
        ) : (
          ""
        )}
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction" key={transaction._id}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>

              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">{formatDate(transaction.datetime)}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default Home;
