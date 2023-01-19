#!/bin/bash

# Get the top 10k sites from http://s3.amazonaws.com/alexa-static/top-1m.csv.zip

set -e

rm -f current.csv
curl -o current.csv.gz http://s3.amazonaws.com/alexa-static/top-1m.csv.zip
unzip current.csv.gz
mv top-1m.csv current.csv

OUT=top_10k_sites
OUT_CSV=${OUT}.csv
OUT_JS=${OUT}.js

head -n 10001 current.csv| cut -f 2 -d "," > ${OUT_CSV}

echo "const topSites = [" > ${OUT_JS}

while read p; do
  echo "\"$p\"," >> ${OUT_JS}
done < ${OUT_CSV}

echo "\"\"];" >> ${OUT_JS}
