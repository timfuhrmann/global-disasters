import React, { useEffect, useState } from "react";
import { GlobeRenderer } from "../lib/globe";
import { Overview } from "./Overview";
import { useRouter } from "next/router";

export interface GlobeProps {
    features: Api.Feature[];
}

export const Globe: React.FC<GlobeProps> = ({ features }) => {
    const router = useRouter();
    const { sequence } = router.query;
    const [featureCollection, setFeatureCollection] = useState<Api.Feature[]>(features);
    const [mounted, setMounted] = useState<boolean>(false);
    const [renderer, setRenderer] = useState<GlobeRenderer | null>(null);
    const [activePosition, setActivePosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        const globe = new GlobeRenderer({
            mounted: () => {
                setMounted(true);
            },
        });

        setRenderer(globe);

        return () => {
            globe.destroy();
            setActivePosition(null);
            setMounted(false);
        };
    }, [features]);

    useEffect(() => {
        if (!renderer || !activePosition) {
            return;
        }

        renderer.toCoords(activePosition);
    }, [renderer, activePosition]);

    useEffect(() => {
        if (!renderer || !mounted || !sequence || typeof sequence !== "string") {
            return;
        }

        renderer.startSequence(parseInt(sequence, 10));
        renderer.setFeatures(featureCollection);
    }, [renderer, mounted, sequence]);

    useEffect(() => {
        if (!renderer || !sequence || typeof sequence !== "string") {
            return;
        }

        console.log("haha");
        renderer.setFeatures(featureCollection);
    }, [featureCollection]);

    if (!sequence) return null;

    return (
        <Overview
            features={features}
            onSelect={pos => setActivePosition(pos)}
            updateResults={setFeatureCollection}
        />
    );
};
