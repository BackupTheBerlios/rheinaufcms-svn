<?php
class User extends Admin
{
	var $existent_users;
	var $existent_groups;
	var $groups_select;
	var $fields = array();
	var $tables = array('user_table'=>'RheinaufCMS>User',
						'groups_table'=>'RheinaufCMS>Groups',

	);

	function User(&$system)
	{
		$this->system =& $system;
		$this->add_db_prefix();
		$this->connection = $system->connection;

		$this->fields['id'] = array();
		$this->fields['id']['type'] = 'auto';
		$this->fields['Name'] = array();
		$this->fields['Name']['type'] = 'text';
		$this->fields['Login'] = array();
		$this->fields['Login']['type'] = 'text';
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


		$this->event_listen();

		$this->existent_users = $this->connection->db_assoc("SELECT * FROM `$this->user_table` WHERE `Group` != 'dev'");
		$groups = $this->connection->db_assoc("SELECT * FROM `$this->groups_table`");
		$this->existent_groups = array();

		foreach ($groups as $group)
		{
			$this->existent_groups[] = $group['Name'];
		}
	}
	function event_listen()
	{
		if (!$this->check_right('User')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
		if (isset($_POST['submit_new_user'])) $this->new_user_input();
		if (isset($_GET['deleteuser'])) $this->delete_user();
		if (isset($_POST['submit_edit_group'])) $this->edit_group_update();
		if (isset($_POST['submit_edit_user'])) $this->edit_user_update();
	}

	function show()
	{
		if (!$this->check_right('User')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
		return  $this->user_table();
	}

	function new_user_input()
	{
		$new_user_name = General::input_clean($_POST['new_user_name'],true);
		$new_user_pass = General::input_clean($_POST['new_user_pass'],true);
		$new_user_mail = General::input_clean($_POST['new_user_mail'],true);
		$new_user_gruppe = General::input_clean(rawurldecode($_POST['gruppe']),true);


		$this->connection->db_query("INSERT INTO `$this->user_table` ( `id` , `Name`,`Login` , `Password`, `E-Mail`, `Group` )
							VALUES ('', '$new_user_name','$new_user_name', '$new_user_pass','$new_user_mail', '$new_user_gruppe')");

	}

	function edit_user_update()
	{
		$edit_user_name = General::input_clean($_POST['edit_user_name'],true);
		$edit_user_pass = General::input_clean($_POST['edit_user_pass'],true);
		$edit_user_mail = General::input_clean($_POST['edit_user_mail'],true);
		$edit_user_gruppe = General::input_clean(rawurldecode($_POST['gruppe']),true);
		$id = $_POST['edit_user_id'];

		$this->connection->db_query("UPDATE `$this->user_table` SET `Name` = '$edit_user_name',
														`Password` = '$edit_user_pass',
														`E-Mail` = '$edit_user_mail',
														`Group` = '$edit_user_gruppe' WHERE `id` = '$id' ");
	}

	function edit_group_update()
	{
		$edit_user_gruppe = General::input_clean(rawurldecode($_POST['gruppe']),true);
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
		$img_edit_group = Html::img('/Libraries/Icons/16x16/edit_group.png','Gruppe ändern',array('title'=>'Gruppe ändern'));

		$img_delete_user = Html::img('/Libraries/Icons/16x16/delete_user.png','Benutzer löschen',array('title'=>'Benutzer löschen'));
		$img_new_user = Html::img('/Libraries/Icons/16x16/add_user.png','Benutzer hinzufügen',array('title'=>'Benutzer hinzufügen'));
		$img_edit = Html::img('/Libraries/Icons/16x16/edit.png','Eigenschaften bearbeiten',array('title'=>'Eigenschaften bearbeiten'));
		$img_apply = Html::img('/Libraries/Icons/16x16/apply.png','Speichern');
		$img_apply_path = '/Libraries/Icons/16x16/apply.png';

		$img_pass = Html::img('/Libraries/Icons/16x16/password.png','Passwort');
		$img_user = Html::img('/Libraries/Icons/16x16/edit_user.png','Benutzername');
		$img_group = Html::img('/Libraries/Icons/16x16/edit_group.png','Gruppe');
		$img_mail = Html::img('/Libraries/Icons/16x16/mail_generic.png','E-Mail');


		$img_show_pw = Html::img('/Libraries/Icons/16x16/14_layer_visible.png','Passwörter zeigen');
		$img_hide_pw = Html::img('/Libraries/Icons/16x16/14_layer_novisible.png','Passwörter verstecken');


		$form = new  Form();
		$table = new Table(5,array('id'=>'user_table'));

		$table->add_caption('Registrierte Benutzer');

		if (!isset($_GET['showpw']))
		{
			$pwshow = Html::a($_SERVER['REDIRECT_URL'].'?showpw',$img_show_pw,array('title'=>'Passwörter zeigen'));
		}
		else $pwshow = Html::a($_SERVER['REDIRECT_URL'],$img_hide_pw,array('title'=>'Passwörter verstecken'));

		$table->add_th(array('Benutzer','E-Mail','Passwort '.$pwshow,'Gruppe'));

		foreach($this->existent_users as $user)// ($i=0;$i<count($this->existent_users);$i++)
		{
			$i = 0;
			$select = new Select('gruppe');
			
			foreach ($this->existent_groups as $group)
			{
				if ($user['Group'] == $group) $attr['selected'] = 'selected';
				else unset($attr['selected']);
				$select->add_option(rawurlencode($group),$group,$attr);
			}
			$groups_select = $select->flush_select();

			if (!isset($_GET['showpw']))
			{
				$show_password = '*****';
			}
			else $show_password = $user['Password'];


			if (isset($_GET['editgroup']))
			{
				$id = $_GET['editgroup'];
				if ($id == $user['id'])
				{
					$editgroup_submit = $form->add_input('image','submit_edit_group','',array('src'=>$img_apply_path,'alt'=>'Speichern'));
					$editgroup_submit_id = $form->add_input('hidden','id',$id);
					$groupshow = $groups_select.$editgroup_submit_id.$editgroup_submit;
				}
				else $groupshow = $user['Group'];
			}
			else $groupshow = $user['Group'];

			//$edit_group_button = Html::a($_SERVER['REDIRECT_URL'].'?editgroup='.$this->existent_users[$i]['id'],$img_edit_group);
			$edit_user_button = Html::a($_SERVER['REDIRECT_URL'].'?edituser='.$user['id'],$img_edit);
			$delete_user_confirm = array('onclick'=>'return confirm(\'Wollen Sie '.addcslashes($user['Name'],"'").' wirklich l?schen?\')');
			$delete_user_button = Html::a($_SERVER['REDIRECT_URL'].'?deleteuser='.$user['id'],$img_delete_user,$delete_user_confirm);

			$user_row = array	(	$user['Name'],
									$user['E-Mail'],
									$show_password,
									$groupshow,
									$edit_user_button . $edit_group_button . $delete_user_button
								);

			if (isset($_GET['edituser']))
			{
				$id = $_GET['edituser'];
				if ($id == $user['id'])
				{
					$edit_user_form_name = $form->add_input('text','edit_user_name',$user['Name'],array('size'=>'12'));
					$edit_user_form_pass = $form->add_input('text','edit_user_pass',$user['Password'],array('size'=>'12'));
					$edit_user_form_mail = $form->add_input('text','edit_user_mail',$user['E-Mail'],array('size'=>'12'));
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
			$i++;
		}

		$new_user_link = Html::a($_SERVER['REDIRECT_URL'].'?newuser',$img_new_user.' Benutzer hinzufügen');

		if (isset($_GET['newuser']))
		{
			foreach ($this->existent_groups as $group)
			{
				$select->add_option(rawurlencode($group),$group);
			}
			
			$groups_select = $select->flush_select();
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