const { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("devnet"));

// Generate new key pair
const newPair = new Keypair();
console.log(newPair);

// Store public and private key
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// Get balance 
const getBalance = async () => {
    const balance = await connection.getBalance(new PublicKey(publicKey));
    console.log(`   Wallet balance: ${parseInt(balance)/LAMPORTS_PER_SOL}SOL`);
}

// Air drop sol
const airDrop = async () => {
    const address = new PublicKey(publicKey);
    const signature = await connection.requestAirdrop(address,  LAMPORTS_PER_SOL);
    const res = await connection.confirmTransaction({signature});
    getBalance();
}

// driver function
async function main() {
    getBalance();
    airDrop();
}

main();
