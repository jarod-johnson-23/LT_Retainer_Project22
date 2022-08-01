<?php
$formInterested='';
if( isset($_POST['name']) && isset($_POST['email']) && isset($_POST['url']) && isset($_POST['form_uri']) && isset($_POST['description']) && isset($_POST['type-browser']) && isset($_POST['timeline']) && isset($_POST['emailsJson']) && isset($_POST['company'])) {
  include_once( 'class.phpmailer.php' );
  $mail = new PHPMailer;
  $mail->isMail();
  $mail->Subject = $company.' Web Maintenance Form';
  

  $emailsJson = $_POST['emailsJson'];
  $emailsArray = json_decode($emailsJson);
  $company = $_POST['company']; //hidden field in form which contains company name
  $name = $_POST['name']; //name of person who sent the form
  $email = $_POST['email']; //email of person who sent the form
  $url = $_POST['url'];     //url of the site with issue
  $description = $_POST['description']; //description of the issue in detail
  $typeBrowser = $_POST['type-browser']; //Browser the issue was found on
  $timeline = $_POST['timeline'];
  $formUri = $_POST['form_uri'];

  $issueType = '';
  if( isset($_POST['issueType'])) {
    $issueType = $_POST['issueType']; //from drop-down box of issues like Content, Bug, or Update
  }

  $device = 'Both';
  if( isset($_POST['device'])) {
    $device = $_POST['device'];       //if issue is on moble, desktop, or both devices
  }
  
  $addtlNotes = '';
  if( isset($_POST['addtlNotes']) ) {
    $addtlNotes = $_POST['addtlNotes'];
  }

  $numEmails = count($emailsArray);
  for($i = $numEmails; $i > 1; $i--) {
    $mail->addCC($emailsArray[$i - 1]->email);
  }
  $mail->addAddress($emailsArray[0]);
  $mail->addBCC($email);

  $message = '<html><body>';
  $message .= '<em>This email is sent from'.$company.'\'s Web Maintenance Form</em><br><br>';
  $message .= '<table style="border:0; vertical-align:top;"><tr><td  valign="top"><strong>Name : </strong></td><td>'.$name.'</td></tr>';
  $message .= '<tr><td  valign="top"><strong>Company: </strong></td><td>'.$company.'</td></tr>';
  $message .= '<tr><td  valign="top"><strong>Email: </strong></td><td>'.$email.'</td></tr>';
  $message .= '<tr><td  valign="top"><strong>Issue Type: </strong></td><td>'.$issueType.'</td></tr>';
  $message .= '<tr><td  valign="top"><strong>Browser: </strong></td><td>'.$typeBrowser.'</td></tr>';
  $message .= '<tr><td  valign="top"><strong>Device: </strong></td><td>'.$device.'</td></tr>';
  $message .= '<tr><td  valign="top"><strong>URL of Issue: </strong></td><td>'.$url.'</td></tr>';
  $message .= '<tr><td  valign="top"><strong>Timeline: </strong></td><td>'.$timeline.'</td></tr>';
  if($timeline = 'Urgent') {
    $ifUrgent = $_POST['urgent-selection'];
    $message .= '<tr><td  valign="top"><strong>If Urgent: </strong></td><td>'.$ifUrgent.'</td></tr>';
  }
  $message .= '<tr><td  valign="top"><strong>Description: </strong></td><td>'.$description.'</td></tr>';
  $message .= '<tr><td  valign="top"><strong>Additional Notes: </strong></td><td>'.$addtlNotes.'</td></tr>';
  $message .= '</table></body></html>';

  $mail->msgHTML($message);
  if($mail->send()) {
    header("Location:/thank-you/:" + $formUri);
		$mail->clearAddresses();
		return true;
  } else {
    $mail->clearAddresses();
    return false;
  }
}