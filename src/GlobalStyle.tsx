import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html, body, h1, a{
        margin:0;
        padding:0;
        overflow: hidden;
    }
    a{
        text-decoration: none;
    }
`;
