import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionChart = ({ data, labels }) => {
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Transaction Amounts',
                data,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Transactions Over Months',
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value) {
                        return '$' + value; // Prepend '$' to the labels
                    },
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default TransactionChart;
