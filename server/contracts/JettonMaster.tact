// ===================================================================
// DGTL Jetton Master Contract (TEP-74 Fungible Token Standard)
// Language: Tact
// Project: DGTL Telegram Mini App
// ===================================================================

import "@stdlib/deploy";
import "@stdlib/ownable";

// ===================================================================
// Messages
// ===================================================================

message Mint {
    amount: Int as coins;
    receiver: Address;
}

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

message(0x2c76b973) ProvideWalletAddress {
    queryId: Int as uint64;
    ownerAddress: Address;
    includeAddress: Bool;
}

message(0xd1735400) TakeWalletAddress {
    queryId: Int as uint64;
    walletAddress: Address;
    ownerAddress: Slice as remaining;
}

message ChangeAdmin {
    newAdmin: Address;
}

message ChangeContent {
    newContent: Cell;
}

// ===================================================================
// JettonMaster Contract
// ===================================================================

contract JettonMaster with Deployable, Ownable {
    totalSupply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;

    init(owner: Address, content: Cell) {
        self.totalSupply = 0;
        self.owner = owner;
        self.content = content;
        self.mintable = true;
    }

    // --- Mint new tokens (only owner) ---
    receive(msg: Mint) {
        self.requireOwner();
        require(self.mintable, "Minting is disabled");
        require(msg.amount > 0, "Invalid mint amount");

        self.totalSupply = self.totalSupply + msg.amount;
        let winit: StateInit = self._getJettonWalletInit(msg.receiver);
        send(SendParameters{
            to: contractAddress(winit),
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: TokenTransferInternal{
                queryId: 0,
                amount: msg.amount,
                from: myAddress(),
                responseDestination: self.owner,
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }.toCell(),
            code: winit.code,
            data: winit.data
        });
    }

    // --- Receive burn notifications from wallets ---
    receive(msg: TokenBurnNotification) {
        let walletInit: StateInit = self._getJettonWalletInit(msg.owner);
        require(sender() == contractAddress(walletInit), "Invalid sender");
        self.totalSupply = self.totalSupply - msg.amount;
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

    // --- Provide wallet address (discovery) ---
    receive(msg: ProvideWalletAddress) {
        let winit: StateInit = self._getJettonWalletInit(msg.ownerAddress);
        let walletAddress: Address = contractAddress(winit);
        let body: Cell;
        if (msg.includeAddress) {
            body = TakeWalletAddress{
                queryId: msg.queryId,
                walletAddress: walletAddress,
                ownerAddress: beginCell().storeAddress(msg.ownerAddress).endCell().asSlice()
            }.toCell();
        } else {
            body = TakeWalletAddress{
                queryId: msg.queryId,
                walletAddress: walletAddress,
                ownerAddress: emptySlice()
            }.toCell();
        }
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: body
        });
    }

    // --- Change admin ---
    receive(msg: ChangeAdmin) {
        self.requireOwner();
        self.owner = msg.newAdmin;
    }

    // --- Change content (metadata) ---
    receive(msg: ChangeContent) {
        self.requireOwner();
        self.content = msg.newContent;
    }

    // ===================================================================
    // Getters
    // ===================================================================

    get fun get_jetton_data(): JettonData {
        return JettonData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            owner: self.owner,
            content: self.content,
            walletCode: self._getJettonWalletInit(myAddress()).code!!
        };
    }

    get fun get_wallet_address(ownerAddress: Address): Address {
        let winit: StateInit = self._getJettonWalletInit(ownerAddress);
        return contractAddress(winit);
    }

    // ===================================================================
    // Internal helpers
    // ===================================================================

    fun _getJettonWalletInit(ownerAddress: Address): StateInit {
        return initOf JettonWallet(myAddress(), ownerAddress);
    }
}

// ===================================================================
// Structs
// ===================================================================

struct JettonData {
    totalSupply: Int as coins;
    mintable: Bool;
    owner: Address;
    content: Cell;
    walletCode: Cell;
}
