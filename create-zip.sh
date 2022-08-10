#!/usr/bin/env sh

## see https://superuser.com/questions/119649/avoid-unwanted-path-in-zip-file

set -ex

npm run build
rm -f OmniKey.zip
zip OmniKey.zip README.md CHANGELOG.md
cd lib
zip -r $OLDPWD/OmniKey.zip .
