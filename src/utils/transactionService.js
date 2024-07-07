

const getTransactions = async(user)=>{
    try {
        const url = import.meta.env.VITE_REACT_APP_API_URL + "/transactions/"+user.email;
        const response = await fetch(url, {
          credentials: 'include' // Include credentials to send cookies
        });
  
        const data = await response.json();
        return data
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
}

const postTransaction = async(price,name,description,datetime,email)=>{
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/transaction`;
    return fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: 'include', // Send cookies with the request
        body: JSON.stringify({
          price,
          name: name.substring(price.length + 1),
          description,
          datetime,
          email,
        }),
      })
}


const getBalance = (transactions) => {
  
  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  balance = balance.toFixed(2);
  let fraction = balance.split(".")[1];
  balance = balance.split(".")[0];

  return { balance, fraction };
};

export default{getTransactions,postTransaction,getBalance}