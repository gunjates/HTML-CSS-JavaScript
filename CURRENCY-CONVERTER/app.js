// Currency Converter App

// All currencies loaded from API dynamically
let currencies = [];
async function loadAllCurrencies() {
  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
    );
    const data = await response.json();
    rates = data.rates; // Load rates immediately
    const currenciesList = Object.keys(rates).map((code) => ({
      code,
      name: code,
      countryCode: code.toLowerCase().slice(0, 2),
    }));
    currencies = currenciesList;
    populateSelects();
    updateFlags();
    convert(); // Convert with loaded rates
  } catch (error) {
    console.error("Failed to load currencies");
    resultDiv.innerHTML = "Error loading currencies. Try refresh.";
  }
}

let rates = {}; // Store latest exchange rates {base: rate}
let baseCurrency = "USD"; // Default base for API

// DOM elements
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const swapBtn = document.getElementById("swapBtn");
const refreshBtn = document.getElementById("refreshBtn");
const resultDiv = document.getElementById("result");

// Populate selects
function populateSelects() {
  const optionTemplate = currencies
    .map(
      (c) =>
        `<option value="${c.code}">${c.countryCode.toUpperCase()} - ${c.name}</option>`,
    )
    .join("");
  fromSelect.innerHTML = optionTemplate;
  toSelect.innerHTML = optionTemplate;

  // Set defaults
  fromSelect.value = "USD";
  toSelect.value = "INR";
  updateFlags();
  convert();
}

// Update flag images
function updateFlags() {
  const fromCurr = fromSelect.value;
  const toCurr = toSelect.value;
  const fromCurrObj = currencies.find((c) => c.code === fromCurr);
  const toCurrObj = currencies.find((c) => c.code === toCurr);
  fromFlag.src = fromCurrObj
    ? `https://flagcdn.com/40x30/${fromCurrObj.countryCode}.png`
    : "";
  fromFlag.alt = fromCurrObj ? fromCurrObj.name : "";
  toFlag.src = toCurrObj
    ? `https://flagcdn.com/40x30/${toCurrObj.countryCode}.png`
    : "";
  toFlag.alt = toCurrObj ? toCurrObj.name : "";
}

// Fetch latest rates from base currency
async function fetchRates() {
  refreshBtn.disabled = true;
  refreshBtn.textContent = "Loading...";

  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
    );
    const data = await response.json();

    rates = data.rates;
    baseCurrency = "USD";
    convert();
  } catch (error) {
    resultDiv.textContent = "Error fetching rates. Check connection.";
    console.error(error);
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.textContent = "Refresh Rates";
  }
}

function formatCurrencyName(name) {
  const parts = name.split(" ");
  return {
    first: parts[0],
    second: parts.slice(1).join(" ") || "",
  };
}

// Convert currency
function convert() {
  const amount = parseFloat(amountInput.value) || 1;
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!rates[from] || !rates[to]) {
    resultDiv.innerHTML = "Loading rates...";
    return;
  }

  if (amount <= 0) {
    resultDiv.innerHTML = "Enter valid amount";
    return;
  }

  // Fixed base USD, convert via USD
  const rateFromUSD = rates[from];
  const rateToUSD = rates[to];
  const converted = amount * (rateToUSD / rateFromUSD);

  const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
  const fromName = displayNames.of(from);
  const toName = displayNames.of(to);

  const fromParts = formatCurrencyName(fromName);
  const toParts = formatCurrencyName(toName);

  resultDiv.innerHTML = `
        ${amount.toLocaleString()} ${from} = 
        ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}
        
        <div class="currency-grid">
            <span>${fromParts.first}</span>
            <span>→</span>
            <span>${toParts.first}</span>

            <span>${fromParts.second}</span>
            <span></span>
            <span>${toParts.second}</span>
        </div>
    `;
}

// Swap currencies
function swapCurrencies() {
  const fromVal = fromSelect.value;
  const toVal = toSelect.value;
  fromSelect.value = toVal;
  toSelect.value = fromVal;
  updateFlags();
  convert();
}

// Event listeners
amountInput.addEventListener("input", convert);
fromSelect.addEventListener("change", () => {
  updateFlags();
  convert();
});
toSelect.addEventListener("change", () => {
  updateFlags();
  convert();
});
swapBtn.addEventListener("click", swapCurrencies);
refreshBtn.addEventListener("click", fetchRates);

// Initialize
loadAllCurrencies(); // Loads all + rates
