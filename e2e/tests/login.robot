*** Settings ***
Documentation     A test suite with a single test for valid login.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Resource          resource.robot
#run command: robot -d ..\RobotLogs\login login.robot

*** Test Cases ***
Valid Login
    Login   s@s.com    123123
    Main Page Should Be Open
    Logout
    [Teardown]    Close Browser

Invalid Login
    Login   s@ss.com    123123
    Login error Should Be visible
    Logout
    [Teardown]    Close Browser