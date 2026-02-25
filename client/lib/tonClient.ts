import { TonClient, Address, beginCell, toNano } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';

const NETWORK = process.env.NEXT_PUBLIC_TON_NETWORK || 'testnet';

let clientInstance: TonClient | null = null;

export async function getTonClient(): Promise<TonClient> {
  if (clientInstance) return clientInstance;
  
  const endpoint = await getHttpEndpoint({
    network: NETWORK as 'mainnet' | 'testnet',
  });
  
  clientInstance = new TonClient({ endpoint });
  return clientInstance;
}

export function formatTonAmount(amount: string | bigint): string {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  const tons = Number(value) / 1e9;
  return tons.toFixed(2);
}

export function toNanoAmount(tons: number | string): bigint {
  return toNano(tons.toString());
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Build Jetton transfer message body
export function buildJettonTransferBody(params: {
  toAddress: string;
  jettonAmount: bigint;
  forwardAmount?: bigint;
  forwardPayload?: string;
  responseAddress?: string;
  queryId?: number;
}) {
  const {
    toAddress,
    jettonAmount,
    forwardAmount = BigInt(0),
    forwardPayload,
    responseAddress,
    queryId = 0,
  } = params;

  let body = beginCell()
    .storeUint(0xf8a7ea5, 32) // op: transfer
    .storeUint(queryId, 64)
    .storeCoins(jettonAmount)
    .storeAddress(Address.parse(toAddress))
    .storeAddress(responseAddress ? Address.parse(responseAddress) : null)
    .storeBit(false) // custom_payload
    .storeCoins(forwardAmount);

  if (forwardPayload) {
    body = body.storeBit(true).storeRef(
      beginCell().storeUint(0, 32).storeStringTail(forwardPayload).endCell()
    );
  } else {
    body = body.storeBit(false);
  }

  return body.endCell();
}

// Get Jetton wallet address for a user
export async function getJettonWalletAddress(
  jettonMasterAddress: string,
  ownerAddress: string
): Promise<string> {
  const client = await getTonClient();
  const jettonMaster = Address.parse(jettonMasterAddress);
  const owner = Address.parse(ownerAddress);

  const result = await client.runMethod(
    jettonMaster,
    'get_wallet_address',
    [
      {
        type: 'slice',
        cell: beginCell().storeAddress(owner).endCell(),
      },
    ]
  );

  return result.stack.readAddress().toString();
}

// Get Jetton balance for a wallet
export async function getJettonBalance(
  jettonWalletAddress: string
): Promise<bigint> {
  try {
    const client = await getTonClient();
    const address = Address.parse(jettonWalletAddress);
    
    const result = await client.runMethod(
      address,
      'get_wallet_data'
    );
    
    return result.stack.readBigNumber();
  } catch (error) {
    console.error('Error getting jetton balance:', error);
    return BigInt(0);
  }
}
