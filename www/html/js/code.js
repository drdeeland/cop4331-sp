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

	// Reset contact response HTML
	document.getElementById("contactAddResult").innerHTML = "";

	// Regex to check Phone number
	if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(newContactPhone));
	else if(newContactPhone != "")
	{
		document.getElementById("contactAddResult").innerHTML = "Invalid Phone Number Format";
		return;
	}

	// Regex to check Email
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newContactEmail));
	else if(newContactEmail != "")
	{
		document.getElementById("contactAddResult").innerHTML = "Invalid email format";
		return;
	}

	// Disallowing empty Contacts
	if (newContactName == "" && newContactPhone == "" && newContactEmail == "")
	{
		document.getElementById("contactAddResult").innerHTML = "At least one field is required";
		return;
	}

	// Set default contact field to (None)
	if (newContactPhone == "") newContactPhone = "(None)";
	if (newContactPhone == "") newContactPhone = "(None)";
	if (newContactEmail == "") newContactEmail = "(None)";

	// JSON payload and Server Query
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
				// Successful response, reset contact fields
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
	// Save the html code to throw into BoxBg to give feedback
	let contactSearchFeedBack = '<p style = "color:black" id="contactSearchResult"></p>';
	document.getElementById("boxBg").innerHTML = contactSearchFeedBack;

	let contactList = "";

	// Make JSON and request
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

				// If what they typed in was not a space or an empty string, then we want to give feedback
				if(srch != " " && srch != "")
				{
					let resptext = ""
					if(jsonObject.results == null) resptext = "No Contacts Found";
					else resptext = "Contact(s) have been retrieved";
					document.getElementById("contactSearchResult").innerHTML = resptext;
				}
				// If nothing came back return to avoid error
				if(jsonObject.results == null) return;

				for( let i=0; i<jsonObject.results.length; i++ )
				{	let jsonString = JSON.stringify(jsonObject.results[i]);
					// Create html objects to throw them onto the page
					contactList += `<div class="contactEntry" id=${jsonObject.results[i].contactID}>
								<p class="contactName" id="${jsonObject.results[i].contactID}name" >${jsonObject.results[i].name}</p>
								<button type="button" id="edit" class="editButton"
								onclick = 'editContact(${jsonObject.results[i].contactID});'>Edit</button>
								<button type="button" id="delete" class="editButton"
								onclick = 'promptDelete(${jsonObject.results[i].contactID});'>Delete</button>

								<p id= "${jsonObject.results[i].contactID}phoneNum" >${jsonObject.results[i].phoneNum}</p>
								<p id= "${jsonObject.results[i].contactID}email" >${jsonObject.results[i].email}</p>
								</div>`;
				}
				// Add list of boxes to page
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
	let contactId = id;
	let name = document.getElementById(""+contactId+"name").innerHTML;
	let phoneNum = document.getElementById(""+contactId+"phoneNum").innerHTML;
	let email = document.getElementById(""+contactId+"email").innerHTML;
	document.getElementById("editPopup").style.display = "block";
	if (phoneNum == "(None)") phoneNum = "";
	if (email == "(None)") email = "";
	document.getElementById("boxBg").style.display = "none";
	document.getElementById("editName").value = name;
	document.getElementById("editPhoneNum").value = phoneNum;
	document.getElementById("editEmail").value = email;
	document.getElementById("hiddenID").innerHTML = contactId;
}

function updateContact()
{
	let contactId = document.getElementById("hiddenID").innerHTML;
	let newContactName = document.getElementById("editName").value;
	let newContactPhone = document.getElementById("editPhoneNum").value;
	let newContactEmail = document.getElementById("editEmail").value;

	// Reset contact response HTML
	document.getElementById("contactEditResult").innerHTML = "";

	if (newContactName == document.getElementById(""+contactId+"name").innerHTML &&
		newContactPhone == document.getElementById(""+contactId+"phoneNum").innerHTML &&
		newContactEmail == document.getElementById(""+contactId+"email").innerHTML)
	{
		document.getElementById("contactEditResult").innerHTML = "No changes made";
	}

	// Regex to check Phone number
	if (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(newContactPhone));
	else if(newContactPhone != "")
	{
		document.getElementById("contactEditResult").innerHTML = "Invalid Phone Number Format";
		return;
	}

	// Regex to check Email
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newContactEmail));
	else if(newContactEmail != "")
	{
		document.getElementById("contactEditResult").innerHTML = "Invalid email format";
		return;
	}

	// Disallowing empty Contacts
	if (newContactName == "" && newContactPhone == "" && newContactEmail == "")
	{
		document.getElementById("contactEditResult").innerHTML = "At least one field is required";
		return;
	}

	// Set default contact field to (None)
	if (newContactPhone == "") newContactPhone = "(None)";
	if (newContactPhone == "") newContactPhone = "(None)";
	if (newContactEmail == "") newContactEmail = "(None)";

	// JSON payload and Server Query
	let tmp = {contactID:contactId, name:newContactName, phoneNum:newContactPhone, email:newContactEmail, userID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// Successful response, reset contact fields
				document.getElementById("contactEditResult").innerHTML = "Contact has been updated";
				document.getElementById(""+contactId+"name").innerHTML = newContactName;
				document.getElementById(""+contactId+"phoneNum").innerHTML = newContactPhone;
				document.getElementById(""+contactId+"email").innerHTML = newContactEmail;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = err.message;
	}

}

function promptDelete(id)
{
	let text = "Are you sure you want to delete this contact?\nThis cannot be undone.";
	if (confirm(text) == true) 
	{
		doDelete(id);
	}
}

function doDelete(id)
{
	console.log("Delet func");
	let contactId = id;
	let name = document.getElementById(""+contactId+"name").innerHTML;
	let phone = document.getElementById(""+contactId+"phoneNum").innerHTML;
	let mail = document.getElementById(""+contactId+"email").innerHTML;
	// let contactInfo = doRetrieve(contactId);
	// if (contactInfo == null) 
	// {
	// 	console.log("Error retrieving contact");
	// 	return;
	// }
	// console.log(contactInfo);

	let tmp = {contactID:contactId,userID:userId,name:name,phoneNum:phone,email:mail};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("DELETE", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("" + id).innerHTML = "Contact deleted!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("" + id).innerHTML = "Error deleting contact. Please try again";
		console.log(err);
	}
}

// currently not working properly. retrieves an object, but if called by another function, the object cannot be accessed.
// likely an error with the object getting retrieved in a nested function (xhr.onreadystatechange) and getting lost in the return statements
function doRetrieve(id) {
	console.log("retrieve func");
	let contactId = id;
	console.log("contact: " + contactId + " user: " + userId);

	// Make JSON and request
	let tmp = {contactID:contactId,userID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/RetrieveContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	var result;
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				// If nothing came back return to avoid error
				if(jsonObject.results == null) return;

				else 
				{
					console.log("Contact found: " + jsonObject.results[0]);
					result = jsonObject.results[0];
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
		return null;
	}
	return result;
}

function closeEdit()
{
	document.getElementById("boxBg").style.display = "block";
	document.getElementById("contactEditResult").innerHTML = "";
	document.getElementById("editPopup").style.display = "none";

}
