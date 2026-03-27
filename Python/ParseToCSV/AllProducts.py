from xml.etree import ElementTree as ET
from bs4 import BeautifulSoup
import requests
import csv
import re

URLs = []

ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')

cpu_keyword = ['cpu', 'processor', 'ryzen', 'intel', 'core-i', 'amd', 'threadripper', 'xeon']
gpu_keyword = ['gpu', 'graphics', 'video-card', 'rtx', 'radeon', 'geforce', 'gtx']
ram_keyword = ['ram', 'memory', 'ddr4', 'ddr5', 'dimm']
ssd_keyword = ['ssd', 'solid-state', 'nvme', 'm.2', 'm-2']

exclude_words = ['/qa/', '/questions', '/reviews', '(refurbished)', 
                'desktop', 'gaming-pc', 'prebuilt', 'system', 'tower',
                'laptop', 'notebook', 'chromebook', 'bundle', 'combo', 'kit',
                'foam', 'accessory', 'dock', 'motherboard', 'memory-card', 'water-block',
                'raspberry-pi', 'cooler'
                ]

def exclude(url):
    url_lower = url.lower()
    return any(keyword in url_lower for keyword in exclude_words)

def url_categories(url):
    url_lower = url.lower()

    if exclude(url):
        return None

    if any(re.search(r'\b' + keyword  + r'\b', url_lower) for keyword in cpu_keyword):
        return 'CPU'
    elif any(re.search(r'\b' + keyword  + r'\b', url_lower) for keyword in gpu_keyword):
        return 'GPU'
    elif any(re.search(r'\b' + keyword  + r'\b', url_lower) for keyword in ram_keyword):
        return 'RAM'
    elif any(re.search(r'\b' + keyword  + r'\b', url_lower) for keyword in ssd_keyword):
        return 'SSD'
    else:
        return None
    
def newegg_products(category_url, category_name, pages=10):
    print(f"Getting links for {category_name}")
    for page in range(1, pages + 1):
        page_url = f"{category_url}?Page={page}"    
        response = requests.get(page_url)
        soup = BeautifulSoup(response.content, 'html.parser')
        links = soup.find_all('a', href=True)
        products = [link for link in links if '/p/' in link.get('href', '')]
        if len(products) == 0:
            print(f"No more proudcts for {category_name}")
            break
        for link in products:
            url = link.get('href')
            if url and url.startswith('http'):
                URLs.append({
                    'site': 'newegg',
                    'category': category_name.upper(),
                    'url': url
                })
    print(f"Found {len(URLs)} for new egg")

namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

print("MicroCenter xml file")
tree = ET.parse(r'C:\Users\clayt\Documents\School\Year7\Spring\CIS598/MicrocenterproductSitemap.xml')
root = tree.getroot()

for urlElem in root.findall('.//ns:loc', namespace):
    url = urlElem.text
    category = url_categories(url)
    if category:
        URLs.append({
            'site': 'microcenter',
            'category': category,
            'url': url
        })
print(f"Microcenter urls found: {len(URLs)}")

newegg_products('https://www.newegg.com/Desktop-CPU-Processor/SubCategory/ID-343', 'cpu')
newegg_products('https://www.newegg.com/GPUs-Video-Graphics-Cards/SubCategory/ID-48', 'gpu')
newegg_products('https://www.newegg.com/Workstation-Graphics-Cards/SubCategory/ID-449', 'gpu')
newegg_products('https://www.newegg.com/Internal-SSDs/SubCategory/ID-636', 'ssd')
newegg_products('https://www.newegg.com/External-SSDs/SubCategory/ID-2022', 'ssd')
newegg_products('https://www.newegg.com/Enterprise-SSDs/SubCategory/ID-2021', 'ssd')
newegg_products('https://www.newegg.com/Desktop-Memory/SubCategory/ID-147', 'ram')
newegg_products('https://www.newegg.com/Laptop-Memory/SubCategory/ID-381', 'ram')


with open('All_productsv2.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=['site', 'category', 'url'])
    writer.writeheader()
    writer.writerows(URLs)

print("Saved to csv")
print("Done")