<?php
$long_name =  'Gruppen verwalten';
$icon = 'edit_group.png';
class Gruppen extends Admin
{

	var $existent_groups;
	var $images;

	var $tables = array('navi_table'=>'RheinaufCMS>Navi',
						'user_table'=>'RheinaufCMS>User',
						'rechte_table'=>'RheinaufCMS>Rechte',
						'groups_table'=>'RheinaufCMS>Groups'
	);

	function Gruppen($db_connection,$path_information)
	{
		$this->add_db_prefix();

		$this->connection = $db_connection;//$this->connection->debug=true;
		$this->extract_to_this($path_information);


		$this->group_table_update();
		$this->rechte = $this->connection->db_assoc("SELECT * FROM `$this->rechte_table` ORDER BY `Frontend_Backend`,  `ModulName` ASC, `RechtName` ASC ");

		$this->event_listen();
	}

	function event_listen()
	{
		if (isset($_POST['submit_rechte'])&& $this->check_right('GruppenRechte')) $this->rechte_update();
		elseif (isset($_POST['submit_newgroup'])&& $this->check_right('GruppenRechte')) $this->new_group_input();
		elseif (isset($_GET['deletegroup'])&& $this->check_right('GruppenRechte')) $this->delete_group();

		else return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
	}

	function show()
	{
		if (!$this->check_right('GruppenRechte')) return Html::div('Sie haben kein Recht diese Aktion auszuführen!',array('class'=>'rot'));
		return $this->group_table();
	}

	function group_table_update()
	{
		$this->existent_groups = General::multi_unserialize($this->connection->db_assoc("SELECT * FROM `$this->groups_table`"));
	}

	function group_table()
	{
		$group_table = '';

		$this->images['edit'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit.png','Eigenschaften bearbeiten',array('title'=>'Eigenschaften bearbeiten'));
		$this->images['apply'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/apply.png','Speichern');
		$this->images['apply_path'] = '/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/apply.png';
		$this->images['checkbox_disabled_unchecked'] =Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/checkbox_disabled_unchecked.png','Nicht erlaubt');
		$this->images['checkbox_disabled_checked'] =Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/checkbox_disabled_checked.png','Erlaubt');
		$this->images['new_group'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/add_group.png','Gruppe hinzufügen',array('title'=>'Gruppe hinzufügen'));
		$this->images['delete_group'] = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/delete_group.png','Gruppe löschen',array('title'=>'Gruppe löschen'));


		$img_group = Html::img('/'.INSTALL_PATH . '/Classes/Admin/Icons/16x16/edit_group.png','Gruppe');

		$cols = count($this->rechte)+3;
		$table = new Table($cols,array('id'=>'groups_table'));
		$form_tag = Form::form_tag('/Admin/Gruppen');
		$form_close = Form::close_form();

		$th = array(Html::bold('Gruppe'));


		foreach ($this->rechte as $recht)
		{
			$th[] = $recht['RechtName'];
		}
		$table->add_th($th);
		for ($i=0;$i<count($this->existent_groups);$i++)
		{


			if (isset($_GET['editgroup']) && $_GET['editgroup'] == $i )
			{
				$td = array(Form::add_input('text','name',$this->existent_groups[$i]['Name']));
				for ($j=0;$j<count($this->rechte);$j++)
				{
					if (in_array($this->rechte[$j]['id'],$this->existent_groups[$i]['Rechte']))
					{
						$td[] = Form::add_input('checkbox','Recht[]',$this->rechte[$j]['id'],array('checked'=>'checked'));
					}
					else
					{
						$td[] = Form::add_input('checkbox','Recht[]',$this->rechte[$j]['id']);
					}
				}
				$id = Form::add_input('hidden','group_id',$i);
				$new_rechte_submit = Form::add_input('image','submit_rechte','Speichern',array('src'=>$this->images['apply_path'],'alt'=>'Speichern'));
				$td[] = $id.$new_rechte_submit;
			}
			else
			{
				$td = array(Html::bold($this->existent_groups[$i]['Name']));
				for ($j=0;$j<count($this->rechte);$j++)
				{
					$td[] = (in_array($this->rechte[$j]['id'],$this->existent_groups[$i]['Rechte'])) ? $this->images['checkbox_disabled_checked'] : $this->images['checkbox_disabled_unchecked'];
				}
				$edit_button = Html::a('/Admin/Gruppen?editgroup='.$i,$this->images['edit'],array('title'=>'Eigenschaften bearbeiten'));
				$delete_button = Html::a('/Admin/Gruppen?deletegroup='.$i,$this->images['delete_group'],array('title'=>'Gruppe löschen','onclick'=>"return confirm('Gruppe ".$this->existent_groups[$i]['Name']." löschen?')"));
				$td[] = $edit_button;
				$td[] = $delete_button;
			}
			$class = (is_int($i/2)) ?   'abwechselnde_flaechen_1': 'abwechselnde_flaechen_2';
			$table->add_td($td,array('class'=>(is_int($i/2)) ?   'abwechselnde_flaechen_1': 'abwechselnde_flaechen_2'));
		}
		$new_group_button = Html::a('/Admin/Gruppen?newgroup',$this->images['new_group'].' Gruppe hinzufügen');
		if (isset($_GET['newgroup']))
		{
			$td = array(Form::add_input('text','name','Name...'));
			for ($j=0;$j<count($this->rechte);$j++)
			{
				$td[] = Form::add_input('checkbox','Recht[]',$this->rechte[$j]['id']);
			}

			$new_group_submit = Form::add_input('image','submit_newgroup','Speichern',array('src'=>$this->images['apply_path'],'alt'=>'Speichern'));
			$td[] = $id.$new_group_submit;
			$table->add_td($td);
		}
		else $table->add_td(array(array(2=>$new_group_button)));

		return $form_tag.$table->flush_table().$form_close;
	}

	function rechte_update()
	{
		$id = $this->existent_groups[$_POST['group_id']]['id'];
		$old_name = $this->existent_groups[$_POST['group_id']]['Name'];
		$name = $_POST['name'];
		$new_rechte = (isset($_POST['Recht'])) ? serialize($_POST['Recht']) : serialize(array());
		if ($_SESSION['RheinaufCMS_User']['Group'] == $old_name) $_SESSION['RheinaufCMS_User']['Group'] = $name;
		$this->connection->db_query("UPDATE `$this->groups_table` SET `Name` = '$name', `Rechte` = '$new_rechte' WHERE `id` = '$id'");
		$this->connection->db_query("UPDATE `$this->user_table` SET `Group` = '$name' WHERE `Group` = '$old_name'");

		$this->group_table_update();

	}

	function new_group_input()
	{
		if ($_POST['name'] == 'dev') return;
		$id = count($this->existent_groups);
		$name = $_POST['name'];
		$new_rechte = (isset($_POST['Recht'])) ? serialize($_POST['Recht']) : serialize(array());

		$this->connection->db_query("INSERT INTO `$this->groups_table` ( `id` , `Name` , `Rechte` ) VALUES ('$id', '$name', '$new_rechte')");
		$this->group_table_update();
	}

	function delete_group ()
	{
		$id = $_GET['deletegroup'];
		$this->connection->db_query("DELETE FROM `$this->groups_table` WHERE `id` = $id");
		$this->group_table_update();
	}
}
?>