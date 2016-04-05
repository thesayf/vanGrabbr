<?php
if (isset($_POST['action'])) { // Checking for submit action
	$my_email = 'support@affapress.com'; // Change with your email address
	
	if ($_POST['action'] == 'add') {
		$name	 = trim(strip_tags(addslashes($_POST['name'])));
		$email	 = trim(strip_tags(addslashes($_POST['email'])));
		$phone	 = trim(strip_tags(addslashes($_POST['phone'])));
		$pattern = '/^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z]{2,4}$/';
		
		if ($email != '') {
			if (preg_match($pattern, $email)) {
				$subject_a = 'User registration: ' . $email;
				$subject_b = 'Registration details from ' . $my_email;
				
				$message = '';
				if ($name != '') $message .= 'Full name: ' . $name . "\n";
				$message .= 'Email address: ' . $email;
				if ($phone != '') $message .= "\n" . 'Phone number: ' . $phone;
				
				$headers_a = 'From: ' . $email . "\r\n";
				$headers_b = 'From: ' . $my_email . "\r\n";
				
				mail($my_email, $subject_a, $message, $headers_a);
				mail($email, $subject_b, $message, $headers_b);
				echo 'success|Thanks for your submission, we will be in touch shortly.';
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
