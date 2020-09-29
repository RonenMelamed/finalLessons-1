
const  db = firebase.database();
const images_storage = firebase.storage();

//profile attributes
var name ="";
var about_me ="";
var languages_I_teach = [];
var also_speak = [];
var homeCountry ="";
var lessonPrice="";
var availableSlots =[];
var skype_id ="";
var userEmail="";
var imageName="";
var newImageName="";
var bookedClasses;
var bookedDates = [];


var weekCalenders = initWeekCalendersObjects();
var weekCalenderIndx = 0;


var availableColor = "rgb(0, 153, 51)";
var notAvailablrColor = "rgb(194, 194, 163)";
var bookedColor = "rgb(255, 204, 102)";
var userID = get_userID_from_url();
var real_upload_btn = document.getElementById("myPhoto");


firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {

     window.location = "../index.html";
  } else {
    userID = user.uid;
    console.log("this line shoud be executed once for each login");
  }
});

console.log("userID: " +userID);
var teacher_path = "Users/Teachers/" + userID +"/";
console.log("teacher_path: " +teacher_path);

db.ref(teacher_path).on("value", get_profile_info_from_db);


build_calender();

/* ---------------- Buttons callbacks -------------- */



$("select.home_country").on("click", function(e) {
  homeCountry = $(this).children("option:selected").val();


});

$("#logout_btn").on("click", function () {
  firebase.auth().signOut();
});

$("#move_to_main").on("click", function () {
  window.location = "../main/main.html?uid="+userID;
});

$("#edit_teacher_profile").on("click", function () {
  var students = firebase.database().ref( "Users/Students/"+userID);
  students.once("value").then(function(snapshot) {
    if(snapshot.exists())
      window.location = "../user/user.html?uid=" + userID;  //if it's True then the user is a student and move to student profile
    else
      window.location = "../teacher_page/teacher.html?uid=" + userID; //move to teachers profile
    }); 
});

$("#save_btn").on("click",function(){
  upadate_array_by_checkbox('teach', languages_I_teach);
  upadate_array_by_checkbox('speak', also_speak);
  console.log("imageName: " + imageName);
  console.log("newImageName: " + newImageName);
  path = "Users/Teachers/"+userID+"/";

if(imageName != newImageName){
  update_profile_image();
  imageName = newImageName;
}

db.ref(path).update({'name':$(".Name").val(),
                    'homeCountry':homeCountry,
                    'languages_I_teach':languages_I_teach,
                    'alsoSpeak':also_speak,
                    'lessonPrice':$(".Lesson_price").val(),
                    'availableSlots':availableSlots,
                    'aboutMe': $(".about_me_txt").val(),
                    'skypeID': $("#skype_id").val(),
                    'userType': "Teacher",
                    'userEmail':userEmail,
                    'imageName': imageName
                  });




});

$("#read").on("click",function(event){
   db.ref("Users/Teachers/").on("value", read);
});

function calender_btn_clicked(event){

  console.log("enterd calender_btn");

  console.log("id: " + $(this).attr('id'));



  if ($( this ).css( "background-color" ) == bookedColor)
    return;
    
  var newColor = availableColor;

  if ($( this ).css( "background-color" ) == availableColor)
    newColor = notAvailablrColor;

  $(event.delegateTarget ).css( "background-color", newColor);

  var slot = $(this).attr('id');
  if(newColor == availableColor)
    availableSlots.push(slot);
  else
    removeSlot(slot);

}

$("#date_left").on("click",function(event){
  if(weekCalenderIndx == 0)
    return;
  weekCalenderIndx--;
  build_calender();

});

$("#date_right").on("click",function(event){
  if(weekCalenderIndx == 3)
    return;
  weekCalenderIndx++;

  build_calender();

});




$('input[name=checkbox]').change(function(){
    if($(this).is(':checked')) {
        console.log("added: " +  $(this).value.text())
    } else {
          console.log("removed: " +  $(this).val())
    }
});

//upload images



$("#upload_image_btn").on("click",function(event){
    real_upload_btn.click();
});

$("#myPhoto").on("change",function(event){
  console.log("I was here qqqqqqqqqqq");
  if(!real_upload_btn.value){
    console.log("exiting function");
    return;
  }

  newImageName = real_upload_btn.files[0].name;

});

/* ---------------- Service functions -------------- */

// Returns an array of dates between the two dates
function getDates(startDate) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  for(var i =0; i< 7; i++) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

function create2DimArray(rows, cols){
    var arr = new Array(rows);
    for(var i = 0; i< rows; i++)
      arr[i] = new Array(cols);

    for(var i =0; i <rows; i++ )
      for(var j =0; j <cols; j++)
        arr[i][j] = false;

    return arr;
}

function build_calender(){
  console.log("enterd build_calender");
  var table ="";

  table +="<tr>";

  table +='<td class="dates_cells"> Date </td>';
  for(var i =0; i < 7; i++){
        var temp = getDates( weekCalenders[weekCalenderIndx].firstDay);
        table +='<td class="dates_cells">' + temp[i].getDate()+'/'+(temp[i].getMonth())+'</td>';

  }
  table +="</tr>";

  var days  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  table +="<tr>";

  table +='<td class="days_cells"> Day </td>';
  for(var i =0; i < 7; i++)
        table +='<td class="days_cells">' +days[i]+'</td>';

  table +="</tr>";

  var hours = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00"
              ,"10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00",
              "21:00","22:00","23:00"];

  for(var i = 0; i < 24; i++){
    table +="<tr>";
    for(var j =0; j < 8; j++){
      var temp = getDates( weekCalenders[weekCalenderIndx].firstDay);

      if( j == 0 )
            table +='<td class="hours_cells">' +hours[i]+'</td>';
      else{
        //table += '<td> <button type="button" class="calender_btn" data-day="'+j+'" data-hour="'+i+'"></button></td>';
        var temp_id = temp[j-1].getDate()+'.'+(temp[j-1].getMonth())+"_day-"+days[j-1]+"_hour-"+hours[i];

        table += '<td> <button type="button" class="calender_btn"  id="'+temp_id+'"></button></td>';

      }
    }
      table +="</tr>";
  }

  $(".booking_calneder").empty();
  $(".booking_calneder").append(table);
  $(".calender_btn").on("click",calender_btn_clicked);
  updateSlotsColors();

}

function initWeekCalendersObjects(){
  var objectArr = new Array(4);
  for(var i=0; i< objectArr.length; i++){
    var obj = {firstDay : new Date()};
    obj.firstDay.setDate(getSunday().getDate() + i*7);
    objectArr[i] = obj;
}
  return objectArr;
}

function read(data){

    console.log("enter got_data");

    var teachers = data.val();
    var teachers_ids = Object.keys(teachers);
    for(var i =0; i< teachers_ids.length; i++){
      id = teachers_ids[i];
      console.log("email: " +teachers[id].userEmail);

    }
}

function upadate_array_by_checkbox(name, arr){
  var items=document.getElementsByName(name);
  for(var i=0; i<items.length; i++){
    if(items[i].type=='checkbox' && items[i].checked==true && !isElemInArray(items[i].value, arr))
      arr.push(items[i].value);
  }
}

// removes the slot from the availableSlots array
function removeSlot(slot){
  const index = availableSlots.indexOf(slot);
  if (index > -1) {
    availableSlots.splice(index, 1);
  }

  console.log("availableSlots: " + availableSlots);
}

function updateSlotsColors(){
  console.log("array slots: " + availableSlots);

  for(var i =0; i<availableSlots.length; i++){
    var slot = document.getElementById(availableSlots[i])
    if(slot)
      slot.style.background=availableColor;
  }

  for(var i = 0; i < bookedDates.length; i++){
    var slot = document.getElementById(bookedDates[i])
    if(slot){
      slot.innerText ="Booked";
      slot.style.background=bookedColor;
    }
  }
}

function get_profile_info_from_db(data){
  console.log("enter get_profile_info_from_db @@@@@@@");
  console.log("userID: " + userID);
  // var teachers = data.val();
  // var current_teacher = teachers[userID];
  var current_teacher = data.val();
  console.log("current_teacher: " + current_teacher);
  var keys = Object.keys(current_teacher);

  console.log("keys: " + keys);

  name = current_teacher['name'];
  about_me = current_teacher['aboutMe'];
  skype_id = current_teacher['skypeID'];
  homeCountry = current_teacher['homeCountry'];
  lessonPrice = current_teacher['lessonPrice'];
  languages_I_teach = current_teacher['languages_I_teach'];
  also_speak = current_teacher['alsoSpeak'];
  availableSlots = current_teacher['availableSlots'];
  userEmail = current_teacher['userEmail'];
  imageName =  current_teacher['imageName'];
  newImageName = current_teacher['imageName'];
  bookedClasses = current_teacher['bookedClasses'];
  fix_undefined_variavles();

  $("#homeCountry").val(homeCountry);
  document.getElementById("Name").value = name;
  document.getElementById("lesson_price").value = lessonPrice;
  document.getElementById("about_me").value = about_me;
  document.getElementById("skype_id").value = skype_id;

  update_booked_classes_list();

  get_and_update_image_from_db();
  fill_booked_dates();
  updateSlotsColors();
  update_profile_checkboxes();



}

function update_booked_classes_list(){
  console.log("update_booked_classes_list");
  if(!bookedClasses)
    return;
  
  for( var i =0; i < bookedClasses.length; i++){
    console.log("update_booked_classes_list i= " + i);
    var new_li_str = '<li class="list-group-item" style="background-color: rgb(153, 187, 255)">' +bookedClasses[i]+ '</li>';
    $(".list-group").append(new_li_str);
  }

}

function get_and_update_image_from_db(){
  var storage_ref = images_storage.ref("Users/" + userID +"/");

  storage_ref.listAll().then(snap => {
    snap.items.forEach(itemRef => {
      itemRef.getDownloadURL().then(imgUrl => {
        document.getElementById("profile_img").src = imgUrl;
      });
    })
  })
}

function update_profile_checkboxes(){
  var items=document.getElementsByName("teach");

  for(var i = 0; i < languages_I_teach.length; i++){
    for(var j = 0; j < items.length; j++ ){

      if(items[j].type=='checkbox' && items[j].value==languages_I_teach[i])
          items[j].checked = true;
    }
  }

  var items=document.getElementsByName("speak");
  for(var i = 0; i < also_speak.length; i++){
    for(var j = 0; j < items.length; j++ ){
      if(items[j].type=='checkbox' && items[j].value==also_speak[i])
          items[j].checked = true;

    }
  }

}

function getSunday(){
  var today = new Date();
  var  diff = today.getDate() -  today.getDay();
  var sunday =  new Date(today.setDate(diff));
  console.log("first day of this week: " + sunday);
  return sunday;

}

function fix_undefined_variavles(){
  if(!languages_I_teach)
      languages_I_teach = [];

  if(!also_speak)
      also_speak = [];

  if(!homeCountry)
        homeCountry ="";

  if(!availableSlots)
        availableSlots = [];

  if(!skype_id)
        skype_id ="";

  if(!name)
          name ="";
  if(!about_me)
        about_me ="";
  if(!lessonPrice)
          lessonPrice ="";

  if(!imageName)
      imageName ="";

  if(!newImageName)
    newImageName ="";


    

}

function isElemInArray(elem, arr){
  for(var i =0; i < arr.length; i++){
    if(arr[i] == elem)
      return true;
  }

  return false;
}

function get_userID_from_url(){
  var res = location.search.substring(1).split("=")[1];
  console.log("userID from url: " + res);
  return res;
}

function update_profile_image(){
  var path = "Users/" + userID +"/" + imageName;
  var storage_ref = images_storage.ref(path);
  // deleting the old image
  if(imageName != ""){
    storage_ref.delete().then(function() {
      console.log("deleting  the old image")
    }).catch(function(error) {
      console.log(error);
    });
  }

  // uplaoding the new image to the storage DB
  storage_ref = images_storage.ref("Users/" + userID + "/" + newImageName);
  storage_ref.put(real_upload_btn.files[0]);


}

function fill_booked_dates(){
  for(var i =0; i < bookedClasses.length; i++){
    var temp = extract_date(bookedClasses[i]);
    bookedDates.push(temp);
  }
}

function extract_date(str){
  var res = str.substring(0).split(",")[0];
  res = res.substring(0).split(" ")[1];
  return res;
}


