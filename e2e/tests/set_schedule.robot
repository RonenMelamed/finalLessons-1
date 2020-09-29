*** Settings ***
Documentation     A test suite with a single test for valid login.
Resource          resource.robot
Library    String

#run command: robot -d ..\RobotLogs\set_schedule set_schedule.robot

*** Test Cases ***

Book Lesson expect to pass
    Login   c@c.com    123123
    Main Page Should Be Open
    Click Profile Button
    Sleep  5 seconds
    Click Wanted Date Schedule  xpath://html/body/div[1]/div[4]/div/table/tr[9]/td[4]/button
    Click Schedule Save Changes
    Success Scheduling Should Appear
    #[Teardown]    Close Browser


*** Keywords ***
