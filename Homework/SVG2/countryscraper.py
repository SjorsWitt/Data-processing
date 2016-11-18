# Name: Sjors Witteveen
# Student number: 10808493
'''
This script scrapes the wikipedia population per country table
'''
import csv
import re
import json

from pattern.web import URL, DOM

TARGET_URL = "https://en.wikipedia.org/wiki/Demographics_of_Europe"
OUTPUT_FILE = "data.json"

def extractCountry(dom):
    data = {}
    data['points'] = []

    table = dom.body.by_class("wikitable sortable")[0]
    countries_content = table.by_tag("tr")

    # Add every country and its population to data
    for country_content in countries_content[1:-2]:
        country_data = {}
        country_data['country'] = country_content.by_tag("a")[1].content
        country_data['population'] = country_content.by_tag("td")[2].content
        data['points'].append(country_data)
    return data

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    data = extractCountry(dom)
    
    with open(OUTPUT_FILE, 'w') as outfile:
        json.dump(data, outfile, indent=4)