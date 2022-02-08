#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

CUSTOM_IMAGE=$@
if [ -z "$CUSTOM_IMAGE" ]
then
    START_IMAGE="ibmcom/ibp-microfab:0.0.11"
else
    START_IMAGE=$CUSTOM_IMAGE
fi

echo "Using image: $START_IMAGE"

CONTAINER=$(docker ps -f label=fabric-environment-name="aaaaaaaaaaa Microfab" -q -a)
if [ -z "$CONTAINER" ]
then
    export MICROFAB_CONFIG='{"port":8083,  "endorsing_organizations": [{"name": "Org1"}],"channels": [{"name": "mychannel","endorsing_organizations": ["Org1"]}]}'
    docker run -e MICROFAB_CONFIG --label fabric-environment-name="aaaaaaaaaaa Microfab" -d -p 8083:8083 $START_IMAGE
else
    docker start ${CONTAINER}
fi
sleep 2


exit 0