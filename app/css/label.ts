import { css } from "styled-components";

export const label = css`
    .label {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        transition: opacity 0.25s;
        will-change: opacity, transform;
        backface-visibility: hidden;
    }
`;
