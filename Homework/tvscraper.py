#!/usr/bin/env python
# Name: Sjors Witteveen
# Student number: 10808493
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import re

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    tvseries = []

    series_content = dom.body.by_class("lister-item-content")

    # Add every serie info to tvseries list
    for serie in series_content:
        serie_info = []
        serie_info.append(serie.by_class("lister-item-header")[0].by_tag("a")[0].content.encode('utf-8'))
        serie_info.append(serie.by_class("rating-rating")[0].by_class("value")[0].content)
        serie_info.append(serie.by_class("genre")[0].content.strip(" \n"))
        serie_info.append(re.sub("<.*?>", '', serie.by_tag("p")[2].content).strip(" \n").replace("\n", "")[6:].encode('utf-8'))
        serie_info.append(serie.by_class("runtime")[0].content[:-4])
        tvseries.append(serie_info)

    return tvseries


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for row in tvseries:
        writer.writerow(row)


if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
