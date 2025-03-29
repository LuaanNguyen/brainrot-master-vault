import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

interface CategoryInputPopupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (categoryName: string) => void;
}

const CategoryInputPopup = ({
  visible,
  onClose,
  onSave,
}: CategoryInputPopupProps) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSave = () => {
    if (categoryName.trim()) {
      onSave(categoryName);
      setCategoryName("");
      onClose();
    }
  };

  const handleCancel = () => {
    setCategoryName("");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.cardContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Add New Category</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "85%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default CategoryInputPopup;

// Example Usage:
/*
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import CategoryInputPopup from './CategoryInputPopup';

const App = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  const handleSaveCategory = (categoryName) => {
    console.log('New category:', categoryName);
    // Add your logic to save the category
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        title="Add Category" 
        onPress={() => setIsPopupVisible(true)} 
      />
      
      <CategoryInputPopup
        visible={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        onSave={handleSaveCategory}
      />
    </View>
  );
};

export default App;
*/
