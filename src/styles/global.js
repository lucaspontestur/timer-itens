
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif; 
    background-color: #121212; 
    color: #fff; 
  }

  h1, h2, h3, p { 
    margin: 0;
  }

  a { 
    color: inherit; 
    text-decoration: none;
  }
`;