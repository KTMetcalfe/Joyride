#!/bin/bash

echo Uploading client build...
rsync -q -avzhP --no-p ./client/build root@10.0.0.10:/mnt/user/joyride
echo Client build uploaded.

echo Uploaded server files...
rsync -q -avzhP --no-p ./server/* root@10.0.0.10:/mnt/user/joyride
echo Server files uploaded.

echo Joyride has been updated!
