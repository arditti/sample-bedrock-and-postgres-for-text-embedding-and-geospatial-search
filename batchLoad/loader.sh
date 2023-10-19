#!/bin/bash

# Path to CSV file
csv_file="./example_input.csv"

# Read header row and store field names
read -r -a header < $csv_file

tail -n +2 "$csv_file" | while IFS=, read -r "${header[@]}"
do
  # Build curl request with data from each field
  curl --location 'localhost:3000/ingestNeedHelp' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "user": {
          "phone": "$4",
          "email": "example@gmail.com",
          "name": "$3"
      },
      "props": {
          "text": "$5",
          "address": "$5"
      }
  }'
done
