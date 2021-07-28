import React from "react";
import styled from "styled-components";

const OverviewWrapper = styled.div`
    position: absolute;
    z-index: 2;
    right: 0;
    top: 0;
    width: 30%;
    max-width: 50rem;
    height: 100%;
`;

const OverviewInner = styled.div`
    padding: 2rem;
`;

interface OverviewProps {
    features?: any;
    onSelect: (pos: [number, number]) => void;
}

export const Overview: React.FC<OverviewProps> = ({ features, onSelect }) => {
    if (!features) return null;

    return (
        <OverviewWrapper>
            <OverviewInner>
                {features.map((feature: any) => (
                    <div
                        key={feature.properties.eventid}
                        onClick={() => onSelect(feature.geometry.coordinates)}>
                        {feature.properties.description}
                    </div>
                ))}
            </OverviewInner>
        </OverviewWrapper>
    );
};
