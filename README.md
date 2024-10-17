## This project has the following features

### Cron job fetches the prices of Ethereum and Polygon every 5 minutes and pushes into the postgres database. It also checks if any "Alert" condition is matched , if any matches then an email is sent to the user

### Cron job fetches prices every hour and compares them to the prices an hour ago , if the change is greater than or equal to 3% an email is sent

### Api that provides prices for every hour for 24 hours

### Api that allows user to set alerts.

### Api that allows user to find their eth to btc swap rate , get btc amount for eth amount provided and the fees incurred

### To run the app simply clone the repo and run
#### create a .env file
  `MORALIS_API_KEY=` 
  `docker compose up --build`

