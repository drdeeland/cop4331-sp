// RESET LOCALHOST URL BEFORE PUSHING!!!!!!!!
const urlBase = 'http://paradise7.ninja/LAMPAPI';
const extension = 'php';
// User Information from Database (userID is Primary Key)
let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener('DOMContentLoaded', function()
	{
		if (window.location.pathname != "/index.html" 
		&& window.location.pathname != "/register.html" )
		{
			readCookie();
		}
		if(window.location.pathname == "/contacts.html")
		{
			searchContact();
		}
	}, false);

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	// This gets the login and password from HTML File
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	// This resets loginResult to empty. If login fails it will change this
	document.getElementById("loginResult").innerHTML = "";

	// This is a variable that is compatible with JSON format
	let tmp = {login:login,password:password};
	// var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	// Expected output: "{"login": userinput,"password": userinput}"

	// This stores the url necessary to make an Http request with a php
	let url = urlBase + '/Login.' + extension;

	// Make request
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// Listens for a change on the "readyState" property of the Http request
		xhr.onreadystatechange = function()
		{
			// readyState = 0 means "request has not been sent"
			// readyState = 4 means "complete and response received"
			// status = 200 means the server reponse is ok
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				// No user was found in database
				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				// Get info from returned JSON object
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				// Saves the fact that you are logged in
				saveCookie();
				// Send to next page
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	// Kept below if we decide to display who is logged in eventually.
	//else
	//{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	//}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	// Send to login screen
	window.location.href = "index.html";
}


function doRegister()
{
	error = "";

	// This gets the login and password from HTML File
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	let login = document.getElementById("regUsername").value;
	let password = document.getElementById("regPassword").value;
	//	var hash = md5( password );

	// This resets loginResult to empty. If login fails it will change this
	// document.getElementById("regResult").innerHTML = "";

	if (password != document.getElementById("confirmPassword").value)
	{
		document.getElementById("regResult").innerHTML = "Passwords do not match";
		return;
	}

	// Restriction on Password length
	if (password.length < 5)
	{
		document.getElementById("regResult").innerHTML = "Passwords need to be at least 5 characters long";
		return;
	}

	// This is a variable that is compatible with JSON format
	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	// var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	// Expected output: "{"firstName": userInput, "lastName": userInput, "login": userinput,"password": userinput}"

	// This stores the url necessary to make an Http request with a php
	let url = urlBase + '/Register.' + extension;

	// Make request
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// Listens for a change on the "readyState" property of the Http request
		xhr.onreadystatechange = function()
		{
			// readyState = 0 means "request has not been sent"
			// readyState = 4 means "complete and response received"
			// status = 200 means the server reponse is ok
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				error = jsonObject.error;
				// This will be non-empty should there be an error
				if (error != "")
				{
					document.getElementById("regResult").innerHTML = error;
					return;
				}

				// Inform user of success
				document.getElementById("regResult").innerHTML = "User registered successfully";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("regResult").innerHTML = err.message;
	}

}

function addContact()
{
	let newContactName = document.getElementById("name").value;
	let newContactPhone = document.getElementById("phoneNum").value;
	let newContactEmail = document.getElementById("email").value;
	document.getElementById("contactAddResult").innerHTML = "";

	if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(newContactPhone));
	else if(newContactPhone != "")
	{
		document.getElementById("contactAddResult").innerHTML = "Invalid Phone Number Format";
		return;
	}

	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newContactEmail));
	else if(newContactEmail != "")
	{
		document.getElementById("contactAddResult").innerHTML = "Invalid Email Format";
		return;
	}
	
	

	let tmp = {name:newContactName, phoneNum:newContactPhone, email:newContactEmail, userID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				document.getElementById("name").value = "";
				document.getElementById("phoneNum").value = "";
				document.getElementById("email").value = "";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}


function searchContact()
{
	let srch = document.getElementById("search").value;
	let contactSearchFeedBack = '<p style = "color:black" id="contactSearchResult"></p>';
	document.getElementById("boxBg").innerHTML = contactSearchFeedBack;

	let contactList = "";

	let tmp = {search:srch,userID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				if(srch != " " && srch != "") 
				{
					let resptext = ""
					if(jsonObject.results == null) resptext = "No Contacts Found";
					else resptext = "Contact(s) have been retrieved";
					document.getElementById("contactSearchResult").innerHTML = resptext;
				}
				if(jsonObject.results == null) return;
				for( let i=0; i<jsonObject.results.length; i++ )
				{	let jsonString = JSON.stringify(jsonObject.results[i]);
					console.log("JSON object: " + jsonString);
					contactList += `<div class="contactEntry">
								<p class="contactName">${jsonObject.results[i].name}</p>
								<button type="button" id="edit" class="editButton" 
								onclick = 'editContact(${jsonString});'>Edit</button>
		
								<p>${jsonObject.results[i].phoneNum}</p>
								<p>${jsonObject.results[i].email}</p>
								</div>`;
				}

				document.getElementById("boxBg").innerHTML += contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}



// We know this id is in the database
function editContact(id)
{
	
	// Redirect to editcontact page
	window.location.href = "editContact.html";
	console.log("hiii");
	window.onload = function()
	{
		console.log("Hellooo");
		document.getElementById("name").value = id.name;
	// document.getElementById("phoneNum") = id.phoneNum;
	// document.getElementById("email") = id.email;
	// document.getElementById("userID") = id.contactID;
	
	}
	
		
	
	
}

function updateContact()
{

}

