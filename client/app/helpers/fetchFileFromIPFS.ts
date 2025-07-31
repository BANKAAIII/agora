const GATEWAY = "orange-confused-boar-516.mypinata.cloud";
const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export async function fetchFileFromIPFS(CID: String) {
  // Validate CID format (should be at least 20 characters)
  if (!CID || CID.length < 20) {
    // Invalid IPFS CID
    return null;
  }
  
  const url = `https://${GATEWAY}/ipfs/${CID}`;
  try {
    const request = await fetch(url);
    if (!request.ok) {
      // IPFS fetch failed
      return null;
    }
    const response = await request.json();
    return response;
  } catch (error) {
    // IPFS error occurred
    return null;
  }
}
