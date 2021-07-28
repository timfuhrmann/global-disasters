import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { gsap } from "gsap";

const HeroWrapper = styled.div<{ active: boolean }>`
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    opacity: ${p => (p.active ? 1 : 0)};
    pointer-events: ${p => (p.active ? "auto" : "none")};
    transition: opacity 0.5s;
    will-change: opacity;
`;

const HeroInner = styled.div`
    text-align: center;
`;

const HeroOverline = styled.div`
    font-size: 2rem;
    text-transform: uppercase;
    margin-bottom: 2rem;
    letter-spacing: -0.05rem;
`;

const HeroHeadline = styled.h1`
    font-size: 10rem;
    font-weight: 600;
    letter-spacing: -0.3rem;
    line-height: 1;
    margin-bottom: 2rem;
`;

const HeroText = styled.div`
    font-size: 3rem;
    letter-spacing: -0.1rem;
    line-height: 1.2;
    margin-bottom: 4rem;
`;

const HeroButton = styled.button`
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: -0.05rem;
    background-color: ${p => p.theme.white};
    color: ${p => p.theme.black};
    padding: 0 4rem;
    height: 6rem;
    border-radius: 3rem;
    transition: color 0.2s, background-color 0.2s;
    will-change: color, background-color;

    @media (hover: hover) {
        &:hover {
            background-color: ${p => p.theme.darkBlue};
            color: ${p => p.theme.white};
        }
    }
`;

const HeroGroup = styled.div`
    will-change: transform;
`;

export const Hero: React.FC = () => {
    const router = useRouter();
    const { sequence } = router.query;
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if (!ref.current) {
                return;
            }

            const { y, x } = ref.current.getBoundingClientRect();
            const a = (x - event.clientX) / 100;
            const b = (y - event.clientY) / 100;

            gsap.timeline().to(ref.current, {
                x: a,
                y: b,
                force3D: true,
            });
        };

        document.addEventListener("mousemove", onMouseMove);
    }, []);

    const handleClick = () => router.push({ query: { sequence: 1 } }, undefined, { shallow: true });

    return (
        <HeroWrapper active={!sequence || typeof sequence !== "string"}>
            <HeroInner>
                <HeroOverline>A historical overview</HeroOverline>
                <HeroGroup ref={ref}>
                    <HeroHeadline>Global disasters</HeroHeadline>
                    <HeroText>
                        As the global temperature is rising, catastrophes are emerging.
                        <br />
                        We need change, today.
                    </HeroText>
                </HeroGroup>
                <HeroButton onClick={handleClick}>Discover</HeroButton>
            </HeroInner>
        </HeroWrapper>
    );
};