// Theme toggle logic
const checkbox = document.getElementById("checkbox");
const body = document.body;
const currTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currTheme);
checkbox.checked = currTheme === 'dark';

checkbox.addEventListener("change", () => {
    const newTheme = checkbox.checked ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    body.setAttribute('data-theme', newTheme);
});

const url = "https://api.coingecko.com/api/v3/search/trending";

fetch(url)
    .then(response => response.json())
    .then(data => {
        const coinsContainer = document.querySelector('.coins-container');
        coinsContainer.innerHTML = ''; // Clear any existing content

        // Access the 'coins' array inside the 'data' object
        const coins = data.coins;

        // Ensure 'coins' is an array and slice the first 15 elements
        if (Array.isArray(coins)) {
            coins.slice(0, 15).forEach(coinData => {
                const coin = coinData.item; // Access the 'item' property for each coin

                const coinDiv = document.createElement('div');
                coinDiv.classList.add('top-coin');

                const coinImage = document.createElement('img');
                coinImage.src = coin.thumb;
                coinImage.alt = coin.name;

                const coinInfo = document.createElement('div');
                coinInfo.classList.add('coin-info');

                const coinName = document.createElement('h4');
                coinName.textContent = `${coin.name} (${coin.symbol})`;

                // Assuming you have a conversion rate defined somewhere
                const conversionRate = 10000; // Example conversion rate
                const coinPrice = document.createElement('p');
                coinPrice.textContent = Math.round(coin.price_btc * conversionRate * 10000) / 10000;

                coinInfo.appendChild(coinName);
                coinInfo.appendChild(coinPrice);

                coinDiv.appendChild(coinImage);
                coinDiv.appendChild(coinInfo);

                coinsContainer.appendChild(coinDiv);
            });
        } else {
            console.error('Coins data is not an array:', coins);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

const mainContainer = document.querySelector('main'); // Correct selector to get the main element
const searchbtn1 = document.getElementById('search-btn1');
searchbtn1.addEventListener('click', searchEvent);

function searchEvent() {
    console.log('+++');
    mainContainer.innerHTML = ''; // Clear main container content
    mainContainer.style.minHeight = '100vh';
    mainContainer.style.maxHeight = 'auto';

    // Create header div with title and search input
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('header-div');

    const titleHeading = document.createElement('h1');
    titleHeading.textContent = 'Search';
    titleHeading.classList.add('title-heading');

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Enter coin name...';
    searchInput.classList.add('search-input');

    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.classList.add('search-button');
    searchButton.addEventListener('click', performSearch);

    headerDiv.appendChild(titleHeading);
    headerDiv.appendChild(searchInput);
    headerDiv.appendChild(searchButton);

    mainContainer.appendChild(headerDiv);
}

function performSearch() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    console.log('Searching for:', searchTerm);

    // Clear previous search results
    const existingResultsContainer = document.querySelector('.search-results-container');
    if (existingResultsContainer) {
        existingResultsContainer.remove();
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const searchResultsContainer = document.createElement('div');
            searchResultsContainer.classList.add('search-results-container');

            const coins = data.coins;

            if (Array.isArray(coins)) {
                const filteredCoins = coins.filter(coinData => {
                    const coin = coinData.item;
                    return coin.name.toLowerCase().includes(searchTerm) || coin.symbol.toLowerCase().includes(searchTerm);
                });

                if (filteredCoins.length > 0) {
                    filteredCoins.forEach((coinData, index) => {
                        const coin = coinData.item;

                        const searchRowDiv = document.createElement('div');
                        searchRowDiv.classList.add('search-coin-row');

                        const searchRowNumber = document.createElement('span');
                        searchRowNumber.textContent = index + 1;
                        searchRowNumber.classList.add('search-row-number');

                        const searchCoinImage = document.createElement('img');
                        searchCoinImage.src = coin.thumb;
                        searchCoinImage.alt = coin.name;
                        searchCoinImage.classList.add('search-coin-image');

                        const searchCoinName = document.createElement('span');
                        searchCoinName.textContent = `${coin.name} (${coin.symbol})`;
                        searchCoinName.classList.add('search-coin-name');

                        const conversionRate = 10000; // Example conversion rate
                        const searchCoinPrice = document.createElement('span');
                        searchCoinPrice.textContent = (Math.round(coin.price_btc * conversionRate * 10000) / 10000).toFixed(4);
                        searchCoinPrice.classList.add('search-coin-price');

                        const searchMoreInfoButton = document.createElement('button');
                        searchMoreInfoButton.textContent = 'More Info';
                        searchMoreInfoButton.classList.add('search-more-info-button');
                        searchMoreInfoButton.addEventListener('click', () => showCoinDetails(coin.id));

                        searchRowDiv.appendChild(searchRowNumber);
                        searchRowDiv.appendChild(searchCoinImage);
                        searchRowDiv.appendChild(searchCoinName);
                        searchRowDiv.appendChild(searchCoinPrice);
                        searchRowDiv.appendChild(searchMoreInfoButton);

                        searchResultsContainer.appendChild(searchRowDiv);
                    });
                } else {
                    const noResultsMessage = document.createElement('div');
                    noResultsMessage.classList.add('no-results-message');
                    noResultsMessage.textContent = 'No related coin found';
                    searchResultsContainer.appendChild(noResultsMessage);
                }
            } else {
                console.error('Coins data is not an array:', coins);
            }

            mainContainer.appendChild(searchResultsContainer);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
function showCoinDetails(coinId) {
    const coinDetailsUrl = `https://api.coingecko.com/api/v3/coins/${coinId}`;

    fetch(coinDetailsUrl)
        .then(response => response.json())
        .then(coin => {
            mainContainer.innerHTML = ''; // Clear main container content

            // Create elements for coin details
            const coinDetailsDiv = document.createElement('div');
            coinDetailsDiv.classList.add('coin-details');

            const coinImage = document.createElement('img');
            coinImage.src = coin.image.large;
            coinImage.alt = coin.name;
            coinImage.classList.add('coin-details-image');

            const coinName = document.createElement('h2');
            coinName.textContent = `${coin.name} (${coin.symbol.toUpperCase()})`;
            coinName.classList.add('coin-details-name');

            const coinDescription = document.createElement('p');
            coinDescription.innerHTML = coin.description.en;
            coinDescription.classList.add('coin-details-description');

            const chartContainer = document.createElement('div');
            chartContainer.classList.add('chart-container');
            chartContainer.innerHTML = '<canvas id="priceChart"></canvas>';

            coinDetailsDiv.appendChild(coinImage);
            coinDetailsDiv.appendChild(coinName);
            coinDetailsDiv.appendChild(coinDescription);
            coinDetailsDiv.appendChild(chartContainer);

            mainContainer.appendChild(coinDetailsDiv);

            // Fetch historical data for the chart
            fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`)
                .then(response => response.json())
                .then(data => {
                    const ctx = document.getElementById('priceChart').getContext('2d');

                    // Process the prices data
                    const prices = data.prices.map(price => ({
                        x: moment(price[0]).toDate(), // Convert timestamp to Date object
                        y: price[1]
                    }));

                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            datasets: [{
                                label: `${coin.name} Price (Last 30 Days)`,
                                data: prices,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: false
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'day',
                                        tooltipFormat: 'MMM DD, YYYY' // Format for tooltips
                                    },
                                    title: {
                                        display: true,
                                        text: 'Date'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Price (USD)'
                                    }
                                }
                            },
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                });
        })
        .catch(error => {
            console.error('Error fetching coin details:', error);
        });
}

