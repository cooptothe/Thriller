import { View, Text, Image, TouchableOpacity, Platform, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { StarIcon } from 'react-native-heroicons/solid'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MovieList from '../components/movieList';
import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image185, image342, image500 } from '../api/moviedb';
import Loading from '../components/loading';
import { styles } from '../theme';

const ios = Platform.OS == 'ios';
const verticalMargin = ios? '':' my-3';
var {width, height} = Dimensions.get('window');

const horrorTheme = {
    background: '#000000', // Black background
    text: '#FF0000', // Blood red text color
    accent: '#8B0000' // Dark red accent color
  };

export default function PersonScreen() {
    const {params: item} = useRoute();
    const [isFavourite, toggleFavourite] = useState(false);
    const navigation = useNavigation();
    const [person, setPerson] = useState({});
    const [personMovies, setPersonMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true);
        getPersonDetails(item.id);
        getPersonMovies(item.id);
    },[item]);

    const getPersonDetails = async id=>{
        const data = await fetchPersonDetails(id);
        console.log('got person details');
        setLoading(false);
        if(data) {
            setPerson(data);
        }
    }
    const getPersonMovies = async id=>{
        const data = await fetchPersonMovies(id);
        console.log('got person movies')
        if(data && data.cast){
            setPersonMovies(data.cast.filter(item => item.genre_ids.includes(27)));
        }

    }

  return (
    <ScrollView style={{ ...styles.background, backgroundColor: horrorTheme.background}}
        className="flex-1 bg-neutral-900" 
        contentContainerStyle={{paddingBottom: 20}}>
        {/* back button */}
        <SafeAreaView 
            className={"flex-row justify-between items-center mx-4 z-10 "+verticalMargin}>
            <TouchableOpacity style={styles.background} className="rounded-xl p-1" onPress={()=> navigation.goBack()}>
                <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> toggleFavourite(!isFavourite)}>
                <StarIcon size="35" color={isFavourite? theme.background: 'white'} />
            </TouchableOpacity>
        </SafeAreaView>

        {/* person details */}
        {
            loading? (
                <Loading />
            ):(
                <View style={{ ...styles.background, backgroundColor: horrorTheme.background}} >
                    <View 
                        className="flex-row justify-center"
                        style={{
                            shadowColor: '#cc2b2b',
                            shadowRadius: 27,
                            shadowOffset: {width: 0, height: 0},
                            shadowOpacity: .5,
                        }}
                    >
                        <View 
                        className="items-center rounded-full overflow-hidden h-72 w-72 border-neutral-800 border-2">
                            <Image
                                // source={require('../assets/images/castImage2.png')}
                                source={{uri: image342(person?.profile_path) || fallbackPersonImage}}
                                style={{height: height*0.43, width: width*0.74}}
                            />
                        </View>
                    </View>
                    <View className="mt-6">
                        <Text className="text-3xl text-white font-bold text-center">
                            {/* Keanu Reeves */}
                            {person?.name}
                        </Text>
                        <Text className="text-neutral-500 text-base text-center">
                            {person?.place_of_birth}
                            {/* Beirut, Lebanon */}
                        </Text>
                    </View>
                    <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-800 rounded-full ">
                        <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-semibold ">Gender</Text>
                            <Text className="text-neutral-300 text-sm">
                                {/* Male */}
                                {
                                    person?.gender==1? 'Female': 'Male'
                                }
                            </Text>
                        </View>
                        <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-semibold">Birthday</Text>
                            <Text className="text-neutral-300 text-sm">
                                {/* 1964-09-02 */}
                                {person?.birthday}
                            </Text>
                        </View>
                        <View className="border-r-2 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-semibold">known for</Text>
                            <Text className="text-neutral-300 text-sm">
                                {/* Acting */}
                                {person?.known_for_department}
                            </Text>
                        </View>
                        <View className="px-2 items-center">
                            <Text className="text-white font-semibold">Popularity</Text>
                            <Text className="text-neutral-300 text-sm">
                                {/* 84.23 % */}
                                {person?.popularity?.toFixed(2)} %
                            </Text>
                        </View>
                    </View>
                    <View className="my-6 mx-4 space-y-2">
                        <Text className="text-white text-lg">Biography 👻</Text>
                        <Text className="text-neutral-400 tracking-wide">
                            {
                                person?.biography? person.biography : 'N/A'
                            }
                        </Text>
                    </View>

                    {/* person movies */}
                    { person?.id && personMovies.length>0 && <MovieList title="Movies 🎞️" hideSeeAll={true} data={personMovies} /> }
                </View>
            )
        }
    </ScrollView>
  )
}