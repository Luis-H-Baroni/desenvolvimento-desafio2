@echo on
rem
rem Copyright IBM Corp All Rights Reserved
rem
rem SPDX-License-Identifier: Apache-2.0
rem
setlocal enabledelayedexpansion
for /f "usebackq tokens=*" %%c in (`docker ps -f label^=fabric-environment-name^="aaaaaaaaaaa Microfab" -q -a`) do (
    docker rm -f %%c
    if !errorlevel! neq 0 (
        exit /b !errorlevel!
    )
)
for /f "usebackq tokens=*" %%v in (`docker volume ls -f label^=fabric-environment-name^="aaaaaaaaaaa Microfab" -q`) do (
    docker volume rm -f %%v
    if !errorlevel! neq 0 (
        exit /b !errorlevel!
    )
)
exit /b 0