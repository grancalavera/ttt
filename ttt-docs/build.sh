#!/usr/bin/env bash

rm -rf ./images/*
mkdir -p images

for source in ./src/*; do
  if [ ! -d "$source" ]; then
    pathname="${source##*/}"
    destination="./images/${pathname%.*}.png"
    yarn mmdc -i ${source} -o ${destination}
  fi
done
