from xml.etree import ElementTree as ET
import csv

URLs = []

ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')

cpu_keyword = ['cpu', 'processor', 'ryzen', 'intel', 'core-i', 'amd', 'threadripper', 'xeon']
gpu_keyword = ['gpu', 'graphics', 'video-card', 'rtx', 'radeon', 'geforce', 'gtx']
ram_keyword = ['ram', 'memory', 'ddr4', 'ddr5', 'dimm']
ssd_keyword = ['ssd', 'solid-state', 'nvme', 'm.2', 'm-2']

exclude_words = ['/qa/', '/questions', '/reviews', '(refurbished)', 
                'desktop', 'gaming-pc', 'prebuilt', 'system', 'tower',
                'laptop', 'notebook', 'chromebook', 'bundle', 'combo', 'kit'
                ]

def exclude(url):
    url_lower = url.lower()
    return any(keyword in url_lower for keyword in exclude_words)

def url_categories(url):
    url_lower = url.lower()

    if exclude(url):
        return None

    if any(keyword in url_lower for keyword in cpu_keyword):
        return 'CPU'
    elif any(keyword in url_lower for keyword in gpu_keyword):
        return 'GPU'
    elif any(keyword in url_lower for keyword in ram_keyword):
        return 'RAM'
    elif any(keyword in url_lower for keyword in ssd_keyword):
        return 'SSD'
    else:
        return None
    
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

print("Newegg xml file")
tree = ET.parse(r'C:\Users\clayt\Documents\School\Year7\Spring\CIS598/ProductListKeywords_USA.xml')
root = tree.getroot()

for urlElem in root.findall('.//ns:loc', namespace):
    url = urlElem.text
    category = url_categories(url)
    if category:
        URLs.append({
            'site': 'newegg',
            'category': category,
            'url': url
        })
print(f"newgg urls found: {len(URLs)}")

with open('All_products.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=['site', 'category', 'url'])
    writer.writeheader()
    writer.writerows(URLs)

print("Saved to csv")
print("Done")