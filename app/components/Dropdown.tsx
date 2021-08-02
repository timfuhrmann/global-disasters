import React, { useState } from "react";
import { Facets } from "../lib/filter";
import styled from "styled-components";
import { ChevronBottom } from "../icon/ChevronBottom";
import { Check } from "../icon/Check";

const DropdownWrapper = styled.div`
    position: relative;
`;

const DropdownHead = styled.button`
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: ${p => p.theme.white};
    color: ${p => p.theme.body};
    border-radius: 1rem;
    line-height: 1;
`;

const DropdownOptionsWrapper = styled.div`
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    transform: translateY(100%);
    padding-top: 1rem;
`;

const DropdownOptions = styled.div`
    color: ${p => p.theme.body};
    background-color: ${p => p.theme.white};
    border-radius: 1rem;
`;

const DropdownOption = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    width: 100%;
    border-top: 0.1rem solid ${p => p.theme.body};

    &:first-child {
        border: none;
    }
`;

const IconChevron = styled(ChevronBottom)<{ $active?: boolean }>`
    width: 1.4rem;
    height: 1.4rem;
    margin-left: 0.8rem;
    transform: ${p => p.$active && "rotate(180deg)"};
`;

const IconCheck = styled(Check)<{ $active: boolean }>`
    width: 1.4rem;
    height: 1.4rem;
    margin-left: 1rem;
    opacity: ${p => (p.$active ? 1 : 0)};
`;

interface DropdownProps {
    title: string;
    options: Facets;
    onSelect: (key: string, value: string) => void;
    activeOptions: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({ title, options, onSelect, activeOptions }) => {
    const [active, setActive] = useState<boolean>(false);

    return (
        <DropdownWrapper>
            <DropdownHead type="button" onClick={() => setActive(prevState => !prevState)}>
                {title}
                <IconChevron $active={active} />
            </DropdownHead>
            {active && (
                <DropdownOptionsWrapper>
                    <DropdownOptions>
                        {Object.keys(options).map(key => (
                            <DropdownOption
                                key={key}
                                onClick={() => {
                                    setActive(false);
                                    onSelect(key, options[key]);
                                }}>
                                {options[key]}
                                <IconCheck $active={activeOptions.includes(key)} />
                            </DropdownOption>
                        ))}
                    </DropdownOptions>
                </DropdownOptionsWrapper>
            )}
        </DropdownWrapper>
    );
};
