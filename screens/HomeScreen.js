import { View, Text, Image, TouchableOpacity, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {Bars3CenterLeftIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import TrendingMovies from '../components/trendingMovies';
import MovieList from '../components/movieList';
import { StatusBar } from 'expo-status-bar';
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviedb';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading';
import { styles } from '../theme';
import customLogo from '../assets/customLogo.png';

const ios = Platform.OS === 'ios';

const horrorTheme = {
  background: '#000000', // Black background
  text: '#FF0000', // Blood red text color
  accent: '#8B0000' // Dark red accent color
};

export default function HomeScreen() {

  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


  useEffect(()=>{
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  },[]);

  const getTrendingMovies = async ()=>{
    const data = await fetchTrendingMovies();
    console.log('got trending', data.results.length)
    if(data && data.results) setTrending(data.results);
    setLoading(false)
  }
  const getUpcomingMovies = async ()=>{
    const data = await fetchUpcomingMovies();
    console.log('got upcoming', data.results.length)
    if(data && data.results) setUpcoming(data.results);
  }
  const getTopRatedMovies = async ()=>{
    const data = await fetchTopRatedMovies();
    console.log('got top rated', data.results.length)
  }



  return (
    <View className="flex-1" style={{ ...styles.background, backgroundColor: horrorTheme.background }}>
      {/* search bar */}
      <SafeAreaView className={ios? "-mb-2": "mb-3"}>
        <StatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4">
        <Image source={customLogo} style={{ width: 30, height: 30, marginRight: 10 }} />
          <Text
            className="text-white text-3xl font-bold ">
              <Text style={styles.text}>T</Text>hriller
          </Text>
          <TouchableOpacity onPress={()=> navigation.navigate('Search')}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {
        loading? (
          <Loading />
        ):(
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 10}}
          >

            {/* Trending Movies Carousel */}
            { trending.length>0 && <TrendingMovies data={trending} /> }

            {/* upcoming movies row */}
            { upcoming.length>0 && <MovieList title="Upcoming" data={upcoming} /> }


            {/* top rated movies row */}
            { topRated.length>0 && <MovieList title="Top Rated" data={topRated} /> }

          </ScrollView>
        )
      }

  </View>



  )
}
