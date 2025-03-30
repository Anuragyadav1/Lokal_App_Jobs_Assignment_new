import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { BookmarkProvider } from "./src/context/BookmarkContext";

export default function App() {
  return (
    <BookmarkProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </BookmarkProvider>
  );
}
