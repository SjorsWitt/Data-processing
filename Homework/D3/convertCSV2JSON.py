# Name: Sjors Witteveen
# Student number: 10808493

import csv
import re
import json

from pattern.web import URL, DOM

OUTPUT_FILE = "data.json"
CSV_NAME = "Neerslag 2015 per maand.csv"

def readCSV(CSV_NAME):
	data = {}
	data['points'] = []

	with open(CSV_NAME, 'rb') as csvfile:
	    reader = csv.reader(csvfile, delimiter=',')
	    keys = next(reader)

	    for row in reader:
	    	row_data = {}

	        for i in range(len(row)):
	        	row_data[keys[i].strip()] = row[i].strip()

	    	data['points'].append(row_data)

	return data

data = readCSV(CSV_NAME)

with open(OUTPUT_FILE, 'w') as outfile:
    json.dump(data, outfile, indent=4)