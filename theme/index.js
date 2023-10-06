import { StyleSheet } from 'react-native';

export const theme = {
   background: '#FF4040',
   text: '#FF4040',
   accent: '#8B0000', // Dark red accent color
}
export const styles = StyleSheet.create({
   text: {
     color: theme.text,
     fontFamily: 'horror-type',
     textShadowColor: theme.accent,
     textShadowOffset: { width: 5, height: 5 },
     textShadowRadius: 12,
   },
   background: {
     backgroundColor: theme.background,
   },
 });

