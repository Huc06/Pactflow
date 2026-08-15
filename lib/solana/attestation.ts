import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import { readFile } from "node:fs/promises";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export type AttestationResult = {
  signature: string;
  network: "Solana Devnet";
  explorerUrl: string | null;
  mode: "live" | "simulated";
  fallbackReason?: string;
};

export async function attestProof(proofHash: string): Promise<AttestationResult> {
  const secret = await loadSecretKey();
  if (!secret) return simulatedAttestation(proofHash, "SOLANA_SECRET_KEY is not configured");

  try {
    const payer = Keypair.fromSecretKey(parseSecretKey(secret));
    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com", "confirmed");
    const instruction = new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: false }],
      data: Buffer.from(`pactflow:${proofHash}`, "utf8"),
    });
    const signature = await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [payer], { commitment: "confirmed" });
    return { signature, network: "Solana Devnet", explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`, mode: "live" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Solana error";
    return simulatedAttestation(proofHash, message);
  }
}

async function loadSecretKey() {
  if (process.env.SOLANA_SECRET_KEY) return process.env.SOLANA_SECRET_KEY;
  if (process.env.SOLANA_KEYPAIR_PATH) return readFile(process.env.SOLANA_KEYPAIR_PATH, "utf8");
  return null;
}

export function parseSecretKey(value: string): Uint8Array {
  const trimmed = value.trim();
  if (trimmed.startsWith("[")) {
    const bytes: unknown = JSON.parse(trimmed);
    if (!Array.isArray(bytes) || !bytes.every((item) => Number.isInteger(item) && item >= 0 && item <= 255)) throw new Error("Invalid JSON secret key");
    return Uint8Array.from(bytes as number[]);
  }
  return bs58.decode(trimmed);
}

function simulatedAttestation(proofHash: string, fallbackReason: string): AttestationResult {
  return { signature: `5PactFlowDemo${proofHash.slice(0, 30)}`, network: "Solana Devnet", explorerUrl: null, mode: "simulated", fallbackReason };
}
