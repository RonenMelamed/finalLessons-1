
const  db = firebase.database().ref();


$("#sbmt").on("click",function(){


 var email = $("#email").val();
 var password = $("#Password1").val();
 var userType = $('input[name=userTypeRadios]:checked').val();
 //alert("email:"+email+" pass:"+password+ " type:"+userType);
 var verify = $("#Password2").val();
var skype_id = $("#skype_id").val();
var name =  $("#user_name").val();

 if(verify != password){
	 alert("wrong password verification");
	 return;
 }

var user_created_successfully = false;




 firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
		 //Registration is successful
		 user_created_successfully = true;
		 console.log("begin: " + user_created_successfully);
		 var user = firebase.auth().currentUser;
		 var userID = user.uid;

		 var path = "Users/"+ userType +"s/" + userID;
			console.log("db path: " + path);
			//var db = firebase.database().ref();
			db.child(path).set({
				userEmail: email,
				userType: userType,
				skypeID: skype_id,
				name: name
			}).catch(function(error){
				console.log("Error ocurred: ", error);
			});

			console.log("end: " + user_created_successfully);
			if(user_created_successfully){
				console.log("user created successfuly");
				document.getElementById("success_msg").innerHTML = "user created successfuly";
				
				window.location = "../main/main.html?uid="+userID;
			}


			}).catch(e => document.getElementById("error_msg").innerHTML = (e.message));	



 });
