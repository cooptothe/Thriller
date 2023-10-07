import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowLeftIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';
import { StarIcon} from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cast from '../components/cast';
import MovieList from '../components/movieList';
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, fetchStreamingServices, image500 } from '../api/moviedb';
import { styles, theme } from '../theme';
import Loading from '../components/loading';

const ios = Platform.OS == 'ios';
const topMargin = ios? '':' mt-3';
var {width, height} = Dimensions.get('window');

const horrorTheme = {
    background: '#000000', // Black background
    text: '#FF0000', // Blood red text color
    accent: '#8B0000' // Dark red accent color
  };

export default function MovieScreen() {
  const {params: item} = useRoute();
  const navigation = useNavigation();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState([]);
  const [watchLink, setWatchLink] = useState('');



  useEffect(()=>{
    setLoading(true);
    getMovieDetials(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
    getMovieStreaming(item.id);
  },[item]);

  const getMovieDetials = async id=>{
    const data = await fetchMovieDetails(id);
    console.log('got movie details');
    setLoading(false);
    if(data) {
        setMovie({...movie, ...data});
    }
  }
  const getMovieStreaming = async id=>{
    const data = await fetchStreamingServices(id);
    console.log('got movie streaming');
    console.log(watchLink);
    if(data && data.results) {
        setStreaming(data.results);
        setWatchLink(data.results.US.link);
    }
  }
  const getMovieCredits = async id=>{
    const data = await fetchMovieCredits(id);
    console.log('got movie credits');
    if(data && data.cast){
        setCast(data.cast);
    }

  }
  const getSimilarMovies = async id=>{
    const data = await fetchSimilarMovies(id);
    console.log('got similar movies');
    if(data && data.results){
        setSimilarMovies(data.results);
    }

  }
  return (
    <ScrollView
        className="flex-1 bg-neutral-900">


      {/* back button and movie poster */}
      <View className="w-full" >
        <SafeAreaView className={"absolute z-20 w-full flex-row justify-between items-center px-4 "+topMargin}>
            <TouchableOpacity style={styles.background} className="rounded-xl p-1" onPress={()=> navigation.goBack()}>
                <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> toggleFavourite(!isFavourite)}>
                <StarIcon size="35" color={isFavourite? theme.background: 'white'} />
            </TouchableOpacity>
        </SafeAreaView>
        {
            loading? (
                <Loading />
            ):(
                <View>
                    <Image
                        // source={require('../assets/images/moviePoster2.png')}
                        source={{uri: image500(movie.poster_path) || fallbackMoviePoster}}
                        style={{width, height: height*0.55}}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 1)']}
                        style={{width, height: height*0.20}}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        className="absolute bottom-0"
                    />
                </View>
            )
        }



      </View>

      {/* movie details */}
      <View style={{marginTop: -(height*0.09), marginBottom: 10}}className="space-y-3">
      {/* title */}
      <Text className="text-white text-center text-3xl font-bold tracking-widest">
            {
                movie?.title
            }
        </Text>
        </View>

      <View style={{ ...styles.background, backgroundColor: horrorTheme.background, marginTop: 10}} className="space-y-3">

        {/* status, release year, runtime */}
        <View style={{ marginTop: 10}}  className="flex-row justify-center mx-4 space-x-2">
        {
            movie?.id? (
                <Text className="text-neutral-400 font-semibold text-base text-center">
                    {movie?.status} • {movie?.release_date?.split('-')[0] || 'N/A'} • {movie?.runtime} min
                </Text>
            ):null
        }
        </View>

        {/* genres  */}
        <View className="flex-row justify-center mx-4 space-x-2">
            {
                movie?.genres?.map((genre,index)=>{
                    let showDot = index+1 != movie.genres.length;
                    return (
                        <Text key={index} className="text-neutral-400 font-semibold text-base text-center">
                            {genre?.name} {showDot? "•":null}
                        </Text>
                    )
                })
            }
        </View>

        {/* description */}
        <Text className="text-neutral-400 mx-4 tracking-wide">
            {
                movie?.overview
            }
        </Text>
    {/* streaming */}
    <Text style={{ marginTop: 60 }} className="text-white text-sm mx-4">
        Watch Now:
        {streaming?.US?.buy?.map((provider, index) => (
            <TouchableOpacity key={index} onPress={() => open(watchLink)}>
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/original${provider.logo_path}` }}
                style={{ width: 20, height: 20, marginRight: 5, marginLeft: 5 }}
            />
            </TouchableOpacity>

        ))}
        </Text>
      {/* cast */}
      {
        movie?.id && cast.length>0 && <Cast navigation={navigation} cast={cast} />
      }

      {/* similar movies section */}
      {
        movie?.id && similarMovies.length>0 && <MovieList title={'Similar Movies 🎞️'} hideSeeAll={true} data={similarMovies} />
      }
     </View>

    </ScrollView>
  )
}