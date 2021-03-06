#!/usr/bin/env ts-node
import inquirer from 'inquirer';
import chalk from 'chalk';

process.stdout.write('💰 Welcome to the stock seller 💰\n');
console.log(`This program is based on a piece of advice I heard regarding balancing individual stocks
in your investment portfolio:

${chalk.white.bgBlue
  .bold(`Sell 20% of your shares after a 40% increase in price. 
After another 40% increase in price, sell another 20%. Continue with this until you've offloaded 
all shares for that stock or you are done balancing your portfolio`)}.
`);

interface AnswersType {
  originalPrice: string;
  currentPrice: string;
  sharesQuantity: string;
}

function getSellableYield(price: number, percent: number = 0.4): string {
  const increaseAmt = price * percent;
  const expectedYield = increaseAmt + price;
  return expectedYield.toFixed(2);
}

function getPercentageVariance(
  originalPrice: number,
  currentPrice: number
): string {
  const variance = currentPrice - originalPrice;
  return ((variance / originalPrice) * 100).toFixed(2);
}

function getNumberOfSharesToSell(
  sharesQuantity: number,
  percent: number = 0.2
): string {
  return (percent * sharesQuantity).toFixed(2);
}

function getAmountMadeFromSale(
  sharesToSell: number,
  currentPrice: number
): string {
  return (sharesToSell * currentPrice).toFixed(2);
}

function validateInput(answer: string) {
  // checks if answer is empty and if it's not digits
  return answer.length !== 0 && isNaN(+answer) === false;
}

inquirer
  .prompt([
    {
      name: 'originalPrice',
      message:
        'At what price did you purchase one share of stock? (digits only)',
      type: 'input',
      validate: (answer) => validateInput(answer),
    },
    {
      name: 'currentPrice',
      message: 'At what price is one share of stock currently? (digits only)',
      type: 'input',
      validate: (answer) => validateInput(answer),
    },
    {
      name: 'sharesQuantity',
      message: 'How many shares of stock do you own? (digits only)',
      type: 'input',
      validate: (answer) => validateInput(answer),
    },
  ])
  .then(({ originalPrice, currentPrice, sharesQuantity }: AnswersType) => {
    const sellableYield = getSellableYield(+originalPrice);
    const percentVariance = getPercentageVariance(
      +originalPrice,
      +currentPrice
    );
    const isStockSellable = +currentPrice >= +sellableYield;
    const initialStockValue = (+originalPrice * +sharesQuantity).toFixed(2);
    const currentStockWorth = (+currentPrice * +sharesQuantity).toFixed(2);

    if (!isStockSellable) {
      console.log(
        `🚫🙅🏽‍♀️ It's not time to sell, your shares have grown by ${chalk.underline.red(
          `${percentVariance}%`
        )} and that's less than a 40% increase. Wanna wait a bit? ⏳`
      );
    } else {
      const sharesToSell = getNumberOfSharesToSell(+sharesQuantity);
      const amountMadeFromSale = getAmountMadeFromSale(
        +sharesToSell,
        +currentPrice
      );

      console.log(chalk.bgGrey('Your initial investment: ', initialStockValue));
      console.log(
        chalk.underline('Your current stock is worth: ', currentStockWorth)
      );

      console.log(
        chalk.green(
          `Yaaay 🎉, you've made a profit of over 40%. You may sell ${chalk.underline(
            sharesToSell
          )} shares now! . That'll be ~${amountMadeFromSale} in cash value 🤑💰💸💵`
        )
      );
    }
  });
