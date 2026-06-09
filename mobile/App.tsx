import { StyleSheet, View, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <View style={[styles.container]}>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
