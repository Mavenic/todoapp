import { Text, Container, Content,Fab,Icon, Card, CardItem, Body, View } from 'native-base';
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Connection from "../../db/Connection";
import platformTheme from "../../../native-base-theme/variables/platform";
import props from "../../config/properties";

class TaskList extends Component {

    static navigationOptions = {
        title: 'Task List',
    };

    dataRefreshEvent;

    constructor(props) {
        super(props);
        this.state = {
            myTasks : []
        }
    }

    componentDidMount(){
        this.dataRefreshEvent = this.props.navigation.addListener(
            'willFocus',
            () => {
              this.fetchData();
            }
        );
    }

    componentWillUnmount() {
        this.dataRefreshEvent.remove();
    }

    /**
     * Fetches the data from the DB
     */
    fetchData = () => {
        /** Fetch the connection and get the tasklist */
        Connection.get()
        .then( db => Connection.fetchAllTask(db))
        .then(([results]) => {
            if (results !== undefined) {
                let myTasks = [];
                for (let i = 0; i < results.rows.length; i++) {
                    const row = results.rows.item(i);
                    const { title, id, description, status } = row;
                    myTasks.push({ id, title, description, status});
                }
                this.setState({
                    myTasks : myTasks
                })
            }
        }).catch(error => {
            if(props.logging)
                console.error(error);
        });
    }

    /**
     * Redirects to create a new task
     */
    createNewTask = () => {
        this.props.navigation.navigate("CreateNewTask");
    }

    /**
     * Renders a single task for the UI
     */
    renderTask = (entry) => {
        let task = entry.item;
        let statusText;
        if(task.status==0){
            //Inprogress
            statusText = (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='timer' />
                    <Text style={{marginLeft:20}}>In Progress</Text>
                </View>
            );
        }else{
            //Completed
            statusText = (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon style={{color:'green'}} name='checkmark-circle' />
                    <Text style={{marginLeft:20}}>Completed</Text>
                </View>
            );
        }
        return (
            <Card>
                <CardItem header>
                    <Text>{task.title}</Text>
                </CardItem>
                <CardItem>
                <Body>
                    <Text style={{color:"#888888"}}>
                        {task.description}
                    </Text>
                </Body>
                </CardItem>
                <CardItem footer>
                    {statusText}
                </CardItem>
            </Card>
        );
    }

    render(){
        return(
            <Container>
                <Content style={{backgroundColor:"#EBF3F9",padding:20}}>
                    <FlatList
                        maxToRenderPerBatch = {50}
                        initialNumToRender={30}
                        data = {this.state.myTasks} 
                        renderItem={this.renderTask}
                        keyExtractor={item => item.id+""} >

                    </FlatList>
                </Content>
                <Fab
                    style={{ backgroundColor: platformTheme.brandPrimary ,marginRight:15,marginBottom:15}}
                    position="bottomRight"
                    onPress={this.createNewTask}>
                        <Icon name="create" />
                </Fab>
            </Container>
        );
    }
}

export default TaskList;