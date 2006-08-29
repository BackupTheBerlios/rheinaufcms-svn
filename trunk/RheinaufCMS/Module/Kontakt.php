<?php
class Kontakt extends RheinaufCMS
{
	function  Kontakt($empfaenger)
	{
		$this->connection = new RheinaufDB();
		$this->empfaenger = $empfaenger;
		$this->event_listen();
	}

	function show()
	{
		$page = new Template(INSTALL_PATH.'/Module/Kontakt/Kontakt.template.html');

		$return_string ='';
		$vars =array();
		if (!$this->mail_sent) $return_string .= $page->parse_template('Formular',$vars);
		else $return_string .= $page->parse_template('Danke',$vars);
		return $return_string;
	}

	function event_listen()
	{
		if (isset($_POST['Mailtext'])) $this->send_mail();
	}

	function send_mail()
	{

		$empfaenger = $this->empfaenger;

		$regex = array(
					 		'email' => '/^[0-9a-z.+-]{2,}\@[0-9a-z.-]{2,}\.[a-z]{2,6}$/i',
					 		'name_betreff' => '/^[[:print:]]+$/',
					 		'text' => '/^[[:print:][:space:]]+$/s'
						);

		$betreff = General::input_clean($_POST['Betreff'],false,true);

		preg_match($regex['text'],General::input_clean($_POST['Mailtext'],false,true),$text);
		$text = $text[0];

		preg_match($regex['name_betreff'],General::input_clean($_POST['Name'],false,true),$absender);
		$absender = $absender[0];

		preg_match($regex['email'],General::input_clean($_POST['E-Mail'],false,true),$email);
		$email = $email[0];

		$datum = date("d.m.");
		$uhr = date("H:i");
		$betreff .=' (via Kontaktformular)';

		$mail_header="From: $absender <$email>\n";
		if ($_POST['copy'])
		{
			$mail_header .= "cc: $absender <$email>\n";
		}
		$mail_header .= "X-Mailer: powered by PHP\n";
		if (mail($empfaenger, $betreff, $text, $mail_header)) $this->mail_sent =true;

	}

}

?>