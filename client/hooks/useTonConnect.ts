import { useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';

export interface TonConnectState {
  wallet: ReturnType<typeof useTonWallet>;
  userFriendlyAddress: string;
  rawAddress: string;
  connected: boolean;
  connecting: boolean;
  sendTransaction: (tx: any) => Promise<any>;
  connect: () => void;
  disconnect: () => void;
}

export function useTonConnect(): TonConnectState {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const [connecting, setConnecting] = useState(false);

  const connected = !!wallet;

  const connect = useCallback(() => {
    setConnecting(true);
    tonConnectUI.openModal();
  }, [tonConnectUI]);

  const disconnect = useCallback(async () => {
    await tonConnectUI.disconnect();
  }, [tonConnectUI]);

  const sendTransaction = useCallback(
    async (transaction: any) => {
      if (!tonConnectUI) {
        throw new Error('TON Connect UI is not initialized');
      }
      return await tonConnectUI.sendTransaction(transaction);
    },
    [tonConnectUI]
  );

  useEffect(() => {
    if (wallet) {
      setConnecting(false);
    }
  }, [wallet]);

  // Listen for connection status changes
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      if (walletInfo) {
        setConnecting(false);
      }
    });
    return () => unsubscribe();
  }, [tonConnectUI]);

  return {
    wallet,
    userFriendlyAddress,
    rawAddress,
    connected,
    connecting,
    sendTransaction,
    connect,
    disconnect,
  };
}
