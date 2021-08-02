const events: Api.Event[] = ["EQ", "TC", "VO", "FL", "DR", "WF"];

export const eventMap: Record<Api.Event, string> = {
    EQ: "Earthquakes",
    TC: "Tropical Cyclones",
    VO: "Volcanoes",
    FL: "Floods",
    DR: "Droughts",
    WF: "Forest Fires",
};

const db = async <T>(path: string): Promise<T | null> => {
    const res = await fetch("https://www.gdacs.org/gdacsapi/api" + path);
    if (!res.ok) return null;
    return res.json();
};

export const fetchEventsByType = async (type: Api.Event): Promise<Api.Feature[] | null> => {
    const res = await db<Api.FeatureCollection>(`/events/geteventlist/MAP?eventtypes=${type}`);

    if (!res) {
        return null;
    }

    return res.features
        .filter(feature => feature.geometry.type.toLowerCase() === "point")
        .map(feature => {
            return {
                ...feature,
                eventType: type,
            };
        });
};

export const fetchEvents = async () => {
    const requests = events.map(eventType => {
        return fetchEventsByType(eventType);
    });

    const res = await Promise.all(requests);
    const featuresCollection = res.filter(event => event !== null) as Api.Feature[][];

    return Array.prototype.concat.apply([], featuresCollection);
};
