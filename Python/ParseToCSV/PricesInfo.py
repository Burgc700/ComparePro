import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import WebDriverException
import time
import random
import os

def get_driver():
    """Creates a fresh, stealthy Chrome instance."""
    chrome_options = Options()
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    #chrome_options.add_argument("--headless") 
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

input_file = 'All_productsv2.csv'
output_file = 'updated_prices.csv'

df_main = pd.read_csv(input_file)

if os.path.exists(output_file):
    df_progress = pd.read_csv(output_file)
    scraped_urls = set(df_progress['url'].tolist())
    scraped_products = df_progress.to_dict('records')
    print(f"Resuming: {len(scraped_urls)} products already finished.")
else:
    scraped_urls = set()
    scraped_products = []
    print("Starting fresh crawl.")

driver = get_driver()
links_since_break = 0

try:
    for index, row in df_main.iterrows():
        url = row['url']
        
        if url in scraped_urls:
            continue
            
        site = row['site']
        print(f"[{index+1}/{len(df_main)}] Scraping {site}: {url}")

        try:
            driver.get(url)
            time.sleep(random.uniform(5, 10))
            
            price, rating = "N/A", "N/A"

            if site == 'microcenter':
                try:
                    price = driver.find_element(By.ID, "pricing").get_attribute("content")
                    rating = driver.find_element(By.CLASS_NAME, "bv_text").text
                except:
                    pass # Keep as N/A

            elif site == 'newegg':
                try:
                    price = driver.find_element(By.CLASS_NAME, "price-current").text
                    rating_elem = driver.find_element(By.XPATH, "//i[contains(@class, 'rating')]")
                    raw_rating = rating_elem.get_attribute("title")
                    rating = raw_rating.split(' ')[0]
                except:
                    pass

            scraped_products.append({
                'site': site,
                'category': row['category'],
                'url': url,
                'price': price,
                'rating': rating
            })
            scraped_urls.add(url)
            
            pd.DataFrame(scraped_products).to_csv(output_file, index=False)
            
            links_since_break += 1
            if links_since_break >= 50:
                print("--- 50 links reached. Taking a 5-minute break to stay stealthy... ---")
                driver.quit()
                time.sleep(300) # 5 minutes
                driver = get_driver()
                links_since_break = 0

        except WebDriverException as e:
            print(f"Browser error, restarting session: {e}")
            driver.quit()
            time.sleep(10)
            driver = get_driver()

finally:
    driver.quit()
    print("Scraping Session Ended.")