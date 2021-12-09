#!/usr/bin/env bash

rm -rf ./images/*
mkdir -p images

for src in ./src/*; do
  if [ ! -d "$src" ]; then
    pathname="${src##*/}"
    destination="./images/${pathname%.*}.svg"
    cat ${src} | sed 's/```.*//g' | yarn mmdc -o ${destination}
  fi
done
