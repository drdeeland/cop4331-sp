
<?php

	// Read in the information from the API request
	$inData = getRequestInfo();

  $contactID = $inData["contactID"];
	$userID = $inData["userID"];	
	$name = $inData["name"];
	$phoneNum = $inData["phoneNum"];
	$email = $inData["email"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	// Check if the connection was successful or not
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Prepare & execute deletion from the Contacts table
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND Name=? AND Phone=? AND Email=? AND UserID=?");
		$stmt->bind_param("isssi", $contactID, $name, $phoneNum, $email, $userID);
		$stmt->execute();
		$nrows = $stmt->affected_rows;
	  
    // If rows were affected, no error. Return info to front-end
		if( $nrows != 0 ) 
		{
			returnWithError("");
		}
		else
		{
			returnWithError("Could not find record to delete");
		}

		// Close the connection & database
		$stmt->close();
		$conn->close();
	}

	// Function that reads in the JSON API request
	function getRequestInfo()
	{
			return json_decode(file_get_contents('php://input'), true);
	}

	// Function that sends an API response as a JSON object
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	// Function that returns with an error as a JSON object (Used just to send back a response)
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
