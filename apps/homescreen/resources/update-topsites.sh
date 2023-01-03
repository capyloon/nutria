#!/bin/bash

# Get the top 10k sites from https://github.com/zakird/crux-top-lists

set -e

rm -f current.csv
curl -O https://raw.githubusercontent.com/zakird/crux-top-lists/main/data/global/current.csv.gz
gzip -d current.csv.gz

OUT=top_10k_sites
OUT_CSV=${OUT}.csv
OUT_JS=${OUT}.js

head -n 10001 current.csv|grep http | cut -f 1 -d "," | sed 's_http[s]*://__' > ${OUT_CSV}

echo "const topSites = [" > ${OUT_JS}

while read p; do
  echo "\"$p\"," >> ${OUT_JS}
done < ${OUT_CSV}

echo "\"\"];" >> ${OUT_JS}
