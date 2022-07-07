import { ethers } from "ethers";
export function unit18(value:number){
    return ethers.utils.formatUnits(value, 18);
}