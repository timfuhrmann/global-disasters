import { css } from "styled-components";

export const label = css`
    .label {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.75rem;
        transition: opacity 0.25s;
        will-change: opacity, transform;
        backface-visibility: hidden;

        .marker {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
        }

        .type {
            position: absolute;
            top: 0.25rem;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            color: ${p => p.theme.white};
        }

        &.is-green {
            .marker {
                color: ${p => p.theme.green};
            }
        }

        &.is-orange {
            .marker {
                color: ${p => p.theme.orange};
            }
        }

        &.is-red {
            .marker {
                color: ${p => p.theme.red};
            }
        }
    }
`;
