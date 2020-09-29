*** Settings ***
Documentation     A resource file with reusable keywords and variables.
...
...               The system specific keywords created here form our own
...               domain specific language. They utilize keywords provided
...               by the imported SeleniumLibrary.
Library           SeleniumLibrary

*** Variables ***
${SERVER}         localhost:7272
${BROWSER}        chrome
${DELAY}          0
${LOGIN URL}      https://calm-peak-58723.herokuapp.com/login/index.html
${MAIN_URL}    https://calm-peak-58723.herokuapp.com/main/main.html
${LOGIN_BTN}       login_btn
${LOGOUT_BTN}       logout_btn
${SIGNUP_BTN}      sign_up_btn
${SIGNUP_UNAME_INPUT}   user_name
${SIGNUP_EMAIL_INPUT}   email
${SIGNUP_PASS1_INPUT}   Password1
${SIGNUP_PASS2_INPUT}   Password2
${SIGNUP_SUBMIT_BTN}    sbmt
${SIGNUP_ERR_MSG}    error_msg
${SEARCH_LANG_LIST}   ddl_language
${SEARCH_ORIGIN_LIST}   ddl_origin
${SEACRH_TEACHER_BTN}   searchBtn
${SEARCH_SEE_PROFILE_BTN}   lCF3MT5PhvUAJyPT4irwxNu7jok1
${BOOK_LESSON_TEAECHER_BUTTON}   book_btn
${PAY_CARD_NAME_INPUT}   pay-credit-name-input
${PAY_EMAIL_INPUT}   pay-credit-email-input
${PAY_CARD_NUMBER_INPUT}   pay-credit-number-input
${PAY_CARD_CVC_INPUT}   pay-credit-cvc-input
${PAY_ORDER_BTN}  orderButton
${PROFILE_BUTTON}   edit_teacher_profile
${PROFILE_SAVE_CHANGES_BUTTON}   save_btn
${TEACHER_CALENDAR_SCHEDULE_TABLE}  xpath://html/body/div[1]/div[4]/div/table
${TEACHER_CALENDAR_TABLE}   xpath://html/body/section/div/div[2]/div/div/table
*** Keywords ***
Valid Login
    Login   s@s.com    123123
    Main Page Should Be Open
    Logout
    #[Teardown]    Close Browser

Login
    [Arguments]    ${username}    ${password}
    Open Browser To Login Page
    Input Username    ${username}
    Input Password    ${password}
    Click Button Helper  ${LOGIN BTN}

Logout
    ${c} =   Get Element Count   ${LOGOUT_BTN}
    Run Keyword If   ${c}>0      Click Button Helper  ${LOGOUT_BTN}

Open Browser To Login Page
    Open Browser    ${LOGIN URL}    ${BROWSER}
    #Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    Login Page Should Be Open

Login Page Should Be Open
    Title Should Be    Languages

Go To Login Page
    Go To    ${LOGIN URL}
    Login Page Should Be Open

Input Username
    [Arguments]    ${username}
    Input Text    email    ${username}

Input Password
    [Arguments]    ${password}
    Input Text    password    ${password}

Main Page Should Be Open
    Wait Until Page Contains Element   ${LOGOUT_BTN}    10
    #Title Should Be    Hellow, World!

Login error Should Be visible
    Wait Until Page Contains Element   error_msg_id
    #Title Should Be    Hellow, World!

Click Signup Btn
    Click Button Helper  ${SIGNUP_BTN}

Click Button Helper
    [Arguments]    ${button_id}
    Wait Until Page Contains Element   ${button_id}    20
    Click Button    ${button_id}

Input helper
    [Arguments]    ${input_id}    ${input_val}
    Wait Until Page Contains Element   ${input_id}
    Input Text    ${input_id}    ${input_val}

Signup Page Should Be Open
    Wait Until Page Contains Element   ${SIGNUP_UNAME_INPUT}    20

Input Signup Name
    [Arguments]    ${input_val}
    Input helper  ${SIGNUP_UNAME_INPUT}    ${input_val}

Input Signup Email
    [Arguments]    ${input_val}
    Input helper  ${SIGNUP_EMAIL_INPUT}    ${input_val}

Input Signup Pass
    [Arguments]    ${input_val}
    Input helper  ${SIGNUP_PASS1_INPUT}    ${input_val}
    Input helper  ${SIGNUP_PASS2_INPUT}    ${input_val}

Click Signup Submit Btn
    Click Button Helper  ${SIGNUP_SUBMIT_BTN}

Signup Error Should Apear
    Wait Until Page Contains Element   ${SIGNUP_ERR_MSG}    20

Select Language
    [Arguments]    ${input_val}
    Select From List By Value   ${SEARCH_LANG_LIST}   ${input_val}

Select Teacher Origin
    [Arguments]    ${input_val}
    Select From List By Value   ${SEARCH_ORIGIN_LIST}   ${input_val}

Click Search Teacher Button
    Click Button Helper  ${SEACRH_TEACHER_BTN}

Select Teacher Profile
    Click Button Helper  ${SEARCH_SEE_PROFILE_BTN}

Click Wanted Date
    [Arguments]    ${input_val}
    Wait Until Page Contains Element   ${TEACHER_CALENDAR_TABLE}  20
    Sleep  10 seconds
    Click Button Helper    ${input_val}

Click Wanted Date Schedule
    [Arguments]    ${input_val}
    Wait Until Page Contains Element   ${TEACHER_CALENDAR_SCHEDULE_TABLE}  20
    Sleep  3 seconds
    Click Button Helper    ${input_val}

Click Book Lesson
    Click Button Helper  ${BOOK_LESSON_TEAECHER_BUTTON}

Payment Page Should Be Open
    Wait Until Page Contains Element   ${PAY_CARD_NAME_INPUT}    20
Fill Name On Card
    [Arguments]    ${input_val}
    Input helper   ${PAY_CARD_NAME_INPUT}   ${input_val}

Fill Email
    [Arguments]    ${input_val}
    Input helper   ${PAY_EMAIL_INPUT}   ${input_val}

Fill Credit Card
    [Arguments]    ${input_val}
    Input helper   ${PAY_CARD_NUMBER_INPUT}     ${input_val}

Fill Cvc
    [Arguments]    ${input_val}
    Input helper   ${PAY_CARD_CVC_INPUT}     ${input_val}

Click Payment Order Button
    Click Button Helper  ${PAY_ORDER_BTN}

Success Message Should Appear Payment
    Wait Until Page Contains Element   payment-success-ok-btn    15

Click Profile Button
    Click Button Helper  ${PROFILE_BUTTON}

Click Schedule Save Changes
    Click Button Helper  ${PROFILE_SAVE_CHANGES_BUTTON}

Success Scheduling Should Appear
    Wait Until Page Contains Element  xpath://html/body/div[2]/div/div/div[2]/button   15

