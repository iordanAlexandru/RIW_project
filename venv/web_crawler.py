import requests
from bs4 import BeautifulSoup
import csv

# with open('digi24.html', encoding="utf8") as html_file:
#     soup = BeautifulSoup(html_file, 'lxml')
#
# for article in soup.find_all('article', class_='article brdr'):
#     if (article.p):
#         print(article.h4.a.text)
#         print(article.p.text + '\n')

source = requests.get('https://www.coreyms.com/').text
soup = BeautifulSoup(source, 'lxml')

csv_file = open('cms_scrape.csv', 'w')
csv_writer = csv.writer(csv_file)
csv_writer.writerow(['headline','summary','video link'])


for article in soup.find_all('article'):
    article_title = article.header.h2.a.text;
    print(article_title)

    article_summary = article.find('div', class_='entry-content').p.text;
    print(article_summary)

    try:
        yt_vid = soup.find('iframe', class_='youtube-player')['src'].split('/')[4].split('?')[0]
        yt_link = f'https://youtube.com/watch?v={yt_vid}'

    except Exception as e:
        yt_link = None

    print(yt_link)
    print()
    csv_writer.writerow([article_title, article_summary, yt_link])

csv_file.close()