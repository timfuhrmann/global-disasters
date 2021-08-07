import ReactDOM from "react-dom";
import { Vector3 } from "three";
import { Marker } from "../../../components/Marker";

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
    div.style.opacity = "0";
    div.className = "label";

    ReactDOM.render(<Marker feature={feature} />, div);

    document.body.appendChild(div);
    return div;
};
