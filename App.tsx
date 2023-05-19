import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToDo } from "./components/ToDo";

export default function App() {
  return (
    <SafeAreaProvider>
      <ToDo></ToDo>
    </SafeAreaProvider>
  );
}
