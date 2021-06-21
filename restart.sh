cd android && ./gradlew clean && cd ..

${ANDROID_HOME}/emulator/emulator @nexus_6 -wipe-data >/dev/null 2>&1 &

yarn run android

yarn start
