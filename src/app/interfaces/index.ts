export interface PopupInterface {
    onClose: () => void;
    explorerLink: string;
    title: string;
    subTitle: string;
  }

  export interface PoolData {
    collId: string;
    tswapUnsupported: boolean;
    escrowBalance: string;
    marginBalance: string | null;
    version: number;
    address: string;
    whitelistAddress: string;
    poolType: "TOKEN" | string;
    curveType: "EXPONENTIAL" | string;
    startingPrice: string;
    delta: string;
    mmFeeBps: string | null;
    createdUnix: string;
    ownerAddress: string;
    solEscrowAddress: string;
    takerSellCount: number;
    takerBuyCount: number;
    nftsHeld: number;
    slot: string;
    createdAt: string;
    updatedAt: string;
    currentActive: boolean;
    nftAuthorityAddress: string;
    statsAccumulatedMmProfit: string;
    statsTakerBuyCount: number;
    statsTakerSellCount: number;
    frozenAmount: string | null;
    frozenTime: string | null;
    isCosigned: boolean;
    lastTransactedAt: string;
    margin: string | null;
    orderType: number;
    maxTakerSellCount: number;
    balance: string;
    mmCompoundFees: boolean;
    currentBuyPrice: string;
    currentSellPrice: string;
    nftsForSale: any[];
    buyNowPrice: string | null;
    sellNowPrice: string | null;
    solBalance: string;
    marginNr: string | null;
  }
  
  export type NFTDetailsModalProps = {
    nft: any;
    onClose: () => void;
  };

  interface NFTAttribute {
    value: string;
    trait_type: string;
  }
  
  interface NFTFile {
    type: string;
    uri: string;
  }
  
  interface NFTListing {
    price: string | null;
    txId: string;
    seller: string | null;
    source: string;
    blockNumber: string;
    priceUnit: string | null;
  }
  
  interface NFTLastSale {
    price: string;
    priceUnit: string;
    txAt: string;
  }
  
  export interface PriceDetails {
    onchainId: string;
    attributes: NFTAttribute[];
    imageUri: string;
    lastSale: NFTLastSale;
    metadataFetchedAt: string;
    metadataUri: string;
    files: NFTFile[];
    animationUri: string | null;
    name: string;
    rarityRankTT: number;
    rarityRankTTStat: number;
    rarityRankHrtt: number;
    rarityRankStat: number;
    sellRoyaltyFeeBPS: number;
    tokenEdition: string | null;
    tokenStandard: string;
    hidden: boolean;
    compressed: boolean;
    verifiedCollection: string;
    owner: string;
    inscription: string | null;
    tokenProgram: string;
    metadataProgram: string;
    transferHookProgram: string | null;
    listingNormalizedPrice: string | null;
    hybridAmount: string | null;
    listing: NFTListing;
    slugDisplay: string;
    collId: string;
    collName: string;
    numMints: number;
  }

  export interface TokenInfo {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    tags: string[];
    daily_volume: number;
  }

  export interface Price {
    rate: number;
    currency: string;
    logo?: string;
  }
  
  
  