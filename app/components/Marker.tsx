import React from "react";
import styled from "styled-components";
import { IconEQ, IconFL, IconVO, IconDR, IconTC, IconWF } from "../css/disasters";

const MarkerWrapper = styled.div`
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    transform: translateY(calc(-100% - 1rem));
    display: flex;
    justify-content: center;
    align-items: center;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, calc(100% - 0.1rem));
        width: 0;
        height: 0;
        border-left: 0.8rem solid transparent;
        border-right: 0.8rem solid transparent;
        border-top: 1rem solid #fff;
    }
`;

const MarkerFrame = styled.div<{ $score: number }>`
    width: 3rem;
    height: 3rem;
    overflow: hidden;
    transform: translateZ(0);
    border: 0.1rem solid #fff;
    ${p => {
        switch (p.$score) {
            case 1:
                return `background-color: #35CCAF`;
            case 2:
                return `background-color: #BFBB28`;
            case 3:
                return `background-color: #BF4E56`;
        }
    }};
`;

interface MarkerProps {
    feature: Api.Feature;
}

export const Marker: React.FC<MarkerProps> = ({ feature }) => {
    const getIcon = () => {
        switch (feature.eventType) {
            case "EQ":
                return <IconEQ />;
            case "TC":
                return <IconTC />;
            case "DR":
                return <IconDR />;
            case "WF":
                return <IconWF />;
            case "VO":
                return <IconVO />;
            case "FL":
                return <IconFL />;
        }
    };

    return (
        <MarkerWrapper>
            <MarkerFrame $score={feature.properties.alertscore}>{getIcon()}</MarkerFrame>
        </MarkerWrapper>
    );
};
