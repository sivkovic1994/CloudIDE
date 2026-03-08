import { AuthProvider, useAuth } from "./context/AuthProvider";
import EditorWithControls from "./components/EditorWithControls";
import AuthPage from "./components/AuthPage";

function AppContent() {
  const { user, loading, showAuth, setShowAuth } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#1e1e1e", color: "#fff" }}>
        Loading...
      </div>
    );
  }

  if (showAuth && !user) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  return <EditorWithControls />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;