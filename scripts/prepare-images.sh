#!/usr/bin/env bash

declare -a sizes=("2411" "1920" "1366" "960")
scriptsPath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
projectPath=$(dirname ${scriptsPath})
baseImagesPath="${projectPath}/assets/img/photos/"
originalImages=${baseImagesPath}original/*.jpg

echo "$originalImages"
for image in ${originalImages}
do
    baseName=$(basename "$image")
    echo "Processing ${baseName}..."
    for size in "${sizes[@]}"
    do
        convert ${image} -resize ${size} -quality 85 "$baseImagesPath$size/$baseName"
    done
done
