// ===================================================================
// DGTL Jetton Wallet Contract (TEP-74)
// Language: Tact
// Each user gets their own JettonWallet deployed by JettonMaster
// ===================================================================

import "@stdlib/deploy";

// Import messages from JettonMaster (shared types)
message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address?;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    responseDestination: Address?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forwardPayload: Slice as remaining;
}

message(0xd53276db) TokenExcesses {
    queryId: Int as uint64;
}

message(0x595f07bc) TokenBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address?;
    customPayload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;
    responseDestination: Address?;
}

// ===================================================================
// JettonWallet Contract
// ===================================================================

contract JettonWallet {
    balance: Int as coins;
    master: Address;
    owner: Address;

    init(master: Address, owner: Address) {
        self.balance = 0;
        self.master = master;
        self.owner = owner;
    }

    // --- Transfer tokens to another wallet ---
    receive(msg: TokenTransfer) {
        require(sender() == self.owner, "Only owner can transfer");
        require(self.balance >= msg.amount, "Insufficient balance");
        require(msg.amount > 0, "Invalid transfer amount");

        self.balance = self.balance - msg.amount;
        let winit: StateInit = self._getJettonWalletInit(msg.destination);
        send(SendParameters{
            to: contractAddress(winit),
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload
            }.toCell(),
            code: winit.code,
            data: winit.data
        });
    }

    // --- Receive tokens (internal transfer from another wallet or mint) ---
    receive(msg: TokenTransferInternal) {
        let senderWalletInit: StateInit = self._getJettonWalletInit(msg.from);
        if (msg.from != self.master) {
            require(sender() == contractAddress(senderWalletInit), "Invalid sender");
        } else {
            require(sender() == self.master, "Invalid sender");
        }

        self.balance = self.balance + msg.amount;

        if (msg.forwardTonAmount > 0) {
            send(SendParameters{
                to: self.owner,
                value: msg.forwardTonAmount,
                mode: SendPayGasSeparately,
                bounce: false,
                body: TokenNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: msg.from,
                    forwardPayload: msg.forwardPayload
                }.toCell()
            });
        }

        if (msg.responseDestination != null) {
            send(SendParameters{
                to: msg.responseDestination!!,
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                bounce: false,
                body: TokenExcesses{queryId: msg.queryId}.toCell()
            });
        }
    }

    // --- Burn tokens ---
    receive(msg: TokenBurn) {
        require(sender() == self.owner, "Only owner can burn");
        require(self.balance >= msg.amount, "Insufficient balance");
        require(msg.amount > 0, "Invalid burn amount");

        self.balance = self.balance - msg.amount;
        send(SendParameters{
            to: self.master,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenBurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                owner: self.owner,
                responseDestination: msg.responseDestination
            }.toCell()
        });
    }

    // ===================================================================
    // Getters
    // ===================================================================

    get fun get_wallet_data(): WalletData {
        return WalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: initOf JettonWallet(self.master, self.owner).code!!
        };
    }

    // ===================================================================
    // Internal helpers
    // ===================================================================

    fun _getJettonWalletInit(ownerAddress: Address): StateInit {
        return initOf JettonWallet(self.master, ownerAddress);
    }
}

// ===================================================================
// Structs
// ===================================================================

struct WalletData {
    balance: Int as coins;
    owner: Address;
    master: Address;
    walletCode: Cell;
}
