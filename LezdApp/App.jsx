import { useState } from "react";
import AgeVerification from "./components/AgeVerification";
import Onboarding from "./components/Onboarding";
import MainApp from "./components/MainApp";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("age"); // age | onboarding | app

  return (
    <div className="app-root">
      {screen === "age" && <AgeVerification onAccept={() => setScreen("onboarding")} />}
      {screen === "onboarding" && <Onboarding onComplete={() => setScreen("app")} />}
      {screen === "app" && <MainApp />}
    </div>
  );
}
