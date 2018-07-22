# Foggler

The project is using [Jekyll](https://jekyllrb.com/) stitic site generator and hosted on github pages. Check documentation out to find details how to run it.

## How to start locally
`bundle exec jekyll serve`

## How to change content
Most of the content located in _config.yml. Also you can change order of images in this config. Some of text also located `html` files.

## How to add new photo
*Important: it was tested only on MacOS* 
  - install [imagemagic](https://www.imagemagick.org/script/download.php) tool
  - add new image to `assets/img/photos/original`
  - run image optimization script `./scripts/prepare-images.sh`
  - wait until script process all images
  - add new photo into the list in `_config.yml` file
