import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { fallbackMoviePoster, image185, searchMovies } from '../api/moviedb'
import { debounce } from 'lodash'
import Loading from '../components/loading'
import { LinearGradient } from 'expo-linear-gradient'

const {width, height} =  Dimensions.get('window');

const horrorTheme = {
    background: '#000000', // Black background
    text: '#FF0000', // Blood red text color
    accent: '#8B0000' // Dark red accent color
  };

export default function SearchScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');  // New state to store the search term

    const handleSearch = search =>{
        setSearchTerm(search);  // Update the search term state
        if(search && search.length>2){
            setLoading(true);
            searchMovies({
                query: search,
                include_adult: false,
                language: 'en-US',
                page: '1'
            }).then(data=>{
                console.log('got search results');
                setLoading(false);
                if(data && data.results) setResults(data.results);
            })
        }else{
            setLoading(false);
            setResults([])
        }
      }
    
    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);    

  return (
    <SafeAreaView style={{ backgroundColor: horrorTheme.background, flex: 1 }}>
        {/* search input */}
        <View 
            className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-700 rounded-full" >
            <TextInput 
                onChangeText={handleTextDebounce} 
                placeholder="Search Movie" 
                placeholderTextColor={'gray'} 
                style={{ padding: 10, flex: 1, fontSize: 16, color: 'white', marginLeft: 10 }}
                value={searchTerm} 
            />
            <TouchableOpacity 
                onPress={()=> navigation.navigate('Home')}
                className="rounded-full p-3 m-1 bg-neutral-700" 
            >
                <XMarkIcon size="10" color="white" />

            </TouchableOpacity>
        </View>

        {/* search results */}
        {
            loading? (
                <Loading />
            ):
            results.length>0? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal:15}}
                    className="space-y-3"
                >
                    <Text className="text-white font-semibold ml-1">Results ({results.filter(item => item.genre_ids.includes(27)).length})</Text>
                    <View className="flex-row justify-between flex-wrap">
                        {
                            results
                            .filter(item => item.genre_ids.includes(27))
                            .map((item, index)=>{
                                return (
                                    <TouchableWithoutFeedback
                                        key={index}
                                        onPress={()=> navigation.push('Movie', item)}>
                                        <View className="space-y-2 mb-4">
                                            <Image
                                                source={{uri: image185(item.poster_path) || fallbackMoviePoster}}
                                                // source={require('../assets/images/moviePoster2.png')}
                                                className="rounded-3xl"
                                                style={{ width: width*0.44, height: height*0.3}}
                                            />
                                            <Text className="text-gray-300 ml-1">
                                                {
                                                    item.title.length>22? item.title.slice(0,22)+'...': item.title
                                                }
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            ):(
                <View className="absolute bottom-0 flex-row justify-center ">
                <Image
                  style={{
                    width: 444,
                    height: 844,
                    top: 37,
                    borderRadius: 33,
                    borderWidth: 2,
                    borderColor: 'rgba(0, 0, 0, 1)',
                  }}
                  source={require('../assets/images/movieTime.png')}
                />
                 <LinearGradient
                        colors={['transparent', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 5)']}
                        style={{width: width*1.2, height: height*0.20, top: 30,}}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                        className="absolute bottom-80"
                />
                <LinearGradient
                        colors={['transparent', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 5)']}
                        style={{width: width*1.2, height: height*0.20}}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        className="absolute bottom-0"
                    />
                </View>
            )
        }
    </SafeAreaView>
  )
}