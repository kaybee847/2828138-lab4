// Required: Use async/await OR .then() for API calls
// Required: Use try/catch OR .catch() for error handling

async function searchCountry(countryName) {
    try {
        // Show loading spinner
        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const country = data[0];
        console.log(country.name.common);
        // Update DOM
        document.getElementById('country-info').innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital[0]}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        // Fetch bordering countries
        const bordersContainer = document.getElementById('bordering-countries');
        bordersContainer.innerHTML = "";

        let borderCountries = []
        if (country.borders) {
            for (const code of country.borders) {
                const borderResponse = await fetch(
                    `https://restcountries.com/v3.1/alpha/${code}`
                );

                if (!borderResponse.ok) continue;

                const borderData = await borderResponse.json();
                const border = borderData[0];

                borderCountries.push({
                    name: border.name.common,
                    flag: border.flags.svg
                });
            }
        }

        
        // Update bordering countries section
        if (borderCountries.length === 0) {
            bordersContainer.innerHTML = "<p>No bordering countries.</p>";
        } else {
            bordersContainer.innerHTML = borderCountries.map(border => `
                <div class="border-country">
                    <p>${border.name}</p>
                    <img src="${border.flag}" alt="${border.name} flag" width="100">
                </div>
            `).join("");
        }



    } catch (error) {
        // Show error message
        //console.log(error);
        document.getElementById('error-message').innerHTML = `${error}`;
    } finally {
        // Hide loading spinner
    }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});