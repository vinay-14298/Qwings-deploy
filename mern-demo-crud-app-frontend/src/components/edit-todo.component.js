import React, { Component } from 'react';
import axios from 'axios';

/*
This component allows us to edit the values of a todo
*/
export default class EditTodo extends Component {

  constructor(props) {
       super(props);

       this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
       this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
       this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
       this.onChangeTodoCompleted = this.onChangeTodoCompleted.bind(this);
       this.validateForm = this.validateForm.bind(this);
       this.onSubmit = this.onSubmit.bind(this);
       this.cancel = this.cancel.bind(this);

       this.state = {
           todo_description: '',
           todo_responsible: '',
           todo_priority: '',
           todo_completed: false
       }
   }

   componentDidMount() {
      // get the todo by id from the database and list the todo parameters
      axios.get('http://localhost:4000/todos/'+this.props.match.params.id)
          .then(response => {
              this.setState({
                  todo_description: response.data.todo_description,
                  todo_responsible: response.data.todo_responsible,
                  todo_priority: response.data.todo_priority,
                  todo_completed: response.data.todo_completed
              })
          })
          .catch(function (error) {
              console.log(error);
          })
  }

  onChangeTodoDescription(e) {
        this.setState({
            todo_description: e.target.value
        });
    }

    onChangeTodoResponsible(e) {
        this.setState({
            todo_responsible: e.target.value
        });
    }

    onChangeTodoPriority(e) {
        this.setState({
            todo_priority: e.target.value
        });
    }

    onChangeTodoCompleted(e) {
        this.setState({
            todo_completed: !this.state.todo_completed
        });
    }

    validateForm() {
      // ensure that an edited todo is not submitted with empty fields
      var todo_description = this.state.todo_description;
      var todo_responsible = this.state.todo_responsible;
      var todo_priority = this.state.todo_priority;


      if (todo_description == null || todo_description == '' ||
      todo_responsible == null || todo_responsible == '' ||
      todo_priority == null || todo_priority == '') {
        alert("Todo fields must be filled out");
        return false;
      }
      return true;
    }

    onSubmit(e) {
      e.preventDefault();
      if (this.validateForm()) {
        // only submit a todo if all fields are filled out
        const obj = {
          todo_description: this.state.todo_description,
          todo_responsible: this.state.todo_responsible,
          todo_priority: this.state.todo_priority,
          todo_completed: this.state.todo_completed
        };
        console.log(obj);
        axios.post('http://localhost:4000/todos/update/'+this.props.match.params.id, obj)
        .then(res => console.log(res.data));

        // return to the homepage after the todo is submitted
        this.props.history.push('/');
      }
    }

    cancel() {
      // canel the editing of a todo and return to the homepage
      this.props.history.push('/');
    }

  render() {
       return (
           <div>
               <h3 align="center">Update Todo</h3>
               <form onSubmit={this.onSubmit}>
                   <div className="form-group">
                       <label>Description: </label>
                       <input  type="text"
                               className="form-control"
                               value={this.state.todo_description}
                               onChange={this.onChangeTodoDescription}
                               />
                   </div>
                   <div className="form-group">
                       <label>Responsible: </label>
                       <input
                               type="text"
                               className="form-control"
                               value={this.state.todo_responsible}
                               onChange={this.onChangeTodoResponsible}
                               />
                   </div>
                   <div className="form-group">
                       <div className="form-check form-check-inline">
                           <input  className="form-check-input"
                                   type="radio"
                                   name="priorityOptions"
                                   id="priorityLow"
                                   value="Low"
                                   checked={this.state.todo_priority==='Low'}
                                   onChange={this.onChangeTodoPriority}
                                   />
                           <label className="form-check-label">Low</label>
                       </div>
                       <div className="form-check form-check-inline">
                           <input  className="form-check-input"
                                   type="radio"
                                   name="priorityOptions"
                                   id="priorityMedium"
                                   value="Medium"
                                   checked={this.state.todo_priority==='Medium'}
                                   onChange={this.onChangeTodoPriority}
                                   />
                           <label className="form-check-label">Medium</label>
                       </div>
                       <div className="form-check form-check-inline">
                           <input  className="form-check-input"
                                   type="radio"
                                   name="priorityOptions"
                                   id="priorityHigh"
                                   value="High"
                                   checked={this.state.todo_priority==='High'}
                                   onChange={this.onChangeTodoPriority}
                                   />
                           <label className="form-check-label">High</label>
                       </div>
                   </div>
                   <div className="form-check">
                       <input  className="form-check-input"
                               id="completedCheckbox"
                               type="checkbox"
                               name="completedCheckbox"
                               onChange={this.onChangeTodoCompleted}
                               checked={this.state.todo_completed}
                               value={this.state.todo_completed}
                               />
                       <label className="form-check-label" htmlFor="completedCheckbox">
                           Completed
                       </label>
                   </div>

                   <br />

                   <div class="form-row">
                        <div class="form-group col-md-2">
                          <input type="submit" value="Update Todo" className="btn btn-primary" />
                        </div>
                        <div class="form-group col-md-2">
                          <input type="button" value="Cancel" onClick={this.cancel} className="btn btn-primary" />
                        </div>
                    </div>
               </form>
           </div>
       )
   }
}
