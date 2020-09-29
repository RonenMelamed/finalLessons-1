*** Settings ***
Documentation     A test suite with a single test for valid login.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Resource          resource.robot
Library    String
#run command: robot -d ..\RobotLogs\book_lesson book_lesson.robot

*** Test Cases ***

Book Lesson expect to pass
    Login   s@s.com    123123
    Main Page Should Be Open
    Select Language  Acholi
    Select Teacher Origin  Afghanistan
    Click Search Teacher Button
    Select Teacher Profile
    Click Wanted Date   xpath://html/body/section/div/div[2]/div/div/table/tr[4]/td[4]/button
    Click Book Lesson
    Payment Page Should Be Open
    Fill Name On Card  Prince
    Fill Email   p@p.com
    Fill Credit Card  1234123412341234
    Fill Cvc  234
    Click Payment Order Button
    #Success Message Should Appear Payment

    #[Teardown]    Close Browser


*** Keywords ***
#Do Add
#    Open Browser To Login Page
#    Click Signup Btn
#    Signup Page Should Be Open
#     ${id} =  Generate Random String  3  [LETTERS]
#    Input Signup Name   ${id}
#    Input Signup Email  ${id}@${id}.com
#    Input Signup Pass   123123
#    Click Signup Submit Btn
