#!/bin/sh
rm icons/64x64.png
rm icons/24x24.png
rm icons/512x512.png
rm icons/1024x1024.png
rm icons/2048x2048.png

convert background.png -resize 16x16 icons/16x16.png
convert background.png -resize 32x32 icons/32x32.png
convert background.png -resize 48x48 icons/48x48.png
convert background.png -resize 128x128 icons/128x128.png
convert background.png -resize 256x256 icons/256x256.png

png2icns icon.icns icons/*.png

convert background.png -resize 64x64 icons/64x64.png

icotool -c icons/*.png -o icon.ico

convert background.png -resize 24x24 icons/24x24.png
convert background.png -resize 512x512 icons/512x512.png
convert background.png -resize 1024x1024 icons/1024x1024.png
cp background.png icons/2048x2048.png
cp icons/512x512.png ../app/icon.png
