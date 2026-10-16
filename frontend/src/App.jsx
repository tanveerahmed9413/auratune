import AppRoutes from "./app.Routes";
import AuthProvider from "./features/auth/auth.context";
import { HomeProvider } from "./features/home/home.context";

const App = () => (
  <AuthProvider>
    <HomeProvider>
      <AppRoutes />
    </HomeProvider>
  </AuthProvider>
);

export default App;
