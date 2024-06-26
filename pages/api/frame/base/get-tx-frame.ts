import { abi } from "./../../../../utils/tx-frame-abi";
import {
  getContractForErc721OpenEdition,
  getErc721PreparedEncodedData,
  getFarcasterAccountAddress,
} from "../../../../utils/tx-frame";
import { CoinbaseKit } from "../../../../classes/CoinbaseKit";
import { FrameRequest } from "@coinbase/onchainkit";
import { NextApiRequest, NextApiResponse } from "next";

// https://thirdweb.com/base/0x352810fF1c51a42B568662D46570A30B590a715a
const contractAddress = "0x352810fF1c51a42B568662D46570A30B590a715a";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Return error response if method is not POST
  if (req.method !== "POST") {
    return res.status(400).send("Invalid method");
  }

  // Validate message with @coinbase/onchainkit
  const { isValid, message } = await CoinbaseKit.validateMessage(
    req.body as FrameRequest
  );

  // Validate if message is valid
  if (!isValid || !message) {
    return res.status(400).send("Invalid message");
  }

  // Get the first verified account address or custody address
  const accountAddress = getFarcasterAccountAddress(message.interactor);

  // Get the contract instnace
  const contract = await getContractForErc721OpenEdition(contractAddress);

  // Get encoded data
  const data = await getErc721PreparedEncodedData(accountAddress, contract);

  // Return transaction details response to farcaster
  return res.status(200).json({
    chainId: "eip155:8453",
    method: "eth_sendTransaction",
    params: {
      abi,
      to: contractAddress,
      data,
      value: "0",
    },
  });
}
