#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev
for CONTAINER in $(docker ps -f label=fabric-environment-name="aaaaaaaaaaa Microfab" -q); do
    docker stop ${CONTAINER}
done
sleep 2
exit 0