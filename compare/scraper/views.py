from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
import requests
from bs4 import BeautifulSoup
from io import BytesIO
from reportlab.pdfgen import canvas
from django.http import HttpResponse
import csv
import json
from django.urls import path
from django.template.loader import get_template
from xhtml2pdf import pisa

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken


class WishlistView(APIView):
    permission_classes = (IsAuthenticated, )
    
    def post(self, request, pinfo):
        pinfo = json.loads(pinfo)

class ProductInfoView(APIView):
    permission_classes = (AllowAny, )


    def get(self, request, searchsentence):
        headers = {
            "User-Agent": "foo Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

        }
        products_info = []

        amazonurl = f"https://www.amazon.in/s?k={searchsentence}"
        response = requests.get(url=amazonurl, headers= headers)
        soup = BeautifulSoup(response.content, 'lxml')
        # print(soup.prettify())
        # Example: Find and print the details of each product
        print(soup)
        product_containers = soup.find_all("div", {"class": "s-result-item"})
        if product_containers:

            for product in product_containers:
                # Extract product title
                product_info={}
                title = product.select_one("span.a-text-normal")
                if title:
                    product_info['title'] = title.text.strip()
                else:
                    continue

                # Extract product's Original price
                prices = product.findAll("span", {"class": "a-offscreen"})
                if len(prices) > 1:
                    product_info['original_price'] = prices[1].text.strip()
                    product_info['price'] = prices[0].text.strip()
                elif prices:
                    product_info['original_price'] = prices[0].text.strip()
                    product_info['price'] = product_info['original_price']
                else:
                    continue
                    product_info['original_price'] = "Price not found"
                    product_info['price'] = "Price not found"


                # Extract product link
                link = product.find("a", {"class": "a-link-normal"})
                if link:
                    product_info['link'] = f"https://www.amazon.in{link['href']}" 
                else:
                    continue
                # Extract product rating
                rating = product.find("span", {"class":'a-icon-alt'})
                product_info['rating'] = rating.text.strip().split()[0] if rating else "Rating not found"

                # Extract number of reviews
                # reviews = product.select_one("span[data-asin='{ASIN}'] span.a-declarative span.a-size-base")
                # review_count = reviews.text.strip() if reviews else "Reviews not found"
                
                # Extract product image URL
                image = product.find("img",{"class":"s-image"})
                product_info['image'] = image['src'] if image else "Image not found"
                product_info['website'] = 'amazon'
                # print(product_info)
                products_info.append(product_info)
                # Print product details
            
            # all_products['amazon'] = products_info
            # return Response({'products':products})

        # else:
        #     # return Response({'detail':'Products not found','code':400})
        #     all_products['amazon'] = 'Products not found'
        

        myntraurl = f"https://www.myntra.com/{searchsentence}?rawQuery={searchsentence}"
        headers = {
            "User-Agent": "foo Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }
        response = requests.get(url=myntraurl, headers= headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        # print(soup.prettify())
        # Example: Find and print the details of each product
        # print(str(soup.get_text)[10000:1000000])
        
        # scrapfile = open('scrapfile.txt', 'w+')
        # scrapfile.write(soup.prettify())
        # scrapfile.close()
        product_containers = soup.find_all("li.product-base")
        print(product_containers)
        if product_containers:

            for product in product_containers:
                # Extract product title
                product_info={}
                title = product.select_one("h4.product-product")
                if title:
                    product_info['title'] = title.text.strip()
                else:
                    continue

                # Extract product's Original price
             
                price = product.select_one("span.product-discountedPrice")
                if price:
                    product_info['price'] = price.text.strip()
                else:
                    price = product.select_one("div.product-price span")
                    if price:
                        product_info['price'] = price.text.strip()
                    else:
                        continue
                original_price = product.select_one("span.product-strike")
                product_info['original_price'] = original_price.text.strip() if original_price else product_info['price']
                
                fewleft = product.select_one("div.xcelerator-plpXceleratorInfoTag")
                product_info['few_left'] = "True" if fewleft else "False"

                brand = product.select_one("h3.product-brand")
                product_info['brand'] = brand.text.strip() if brand else 'Not found'


                # Extract product link
                link = product.select_one("a")
                if link:
                    product_info['link'] = f"https://www.myntra.com/{link['href']}" 
                else:
                    continue
                # Extract product rating
                rating = product.find("span", {"class":'a-icon-alt'})
                product_info['rating'] = rating.text.strip().split()[0] if rating else "Rating not found"

                # Extract number of reviews
                # reviews = product.select_one("span[data-asin='{ASIN}'] span.a-declarative span.a-size-base")
                # review_count = reviews.text.strip() if reviews else "Reviews not found"
                
                # Extract product image URL
                image = product.find("picture",{"class":"img-responsive"})
                if image:
                    main_image = image.select_one("img")
                    product_info['image'] = main_image['src'] if main_image else "Not found"
                else:
                    product_info['image'] = "Not found"
                
                product_info['website'] = 'Myntra'
                # print(product_info)
                products_info.append(product_info)
                # Print product details
            
            # all_products['myntra'] = products_info
            # return Response({'products':products})

        # else:
        #     # return Response({'detail':'Products not found','code':400})
        #     all_products['myntra'] = 'Products not found'
        

        flipkart_product_url = f"https://www.flipkart.com/search?q={searchsentence}"
        headers = {
            "User-Agent": "foo Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }

        response = requests.get(url=flipkart_product_url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Example: Find and print the details of each product
            product_containers = soup.find_all(class_="_13oc-S")

            if product_containers:

                for product in product_containers:
                    product_info = {}
                    # Extract product title
                    product_title = product.find(class_='4rR01T')
                    
                    if product_title:
                        product_info['title'] = product_title.text 
                    else:
                        product_info['title'] = next(iter([x.get('title') for x in product.find_all('a') if x.get('title')]), "Not found")
                    if product_info['title'] == 'Not found':
                        continue
                    print('reached')
                    # Extract product prices
                    price = product.find('div', class_="_30jeq3")
                    if price:
                        product_info['price'] = price.text.strip() 
                    else:
                        continue
                    
                    
                    orgprice = product.find('div', class_="_3I9_wc")
                    product_info['original_price'] = orgprice.text.strip() if orgprice else "Original Price not found"

                    # Extract product link
                    link = product.find('a')['href']
                    if link:
                        product_info['link'] = f"https://www.flipkart.com{link}"
                    else:
                        continue

                    # Extract product rating
                    rating = product.find(class_="_3LWZlK")
                    product_info['rating'] = rating.text.strip() if rating else "Rating not found"

                    # Extract number of reviews
                    # reviews = product.select_one("span._2_R_DZ")
                    # review_count = reviews.text.strip() if reviews else "Reviews not found"

                    # Extract product image URL
                    image = product.find('img')
                    product_info['image'] = image['src'] if image else "Image not found"

                    product_info['website'] = 'Flipkart'

                    # Print product details
                    products_info.append(product_info)

        #         all_products['flipkart'] = products_info
        #     else:
        #         all_products['flipkart'] = 'Products not found'
        # else:
        #     all_products['flipkart'] = 'Page not found'

        all_products = json.dumps(products_info)
        return Response({'all_products': all_products})



        # title = soup.title.string
        # headings = []
        # for heading in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        #     headings.append(heading.text.strip())
        # paragraphs = []
        # for paragraph in soup.find_all('p'):
        #     paragraphs.append(paragraph.text.strip())
        






# response = requests.get(url=amazon_product_url, headers=headers)

# if response.status_code == 200:
#     soup = BeautifulSoup(response.content, 'html.parser')
    
#     # Your scraping logic here to extract information
    
#     # Example: Find and print the details of each product
#     product_containers = soup.findAll("div", {"class": "s-result-item"})
#     # print(product_containers[11].prettify())
#     if product_containers:
#         for product in product_containers:
#             # Extract product title
#             title = product.select_one("span.a-text-normal")
#             product_title = title.text.strip() if title else "Title not found"

#             # Extract product's Original price
#             original_price = product.find("span", {"class": "a-offscreen"})
#             original_product_price = original_price.text.strip() if original_price else "Price not found"

#             # Extract product price
#             price = product.find("span", {"class": "a-price-whole"})
#             product_price = price.text.strip() if price else "Price not found"

#             # Extract product link
#             link = product.find("a", {"class": "a-link-normal"})
#             product_link = f"https://www.amazon.in{link['href']}" if link else "Link not found"

#             # Extract product rating
#             rating = product.find("span", {"class":'a-icon-alt'})
#             product_rating = rating.text.strip() if rating else "Rating not found"

#             # Extract number of reviews
#             # reviews = product.select_one("span[data-asin='{ASIN}'] span.a-declarative span.a-size-base")
#             # review_count = reviews.text.strip() if reviews else "Reviews not found"

#             # Extract product image URL
#             image = product.find("img",{"class":"s-image"})
#             product_image = image['src'] if image else "Image not found"

#             # Print product details
#             print("Product Title:", product_title)
#             print("Product Original Price:", original_product_price)
#             print("Product Price:", product_price)
#             print("Product Rating:", product_rating)
#             # print("Review Count:", review_count)
#             print("Product Link:", product_link)
#             print("Product Image:", product_image)
#             print("\n")
#     else:
#         print("No products found on the page.")
# else:
#     print("Failed to retrieve the page. Status code:", response.status_code)




















def home(request):
    return render(request, 'home.html')


def scrape(request):
    if request.method == 'POST':
        url = request.POST.get('url')
        r = requests.get(url)
        soup = BeautifulSoup(r.content, 'lxml')
        # get the required data from soup object
        title = soup.title.string
        headings = []
        for heading in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
            headings.append(heading.text.strip())
        paragraphs = []
        for paragraph in soup.find_all('p'):
            paragraphs.append(paragraph.text.strip())
        context = {
            'title': title,
            'headings': headings,
            'paragraphs': paragraphs,
        }
        request.session['scraped_data'] = context
        return render(request, 'result.html', context)
    else:
        return render(request, 'home.html')

def download_file(request):
    if 'scraped_data' in request.session:
        context = request.session['scraped_data']
        response = HttpResponse(content_type='')
        if request.POST['download_type'] == 'pdf':
            template_path = 'result.html'
            template = get_template(template_path)
            html = template.render(context)
            response = HttpResponse(content_type='application/pdf')
            filename = f"{context['title']}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            buffer = BytesIO()
            pisa_status = pisa.CreatePDF(html, dest=response, encoding='utf-8')
            if pisa_status.err:
                return HttpResponse('PDF generation failed')
        elif request.POST['download_type'] == 'csv':
            response = HttpResponse(content_type='text/csv')
            filename = f"{context['title']}.csv"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            writer = csv.writer(response)
            writer.writerow(['Title', 'Headings', 'Paragraphs'])
            rows = zip([context['title']], context['headings'], context['paragraphs'])
            for row in rows:
                writer.writerow(row)
        elif request.POST['download_type'] == 'json':
            response = HttpResponse(content_type='application/json')
            filename = f"{context['title']}.json"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            json.dump(context, response, indent=4)
        return response
    else:
        return render(request, 'home.html')