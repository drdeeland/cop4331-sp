
<?php
   
	$inData = getRequestInfo();
	
  // Assign request info to variables
	$id = 0;
  $firstName = $inData["firstName"];
  $lastName = $inData["lastName"];
  $login = $inData["login"];
  $password = $inData["password"];

  // Make connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	// Connection failed
  if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
  //Connection success
	else
	{
    // Check if there are already any Users with requested Login
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
    $rows = mysqli_num_rows($result);
  
    // There are no Users with the requested Login
		if( $rows == 0 )
		{
      $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password)  VALUES (?, ?, ?, ?)");
      $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
      $stmt->execute();
      $id = $conn->insert_id;
      $stmt->close();
      $conn->close();
      
      returnWithInfo( $id, $login );
		}
    // There is already a User with the requested Login
		else
		{
		  returnWithError($login, "Username is already in use");
      	  $stmt->close();
		  $conn->close();
		}

	}
	
  // Helper function that decodes the received JSON
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

  // Helper function that sends the result info as JSON
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
  // Helper function that returns a JSON file with an error
	function returnWithError( $login, $err )
	{
		$retValue = '{"id":0,"login":"' . $login . '","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
  // Helper function that returns info as a JSON files
	function returnWithInfo( $id, $login )
	{
		$retValue = '{"id":' . $id . ',"login":"' . $login . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
