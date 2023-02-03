<?php
	// Read in the info from the API request
	$inData = getRequestInfo();
	
	$contactID = $inData["contactID"];
	$userID = $inData["userID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	// Check if the connection was successful or not
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Prepare & execute selecting from the Contacts table
		$stmt = $conn->prepare("SELECT Name,Phone,Email FROM Contacts WHERE ID=? AND UserID=?");
		$stmt->bind_param("ii", $contactID, $userID);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		if( $row = $result->fetch_assoc()  )
		{
			// Building JSON object to return
			$contactInfo .= '{"contactID" : ' . $contactID . ', "name" : "' . $row["Name"]. '", "phoneNum" : "' . $row["Phone"] . '", "email" : "' . $row["Email"] . '", "userID" : ' . $userID . '}';
			returnWithInfo( $contactInfo );
		}
		else
		{
			returnWithError("No Records Found");
		}

		// Close the connection & database
		$stmt->close();
		$conn->close();
	}
	
	// Reads in the JSON API request
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	// Sends an API response as a JSON object
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// Returns with an error as a JSON object
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	// Returns info as JSON object
	function returnWithInfo( $contactInfo )
	{
    $retValue = '{"results":[' . $contactInfo . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>