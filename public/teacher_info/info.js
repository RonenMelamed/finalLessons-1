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

var availableColor = "rgb(0, 153, 51)";
var notAvailablrColor = "rgb(194, 194, 163)";
var bookedColor = "rgb(51, 133, 255)";

var weekCalenders = initWeekCalendersObjects();
var weekCalenderIndx = 0;
var bookedIndex = 0;
var chosenSolt ="";

var teacherID = get_userID_from_url();
var userID;


firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {

     window.location = "../index.html";
  } else {
    userID = user.uid;
    console.log("this line shoud be executed once for each login");
  }
});

db.ref("Users/Teachers/"+ teacherID + "/").on("value", get_profile_info_from_db);

build_calender();





/* ---------------- Buttons callbacks -------------- */

function calender_btn_clicked(event){

  console.log("enterd calender_btn");
  console.log("id: " + $(this).attr('id'));


  var cellColor = $( this ).css( "background-color" );

  if (cellColor == notAvailablrColor)
      return;

  if (cellColor == bookedColor){
      $(event.delegateTarget ).css( "background-color", availableColor);
      chosenSolt ="";
  }
  else{
      $(event.delegateTarget ).css( "background-color", bookedColor);
      if(chosenSolt != "")
        document.getElementById(chosenSolt).style.backgroundColor = availableColor;
      chosenSolt  = $(this).attr('id');
      bookedIndex = weekCalenderIndx;
  }


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

$("#book_btn").on("click",function(event){
  if(chosenSolt == "")
    return;
  window.location = "../payment/payment.html?uid="+teacherID+"="+chosenSolt+"="+userID;
  
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

function getSunday(){
  var today = new Date();
  var  diff = today.getDate() -  today.getDay();
  var sunday =  new Date(today.setDate(diff));
  console.log("first day of this week: " + sunday);
  return sunday;

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

  if(chosenSolt != "" && bookedIndex == weekCalenderIndx)
   document.getElementById(chosenSolt).style.background=bookedColor;
}

function get_userID_from_url(){
  var res = location.search.substring(1).split("=")[1];
  console.log("userID from url: " + res);
  return res;
}

function get_profile_info_from_db(data){
  console.log("enter get_profile_info_from_db @@@@@@@");
  console.log("userID: " + userID);

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
  userEmail =current_teacher['userEmail'];


   fix_undefined_variavles();

  $("#homeCountry").val(homeCountry);
  document.getElementById("name_val").innerHTML  = name;
  document.getElementById("homeCountry_val").innerHTML  = homeCountry;
  document.getElementById("languages_I_teach_val").innerHTML  = languages_I_teach;
  document.getElementById("also_speak_val").innerHTML = also_speak;
  document.getElementById("lessonPrice_val").innerHTML = lessonPrice;
  document.getElementById("about_me_val").innerHTML = about_me;
  document.getElementById("skype_id_val").innerHTML = skype_id;
  document.getElementById("email_val").innerHTML = userEmail;
  get_and_update_image_from_db();

  updateSlotsColors();

}

function get_and_update_image_from_db(){
  var storage_ref = images_storage.ref("Users/" + teacherID +"/");

  storage_ref.listAll().then(snap => {
    snap.items.forEach(itemRef => {
      itemRef.getDownloadURL().then(imgUrl => {
        document.getElementById("profile_img").src = imgUrl;
      });
    })
  })
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

}


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
