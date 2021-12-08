import React, { Component } from 'react';
import axios from 'axios';

/*
This component allows us to delete an existing todo
*/
export default class Delete extends Component {

  constructor(props) {
       super(props);

       this.state = {
           todo_description: '',
           todo_responsible: '',
           todo_priority: '',
           todo_completed: false
       }
   }

   componentDidMount() {
     // delete todo by id and then return to the homepage
     axios.post('http://localhost:4000/todos/delete/'+this.props.match.params.id)
                 .then(res => console.log(res.data));
     this.props.history.push('/');
  }

  render() {
      return null
    }
 }
