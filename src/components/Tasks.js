import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, StyleSheet, Text, Modal, Dimensions, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const Tasks = () => {
  const [notes, setNotes] = useState([]); // Stores the list of notes
  const [modalVisible, setModalVisible] = useState(false); // Controls the visibility of the modal
  const [noteTitle, setNoteTitle] = useState(''); // Stores the title of the note
  const [noteText, setNoteText] = useState(''); // Stores the text content of the note
  const [isTaskList, setIsTaskList] = useState(false); // Indicates whether the note is a task list or a regular note
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null); // Keeps track of the index of the selected note

  useEffect(() => {
    retrieveNotes();
  }, []);

  const retrieveNotes = async () => {
    // Retrieves the saved notes from AsyncStorage

    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveNotes = async (notes) => {
    // Saves the notes to AsyncStorage

    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (index) => {
    // Opens the modal for adding/editing a note

    setSelectedNoteIndex(index);
    setNoteTitle(index !== null ? notes[index].title : '');
    setNoteText(index !== null ? notes[index].text : '');
    setIsTaskList(index !== null ? notes[index].isTaskList : false);
    setModalVisible(true);
  };

  const closeModal = () => {
    // Closes the modal and resets the state variables

    setSelectedNoteIndex(null);
    setNoteTitle('');
    setNoteText('');
    setIsTaskList(false);
    setModalVisible(false);
  };

  const addNote = () => {
    // Adds a new note or updates an existing note

    if (noteTitle.trim() !== '' || noteText.trim() !== '') {
      const newNote = {
        title: noteTitle,
        text: noteText,
        isTaskList: isTaskList
      };
      if (selectedNoteIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[selectedNoteIndex] = newNote;
        setNotes(updatedNotes);
      } else {
        setNotes([...notes, newNote]);
      }
    }
    closeModal();
  };

  const deleteNote = (index) => {
    // Deletes a note

    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    closeModal();
  };

  const toggleTask = (index) => {
    // Toggles the completion status of a task in a task list

    setNotes(prevNotes => {
      const newNotes = [...prevNotes];
      const currentNote = newNotes[index];
      const tasks = currentNote.text.split('\n');
      const task = tasks[index];
      if (task.startsWith('☑')) {
        tasks[index] = task.substring(2);
      } else {
        tasks[index] = '☑ ' + task;
      }
      currentNote.text = tasks.join('\n');
      return newNotes;
    });
  };

  const renderNote = ({ item, index }) => {
    // Renders a single note item

    const toggleTask = (taskIndex) => {
      setNotes(prevNotes => {
        const newNotes = [...prevNotes];
        const currentNote = newNotes[index];
        const tasks = currentNote.text.split('\n');
        const task = tasks[taskIndex];
        if (task.startsWith('☑')) {
          tasks[taskIndex] = task.substring(2);
        } else {
          tasks[taskIndex] = '☑ ' + task;
        }
        currentNote.text = tasks.join('\n');
        return newNotes;
      });
    };

    if (item.title.trim() === '' && item.text.trim() === '') {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.noteContainer}
      >
        <View style={styles.noteOptionsContainer}>

          /* Button to open the options modal for the note */
          <TouchableOpacity
            style={styles.noteOptionsButton}
            onPress={() => openModal(index)}
          >
            <Entypo name="dots-three-horizontal" size={20} color="black" />
          </TouchableOpacity>
        </View>

        /* Render note title if it is not empty */
        {item.title !== '' && <Text style={styles.noteTitle}>{item.title}</Text>}

        /* Render task list if it is a task list note */
        {item.isTaskList && item.text ? (
          <SafeAreaView style={styles.taskListContainer}>
            <FlatList
              data={item.text.split('\n')}
              renderItem={({ item: task, index: taskIndex }) => (
                <View style={styles.taskListItem}>

                  /* Checkbox button to toggle task completion */
                  <TouchableOpacity
                    onPress={() => toggleTask(taskIndex)}
                    style={styles.checkBoxButton}
                  >

                    /* Render different checkbox icon based on task completion */
                    {task.startsWith('☑') ? (
                      <MaterialIcons name="check-box" size={24} color="black" />
                    ) : (
                      <MaterialIcons name="check-box-outline-blank" size={24} color="black" />
                    )}
                  </TouchableOpacity>

                  /* Render task text */
                  <Text style={styles.taskText}>{task.replace('☑ ', '')}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </SafeAreaView>
        ) : (

          /* Render regular note text */
          <Text style={styles.noteText}>{item.text}</Text>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    // Filter out notes with empty titles or texts

    const nonEmptyNotes = notes.filter(note => note.title.trim() !== '' || note.text.trim() !== '');

    // Save the non-empty notes
    saveNotes(nonEmptyNotes);
  }, [notes]);

  return (
    <View style={styles.container}>

      /* Render the list of notes */
      <SafeAreaView style={styles.notesContainer}>
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>

      /* Modal for adding/editing notes */
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => closeModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.buttonContainer}>

              /* Delete button (visible if a note is selected) */
              {selectedNoteIndex !== null && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNote(selectedNoteIndex)}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.inputContainer}>

              /* Input for note title */
              <TextInput
                style={styles.input}
                placeholder="Title"
                onChangeText={(text) => setNoteTitle(text)}
                value={noteTitle}
                autoFocus={true}
              />

              /* Input for note text (supports multiline) */
              <TextInput
                style={[styles.input, styles.noteTextInput]}
                placeholder={isTaskList ? "Enter tasks (one per line)" : "Write your note"}
                onChangeText={(text) => setNoteText(text)}
                value={noteText}
                multiline={true}
              />
            </View>
            <View style={styles.buttonContainer}>

              /* Toggle between regular note and task list */
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setIsTaskList(!isTaskList)}
              >
                {isTaskList ? (
                  <FontAwesome5 name="sticky-note" size={24} color="black" />
                ) : (
                  <Octicons name="tasklist" size={24} color="black" />
                )}
              </TouchableOpacity>

              /* Confirm button to add/edit the note */
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => addNote()}
              >
                <MaterialIcons name="check" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      /* Button to open the modal for adding/editing a note */
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => openModal(null)}
      >
        <MaterialIcons name="add" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eb6956',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    margin: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    borderRadius: 30,
    padding: 10,
    margin: 5,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  noteTextInput: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  optionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eb6956',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  confirmButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginTop: 10,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eb6956',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  notesContainer: {
    flex: 1,
    width: Dimensions.get('window').width - 40,
    marginTop: 20,
  },
  noteContainer: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 3,
  },
  noteOptionsContainer: {
    alignItems: 'flex-end',
  },
  noteOptionsButton: {
    padding: 5,
    alignSelf: 'center'
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 16,
  },
  taskListContainer: {
    flex: 1,
  },
  taskListItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  checkBoxButton: {
    marginRight: 10,
  },
});

export default Tasks;
