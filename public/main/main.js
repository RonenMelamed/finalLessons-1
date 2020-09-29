const db = firebase.database();
const images_storage = firebase.storage();

var teacher_image_url;

var res = [];



var jokes_button = document.getElementById('jokes_btn');
var jokes_result = document.getElementById('jokes_res');


var userID = get_userID_from_url();
//var database = firebase.database();
const
  range = document.getElementById('rangeSlider'),
  rangeV = document.getElementById('rangeV'),
  setValue = () => {
    const
      newValue = Number((range.value - range.min) * 100 / (range.max - range.min)),
      newPosition = 10 - (newValue * 0.2);
    rangeV.innerHTML = `<span>${range.value}</span>`;
    rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
  };
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);


//fetch('https://sv443.net/jokeapi/v2/joke/Any')
//.then(res=>res.json())
//.then(data => console.log('aaaaaaaa' + data[0]));


jokes_button.addEventListener('click',function(){
  fetch('https://sv443.net/jokeapi/v2/joke/Any')
  .then(res => res.json())
  //.then(data => console.log(data))
  .then(res =>{
    var t;
    if (res['setup'] === undefined || res['delivery']===undefined){
      t = 'What did the boy with no arms get for Christmas? I don\'t know, he hasn\'t opened it yet.'
    }else {
      t = res['setup'] + ' ' + res['delivery'];
    }
    jokes_result.innerHTML = t;
  })
  //.then(res => {
  //  
    //jokes_result.html(t)
  //})
.catch(error => console.log("error getting data"));
});







/////////////---------- Read Teachers for search
$("#edit_teacher_profile").on("click", function () {
  var students = firebase.database().ref( "Users/Students/"+userID);
  students.once("value").then(function(snapshot) {
    if(snapshot.exists())
      window.location = "../user/user.html?uid=" + userID;  //if it's True then the user is a student and move to student profile
    else
      window.location = "../teacher_page/teacher.html?uid=" + userID; //move to teachers profile
    }); 
});


$("#searchBtn").on("click", function (event) {
  db.ref("Users/Teachers/").on("value", read);
});


function read(data) {
  res=[];
  var selected_Language = $("#ddl_language").children("option:selected").val();
  var selected_Origin = $("#ddl_origin").children("option:selected").val();
  var selected_Price = document.getElementById("rangeSlider").value;

 
  var teachers = data.val();
  var teachers_ids = Object.keys(teachers);

  var res_size = 0;
  for (var i = 0; i < teachers_ids.length; i++) {
    id = teachers_ids[i];
    if (teachers[id].languages_I_teach && teachers[id].lessonPrice && teachers[id].homeCountry) {
      if (search_language(teachers[id].languages_I_teach, selected_Language) &&
        parseInt(teachers[id].lessonPrice) <= parseInt(selected_Price) &&
        teachers[id].homeCountry == selected_Origin) {
        res.push({ name: teachers[id].name, email: teachers[id].userEmail , teacherId: id, imageName:teachers[id].imageName});
        res_size++;

      }
    }
  }
  update_html_profiles(res, res_size);
}


function search_language(languages, selected_Language) {
  for (var i = 0; i < languages.length; i++) {
    if (languages[i] == selected_Language)
      return true;
  }
  return false;
}

function update_html_profiles(res, res_size) {
  $(".profiles").empty();
  
  console.log(" was printed : " + name + "   " + res_size);
  //console.log(" imageUrl : " + res[x].imageUrl);

    for (var x = 0; x < res_size; x++) {
      var imgID = "img"+res[x].teacherId;
      var html_string = '<div class="card" style="width:250px" imgstyle= >'
        + '<img class="card-img-top" src="https://www.w3schools.com/bootstrap4/img_avatar1.png" alt="Card image" id="'+imgID+'" style="width:100%">'
        + '<div class="card-body">'
        + '<h4 class="card-title">' + res[x].name + '</h4>'
        + '<p class="card-text">Email:' + res[x].email + ' \n</p>'
        + '<button type="button" id="' + res[x].teacherId +'" class="btn btn-primary see_profile">See Profile</button>'
        + '</div>'
        + '</div>';
      $(".profiles").append(html_string);
      console.log(" " + res[x].teacherId);
    }
      $(".btn.btn-primary.see_profile").on("click",profile_btn_func);

      for(var i = 0; i < res_size; i++){
        if(!res[i].imageName)
          continue;
        var storage_ref = images_storage.ref("Users/" + res[i].teacherId +"/" +  res[i].imageName);
        console.log("Users/" + res[i].teacherId +"/" +  res[i].imageName);
      
        var data ={id : "img"+res[i].teacherId };
        storage_ref.getDownloadURL().then(function(url) {
          document.getElementById(data.id).src = url;
      
        }.bind(data)).catch(function(error) {
          console.log("error url is: " + error);
        });
        
      }
}

function profile_btn_func(){
  var teacher_ID = $(this).attr('id');
  console.log("teacher_ID:" + teacher_ID);
  window.location = "../teacher_info/info.html?uid=" + teacher_ID;
}


firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {

     window.location = "../index.html";
  } else {
    userID = user.uid;
    console.log("this line shoud be executed once for each login");
  }
});


function get_userID_from_url() {
  var res = location.search.substring(1).split("=")[1];
  console.log("userID from url: " + res);
  return res;
}

$("#logout_btn").on("click", function () {
  firebase.auth().signOut();
});


$("#move_to_main").on("click", function () {
  window.location = "../main/main.html?uid="+userID;
});