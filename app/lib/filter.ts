import { useEffect, useState } from "react";
import { eventMap } from "./api";

export type Facets = Record<string, string>;

export const useFilter = (features: Api.Feature[]) => {
    const [results, setResults] = useState<Api.Feature[]>(features);
    const [facets, setFacets] = useState<Facets>({});
    const [selectedFacets, setSelectedFacets] = useState<Facets>({});

    useEffect(() => {
        const options: Facets = {};

        features.forEach(feature => {
            const type = feature.eventType;

            if (!Object.keys(options).includes(type)) {
                options[type] = eventMap[type];
            }
        });

        setFacets(options);
    }, []);

    useEffect(() => {
        if (Object.keys(selectedFacets).length === 0) {
            setResults(features);
            return;
        }

        let finalResults: Api.Feature[] = [];

        Object.keys(selectedFacets).forEach(facetKey => {
            const hits = features.filter(feature => {
                return (
                    feature.eventType === facetKey &&
                    !finalResults.find(
                        item => item.properties.eventid === feature.properties.eventid
                    )
                );
            });

            finalResults = [...finalResults, ...hits];
        });

        setResults(finalResults);
    }, [selectedFacets]);

    const handleSelect = (key: string, value: string) => {
        const currentSelectedFacets = { ...selectedFacets };

        if (Object.keys(currentSelectedFacets).includes(key)) {
            delete currentSelectedFacets[key];
        } else {
            currentSelectedFacets[key] = value;
        }

        setSelectedFacets(currentSelectedFacets);
    };

    return {
        results,
        facets,
        selectedFacets,
        handleSelect,
    };
};
