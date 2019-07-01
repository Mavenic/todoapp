/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { Root, StyleProvider } from 'native-base';
import React, { Component } from 'react';
import { createAppContainer, createStackNavigator } from "react-navigation";
import getTheme from "./native-base-theme/components";
import platformTheme from "./native-base-theme/variables/platform";
import TaskListScreen from "./src/screens/task/TaskList";
import CreateNewTaskScreen from "./src/screens/task/CreateNewTask";

/**
 * Stack navigator that will take case of all routings
 */
const StackAuthNavigator = createStackNavigator(
  {
    TaskList : {screen : TaskListScreen },
    CreateNewTask : {screen : CreateNewTaskScreen }
  },{
    initialRouteName: "TaskList",
  }
);

const AppContainer = createAppContainer(StackAuthNavigator);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <StyleProvider style={getTheme(platformTheme)}>
        <Root>
          <AppContainer />
        </Root>
      </StyleProvider>
    );
  }
}