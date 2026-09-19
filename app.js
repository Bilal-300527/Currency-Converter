const fromCurrency = document.querySelector("#fromCurrency");
const toCurrency = document.querySelector("#toCurrency");

const amountInput = document.querySelector("#amount");

const fromFlag = document.querySelector("#fromFlag");
const toFlag = document.querySelector("#toFlag");

const result = document.querySelector("#result");

const form = document.querySelector("#converterForm");

const swapBtn = document.querySelector("#swapBtn");

let rates = {};

// ========================================
// Get Currency Data
// ========================================

const currencyConverter = async () => {
  try {
    result.innerText = "Loading exchange rates...";

    const response = await fetch(
      "https://v6.exchangerate-api.com/v6/ff73c8912e2783b83d214a46/latest/USD",
    );

    // Check HTTP response
    if (!response.ok) {
      throw new Error("Network response failed");
    }

    const data = await response.json();

    // Check API response
    if (data.result !== "success") {
      throw new Error(data["error-type"] || "Exchange rate API error");
    }

    // Store rates
    rates = data.conversion_rates;

    console.log("Currency Rates:", rates);

    // Clear dropdowns
    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";

    // Add only currencies available in countryList
    for (const currency in countryList) {
      if (rates[currency]) {
        const fromOption = document.createElement("option");

        fromOption.value = currency;

        fromOption.textContent = currency;

        fromCurrency.appendChild(fromOption);

        const toOption = document.createElement("option");

        toOption.value = currency;

        toOption.textContent = currency;

        toCurrency.appendChild(toOption);
      }
    }

    // Default currencies
    fromCurrency.value = "PKR";

    toCurrency.value = "USD";

    // Update flags
    updateFlag();

    // Calculate initial result
    calculateCurrency();
  } catch (error) {
    console.error("API Error:", error);

    result.innerText = "Unable to get exchange rate. Please try again.";
  }
};

// ========================================
// Update Flags
// ========================================

const updateFlag = () => {
  const fromCode = countryList[fromCurrency.value];

  const toCode = countryList[toCurrency.value];

  if (fromCode) {
    fromFlag.src = `https://flagsapi.com/${fromCode}/flat/64.png`;
  }

  if (toCode) {
    toFlag.src = `https://flagsapi.com/${toCode}/flat/64.png`;
  }
};

// ========================================
// Calculate Currency
// ========================================

const calculateCurrency = () => {
  const amount = Number(amountInput.value);

  const from = fromCurrency.value;

  const to = toCurrency.value;

  // Check amount
  if (amountInput.value === "" || amount <= 0) {
    result.innerText = "Please enter a valid amount.";

    return;
  }

  // Check rates
  if (!rates[from] || !rates[to]) {
    result.innerText = "Exchange rate not available.";

    return;
  }

  // Currency conversion
  const convertedAmount = (amount / rates[from]) * rates[to];

  // Display result
  result.innerText = `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
};

// ========================================
// From Currency Change
// ========================================

fromCurrency.addEventListener("change", () => {
  updateFlag();

  calculateCurrency();
});

// ========================================
// To Currency Change
// ========================================

toCurrency.addEventListener("change", () => {
  updateFlag();

  calculateCurrency();
});

// ========================================
// Amount Change
// ========================================

amountInput.addEventListener("input", () => {
  calculateCurrency();
});

// ========================================
// Form Submit
// ========================================

form.addEventListener("submit", (event) => {
  event.preventDefault();

  calculateCurrency();
});

// ========================================
// Swap Currency
// ========================================

swapBtn.addEventListener("click", () => {
  const oldFrom = fromCurrency.value;

  const oldTo = toCurrency.value;

  fromCurrency.value = oldTo;

  toCurrency.value = oldFrom;

  updateFlag();

  calculateCurrency();
});

// ========================================
// Start Application
// ========================================

currencyConverter();
