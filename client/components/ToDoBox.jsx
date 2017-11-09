import React from 'react';

export default class ToDoBox extends React.Component {
    constructor(){
        super();
        this.state = {
            actions: []
        };
        {
            this._getActions()
                .then((actions) => this.setState({actions}))
                .catch((error) => console.log(error()))
        }
    }

    render() {

        return (
            <div style={{textAlign: 'center'}}>
                <Header />
                <Title getTitle={this._getTitle.bind(this)} numberOfActions={this.state.actions.length}/>
                <ToDoForm addAction={this._addAction.bind(this)}/>
                {this.state.actions.map(action => <Action {...action} key={action.id} remove={() => this._removeAction(action.id)}/>)}
            </div>);
    }

    _getActions(){
        return new Promise((resolve, reject) => {
            let uri = "http://localhost:3000/actions";
            let request = new XMLHttpRequest();
            request.open("GET", uri, true);
            request.onload = () => {
                if(request.status >= 200 && request.status < 400){
                    resolve( JSON.parse(request.response));
                }
            };
            request.onerror = () =>{
                reject(new Error("Couldnt call the API"))
            };
            request.send();
        });
    }

    _addAction(description){
        const action = {id: this.state.actions.length + 1, description};
        this.setState({actions: this.state.actions.concat([action])});
    }

    _removeAction(actionId){
        let updatedActions = this.state.actions;
        this.setState({actions: updatedActions.splice(actionId - 1, 1)});
    }

    _getTitle(numberOfActions){
        let title;
        if(numberOfActions == 0){
            title = "Nothing to see here";
        }
        else if(numberOfActions == 1){
            title = `${numberOfActions} item`;
        }
        else {
            title = `${numberOfActions} items`;
        }
        return title;
    }

}

class Header extends React.Component{
    render(){
        return(
            <h1>To-Do List</h1>
        );
    };
}

class Title extends React.Component{
    render(){
        return(
            <h3>{this.props.getTitle(this.props.numberOfActions)}</h3>
        );
    }
}

class ToDoForm extends React.Component{
    constructor(){
        super();
        this.state = {
            characterCount: 0
        }
    }
    render(){
        return(
            <div>
                <form onSubmit={this._handleSubmit.bind(this)}>
                    <textarea placeholder={'What you doing?'} ref={(textarea) => this._textarea = textarea} />
                    <br/>
                    <button>Add</button>
                </form>
            </div>
        );
    }

    _handleSubmit(event){
        event.preventDefault();
        let description = this._textarea;
        if(description.value.length > 0){
            this.props.addAction(description.value);
        }
        description.value = "";
    };
}

class Action extends React.Component{
    render(){
        return(
            <p onClick={this._handleRemove.bind(this)}>{this.props.description}</p>
        );
    }
    _handleRemove(event){
        event.preventDefault();
        this.props.remove(this.props.key);
    };
}





