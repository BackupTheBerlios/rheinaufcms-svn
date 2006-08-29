<?php
class DBBasedObject extends DefaultObject{
	//DBBased objects are a class that can be inherited from to get a list
	//of names and ids from a db table. A subclass will define a table name,
	//an id column name, and a name column name

	var $table_name;
	var $id_colname;
	var $name_colname;

	function get_table_name(){
		//returns the name of the table used to get the list of names and ids
		return $this->table_name;
	}
	
	function set_table_name($new_table_name){
		//sets the name of the table used to get the list of names and ids
		$this->table_name=$new_table_name;
	}
	
	function get_id_colname(){
		//returns the id column in the DB
		return $this->id_colname;
	}

	function set_id_colname($new_val){
		//sets the id column in the DB
		$this->id_colname=$new_val;
	}

	function get_name_colname(){
		//returns the name column in teh DB
		return $this->name_colname;
	}

	function set_name_colname($new_val){
		//sets the name column in the DB
		$this->name_colname=$new_val;
	}
	
	function find_all(){
		//returns a list of objects from the DB with names set to the value of the name column
		// and ids set to the value from the id column for teh table defined by the table name
		//variable
		// global $db_obj;
		$db_obj = new DB();
		
		$all_objs = array();
		$sql="select ".$this->get_id_colname().", ";
		$sql=$sql.$this->get_name_colname();
		$sql=$sql." from ".$this->get_table_name();
		$db_rows=$db_obj->query($sql);
		for ($i=0;$i<sizeof($db_rows);$i=$i+1){
			$next_item= $db_rows[$i];
			$next_obj=new Location();
			$next_obj->set_id($next_item[$this->get_id_colname()]);
			$next_obj->set_name($next_item[$this->get_name_colname()]);
			array_unshift($all_objs, $next_obj);
		}
		return $all_objs;
	}
}
?>
