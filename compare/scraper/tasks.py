from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail, EmailMessage, get_connection
from bs4 import BeautifulSoup
import requests
from .models import Product, PUTrack


def scrap_flipkart(link):
    headers = {
            "User-Agent": "foo Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }
    response = requests.get(url=link, headers= headers)
    soup = BeautifulSoup(response.content, 'lxml')
    # print(soup.prettify())
    # Example: Find and print the details of each product
    print(soup)
    price_container = soup.find('div', class_="_30jeq3")
    raw_price = price_container.text.strip()
    price_without_symbol = raw_price.replace('₹', '')
    numeric_price = float(price_without_symbol)
    return numeric_price

def scrap_amazon(link):
    headers = {
            "User-Agent": "foo Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }
    response = requests.get(url=link, headers= headers)
    soup = BeautifulSoup(response.content, 'lxml')
    # print(soup.prettify())
    # Example: Find and print the details of each product
    # print(soup)
    # price_container = soup.find("div", {"id": "corePriceDisplay_desktop_feature_div"})
    print(soup)
    price_container = soup.find("span", {"class":"aok-offscreen"})
    
    print(price_container.text.strip())
    return price_container.text.strip().split(' ')[0][1:]


@shared_task
def scrap_wishlist():
    notify(subject="Hello",message="hello", recipient_list=['sai.9@iitj.ac.in',])
    print('scraping')
    products = Product.objects.all()
    for product in products:
        link = str(product.product_link)
        if 'www.amazon.in' in link:
            print(product.product_name)
            price = float(scrap_amazon(link))
            print(price)
            if price < float(product.last_seen_price):
                recipient_list = []
                for track in product.putrack_set.all:
                    if float(track.price_quoted) >= price:
                        recipient_list.append(track.user.email)
                if recipient_list:
                    subject = "Hooray!!! Now you can buy your wished product at your budget"
                    message = "Hi"+str(product.product_name)+" price is now "+ str(price)
        
        if 'www.flipkart.com' in link:
            print(product.product_name)
            price = float(scrap_flipkart(link))
            print(price)
            if price < float(product.last_seen_price):
                recipient_list = []
                for track in product.putrack_set.all:
                    if float(track.price_quoted) >= price:
                        recipient_list.append(track.user.email)
                if recipient_list:
                    subject = "Hooray!!! Now you can buy your wished product at your budget"
                    message = "Hi"+str(product.product_name)+" price is now "+ str(price)
        
            
    
# @shared_task
def notify(subject,message,recipient_list):
    with get_connection(  
           host=settings.EMAIL_HOST, 
     port=settings.EMAIL_PORT,  
     username=settings.EMAIL_HOST_USER, 
     password=settings.EMAIL_HOST_PASSWORD, 
     use_tls=settings.EMAIL_USE_TLS  
       ) as connection:  
           email_from = settings.EMAIL_HOST_USER  
           EmailMessage(subject, message, email_from, recipient_list, connection=connection).send()  
    # print("Scraping.......")
    # email_from = settings.EMAIL_HOST_USER
    # send_mail( subject, message, email_from, recipient_list )
    return "Mail has been sent........"

