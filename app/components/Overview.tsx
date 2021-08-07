import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Dropdown } from "./Dropdown";
import { useFilter } from "../lib/filter";
import { Close } from "../icon/Close";
import { Menu } from "../icon/Menu";

const OverviewWrapper = styled.div`
    position: fixed;
    z-index: 2;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

const OverviewButton = styled.button`
    position: absolute;
    z-index: 1;
    top: 4rem;
    right: 4rem;
    pointer-events: auto;
`;

const OverviewFrame = styled.div<{ active: boolean }>`
    position: absolute;
    top: 0;
    left: 100%;
    height: 100%;
    width: 30%;
    max-width: 50rem;
    padding: 10rem 4rem 0;
    border-left: 0.1rem solid ${p => p.theme.white};
    transform: ${p => p.active && "translate3d(-100%, 0, 0)"};
    transition: transform 0.3s;
    will-change: transform;
    pointer-events: auto;
`;

const OverviewInner = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

const OverviewList = styled.div`
    flex: 1;
    overflow-y: auto;
    margin-top: 2rem;
    padding-bottom: 4rem;
    border-top: 0.1rem solid ${p => p.theme.white};

    &::-webkit-scrollbar {
        display: none;
    }
`;

const OverviewItem = styled.button`
    display: block;
    width: 100%;
    border-top: 0.1rem solid ${p => p.theme.white};

    &:first-child {
        border: none;
    }
`;

const OverviewItemInner = styled.div`
    padding: 1.5rem 0;
    transition: transform 0.2s;
    will-change: transform;

    @media (hover: hover) {
        &:hover {
            transform: translate3d(1rem, 0, 0);
        }
    }
`;

const OverviewChips = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
`;

const OverviewChip = styled.button`
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    padding: 0.75rem 1.5rem;
    border: 0.1rem solid ${p => p.theme.white};
    border-radius: 5rem;
    background-color: ${p => p.theme.white};
    color: ${p => p.theme.body};
`;

const IconRemove = styled(Close)`
    width: 1.4rem;
    height: 1.4rem;
    margin-left: 0.4rem;
`;

const IconClose = styled(Close)`
    width: 2.4rem;
    height: 2.4rem;
`;

const IconMenu = styled(Menu)`
    width: 2.4rem;
    height: 2.4rem;
`;

interface OverviewProps {
    features: Api.Feature[];
    onSelect: (pos: [number, number]) => void;
    updateResults: (features: Api.Feature[]) => void;
}

export const Overview: React.FC<OverviewProps> = ({ features, onSelect, updateResults }) => {
    const { facets, handleSelect, results, selectedFacets } = useFilter(features);
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => {
        updateResults(results);
    }, [results]);

    const handleClick = (feature: Api.Feature) => {
        onSelect(feature.geometry.coordinates);
    };

    if (!features || features.length === 0) return null;

    return (
        <OverviewWrapper>
            <OverviewButton type="button" onClick={() => setActive(prevState => !prevState)}>
                {active ? <IconClose /> : <IconMenu />}
            </OverviewButton>
            <OverviewFrame active={active}>
                <OverviewInner>
                    <Dropdown
                        title="Hazards"
                        options={facets}
                        onSelect={handleSelect}
                        activeOptions={Object.keys(selectedFacets)}
                    />
                    <OverviewChips>
                        {Object.keys(selectedFacets).map(facetKey => (
                            <OverviewChip
                                key={facetKey}
                                onClick={() => handleSelect(facetKey, selectedFacets[facetKey])}>
                                {selectedFacets[facetKey]}
                                <IconRemove />
                            </OverviewChip>
                        ))}
                    </OverviewChips>
                    <OverviewList>
                        {results.length > 0 ? (
                            results.map(feature => (
                                <OverviewItem
                                    key={feature.properties.eventid}
                                    onClick={() => handleClick(feature)}>
                                    <OverviewItemInner>
                                        {feature.properties.description}
                                    </OverviewItemInner>
                                </OverviewItem>
                            ))
                        ) : (
                            <div>No hazards found</div>
                        )}
                    </OverviewList>
                </OverviewInner>
            </OverviewFrame>
        </OverviewWrapper>
    );
};
