import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { categories } from '../data/categories';
import type { Category, SubCategory, TimeOption } from '../types/game';

type RootStackParamList = {
  Home: undefined;
  Game: { words: string[]; timeout: TimeOption };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleSubCategorySelect = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setShowTimeModal(true);
  };

  const handleTimeSelect = (timeout: TimeOption) => {
    setShowTimeModal(false);
    navigation.navigate('Game', {
      words: selectedSubCategory!.words,
      timeout
    });
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  const renderCategoryCard = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.card, selectedCategory?.id === item.id && styles.selectedCard]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderSubCategoryCard = ({ item }: { item: SubCategory }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSubCategorySelect(item)}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ชาร้อน</Text>
      
      {!selectedCategory ? (
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <FlatList
          data={selectedCategory.subCategories}
          renderItem={renderSubCategoryCard}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      )}

      <Modal
        visible={showTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>เลือกเวลา</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => handleTimeSelect(30)}
            >
              <Text style={styles.timeButtonText}>30 วินาที</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => handleTimeSelect(60)}
            >
              <Text style={styles.timeButtonText}>60 วินาที</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => handleTimeSelect(120)}
            >
              <Text style={styles.timeButtonText}>120 วินาที</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  gridContainer: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  timeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 8,
    width: '100%',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});