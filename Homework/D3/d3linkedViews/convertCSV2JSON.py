# Name: Sjors Witteveen
# Student number: 10808493

# This program takes 2 arguments (without file extensions)
#	1. csv file name to convert
#	2. json output file name

import csv
import re
import json
import sys

from pattern.web import URL, DOM

CSV_NAME = sys.argv[1] + ".csv"
OUTPUT_FILE = sys.argv[2] + ".json"

def readCSV(CSV_NAME):
	data = {}
	data['points'] = []

	with open(CSV_NAME, 'rb') as csvfile:
	    reader = csv.reader(csvfile, delimiter=',')
	    keys = reader.next()
	    keys[0] = keys[0].decode("utf-8-sig").encode("utf-8")

	    for row in reader:
	    	row_data = {}

	        for i in range(len(row)):
	        	row_data[keys[i].strip()] = row[i].strip()

	    	data['points'].append(row_data)

	return data

data = readCSV(CSV_NAME)



with open(OUTPUT_FILE, 'w') as outfile:
    json.dump(data, outfile, indent=4)