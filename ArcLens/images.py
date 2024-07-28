from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

# The specific search URL provided
search_url = "https://www.google.com/search?sca_esv=c839f9702c677c11&q=ch%C3%A2teau+de+versailles+poses&udm=2&fbs=AEQNm0AbzhUJjXv6jRup8eVc0BvPyH5PazCaW205cG-Bd0in0dvSnU368ct8hcGzY9zRCgahXUvXYtux5SPCz-VD8JjCRRQ8LRqTDdEUYpRLpCO7i4Abpfgr5RKfHAgc3Zq8pbKkp0mi68K3CXDFL7KsrYadrVQgVTdiihKp3Ia169rEPCwfPwJXLr9DBt3ZwxM0XlbirQsyiZwWgE0_ock6dT6lmfSWVA&sa=X&ved=2ahUKEwiosePGqcmHAxUBke4BHWHZGRMQtKgLegQIDBAB"

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

# Set up the Selenium WebDriver (using Chrome in this example)
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)

# Open the search URL
driver.get(search_url)

# Scroll to load more images
for _ in range(10):
    driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(2)  # Wait for the images to load

# Find image elements
image_elements = driver.find_elements(By.CSS_SELECTOR, 'img.Q4LuWd')

# Get the image URLs
image_urls = []
for img in image_elements[:100]:  # Limit to the first 100 images
    src = img.get_attribute('src')
    if src:
        image_urls.append(src)
    else:
        src = img.get_attribute('data-src')
        if src:
            image_urls.append(src)

# Output the image URLs
for idx, img_url in enumerate(image_urls):
    print(f"{idx+1}: {img_url}")

# Close the WebDriver
driver.quit()
