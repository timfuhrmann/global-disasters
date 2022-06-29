import React from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import { GlobeProps } from "../app/components/Globe";
import { Hero } from "../app/components/Hero";
import { fetchEvents } from "../app/lib/api";

const Globe = dynamic<GlobeProps>(() => import("../app/components/Globe").then(mod => mod.Globe), {
    ssr: false,
});

const HomeTemplate = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

interface HomeProps {
    features: Api.Feature[];
}

const Home: React.FC<HomeProps> = ({ features }) => {
    return (
        <HomeTemplate>
            <Hero />
            <Globe features={features} />
        </HomeTemplate>
    );
};

export const getStaticProps: GetServerSideProps = async () => {
    const features = await fetchEvents();

    return {
        props: { features: features || [] },
        revalidate: 60 * 5, // 5 minutes
    };
};

export default Home;
