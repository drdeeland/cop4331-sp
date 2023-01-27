<?php

	// Connect to the database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}

	else
	{
		// Get the offset from the query string
		$offset = $_GET['offset'];

		// Retrieve the contacts from the database
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (LIMIT 3 OFFSET ?) AND UserID=?");
		$contactName = "&" . $search . "%";
		$stmt->execute([$offset]);

		$result = $stmt->get_result();

		// Return the contacts as a JSON object
		header('Content-Type: application/json');
		echo json_encode($contacts);

		// Close the connection & database
		$stmt->close();
		$conn->close();
	}


?>
