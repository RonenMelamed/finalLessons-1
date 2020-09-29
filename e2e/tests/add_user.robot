*** Settings ***
Documentation     A test suite with a single test for valid login.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Resource          resource.robot
Library    String
#run command: robot -d ..\RobotLogs\add_user add_user.robot

*** Test Cases ***

Add New User
    ${id} =  Generate Random String  3  [LETTERS]
    Set Suite Variable  ${id}  ${id}
    Do Add
    Main Page Should Be Open

Add User that already exists
    Do Add
    Signup Error Should Apear

*** Keywords ***
Do Add
    Open Browser To Login Page
    Click Signup Btn
    Signup Page Should Be Open
    Input Signup Name   ${id}
    Input Signup Email  ${id}@${id}.com
    Input Signup Pass   123123
    Click Signup Submit Btn
