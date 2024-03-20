export const chainAttrs = [

]


export const bscMainnetChainId = 56;
export const bscTestnetChainId = 97;
export const polygonMainnetChainId = 137;
export const polygonTestnetChainId = 80001;

export const tokenAddresses:{ [key: number]: any } = {
    [bscMainnetChainId]: `0x6eAbBB5c4FDA0033936d07Cf1A444e8816C009FC`,
    [bscTestnetChainId]: `0xb0ba56460DaD961A9b3198B051B136aFA3bb0DE0`,
    [polygonMainnetChainId]: `0x6F91acEEAE27e44aeD8d77970d021Fac1aeAACc4`,
    [polygonTestnetChainId]: `0xef1C1753Ef118612833fd5382581556E16d06F3E`,
};

export const contractAddresses:{ [key: number]: any }= {
    [bscMainnetChainId]: "0xb0f45cd0f21ED59dd0E4b1CA14FCCD78bBBAfEbF",
    [bscTestnetChainId]: "0x78F81BEbE4476D2296CDf195C9A2B77FbF2D24b0",
    [polygonMainnetChainId]: "0x9303B44d23d27eBA85ba71C81c0b075C2668FDF5",
    [polygonTestnetChainId]: "0x55D7176AcC7512375bceD9530d4631C3487bB9b0",
};

export const mintAddressess:  { [key: number]: any } = {
    [bscTestnetChainId]: "0x793ce5150e094cf02b202208b9B5681Bb20582Aa",
}

export const signContractAddresses: { [key: number]: any } = { 
    [bscTestnetChainId]: "0x709cB32AeB3b6EeD3c0ef68120864Dd5b93aBAdD"
}
export const decimals = {
    [bscMainnetChainId]: 9,
    [bscTestnetChainId]: 9,
    [polygonMainnetChainId]: 9,
    [polygonTestnetChainId]: 9,
};