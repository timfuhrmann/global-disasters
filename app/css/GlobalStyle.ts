import { createGlobalStyle } from "styled-components";
import { reset } from "./reset";
import { label } from "./label";

export const GlobalStyle = createGlobalStyle`
    ${reset};
    ${label};
    
    body {
        font-family: "Circular Std", Helvetica, Arial, sans-serif;
        background-color: ${p => p.theme.body};
        color: ${p => p.theme.white};
    }
    
    canvas {
        position: relative;
        z-index: 1;
    }

    .label {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        pointer-events: none;
        transition: opacity 0.25s;
        will-change: opacity, transform;
        backface-visibility: hidden;
    }
    
    @keyframes fade-in {
        100% {
            opacity: 1;
        }
    }
`;
