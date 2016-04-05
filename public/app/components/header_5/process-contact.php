<?php
if (isset($_POST['action'])) { // Checking for submit action
	$my_email = 'support@affapress.com'; // Change with your email address
	
	if ($_POST['action'] == 'add') {
		$name		= trim(strip_tags(addslashes($_POST['name'])));
		$email		= trim(strip_tags(addslashes($_POST['email'])));
		$subject	= trim(strip_tags(addslashes($_POST['subject'])));
		$message	= trim(strip_tags(addslashes($_POST['message'])));
		$pattern	= '/^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z]{2,4}$/';
		
		if ($email != '' && $message != '') {
			if (preg_match($pattern, $email)) {
				$headers = 'From: ' . $email . "\r\n";
				mail($my_email, $subject, $message, $headers);
				echo 'success|Send a message process completed.';
			} else {
				echo 'error|Please enter a valid email address!';
			}
		} else {
			echo 'error|Please fill all the required fields!';
		}
	}
} else { // Submit through invalid form
	echo 'error|Please submit data through a valid form!';
}
