import { Vector3 } from "three";
import { EQ, IconMarker } from "../../Icon";

export const positions = [
    {
        camera: {
            z: 75,
        },
        obj: {
            y: -100,
        },
    },
    {
        camera: {
            z: 200,
        },
        obj: {
            y: 0,
        },
    },
];

export const latLonToRad = (lat: number, lon: number, radius: number): Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new Vector3(x, y, z);
};

export const createLabel = (feature: Api.Feature): HTMLDivElement => {
    const div = document.createElement("div");
    div.className = "label";
    div.style.opacity = "0";

    switch (feature.properties.alertscore) {
        case 1:
            div.classList.add("is-green");
            break;
        case 2:
            div.classList.add("is-orange");
            break;
        case 3:
            div.classList.add("is-red");
            break;
    }

    const marker = document.createElement("svg");
    marker.innerHTML = IconMarker;
    marker.className = "marker";
    div.appendChild(marker);

    const type = document.createElement("svg");
    type.innerHTML = EQ;
    type.className = "type";
    marker.appendChild(type);

    document.body.appendChild(div);
    return div;
};
