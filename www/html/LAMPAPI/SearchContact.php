<?php
	// Read in the info from the API request
	$inData = getRequestInfo();
	
	$search = $inData["search"];
	$userID = $inData["userID"];
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	// Check if the connection was successful or not
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Prepare & execute searching the Contacts table
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (Name LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=?");
		$contactName = "%" . $search . "%";
		$stmt->bind_param("sssi", $contactName, $contactName, $contactName, $userID);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		// while there are rows to fetch
		while($row = $result->fetch_assoc())
		{	
			// searchCount to separate records by commas
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			// Building JSON object to return
			$searchResults .= '{"contactID" : ' . $row["ID"] . ', "name" : "' . $row["Name"]. '", "phoneNum" : "' . $row["Phone"] . '", "email" : "' . $row["Email"] . '"}';
		}
		
		// if no rows to fetch, searchCount stayed at 0
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
	
	// Returns info as JSON objects
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>