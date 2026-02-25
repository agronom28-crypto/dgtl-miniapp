const { TonClient, WalletContractV4, internal, toNano, fromNano, Address, beginCell } = require('@ton/ton');
const { mnemonicToPrivateKey } = require('@ton/crypto');
require('dotenv').config();

// TON Network configuration
const IS_TESTNET = process.env.TON_NETWORK === 'testnet';
const TONCENTER_API_URL = IS_TESTNET
  ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
  : 'https://toncenter.com/api/v2/jsonRPC';

// Jetton contract addresses
const JETTON_MASTER_ADDRESS = process.env.JETTON_MASTER_ADDRESS || '';

let tonClient = null;
let wallet = null;
let walletContract = null;

/**
 * Initialize TON client and wallet
 */
async function initTonClient() {
  try {
    // Create TON client
    tonClient = new TonClient({
      endpoint: TONCENTER_API_URL,
      apiKey: process.env.TONCENTER_API_KEY || undefined,
    });

    // Initialize wallet from mnemonic
    const mnemonic = process.env.TON_WALLET_MNEMONIC;
    if (!mnemonic) {
      console.warn('[TON Client] Warning: TON_WALLET_MNEMONIC not set. Withdrawal functionality will be disabled.');
      return null;
    }

    const mnemonicArray = mnemonic.split(' ');
    const keyPair = await mnemonicToPrivateKey(mnemonicArray);

    wallet = WalletContractV4.create({
      publicKey: keyPair.publicKey,
      workchain: 0,
    });

    walletContract = tonClient.open(wallet);

    console.log(`[TON Client] Initialized. Network: ${IS_TESTNET ? 'testnet' : 'mainnet'}`);
    console.log(`[TON Client] Wallet address: ${wallet.address.toString()}`);

    return { tonClient, wallet, walletContract, keyPair };
  } catch (error) {
    console.error('[TON Client] Initialization error:', error.message);
    return null;
  }
}

/**
 * Get TON client instance
 */
function getClient() {
  return tonClient;
}

/**
 * Get wallet instance
 */
function getWallet() {
  return wallet;
}

/**
 * Get wallet contract instance
 */
function getWalletContract() {
  return walletContract;
}

/**
 * Get balance of a TON address
 */
async function getBalance(address) {
  try {
    if (!tonClient) {
      throw new Error('TON client not initialized');
    }
    const balance = await tonClient.getBalance(Address.parse(address));
    return fromNano(balance);
  } catch (error) {
    console.error('[TON Client] getBalance error:', error.message);
    throw error;
  }
}

/**
 * Get Jetton wallet address for a given owner
 */
async function getJettonWalletAddress(ownerAddress) {
  try {
    if (!tonClient || !JETTON_MASTER_ADDRESS) {
      throw new Error('TON client or Jetton master address not configured');
    }

    const jettonMaster = Address.parse(JETTON_MASTER_ADDRESS);
    const owner = Address.parse(ownerAddress);

    // Call get_wallet_address on Jetton master
    const result = await tonClient.runMethod(
      jettonMaster,
      'get_wallet_address',
      [{ type: 'slice', cell: beginCell().storeAddress(owner).endCell() }]
    );

    return result.stack.readAddress();
  } catch (error) {
    console.error('[TON Client] getJettonWalletAddress error:', error.message);
    throw error;
  }
}

/**
 * Send Jetton tokens to a recipient
 * @param {string} recipientAddress - TON address of the recipient
 * @param {string} jettonAmount - Amount of jettons to send (in base units)
 * @param {object} keyPair - Wallet key pair
 */
async function sendJettons(recipientAddress, jettonAmount, keyPair) {
  try {
    if (!tonClient || !walletContract) {
      throw new Error('TON client not initialized');
    }

    // Get our Jetton wallet address
    const senderJettonWallet = await getJettonWalletAddress(
      wallet.address.toString()
    );

    // Build Jetton transfer message body
    const forwardPayload = beginCell()
      .storeUint(0, 32) // op = 0 (text comment)
      .storeStringTail('DGTL Withdrawal')
      .endCell();

    const jettonTransferBody = beginCell()
      .storeUint(0xf8a7ea5, 32) // op: jetton transfer
      .storeUint(0, 64) // query_id
      .storeCoins(BigInt(jettonAmount)) // amount of jettons
      .storeAddress(Address.parse(recipientAddress)) // destination
      .storeAddress(wallet.address) // response_destination
      .storeBit(0) // no custom payload
      .storeCoins(toNano('0.01')) // forward_ton_amount
      .storeBit(1) // forward payload as ref
      .storeRef(forwardPayload)
      .endCell();

    // Get current seqno
    const seqno = await walletContract.getSeqno();

    // Send the transaction
    await walletContract.sendTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          to: senderJettonWallet,
          value: toNano('0.05'), // gas for jetton transfer
          body: jettonTransferBody,
        }),
      ],
    });

    console.log(`[TON Client] Jetton transfer sent. Seqno: ${seqno}`);

    // Wait for transaction confirmation
    let currentSeqno = seqno;
    let attempts = 0;
    const maxAttempts = 30;

    while (currentSeqno === seqno && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        currentSeqno = await walletContract.getSeqno();
      } catch (e) {
        // Ignore errors during polling
      }
      attempts++;
    }

    if (currentSeqno > seqno) {
      console.log(`[TON Client] Transaction confirmed. New seqno: ${currentSeqno}`);
      return { success: true, seqno: currentSeqno };
    } else {
      console.warn('[TON Client] Transaction may not have been confirmed within timeout');
      return { success: false, seqno, message: 'Transaction timeout' };
    }
  } catch (error) {
    console.error('[TON Client] sendJettons error:', error.message);
    throw error;
  }
}

module.exports = {
  initTonClient,
  getClient,
  getWallet,
  getWalletContract,
  getBalance,
  getJettonWalletAddress,
  sendJettons,
  IS_TESTNET,
};
