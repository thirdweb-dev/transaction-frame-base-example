import { FrameValidationData } from "@coinbase/onchainkit";
import { Base } from "@thirdweb-dev/chains";
import { SmartContract, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BaseContract, Wallet } from "ethers";

const evmSdkMap = new Map<string, ThirdwebSDK>();

export const getContractForErc721OpenEdition = async (
  contractAddress: string
) => {
  // Create a reandom signer. This is required to encode erc721 tx data
  const signer = Wallet.createRandom();

  // Standar RPC url from thirdweb
  const rpcUrl = `https://${Base.chainId}.rpc.thirdweb.com/${process.env.DASHBOARD_THIRDWEB_CLIENT_ID}`;

  let sdk: ThirdwebSDK | null = null;

  if (evmSdkMap.has("sdk")) {
    sdk = evmSdkMap.get("sdk") as ThirdwebSDK;
  } else {
    sdk = new ThirdwebSDK(rpcUrl, {
      readonlySettings: {
        chainId: Base.chainId,
        rpcUrl,
      },
      clientId: process.env.DASHBOARD_THIRDWEB_CLIENT_ID,
      secretKey: process.env.DASHBOARD_THIRDWEB_SECRET_KEY,
    });

    evmSdkMap.set("sdk", sdk);
  }

  // Update signer
  sdk.updateSignerOrProvider(signer);

  // Get contract instance
  const contract = await sdk.getContract(contractAddress);

  // Return contract instance
  return contract;
};

export const getErc721PreparedEncodedData = async (
  walletAddress: string,
  contract: SmartContract<BaseContract>
) => {
  // Prepare erc721 transaction data. Takes in destination address and quantity as parameters
  const transaction = await contract.erc721.claimTo.prepare(walletAddress, 1);

  // Encode transaction data
  const encodedTransactionData = await transaction.encode();

  // Return encoded transaction data
  return encodedTransactionData;
};

export const getFarcasterAccountAddress = (
  interactor: FrameValidationData["interactor"]
) => {
  // Get the first verified account or custody account if first verified account doesn't exist
  return interactor.verified_accounts[0] ?? interactor.custody_address;
};
