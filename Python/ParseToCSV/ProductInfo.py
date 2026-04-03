# import pandas as pd
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from selenium.common.exceptions import WebDriverException
# import time
# import random
# import os

# def getProductInfo():
#     chrome_options = Options()
#     chrome_options.add_argument("--disable-blink-features=AutomationControlled")
#     chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
#     chrome_options.add_experimental_option('useAutomationExtension', False)
#     #chrome_options.add_argument("--headless") 
#     driver = webdriver.Chrome(options=chrome_options)
#     driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
#     return driver

# input_file = 'FinalPrices.csv'
# output_file = 'ProductInfo.csv'

# df_main = pd.read_csv(input_file)
# if os.path.exists(output_file):
#     df_progress = pd.read_csv(output_file)
#     scraped_urls = set(df_progress['url'].tolist())
#     scraped_products = df_progress.to_dict('records')
#     print(f"Resuming: {len(scraped_urls)} products already finished.")
# else:
#     scraped_urls = set()
#     scraped_products = []
#     print("Starting fresh crawl.")

# driver = getProductInfo()

# try:
#     for index, row in df_main.iterrows():
#         url = row['url']
#         if url in scraped_urls:
#             continue
#         site = row['site']
#         print(f"[{index+1}/{len(df_main)}] Scraping {site}: {url}")

#         try:
#             driver.get(url)
#             time.sleep(random.uniform(5,10))
#             name, brand, modelNum, image, features = 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'
#             if site == 'newegg':
#                 try:
#                     image_elem = driver.find_element(By.CSS_SELECTOR, ".product-view-img-original")
#                     if image_elem:
#                         image = image_elem.get_attribute("src")
#                         if image:
#                             image = image.replace("CompressAll160", "ProductImage")
#                 except Exception as ex:
#                     print(f"Image scrape failed: {ex}")
#                 try:
#                     fullName = driver.find_element(By.CLASS_NAME, "product-title").text
#                     name = fullName.split(" - ")[0]
#                     brand = driver.find_element(By.CLASS_NAME, "logo").get_attribute('alt')
#                     modelNum = driver.find_element(By.XPATH, '//*[@id="product-details"]/div[2]/div[2]/table[2]/tbody/tr[5]/td').text
#                     features = driver.find_element(By.CLASS_NAME, "product-bullets")
#                 except:
#                     pass
#                 scraped_products.append({
#                     'name': name,
#                     'brand': brand,
#                     'Model number': modelNum,
#                     'category': row['category'],
#                     'Image': image,
#                     'Features': features
#                 })
#                 pd.DataFrame(scraped_products).to_csv(output_file, index=False)

#                 links_since_break += 1
#                 if links_since_break >= 50:
#                     print("--- 50 links reached. Taking a 5-minute break to stay stealthy... ---")
#                     driver.quit()
#                     time.sleep(300) # 5 minutes
#                     driver = getProductInfo()
#                     links_since_break = 0
#         except WebDriverException as e:
#             print(f"Browser error, restarting session: {e}")
#             driver.quit()
#             time.sleep(10)
#             driver = getProductInfo()
# finally:
#     driver.quit()
#     print("Scraping Session Ended.")

import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import WebDriverException
import time
import random
import os

def get_driver():
    chrome_options = Options()
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    # chrome_options.add_argument("--headless")

    driver = webdriver.Chrome(options=chrome_options)
    driver.execute_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )
    return driver


input_file = "FinalPrices.csv"
output_file = "ProductInfo2.0.csv"
progress_file = "ProductInfo_progress2.0.csv"

df_main = pd.read_csv(input_file)

if os.path.exists(progress_file):
    df_progress = pd.read_csv(progress_file)

    if "url" in df_progress.columns:
        scraped_urls = set(df_progress["url"].astype(str).tolist())
        scraped_products = df_progress.to_dict("records")
        print(f"Resuming: {len(scraped_urls)} products already finished.")
    else:
        scraped_urls = set()
        scraped_products = []
        print("Progress file exists but has no url column. Starting fresh crawl.")
else:
    scraped_urls = set()
    scraped_products = []
    print("Starting fresh crawl.")

driver = None
links_since_break = 0

try:
    driver = get_driver()

    for index, row in df_main.iterrows():
        url = str(row["url"]).strip()
        site = str(row["site"]).strip().lower()
        category = row["category"] if "category" in row else "N/A"

        if not url or url == "nan":
            continue

        # ONLY scrape Newegg
        if site != "newegg":
            continue

        if url in scraped_urls:
            continue

        print(f"[{index + 1}/{len(df_main)}] Scraping {site}: {url}")

        try:
            driver.get(url)
            time.sleep(random.uniform(5, 10))

            name = "N/A"
            brand = "N/A"
            model_num = "N/A"
            image = "N/A"
            features = "N/A"

            # IMAGE
            try:
                image_elem = driver.find_element(By.CSS_SELECTOR, ".product-view-img-original")
                image = image_elem.get_attribute("src")
                if image:
                    image = image.replace("CompressAll160", "ProductImage")
            except Exception as ex:
                print(f"Image scrape failed: {ex}")

            # NAME
            try:
                full_name = driver.find_element(By.CLASS_NAME, "product-title").text.strip()
                if " - " in full_name:
                    name = full_name.split(" - ")[0].strip()
                else:
                    name = full_name
            except Exception as ex:
                print(f"Name scrape failed: {ex}")

            # BRAND
            try:
                brand = driver.find_element(By.CLASS_NAME, "logo").get_attribute("alt")
                if brand:
                    brand = brand.strip()
                else:
                    brand = "N/A"
            except Exception as ex:
                print(f"Brand scrape failed: {ex}")

            # MODEL NUMBER
            try:
                model_num = driver.find_element(
                    By.XPATH,
                    "//tr[th[contains(normalize-space(),'Model')]]/td"
                ).text.strip()
            except Exception:
                try:
                    model_num = driver.find_element(
                        By.XPATH,
                        '//*[@id="product-details"]/div[2]/div[2]/table[2]/tbody/tr[5]/td'
                    ).text.strip()
                except Exception as ex:
                    print(f"Model scrape failed: {ex}")

            # FEATURES
            try:
                feature_elems = driver.find_elements(By.CSS_SELECTOR, ".product-bullets li")
                feature_list = [f.text.strip() for f in feature_elems if f.text.strip()]
                if feature_list:
                    features = " | ".join(feature_list)
            except Exception as ex:
                print(f"Features scrape failed: {ex}")

            record = {
                "url": url,
                "site": site,
                "category": category,
                "name": name,
                "brand": brand,
                "model_number": model_num,
                "image": image,
                "features": features
            }

            scraped_products.append(record)
            scraped_urls.add(url)

            df_full = pd.DataFrame(scraped_products)
            df_full.to_csv(progress_file, index=False)

            df_clean = df_full.drop(columns=["url", "site"], errors="ignore")
            df_clean.to_csv(output_file, index=False)

            links_since_break += 1
            if links_since_break >= 50:
                print("--- 50 links reached. Taking a 5-minute break to stay stealthy... ---")
                driver.quit()
                time.sleep(300)
                driver = get_driver()
                links_since_break = 0

        except WebDriverException as e:
            print(f"Browser error on {url}: {e}")
            if driver:
                driver.quit()
            time.sleep(10)
            driver = get_driver()

finally:
    if driver:
        driver.quit()
    print("Scraping Session Ended.")