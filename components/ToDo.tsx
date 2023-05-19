import { FlatList, Text, View, StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { CheckBox, Button, Icon, Input } from "@rneui/base";

interface Task {
  title: string;
  description: string;
  done: boolean;
}

export const ToDo = () => {
  const [saved, setSaved] = useState(new Array<Task>());
  const [isError, setIsError] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    done: false,
  });

  useEffect(() => {
    getSaved();
  });

  const handleCompleteAll = async () => {
    const pairs: [string, string][] = saved.map((item) => {
      const updatedItem = { ...item, done: true };
      return [item.title, JSON.stringify(updatedItem)];
    });
    try {
      await AsyncStorage.multiSet(pairs);
    } catch (e) {
      setIsError(true);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      setIsError(true);
    }
  };

  const handleNewTask = async () => {
    if (newTask.title !== "") {
      const value = JSON.stringify(newTask);
      try {
        await AsyncStorage.setItem(newTask.title, value);
      } catch (e) {
        setIsError(true);
      }
    }
  };

  const handleUpdate = async (task: Task) => {
    const value = JSON.stringify(task);
    try {
      await AsyncStorage.setItem(newTask.title, value);
    } catch (e) {
      setIsError(true);
    }
  };

  const handleDelete = async (title: string) => {
    try {
      await AsyncStorage.removeItem(title);
    } catch (e) {
      setIsError(true);
    }
  };

  const getSaved = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      try {
        const values = await AsyncStorage.multiGet(keys);
        const items = values.reduce((p, c) => {
          if (c[1] != null) {
            const task: Task = JSON.parse(c[1]);
            return p.concat(new Array<Task>(task));
          } else {
            return p;
          }
        }, new Array<Task>());
        setSaved(items);
      } catch (e) {
        setIsError(true);
      }
    } catch (e) {
      setIsError(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <BaseList
        tasks={saved}
        handleUpdate={handleUpdate}
        handleRemove={handleDelete}
      ></BaseList>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-evenly",
        }}
      >
        <Button
          titleStyle={styles.text}
          buttonStyle={styles.button}
          title={"Complete All"}
          onPress={handleCompleteAll}
        ></Button>
        <Button
          titleStyle={styles.text}
          buttonStyle={styles.button}
          title={"Delete All"}
          onPress={handleDeleteAll}
        ></Button>
      </View>
      <View style={{ margin: 5 }}>
        <Input
          label={"Title"}
          placeholder={"Enter title"}
          inputStyle={styles.input}
          onChangeText={(text: string) => {
            const updatedTask: Task = { ...newTask, title: text };
            setNewTask(updatedTask);
          }}
        ></Input>
        <Input
          label={"Description"}
          placeholder={"Enter description (optional)"}
          inputStyle={styles.input}
          onChangeText={(text: string) => {
            const updatedTask: Task = { ...newTask, description: text };
            setNewTask(updatedTask);
          }}
        ></Input>
        <Button
          titleStyle={styles.text}
          title="Add New Task"
          buttonStyle={styles.button}
          onPress={handleNewTask}
        ></Button>
      </View>
    </View>
  );
};

type BaseListProps = {
  tasks: Array<Task>;
  handleUpdate: (task: Task) => void;
  handleRemove: (title: string) => void;
};

export const BaseList = ({
  tasks,
  handleUpdate,
  handleRemove,
}: BaseListProps) => {
  return (
    <View style={styles.base}>
      <FlatList
        style={styles.list}
        data={tasks}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <View>
              <Text style={{ fontSize: 20 }}>{item.title}</Text>
              <Text style={{}}>{item.description}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <CheckBox
                onIconPress={() => {
                  const updatedItem = { ...item, done: !item.done };
                  handleUpdate(updatedItem);
                }}
                checked={item.done}
                containerStyle={{ backgroundColor: "lavender" }}
              ></CheckBox>
              <Button
                buttonStyle={styles.button}
                titleStyle={styles.text}
                onPress={() => handleRemove(item.title)}
              >
                <Icon type="feather" name="trash"></Icon>
              </Button>
            </View>
          </View>
        )}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: StatusBar.currentHeight,
    flex: 1,
  },
  text: {
    color: "black",
  },
  button: {
    backgroundColor: "lavender",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    elevation: 3,
    height: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    gap: 10,
  },
  list: {
    backgroundColor: "white",
  },
  task: {
    backgroundColor: "lavender",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
  },
});
