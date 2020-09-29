

const  db = firebase.database();
var userID = get_userID_from_url();
var email ="";
var skypeID ="";
var name = "";
const userType = "Student";
var bookedClasses=[];
//alert(userId);
firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {

     window.location = "../login/index.html";
  } else {
    userID = user.uid;
    console.log("this line shoud be executed once for each login");
  }
});


console.log("userID: " +userID);
var student_path = "Users/Students/" + userID +"/";
console.log("student_path: " +student_path);

db.ref(student_path).on("value", getInfo);







$("#updt").click(function(){
  //block of code that runs when the click event triggers

  	console.log("enter update function");
	 email = email;
	 skypeID = $("#skype_id").val();
	 name = $("#nameInput").val();;
	
	 	

  		db.ref(student_path).set({
				name: name,
				userEmail: email,
				userType: userType,
        skypeID: skypeID,
        bookedClasses: bookedClasses
			}).catch(function(error){
				alert("Error ocurred: ", error);
			});

			//alert('Profile Update Success');

			location.reload();


});



	
$("#logout_btn").on("click", function () {
  firebase.auth().signOut();
});

$("#move_to_main").on("click", function () {
  window.location = "../main/main.html?uid="+userID;
});



function getInfo(data) {
	console.log("enter get_profile_info_from_db @@@@@@@");
  console.log("userID: " + userID);
  // var teachers = data.val();
  // var current_teacher = teachers[userID];
  var current_user = data.val();
  console.log("current_user: " + current_user);
  var keys = Object.keys(current_user);

  console.log("keys: " + keys);

  email = current_user['userEmail'];
  
  skypeID = current_user['skypeID'];
  
  name = current_user['name'];

  bookedClasses = current_user['bookedClasses'];

   
	$('#email').append(email);
	$('#nameInfo').append(name);
	$('#skype').append(skypeID);
	//document.getElementById("email").value = email;
	document.getElementById("skype_id").value = skypeID;
	document.getElementById("nameInput").value = name;

  update_booked_classes_list();
	console.log("finished getInfo");


}

function get_userID_from_url(){
  var res = location.search.substring(1).split("=")[1];
  console.log("userID from url: " + res);
  return res;
}



$("#main").on("click", function () {
  window.location = "../main/main.html?uid=" + userID;
});


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