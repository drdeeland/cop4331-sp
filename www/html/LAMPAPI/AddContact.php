
<?php

// Read in the information from the API request
$inData = getRequestInfo();

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
    // Prepare & execute the insertion into the Conctacts table
    $stmt = $conn->prepare("INSERT INTO Contacts (Name, Phone, Email, UserID) VALUES (?,?,?,?)");
    $stmt->bind_param("sssi", $name, $phoneNum, $email, $userID);
    $stmt->execute();
    $result = $stmt->get_result();

    // Close the connection & database
    $stmt->close();
    $conn->close();

    // Respond to the front-end
    returnWithError("");
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
