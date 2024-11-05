require('dotenv').config();
const { createMint, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const { Keypair, Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const payerSecretKey = JSON.parse(process.env.PAYER_SECRET_KEY);

const payer = Keypair.fromSecretKey(Uint8Array.from(payerSecretKey));

const mintAuthority = payer;
const connection = new Connection(clusterApiUrl('devnet'));

async function createMintForToken(payer, mintAuthority) {
    const mint = await createMint(
        connection,
        payer,                    // payer's Keypair for funding
        mintAuthority.publicKey,  // mint authority (public key)
        null,                      // freeze authority (null means no freeze authority)
        6,                         // decimals
        undefined,                 // programId defaults to TOKEN_PROGRAM_ID, so no need to pass
        [payer]                    // signers array (payer needs to be here)
    );
    console.log('Mint created at', mint.toBase58());
    return mint;
}

const mintToken = async (mint, to, amount) => {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, new PublicKey(to));
    console.log('Token account created at', tokenAccount.address.toBase58());

    await mintTo(connection, payer, mint, tokenAccount.address, payer, amount);
    console.log('Minted', amount, 'tokens to', tokenAccount.address.toBase58());
}
async function main() {
    const mint = await createMintForToken(payer, mintAuthority);
    await mintToken(mint, mintAuthority.publicKey, 100);
}

main();
