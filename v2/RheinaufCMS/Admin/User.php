<?php
$long_name = 'User verwalten';
class User extends Admin
{
	var $existent_users;
	var $existent_groups;
	var $groups_select;
	var $fields = array();
	var $tables = array('user_table'=>'RheinaufCMS>User',
						'groups_table'=>'RheinaufCMS>Groups',

	);

	function User($db_connection,$path_information)
	{
		$this->add_db_prefix();

		$this->fields['id'] = array();
		$this->fields['id']['type'] = 'auto';
		$this->fields['Name'] = array();
		$this->fields['Name']['type'] = 'text';
		$this->fields['LoginName'] = array();
		$this->fields['LoginName']['type'] = 'text';
		$this->fields['Password'] = array();
		$this->fields['Password']['type'] = 'text';
		$this->fields['E-Mail'] = array();
		$this->fields['E-Mail']['type'] = 'text';
		$this->fields['Verantwortlichkeitsbereich'] = array();
		$this->fields['Verantwortlichkeitsbereich']['type'] = 'text';
		$this->fields['Kontaktierbar'] = array();
		$this->fields['Kontaktierbar']['type'] = 'bool';
		$this->fields['Group'] = array();
		$this->fields['Group']['type'] = 'text';


		$this->connection = $db_connection;
		$this->extract_to_this($path_information);

		$this->event_listen();

		$this->existent_users = $this->connection->db_assoc("SELECT * FROM `$this->user_table` WHERE `Group` != 'dev'");
		$groups = $this->connection->db_assoc("SELECT * FROM `$this->groups_table`");
		$this->existent_groups = array();

		foreach ($groups as $modul)
		{
			$this->existent_groups[] = $modul['Name'];
		}
	}
	function event_listen()
	{
		if (!$this->check_right('User')) return Html::div('Sie haben kein Recht diese Aktion auszuf�hren!',array('class'=>'rot'));
		if (isset($_POST['submit_new_user'])) $this->new_user_input();
		if (isset($_GET['deleteuser'])) $this->delete_user();
		if (isset($_POST['submit_edit_group'])) $this->edit_group_update();
		if (isset($_POST['submit_edit_user'])) $this->edit_user_update();
	}

	function show()
	{
		if (!$this->check_right('User')) return Html::div('Sie haben kein Recht diese Aktion auszuf�hren!',array('class'=>'rot'));
		return  $this->user_table();
	}

	function new_user_input()
	{
		$new_user_name = General::input_clean($_POST['new_user_name'],true);
		$new_user_pass = General::input_clean($_POST['new_user_pass'],true);
		$new_user_mail = General::input_clean($_POST['new_user_mail'],true);
		$new_user_gruppe = General::input_clean(rawurldecode($_POST['gruppe']),true);


		$this->connection->db_query("INSERT INTO `$this->user_table` ( `id` , `Name` , `Password`, `E-Mail`, `Group` )
							VALUES ('', '$new_user_name', '$new_user_pass','$new_user_mail', '$new_user_gruppe')");

	}

	function edit_user_update()
	{
		$edit_user_name = $_POST['edit_user_name'];
		$edit_user_pass = $_POST['edit_user_pass'];
		$edit_user_mail = $_POST['edit_user_mail'];
		$edit_user_gruppe = rawurldecode($_POST['gruppe']);
		$id = $_POST['edit_user_id'];

		$this->connection->db_query("UPDATE `$this->user_table` SET 	`Name` = '$edit_user_name',
														`Password` = '$edit_user_pass',
														`E-Mail` = '$edit_user_mail',
														`Group` = '$edit_user_gruppe' WHERE `id` = '$id' ");
	}

	function edit_group_update()
	{
		$edit_user_gruppe = rawurldecode($_POST['gruppe']);
		$edit_user_id = $_POST['id'];
		$this->connection->db_query("UPDATE `$this->user_table` SET `Group` = '$edit_user_gruppe' WHERE `id` = '$edit_user_id'");
	}

	function delete_user()
	{
		$id = $_GET['deleteuser'];
		$this->connection->db_query("DELETE FROM `$this->user_table` WHERE `id` = '$id'");
	}
	function user_table()
	{

		$user_table = '';
		$img_edit_group = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit_group.png','Gruppe �ndern',array('title'=>'Gruppe �ndern'));

		$img_delete_user = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/delete_user.png','Benutzer l�schen',array('title'=>'Benutzer l�schen'));
		$img_new_user = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/add_user.png','Benutzer hinzuf�gen',array('title'=>'Benutzer hinzuf�gen'));
		$img_edit = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit.png','Eigenschaften bearbeiten',array('title'=>'Eigenschaften bearbeiten'));
		$img_apply = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/apply.png','Speichern');
		$img_apply_path = '/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/apply.png';

		$img_pass = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/password.png','Passwort');
		$img_user = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit_user.png','Benutzername');
		$img_group = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit_group.png','Gruppe');
		$img_mail = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/mail_generic.png','E-Mail');


		$img_show_pw = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/14_layer_visible.png','Passw�rter zeigen');
		$img_hide_pw = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/14_layer_novisible.png','Passw�rter verstecken');


		$form = new  Form();
		$table = new Table(5,array('id'=>'user_table'));

		$table->add_caption('Registrierte Benutzer');

		if (!isset($_GET['showpw']))
		{
			$pwshow = Html::a($_SERVER['REDIRECT_URL'].'?showpw',$img_show_pw,array('title'=>'Passw�rter zeigen'));
		}
		else $pwshow = Html::a($_SERVER['REDIRECT_URL'],$img_hide_pw,array('title'=>'Passw�rter verstecken'));

		$table->add_th(array('Benutzer','E-Mail','Passwort '.$pwshow,'Gruppe'));

		for ($i=0;$i<count($this->existent_users);$i++)
		{

			$select = new Select('gruppe');
			foreach ($this->existent_groups as $group)
			{
				if ($this->existent_users[$i]['Group'] == $group) $attr['selected'] = 'selected';
				else unset($attr['selected']);
				$select->add_option(rawurlencode($group),$group,$attr);
			}
			$groups_select = $select->flush_select();

			if (!isset($_GET['showpw']))
			{
				$show_password = '*****';
			}
			else $show_password = $this->existent_users[$i]['Password'];


			if (isset($_GET['editgroup']))
			{
				$id = $_GET['editgroup'];
				if ($id == $this->existent_users[$i]['id'])
				{
					$editgroup_submit = $form->add_input('image','submit_edit_group','',array('src'=>$img_apply_path,'alt'=>'Speichern'));
					$editgroup_submit_id = $form->add_input('hidden','id',$id);
					$groupshow = $groups_select.$editgroup_submit_id.$editgroup_submit;
				}
				else $groupshow = $this->existent_users[$i]['Group'];
			}
			else $groupshow = $this->existent_users[$i]['Group'];

			//$edit_group_button = Html::a($_SERVER['REDIRECT_URL'].'?editgroup='.$this->existent_users[$i]['id'],$img_edit_group);
			$edit_user_button = Html::a($_SERVER['REDIRECT_URL'].'?edituser='.$this->existent_users[$i]['id'],$img_edit);
			$delete_user_confirm = array('onclick'=>'return confirm(\'Wollen Sie '.$this->existent_users[$i]['Name'].' wirklich l�schen?\')');
			$delete_user_button = Html::a($_SERVER['REDIRECT_URL'].'?deleteuser='.$this->existent_users[$i]['id'],$img_delete_user,$delete_user_confirm);

			$user_row = array	(	$this->existent_users[$i]['Name'],
									$this->existent_users[$i]['E-Mail'],
									$show_password,
									$groupshow,
									$edit_user_button . $edit_group_button . $delete_user_button
								);

			if (isset($_GET['edituser']))
			{
				$id = $_GET['edituser'];
				if ($id == $this->existent_users[$i]['id'])
				{
					$edit_user_form_name = $form->add_input('text','edit_user_name',$this->existent_users[$i]['Name'],array('size'=>'12'));
					$edit_user_form_pass = $form->add_input('text','edit_user_pass',$this->existent_users[$i]['Password'],array('size'=>'12'));
					$edit_user_form_mail = $form->add_input('text','edit_user_mail',$this->existent_users[$i]['E-Mail'],array('size'=>'12'));
					$edit_user_form_id = $form->add_input('hidden','edit_user_id',$id);

					$edit_user_form_submit = $form->add_input('image','submit_edit_user','Speichern',array('src'=>$img_apply_path,'alt'=>'Speichern'));
					$user_row = array	(	$img_user	. $edit_user_form_name,
											$img_mail 	. $edit_user_form_mail,
											$img_pass 	. $edit_user_form_pass,
											$img_group 	. $groups_select,
											$edit_user_form_submit . $edit_user_form_id
										);
				}
			}

			$table->add_td($user_row,array('class'=>(is_int($i/2)) ?   'abwechselnde_flaechen_1': 'abwechselnde_flaechen_2'));
		}

		$new_user_link = Html::a($_SERVER['REDIRECT_URL'].'?newuser',$img_new_user.' Benutzer hinzuf�gen');

		if (isset($_GET['newuser']))
		{
			$new_user_form_name = $form->add_input('text','new_user_name','',array('size'=>'12'));
			$new_user_form_pass = $form->add_input('text','new_user_pass','',array('size'=>'12'));
			$new_user_form_mail = $form->add_input('text','new_user_mail','',array('size'=>'12'));

			$new_user_form_submit = $form->add_input('image','submit_new_user','Speichern',array('src'=>$img_apply_path,'alt'=>'Speichern'));

			$table->add_td(array($img_user.$new_user_form_name,$img_mail.$new_user_form_mail,$img_pass.$new_user_form_pass,$img_group.$groups_select,$new_user_form_submit));
		}
		else $table->add_td(array(array(2=>$new_user_link)));

		return $form->form_tag('/Admin/User/').$table->flush_table().$form->close_form();
	}
}
?>