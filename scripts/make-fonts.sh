#!/bin/sh
# Rebuilds public/fonts/fraunces-600-{normal,italic}.woff2: the Latin Fraunces variable font from
# @fontsource-variable/fraunces, pinned to the one look the site uses. Needs fontTools and brotli:
#   python3 -m venv .fontenv && .fontenv/bin/pip install fonttools brotli
#   PY=.fontenv/bin/python sh scripts/make-fonts.sh
# If you change the settings, change the file names too (they're cached for a year).
set -e
PY=${PY:-python3}
SRC=node_modules/@fontsource-variable/fraunces/files
for style in normal italic; do
	$PY -m fontTools.varLib.instancer "$SRC/fraunces-latin-full-$style.woff2" \
		wght=600 SOFT=100 WONK=1 opsz=144 --static -o "/tmp/fraunces-600-$style.ttf"
	$PY -c "from fontTools.ttLib import TTFont; f = TTFont('/tmp/fraunces-600-$style.ttf'); f.flavor = 'woff2'; f.save('public/fonts/fraunces-600-$style.woff2')"
done
cp node_modules/@fontsource-variable/fraunces/LICENSE public/fonts/Fraunces-OFL.txt
ls -l public/fonts
