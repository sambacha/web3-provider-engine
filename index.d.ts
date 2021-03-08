import { PostMessageWindowTransport, PostMessageIframeTransport, WebSocketTransport, HTTPTransport, Client, JSONRPCError } from "@open-rpc/client-js";
import { OpenrpcDocument as OpenRPC } from "@open-rpc/meta-schema";
/**
 *
 * Hex representation of a Keccak 256 hash
 *
 */
export declare type Keccak = string;
/**
 *
 * Null
 *
 */
export declare type Null = null;
/**
 *
 * The block hash or null when its the pending block
 *
 */
export declare type BlockHashOrNull = Keccak | Null;
/**
 *
 * The hex representation of the block's height
 *
 */
export declare type BlockNumber = string;
/**
 *
 * The block number or null when its the pending block
 *
 */
export declare type BlockNumberOrNull = BlockNumber | Null;
/**
 *
 * The sender of the transaction
 *
 */
export declare type From = string;
/**
 *
 * The gas limit provided by the sender in Wei
 *
 */
export declare type TransactionGas = string;
/**
 *
 * The gas price willing to be paid by the sender in Wei
 *
 */
export declare type TransactionGasPrice = string;
/**
 *
 * Keccak 256 Hash of the RLP encoding of a transaction
 *
 */
export declare type TransactionHash = string;
/**
 *
 * The data field sent with the transaction
 *
 */
export declare type TransactionInput = string;
/**
 *
 * The total number of prior transactions made by the sender
 *
 */
export declare type TransactionNonce = string;
export declare type Address = string;
/**
 *
 * Destination address of the transaction. Null if it was a contract create.
 *
 */
export declare type To = Address | Null;
/**
 *
 * Hex representation of the integer
 *
 */
export declare type Integer = string;
/**
 *
 * The index of the transaction. null when its pending
 *
 */
export declare type TransactionIndex = Integer | Null;
/**
 *
 * Value of Ether being transferred in Wei
 *
 */
export declare type TransactionValue = string;
/**
 *
 * ECDSA recovery id
 *
 */
export declare type TransactionSigV = string;
/**
 *
 * ECDSA signature r
 *
 */
export declare type TransactionSigR = string;
/**
 *
 * ECDSA signature s
 *
 */
export declare type TransactionSigS = string;
/**
 *
 * The optional block height description
 *
 */
export declare type BlockNumberTag = "earliest" | "latest" | "pending";
/**
 *
 * List of contract addresses from which to monitor events
 *
 */
export declare type Addresses = Address[];
export declare type OneOrArrayOfAddresses = Address | Addresses;
/**
 *
 * 32 Bytes DATA of indexed log arguments. (In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256))
 *
 */
export declare type Topic = string;
/**
 *
 * Topics are order-dependent. Each topic can also be an array of DATA with 'or' options.
 *
 */
export declare type LogTopics = Topic[];
/**
 *
 * The key used to get the storage slot in its account tree.
 *
 */
export declare type StorageProofKey = string;
/**
 *
 * The hex representation of the Keccak 256 of the RLP encoded block
 *
 */
export declare type BlockHash = string;
/**
 *
 * A number only to be used once
 *
 */
export declare type Nonce = string;
export declare type NonceOrNull = Nonce | Null;
/**
 *
 * Keccak hash of the uncles data in the block
 *
 */
export declare type BlockShaUncles = string;
/**
 *
 * The bloom filter for the logs of the block or null when its the pending block
 *
 */
export declare type BlockLogsBloom = string;
/**
 *
 * The root of the transactions trie of the block.
 *
 */
export declare type BlockTransactionsRoot = string;
/**
 *
 * The root of the final state trie of the block
 *
 */
export declare type BlockStateRoot = string;
/**
 *
 * The root of the receipts trie of the block
 *
 */
export declare type BlockReceiptsRoot = string;
export declare type AddressOrNull = Address | Null;
/**
 *
 * Integer of the difficulty for this block
 *
 */
export declare type BlockDifficulty = string;
/**
 *
 * Integer of the total difficulty of the chain until this block
 *
 */
export declare type BlockTotalDifficulty = Integer | Null;
/**
 *
 * The 'extra data' field of this block
 *
 */
export declare type BlockExtraData = string;
/**
 *
 * Integer the size of this block in bytes
 *
 */
export declare type BlockSize = string;
/**
 *
 * The maximum gas allowed in this block
 *
 */
export declare type BlockGasLimit = string;
/**
 *
 * The total used gas by all transactions in this block
 *
 */
export declare type BlockGasUsed = string;
/**
 *
 * The unix timestamp for when the block was collated
 *
 */
export declare type BlockTimeStamp = string;
export interface Transaction {
    blockHash?: BlockHashOrNull;
    blockNumber?: BlockNumberOrNull;
    from?: From;
    gas: TransactionGas;
    gasPrice: TransactionGasPrice;
    hash?: TransactionHash;
    input?: TransactionInput;
    nonce: TransactionNonce;
    to?: To;
    transactionIndex?: TransactionIndex;
    value?: TransactionValue;
    v?: TransactionSigV;
    r?: TransactionSigR;
    s?: TransactionSigS;
    [k: string]: any;
}
export declare type TransactionOrTransactionHash = Transaction | TransactionHash;
/**
 *
 * Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter
 *
 */
export declare type TransactionsOrHashes = TransactionOrTransactionHash[];
/**
 *
 * Block hash of the RLP encoding of an uncle block
 *
 */
export declare type UncleHash = string;
/**
 *
 * Array of uncle hashes
 *
 */
export declare type UncleHashes = UncleHash[];
/**
 *
 * The Block is the collection of relevant pieces of information (known as the block header), together with information corresponding to the comprised transactions, and a set of other block headers that are known to have a parent equal to the present block’s parent’s parent.
 *
 */
export interface Block {
    number?: BlockNumberOrNull;
    hash?: BlockHashOrNull;
    parentHash?: BlockHash;
    nonce?: NonceOrNull;
    sha3Uncles?: BlockShaUncles;
    logsBloom?: BlockLogsBloom;
    transactionsRoot?: BlockTransactionsRoot;
    stateRoot?: BlockStateRoot;
    receiptsRoot?: BlockReceiptsRoot;
    miner?: AddressOrNull;
    difficulty?: BlockDifficulty;
    totalDifficulty?: BlockTotalDifficulty;
    extraData?: BlockExtraData;
    size?: BlockSize;
    gasLimit?: BlockGasLimit;
    gasUsed?: BlockGasUsed;
    timestamp?: BlockTimeStamp;
    transactions?: TransactionsOrHashes;
    uncles?: UncleHashes;
    [k: string]: any;
}
/**
 *
 * Sender of the transaction
 *
 */
export declare type LogAddress = string;
/**
 *
 * The data/input string sent along with the transaction
 *
 */
export declare type LogData = string;
/**
 *
 * The index of the event within its transaction, null when its pending
 *
 */
export declare type LogIndex = string;
/**
 *
 * Whether or not the log was orphaned off the main chain
 *
 */
export declare type LogIsRemoved = boolean;
/**
 *
 * An indexed event generated during a transaction
 *
 */
export interface Log {
    address?: LogAddress;
    blockHash?: BlockHash;
    blockNumber?: BlockNumber;
    data?: LogData;
    logIndex?: LogIndex;
    removed?: LogIsRemoved;
    topics?: LogTopics;
    transactionHash?: TransactionHash;
    transactionIndex?: TransactionIndex;
    [k: string]: any;
}
/**
 *
 * The contract address created, if the transaction was a contract creation, otherwise null
 *
 */
export declare type ReceiptContractAddress = Address | Null;
/**
 *
 * The gas units used by the transaction
 *
 */
export declare type ReceiptCumulativeGasUsed = string;
/**
 *
 * The total gas used by the transaction
 *
 */
export declare type ReceiptGasUsed = string;
/**
 *
 * An array of all the logs triggered during the transaction
 *
 */
export declare type Logs = Log[];
/**
 *
 * A 2048 bit bloom filter from the logs of the transaction. Each log sets 3 bits though taking the low-order 11 bits of each of the first three pairs of bytes in a Keccak 256 hash of the log's byte series
 *
 */
export declare type BloomFilter = string;
/**
 *
 * The intermediate stateRoot directly after transaction execution.
 *
 */
export declare type ReceiptPostTransactionState = string;
/**
 *
 * Whether or not the transaction threw an error.
 *
 */
export declare type ReceiptStatus = boolean;
/**
 *
 * The receipt of a transaction
 *
 */
export interface Receipt {
    blockHash: BlockHash;
    blockNumber: BlockNumber;
    contractAddress: ReceiptContractAddress;
    cumulativeGasUsed: ReceiptCumulativeGasUsed;
    from: From;
    gasUsed: ReceiptGasUsed;
    logs: Logs;
    logsBloom: BloomFilter;
    to: To;
    transactionHash: TransactionHash;
    transactionIndex: TransactionIndex;
    postTransactionState?: ReceiptPostTransactionState;
    status?: ReceiptStatus;
    [k: string]: any;
}
/**
 *
 * The address of the account or contract of the request
 *
 */
export declare type ProofAccountAddress = string;
/**
 *
 * An individual node used to prove a path down a merkle-patricia-tree
 *
 */
export declare type ProofNode = string;
/**
 *
 * The set of node values needed to traverse a patricia merkle tree (from root to leaf) to retrieve a value
 *
 */
export declare type ProofNodes = ProofNode[];
/**
 *
 * The Ether balance of the account or contract of the request
 *
 */
export declare type ProofAccountBalance = string;
/**
 *
 * The code hash of the contract of the request (keccak(NULL) if external account)
 *
 */
export declare type ProofAccountCodeHash = string;
/**
 *
 * The transaction count of the account or contract of the request
 *
 */
export declare type ProofAccountNonce = string;
/**
 *
 * The storage hash of the contract of the request (keccak(rlp(NULL)) if external account)
 *
 */
export declare type ProofAccountStorageHash = string;
/**
 *
 * The value of the storage slot in its account tree
 *
 */
export declare type StorageProofValue = string;
/**
 *
 * Object proving a relationship of a storage value to an account's storageHash.
 *
 */
export interface StorageProof {
    key?: StorageProofKey;
    value?: StorageProofValue;
    proof?: ProofNodes;
    [k: string]: any;
}
/**
 *
 * Current block header PoW hash.
 *
 */
export declare type StorageProofSet = StorageProof[];
/**
 *
 * The merkle proofs of the specified account connecting them to the blockhash of the block specified
 *
 */
export interface ProofAccount {
    address?: ProofAccountAddress;
    accountProof?: ProofNodes;
    balance?: ProofAccountBalance;
    codeHash?: ProofAccountCodeHash;
    nonce?: ProofAccountNonce;
    storageHash?: ProofAccountStorageHash;
    storageProof?: StorageProofSet;
    [k: string]: any;
}
/**
 *
 * Current block header PoW hash.
 *
 */
export declare type PowHash = string;
/**
 *
 * The seed hash used for the DAG.
 *
 */
export declare type SeedHash = string;
/**
 *
 * The boundary condition ('target'), 2^256 / difficulty.
 *
 */
export declare type Difficulty = string;
/**
 *
 * Block at which the import started (will only be reset, after the sync reached his head)
 *
 */
export declare type SyncingDataStartingBlock = string;
/**
 *
 * The current block, same as eth_blockNumber
 *
 */
export declare type SyncingDataCurrentBlock = string;
/**
 *
 * The estimated highest block
 *
 */
export declare type SyncingDataHighestBlock = string;
/**
 *
 * The known states
 *
 */
export declare type SyncingDataKnownStates = string;
/**
 *
 * The pulled states
 *
 */
export declare type SyncingDataPulledStates = string;
/**
 *
 * An object with sync status data
 *
 */
export interface SyncingData {
    startingBlock?: SyncingDataStartingBlock;
    currentBlock?: SyncingDataCurrentBlock;
    highestBlock?: SyncingDataHighestBlock;
    knownStates?: SyncingDataKnownStates;
    pulledStates?: SyncingDataPulledStates;
    [k: string]: any;
}
export declare type BooleanVyG3AETh = boolean;
export declare type Data = string;
export declare type BlockNumberOrTag = BlockNumber | BlockNumberTag;
export declare type IsTransactionsIncluded = boolean;
/**
 *
 * An identifier used to reference the filter.
 *
 */
export declare type FilterId = string;
/**
 *
 * A filter used to monitor the blockchain for log/events
 *
 */
export interface Filter {
    fromBlock?: BlockNumber;
    toBlock?: BlockNumber;
    address?: OneOrArrayOfAddresses;
    topics?: LogTopics;
    [k: string]: any;
}
/**
 *
 * Hex representation of the storage slot where the variable exists
 *
 */
export declare type Position = string;
/**
 *
 * A storage key is indexed from the solidity compiler by the order it is declared. For mappings it uses the keccak of the mapping key with its position (and recursively for X-dimensional mappings)
 *
 */
export declare type StorageKeys = any;
/**
 *
 * Hex representation of a variable length byte array
 *
 */
export declare type Bytes = string;
/**
 *
 * Hex representation of a 256 bit unit of data
 *
 */
export declare type DataWord = string;
/**
 *
 * The mix digest.
 *
 */
export declare type MixHash = string;
export declare type ClientVersion = string;
export declare type IsNetListening = boolean;
/**
 *
 * Hex representation of number of connected peers
 *
 */
export declare type NumConnectedPeers = string;
export declare type NetworkId = string;
export declare type ChainId = string;
/**
 *
 * Integer of the current gas price
 *
 */
export declare type GasPriceResult = string;
export declare type IntegerOrNull = Integer | Null;
export declare type BlockOrNull = Block | Null;
export declare type LogResult = Log[];
export declare type SetOfLogs = Log[];
export declare type TransactionOrNull = Transaction | Null;
export declare type TransactionReceiptOrNull = Receipt | Null;
export declare type ProofAccountOrNull = ProofAccount | Null;
export declare type GetWorkResults = [PowHash, SeedHash, Difficulty];
/**
 *
 * An array of transactions
 *
 */
export declare type Transactions = Transaction[];
export declare type IsSyncingResult = SyncingData | BooleanVyG3AETh;
/**
 *
 * Generated! Represents an alias to any of the provided schemas
 *
 */
export declare type AnyOfDataTransactionBlockNumberOrTagTransactionAddressBlockNumberBlockHashIsTransactionsIncludedBlockNumberOrTagIsTransactionsIncludedBlockHashBlockNumberOrTagAddressBlockNumberFilterIdFilterIdTransactionHashBlockHashIntegerBlockNumberOrTagIntegerFilterAddressPositionBlockNumberOrTagBlockHashIntegerBlockNumberOrTagIntegerTransactionHashAddressBlockNumberOrTagTransactionHashBlockHashIntegerBlockNumberIntegerBlockHashBlockNumberOrTagAddressStorageKeysBlockNumberOrTagFilterBytesDataWordDataWordNoncePowHashMixHashFilterIdClientVersionKeccakIsNetListeningNumConnectedPeersNetworkIdBlockNumberOrTagBytesChainIdAddressIntegerGasPriceResultIntegerOrNullBlockOrNullBlockOrNullIntegerOrNullIntegerOrNullBytesLogResultSetOfLogsBytesBytesBytesSetOfLogsDataWordTransactionOrNullTransactionOrNullTransactionOrNullNonceOrNullTransactionReceiptOrNullBlockOrNullBlockOrNullIntegerOrNullIntegerOrNullProofAccountOrNullGetWorkResultsIntegerBooleanVyG3AEThFilterIdIntegerFilterIdTransactionsIntegerKeccakBooleanVyG3AEThBooleanVyG3AEThIsSyncingResultBooleanVyG3AETh = Data | Transaction | BlockNumberOrTag | Address | BlockNumber | BlockHash | IsTransactionsIncluded | FilterId | TransactionHash | Integer | Filter | Position | StorageKeys | Bytes | DataWord | Nonce | PowHash | MixHash | ClientVersion | Keccak | IsNetListening | NumConnectedPeers | NetworkId | ChainId | GasPriceResult | IntegerOrNull | BlockOrNull | LogResult | SetOfLogs | TransactionOrNull | NonceOrNull | TransactionReceiptOrNull | ProofAccountOrNull | GetWorkResults | BooleanVyG3AETh | Transactions | IsSyncingResult;
export declare type Web3ClientVersion = () => Promise<ClientVersion>;
export declare type Web3Sha3 = (data: Data) => Promise<Keccak>;
export declare type NetListening = () => Promise<IsNetListening>;
export declare type NetPeerCount = () => Promise<NumConnectedPeers>;
export declare type NetVersion = () => Promise<NetworkId>;
export declare type EthBlockNumber = () => Promise<BlockNumberOrTag>;
export declare type EthCall = (transaction: Transaction, blockNumber: BlockNumberOrTag) => Promise<Bytes>;
export declare type EthChainId = () => Promise<ChainId>;
export declare type EthCoinbase = () => Promise<Address>;
export declare type EthEstimateGas = (transaction: Transaction) => Promise<Integer>;
export declare type EthGasPrice = () => Promise<GasPriceResult>;
export declare type EthGetBalance = (address: Address, blockNumber: BlockNumber) => Promise<IntegerOrNull>;
export declare type EthGetBlockByHash = (blockHash: BlockHash, includeTransactions: IsTransactionsIncluded) => Promise<BlockOrNull>;
export declare type EthGetBlockByNumber = (blockNumber: BlockNumberOrTag, includeTransactions: IsTransactionsIncluded) => Promise<BlockOrNull>;
export declare type EthGetBlockTransactionCountByHash = (blockHash: BlockHash) => Promise<IntegerOrNull>;
export declare type EthGetBlockTransactionCountByNumber = (blockNumber: BlockNumberOrTag) => Promise<IntegerOrNull>;
export declare type EthGetCode = (address: Address, blockNumber: BlockNumber) => Promise<Bytes>;
export declare type EthGetFilterChanges = (filterId: FilterId) => Promise<LogResult>;
export declare type EthGetFilterLogs = (filterId: FilterId) => Promise<SetOfLogs>;
export declare type EthGetRawTransactionByHash = (transactionHash: TransactionHash) => Promise<Bytes>;
export declare type EthGetRawTransactionByBlockHashAndIndex = (blockHash: BlockHash, index: Integer) => Promise<Bytes>;
export declare type EthGetRawTransactionByBlockNumberAndIndex = (blockNumber: BlockNumberOrTag, index: Integer) => Promise<Bytes>;
export declare type EthGetLogs = (filter: Filter) => Promise<SetOfLogs>;
export declare type EthGetStorageAt = (address: Address, key: Position, blockNumber: BlockNumberOrTag) => Promise<DataWord>;
export declare type EthGetTransactionByBlockHashAndIndex = (blockHash: BlockHash, index: Integer) => Promise<TransactionOrNull>;
export declare type EthGetTransactionByBlockNumberAndIndex = (blockNumber: BlockNumberOrTag, index: Integer) => Promise<TransactionOrNull>;
export declare type EthGetTransactionByHash = (transactionHash: TransactionHash) => Promise<TransactionOrNull>;
export declare type EthGetTransactionCount = (address: Address, blockNumber: BlockNumberOrTag) => Promise<NonceOrNull>;
export declare type EthGetTransactionReceipt = (transactionHash: TransactionHash) => Promise<TransactionReceiptOrNull>;
export declare type EthGetUncleByBlockHashAndIndex = (blockHash: BlockHash, index: Integer) => Promise<BlockOrNull>;
export declare type EthGetUncleByBlockNumberAndIndex = (uncleBlockNumber: BlockNumber, index: Integer) => Promise<BlockOrNull>;
export declare type EthGetUncleCountByBlockHash = (blockHash: BlockHash) => Promise<IntegerOrNull>;
export declare type EthGetUncleCountByBlockNumber = (blockNumber: BlockNumberOrTag) => Promise<IntegerOrNull>;
export declare type EthGetProof = (address: Address, storageKeys: StorageKeys, blockNumber: BlockNumberOrTag) => Promise<ProofAccountOrNull>;
export declare type EthGetWork = () => Promise<GetWorkResults>;
export declare type EthHashrate = () => Promise<Integer>;
export declare type EthMining = () => Promise<BooleanVyG3AETh>;
export declare type EthNewBlockFilter = () => Promise<FilterId>;
export declare type EthNewFilter = (filter: Filter) => Promise<Integer>;
export declare type EthNewPendingTransactionFilter = () => Promise<FilterId>;
export declare type EthPendingTransactions = () => Promise<Transactions>;
export declare type EthProtocolVersion = () => Promise<Integer>;
export declare type EthSendRawTransaction = (signedTransactionData: Bytes) => Promise<Keccak>;
export declare type EthSubmitHashrate = (hashRate: DataWord, id: DataWord) => Promise<BooleanVyG3AETh>;
export declare type EthSubmitWork = (nonce: Nonce, powHash: PowHash, mixHash: MixHash) => Promise<BooleanVyG3AETh>;
export declare type EthSyncing = () => Promise<IsSyncingResult>;
export declare type EthUninstallFilter = (filterId: FilterId) => Promise<BooleanVyG3AETh>;
export interface Options {
    transport: {
        type: "websocket" | "http" | "https" | "postmessagewindow" | "postmessageiframe";
        host: string;
        port: number;
        path?: string;
        protocol?: string;
    };
}
export declare class EthereumJSONRPC {
    rpc: Client;
    static openrpcDocument: OpenRPC;
    transport: HTTPTransport | WebSocketTransport | PostMessageWindowTransport | PostMessageIframeTransport;
    private validator;
    private timeout;
    constructor(options: Options);
    /**
     * Adds a JSONRPC notification handler to handle receiving notifications.
     * @example
     * myClient.onNotification((data)=>console.log(data));
     */
    onNotification(callback: (data: any) => void): void;
    /**
     * Adds an optional JSONRPCError handler to handle receiving errors that cannot be resolved to a specific request
     * @example
     * myClient.onError((err: JSONRPCError)=>console.log(err.message));
     */
    onError(callback: (data: JSONRPCError) => void): void;
    /**
     * Sets a default timeout in ms for all requests excluding notifications.
     * @example
     * // 20s timeout
     * myClient.setDefaultTimeout(20000);
     * // Removes timeout from request
     * myClient.setDefaultTimeout(undefined);
     */
    setDefaultTimeout(ms?: number): void;
    /**
     * Initiates [[EthereumJSONRPC.startBatch]] in order to build a batch call.
     *
     * Subsequent calls to [[EthereumJSONRPC.request]] will be added to the batch.
     * Once [[EthereumJSONRPC.stopBatch]] is called, the promises for the [[EthereumJSONRPC.request]]
     * will then be resolved.  If there is already a batch in progress this method is a noop.
     *
     * @example
     * myClient.startBatch();
     * myClient.foo().then(() => console.log("foobar"))
     * myClient.bar().then(() => console.log("foobarbaz"))
     * myClient.stopBatch();
     */
    startBatch(): void;
    /**
     * Initiates [[Client.stopBatch]] in order to finalize and send the batch to the underlying transport.
     *
     * stopBatch will send the [[EthereumJSONRPC]] calls made since the last [[EthereumJSONRPC.startBatch]] call. For
     * that reason, [[EthereumJSONRPC.startBatch]] MUST be called before [[EthereumJSONRPC.stopBatch]].
     *
     * @example
     * myClient.startBatch();
     * myClient.foo().then(() => console.log("foobar"))
     * myClient.bar().then(() => console.log("foobarbaz"))
     * myClient.stopBatch();
     */
    stopBatch(): void;
    private request;
    /**
     * current client version
     */
    web3_clientVersion: Web3ClientVersion;
    /**
     * Hashes data
     */
    web3_sha3: Web3Sha3;
    /**
     * returns listening status
     */
    net_listening: NetListening;
    /**
     * number of peers
     */
    net_peerCount: NetPeerCount;
    /**
     * Network identifier associated with network
     */
    net_version: NetVersion;
    /**
     * Returns the number of most recent block.
     */
    eth_blockNumber: EthBlockNumber;
    /**
     * Executes a new message call (locally) immediately without creating a transaction on the block chain.
     */
    eth_call: EthCall;
    /**
     * Returns the currently configured chain id
     */
    eth_chainId: EthChainId;
    /**
     * Returns the client coinbase address.
     */
    eth_coinbase: EthCoinbase;
    /**
     * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete. The transaction will not be added to the blockchain. Note that the estimate may be significantly more than the amount of gas actually used by the transaction, for a variety of reasons including EVM mechanics and node performance.
     */
    eth_estimateGas: EthEstimateGas;
    /**
     * Returns the current price per gas in wei
     */
    eth_gasPrice: EthGasPrice;
    /**
     * Returns Ether balance of a given or account or contract
     */
    eth_getBalance: EthGetBalance;
    /**
     * Gets a block for a given hash
     */
    eth_getBlockByHash: EthGetBlockByHash;
    /**
     * Gets a block for a given number
     */
    eth_getBlockByNumber: EthGetBlockByNumber;
    /**
     * Returns the number of transactions in a block from a block matching the given block hash.
     */
    eth_getBlockTransactionCountByHash: EthGetBlockTransactionCountByHash;
    /**
     * Returns the number of transactions in a block from a block matching the given block number.
     */
    eth_getBlockTransactionCountByNumber: EthGetBlockTransactionCountByNumber;
    /**
     * Returns code at a given contract address
     */
    eth_getCode: EthGetCode;
    /**
     * Polling method for a filter, which returns an array of logs which occurred since last poll.
     */
    eth_getFilterChanges: EthGetFilterChanges;
    /**
     * Returns an array of all logs matching filter with given id.
     */
    eth_getFilterLogs: EthGetFilterLogs;
    /**
     * Returns raw transaction data of a transaction with the given hash.
     */
    eth_getRawTransactionByHash: EthGetRawTransactionByHash;
    /**
     * Returns raw transaction data of a transaction with the block hash and index of which it was mined.
     */
    eth_getRawTransactionByBlockHashAndIndex: EthGetRawTransactionByBlockHashAndIndex;
    /**
     * Returns raw transaction data of a transaction with the block number and index of which it was mined.
     */
    eth_getRawTransactionByBlockNumberAndIndex: EthGetRawTransactionByBlockNumberAndIndex;
    /**
     * Returns an array of all logs matching a given filter object.
     */
    eth_getLogs: EthGetLogs;
    /**
     * Gets a storage value from a contract address, a position, and an optional blockNumber
     */
    eth_getStorageAt: EthGetStorageAt;
    /**
     * Returns the information about a transaction requested by the block hash and index of which it was mined.
     */
    eth_getTransactionByBlockHashAndIndex: EthGetTransactionByBlockHashAndIndex;
    /**
     * Returns the information about a transaction requested by the block number and index of which it was mined.
     */
    eth_getTransactionByBlockNumberAndIndex: EthGetTransactionByBlockNumberAndIndex;
    /**
     * Returns the information about a transaction requested by transaction hash.
     */
    eth_getTransactionByHash: EthGetTransactionByHash;
    /**
     * Returns the number of transactions sent from an address
     */
    eth_getTransactionCount: EthGetTransactionCount;
    /**
     * Returns the receipt information of a transaction by its hash.
     */
    eth_getTransactionReceipt: EthGetTransactionReceipt;
    /**
     * Returns information about a uncle of a block by hash and uncle index position.
     */
    eth_getUncleByBlockHashAndIndex: EthGetUncleByBlockHashAndIndex;
    /**
     * Returns information about a uncle of a block by hash and uncle index position.
     */
    eth_getUncleByBlockNumberAndIndex: EthGetUncleByBlockNumberAndIndex;
    /**
     * Returns the number of uncles in a block from a block matching the given block hash.
     */
    eth_getUncleCountByBlockHash: EthGetUncleCountByBlockHash;
    /**
     * Returns the number of uncles in a block from a block matching the given block number.
     */
    eth_getUncleCountByBlockNumber: EthGetUncleCountByBlockNumber;
    /**
     * Returns the account- and storage-values of the specified account including the Merkle-proof.
     */
    eth_getProof: EthGetProof;
    /**
     * Returns the hash of the current block, the seedHash, and the boundary condition to be met ('target').
     */
    eth_getWork: EthGetWork;
    /**
     * Returns the number of hashes per second that the node is mining with.
     */
    eth_hashrate: EthHashrate;
    /**
     * Returns true if client is actively mining new blocks.
     */
    eth_mining: EthMining;
    /**
     * Creates a filter in the node, to notify when a new block arrives. To check if the state has changed, call eth_getFilterChanges.
     */
    eth_newBlockFilter: EthNewBlockFilter;
    /**
     * Creates a filter object, based on filter options, to notify when the state changes (logs). To check if the state has changed, call eth_getFilterChanges.
     */
    eth_newFilter: EthNewFilter;
    /**
     * Creates a filter in the node, to notify when new pending transactions arrive. To check if the state has changed, call eth_getFilterChanges.
     */
    eth_newPendingTransactionFilter: EthNewPendingTransactionFilter;
    /**
     * Returns the transactions that are pending in the transaction pool and have a from address that is one of the accounts this node manages.
     */
    eth_pendingTransactions: EthPendingTransactions;
    /**
     * Returns the current ethereum protocol version.
     */
    eth_protocolVersion: EthProtocolVersion;
    /**
     * Creates new message call transaction or a contract creation for signed transactions.
     */
    eth_sendRawTransaction: EthSendRawTransaction;
    /**
     * Used for submitting mining hashrate.
     */
    eth_submitHashrate: EthSubmitHashrate;
    /**
     * Used for submitting a proof-of-work solution.
     */
    eth_submitWork: EthSubmitWork;
    /**
     * Returns an object with data about the sync status or false.
     */
    eth_syncing: EthSyncing;
    /**
     * Uninstalls a filter with given id. Should always be called when watch is no longer needed. Additionally Filters timeout when they aren't requested with eth_getFilterChanges for a period of time.
     */
    eth_uninstallFilter: EthUninstallFilter;
}
export default EthereumJSONRPC;
