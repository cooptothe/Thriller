import React from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { image185, fallbackMoviePoster } from '../api/moviedb';

const { width, height } = Dimensions.get('window');

const SeeAllScreen = ({ route }) => {
  const { movies } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 20 }}>
      {movies.map((movie, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <Image
            source={{ uri: image185(movie.poster_path) || fallbackMoviePoster }}
            style={{ width: width * 0.44, height: height * 0.3, borderRadius: 10 }}
          />
          <Text style={{ color: 'white', marginTop: 10 }}>
            {movie.title.length > 22 ? `${movie.title.slice(0, 22)}...` : movie.title}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default SeeAllScreen;
