#!/bin/bash

set -e
cur_dir=`dirname $0`

echo "BUILDING ANDROID";
cd android &&
./gradlew clean assembleRelease && cd ..

echo "APK will be present at android/app/build/outputs/apk/app-release.apk"