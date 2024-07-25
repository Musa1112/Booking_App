import puppeteer from 'puppeteer';
import fs from 'fs';


// Sleep function to introduce delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    const allProducts = new Map(); // Use a Map to store products to avoid duplicates

    try {
        await page.goto('https://www.booking.com/searchresults.html?label=gen173nr-1FCAEoggI46AdIM1gEaKcBiAEBmAExuAEXyAEM2AEB6AEB-AECiAIBqAIDuALhq960BsACAdICJDc2NDE0ZDBhLTU2YzEtNGY3NC05M2M5LWE0M2Q2MTIwYWMxY9gCBeACAQ&sid=673f23ff76f305637b508ce3681a8627&aid=304142&checkin=2024-07-20&checkout=2024-07-21&dest_id=-1997013&dest_type=city&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0', {
            waitUntil: "networkidle2",
            timeout: 60000 // Increase timeout to 60 seconds
        });

        let hasMorePages = true;

        while (hasMorePages) {
            // Scroll to the bottom to ensure all content is loaded
            await page.evaluate(async () => {
                window.scrollTo(0, document.body.scrollHeight);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds to ensure all content loads
            });

            // Scrape the products on the current page
            const products = await page.evaluate(() => {
                const productElements = [...document.querySelectorAll('[data-testid="property-card"]')];
                const productData = productElements.map(products => {
                    const title = products.querySelector(".e037993315.f5f8fe25fa")?.textContent.trim() || '';
                    const description = products.querySelectorAll(".e8acaa0d22")[1]?.textContent.trim() || '';
                    const imageLink = products.querySelector("img")?.src || '';
                    const reviews = products.querySelector(".e8acaa0d22.ab107395cb.c60bada9e4")?.textContent.trim() || '';
                    const location = products.querySelectorAll(".e8acaa0d22")[0]?.textContent.trim() || '';

                    return { title, description, location, reviews, imageLink,  };
                });
                return productData;
            });

            // Avoid duplicates by checking if the product title already exists in the Map
            products.forEach(product => {
                if (!allProducts.has(product.title)) {
                    allProducts.set(product.title, product);
                }
            });

            console.log(`Page scraped successfully. Total unique products: ${allProducts.size}`);

            // Check if there's a "Load More" button and click it
            const loadMoreButton = await page.$('.dba1b3bddf.e99c25fd33.ea757ee64b.f1c8772a7d.ea220f5cdc.f870aa1234'); // Adjust the selector as needed
            if (loadMoreButton) {
                await loadMoreButton.click();
                await sleep(6000); // Adjust timeout as needed
            } else {
                hasMorePages = false;
                console.log('No more pages to load.');
            }
        }
    } catch (error) {
        console.error(`Error occurred while scraping: ${error.message}`);
    } finally {
        await browser.close();
        console.log(`Scraping complete. Total unique products scraped: ${allProducts.size}`);
        
        // Convert Map to an array and save data to JSON file
        const productArray = Array.from(allProducts.values());
        fs.writeFileSync('products.json', JSON.stringify(productArray, null, 2), 'utf-8');
        console.log('JSON file has been written successfully.');
        
        // Log the data to the console (optional)
        console.log(productArray);
    }
})();
