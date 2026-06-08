import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "./src/theme";
import { SAMPLE_CARDS } from "./src/data";
import { HomeScreen } from "./src/screens/HomeScreen";
import { StudyScreen } from "./src/screens/StudyScreen";
import type { Deck, Card } from "./src/data";

type Screen =
  | { name: "home" }
  | { name: "study"; deck?: Deck; cards: Card[] };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  const handleStudyDeck = useCallback((deck: Deck) => {
    const cards = SAMPLE_CARDS.filter((c) => c.deckId === deck.id);
    setScreen({ name: "study", deck, cards });
  }, []);

  const handleStudyAll = useCallback(() => {
    setScreen({ name: "study", cards: SAMPLE_CARDS });
  }, []);

  const handleFinish = useCallback(() => {
    setScreen({ name: "home" });
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {screen.name === "home" && (
          <HomeScreen
            onStudyDeck={handleStudyDeck}
            onStudyAll={handleStudyAll}
          />
        )}
        {screen.name === "study" && (
          <StudyScreen
            deck={screen.deck}
            cards={screen.cards}
            onFinish={handleFinish}
          />
        )}
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
