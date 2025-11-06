#!/bin/sh

set -o errexit
set -o nounset

if [ -n "$(git status --porcelain)" ]
then
  echo "ERROR: There are uncommitted files in the repository" >&2
  echo "" >&2
  git status >&2
  exit 1
fi
