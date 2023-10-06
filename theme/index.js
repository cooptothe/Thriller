import { StyleSheet } from 'react-native';

export const theme = {
   background: '#cc2b2b',
   text: '#cc2b2b',
   accent: '#8B0000', // Dark red accent color
}
export const styles = StyleSheet.create({
   text: {
     color: theme.text,
     textShadowColor: theme.accent,
     textShadowOffset: { width: 5, height: 5 },
     textShadowRadius: 12,
   },
   background: {
     backgroundColor: theme.background,
   },
 });

