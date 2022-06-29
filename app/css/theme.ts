export const theme = {
    //region Color
    black: "#000",
    white: "#fff",
    body: "#143040",
    blue: "#3875d6",
    darkBlue: "#3548cc",
    green: "#35CCAF",
    orange: "#BFBB28",
    red: "#BF4E56",
    //endregion

    //region Breakpoints
    bp: {
        m: "screen and (min-width: 768px)",
        l: "screen and (min-width: 1024px)",
        xl: "screen and (min-width: 1340px)",
        xxl: "screen and (min-width: 2000px)",
    },
    //endregion
};

type Theme = typeof theme;

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}
