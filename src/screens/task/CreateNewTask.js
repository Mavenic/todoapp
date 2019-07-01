import { Text, Container, Content,Fab,Icon,Form,Item,Label,Input,Textarea, Left,Right,Switch, Button } from 'native-base';
import React, { Component } from 'react';
import Connection from "../../db/Connection";
import platformTheme from "../../../native-base-theme/variables/platform";
import props from "../../config/properties";

class CreateNewTask extends Component {

    static navigationOptions = {
        title: 'Create New',
    };

    curState = {
        taskcompleted : false,
        tasktitle : null,
        taskdescription:null
    }

    constructor(props) {
        super(props);
        this.state = this.curState;
    }

    /**
     * Saves the new task in the db
     */
    saveTask = () => {
        let taskObj = {};
        taskObj.title = this.state.tasktitle || "No title provided";
        taskObj.description = this.state.taskdescription || "No description provided";
        taskObj.status = this.state.taskcompleted
        Connection.get()
        .then( db => Connection.createNewTask(db,taskObj))
        .then(([results]) => {
            if(props.logging)
                console.log("Task saved successfully with "+results.insertId);
            this.props.navigation.goBack(null);
        }).catch(error=>{
            if(props.logging)
                console.error(error);
        });
    }

    /**
     * Changes the task status 
     */
    changeTaskStatus = () => {
        this.curState.taskcompleted = !this.curState.taskcompleted;
        this.updateState();
    }

    /**
     * Change the task title in the state
     */
    changeTaskTitle = (title) => {
        this.curState.tasktitle = title;
        this.updateState();
    }

    /**
     * Changes the task description in the state
     */
    changeTaskDescription = (description) => {
        this.curState.taskdescription = description;
        this.updateState();
    }

    /**
     * Update the state to change the UI
     */
    updateState = () => {
        this.setState({
            ...this.curState
        });
    }

    render(){
        return(
            <Container>
                <Content padder>
                    <Text>Fill the form below to create a new task.</Text>
                    <Form>
                        <Item floatingLabel>
                            <Label>Title</Label>
                            <Input onChangeText={this.changeTaskTitle} />
                        </Item>
                        <Item style={{marginTop:30}}>
                            <Textarea style={{width:'100%'}} rowSpan={15} bordered placeholder="Enter description here (optional)"
                            onChangeText={this.changeTaskDescription}
                            />
                        </Item>
                        <Item style={{marginTop:30,borderColor:'transparent'}}>
                            <Left>
                                <Text>Task Completed</Text>
                            </Left>
                            <Right>
                                <Switch value={this.state.taskcompleted} onValueChange={this.changeTaskStatus} />
                            </Right>
                        </Item>
                        <Item style={{marginTop:30,borderColor:'transparent'}}>
                            <Button rounded style={{width:'100%',alignItems:"center"}} onPress={this.saveTask}>
                                <Text style={{width:'100%',textAlign:'center'}}>Save</Text>
                            </Button>
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default CreateNewTask;