import "./App.css";
import AppRoutes from "./app.Routes";
import AuthProvider from "./features/auth/auth.context";
import { HomeProvider } from "./features/home/home.context";

function App() {
  return (
    <div>
      <AuthProvider>
        <HomeProvider>
          <AppRoutes />
        </HomeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
