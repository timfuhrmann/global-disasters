declare module Api {
    type Event = "EQ" | "TC" | "VO" | "FL" | "DR" | "WF";

    interface Url {
        geometry: string;
        report: string;
        details: string;
    }

    interface Properties {
        eventtype: Event;
        eventid: number;
        episodeid: number;
        name: string;
        description: string;
        htmldescription: string;
        alertscore: 1 | 2 | 3;
        istemporary: boolean;
        iscurrent: boolean;
        country: string;
        formdate: string;
        todate: string;
        iso3: string;
        icon: string;
        url: Url;
    }

    interface Geometry {
        type: string;
        coordinates: [number, number];
    }

    interface Feature {
        type: "Feature";
        geometry: Geometry;
        bbox: [number, number, number, number];
        properties: Properties;
        eventType: Api.Event;
    }

    interface FeatureCollection {
        type: "FeatureCollection";
        features: Feature[];
    }
}
