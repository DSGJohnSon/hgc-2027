export type Game = {
    id: string;
    name: string;
    blockType: "text" | "block";
    bgType?: "color" | "gradient";
    color1?: string;
    color2?: string;
    logo?: string;
    img?: string;
    bgImg?: string;
}