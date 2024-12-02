// src/App.tsx
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import GoBoard from './components/GoBoard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GoBoard />
    </ThemeProvider>
  );
}

export default App;
