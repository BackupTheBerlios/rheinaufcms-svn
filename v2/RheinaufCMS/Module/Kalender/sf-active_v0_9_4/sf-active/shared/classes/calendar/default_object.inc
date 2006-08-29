<?php
class DefaultObject{
	//Default object is a base object which has ids and names
	//any object with id and name variables should inherit from this class
	var $id;
	var $name;

	function get_id(){
		//returns the id 
		return $this->id;
	}

	function set_id($new_id){
		//sets the id
		$this->id=$new_id;
	}

	function get_name(){
		//returns the name
		return $this->name;
	}

	function set_name($new_name){
		//sets the name
		$this->name=$new_name;
	}
}
?>
