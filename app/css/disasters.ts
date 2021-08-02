import styled from "styled-components";
import { EQ } from "../icon/EQ";
import { TC } from "../icon/TC";
import { DR } from "../icon/DR";
import { WF } from "../icon/WF";
import { VO } from "../icon/VO";
import { FL } from "../icon/FL";

export const IconEQ = styled(EQ)`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    color: #fff;
`;

export const IconTC = styled(TC)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 125%;
    color: #fff;
`;

export const IconDR = styled(DR)`
    position: absolute;
    top: 0.05rem;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    color: #fff;
`;

export const IconWF = styled(WF)`
    position: absolute;
    top: 0.25rem;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    color: #fff;
`;

export const IconVO = styled(VO)`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150%;
    color: #fff;
`;

export const IconFL = styled(FL)`
    position: absolute;
    top: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 115%;
    color: #fff;
`;
