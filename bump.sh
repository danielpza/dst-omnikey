#!/usr/bin/env bash

next_version=$(git cliff --bumped-version)
sed "s/version = \".*\..*\..*\"/version = \"${next_version:1}\"/" modinfo.lua -i

git-cliff --bump -o CHANGELOG.md

git add modinfo.lua CHANGELOG.md

git commit -m "chore(release): ${next_version:1}"
git tag ${next_version}

git push --tags --follow-tags

gh release create $next_version --notes="$(git cliff --latest)"
