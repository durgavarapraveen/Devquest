from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from bs4 import BeautifulSoup
import requests
from .models import Product, PUTrack

def scrap_amazon(link):
    headers = {
            "User-Agent": "foo Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }
    response = requests.get(url=link, headers= headers)
    soup = BeautifulSoup(response.content, 'lxml')
    # print(soup.prettify())
    # Example: Find and print the details of each product
    # print(soup)
    price_container = soup.find("span", {"class": "aok-offscreen"})
    return price_container.text.strip()


@shared_task
def scrap_wishlist():
    print('scraping')
    products = Product.objects.all()
    for product in products:
        link = str(product.product_link)
        if 'www.amazon.in' in link:
            print(product.product_name)
            if float(scrap_amazon(link)) < float(product.last_seen_price):
                for track in product.putrack_set.all:
                    
        

    

@shared_task
def notify():
    print("Scraping.......")
    subject = 'welcome to Celery world'
    message = 'Hi thank you for using celery'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = ['yourmail@gmail.com', ]
    send_mail( subject, message, email_from, recipient_list )
    return "Mail has been sent........"

