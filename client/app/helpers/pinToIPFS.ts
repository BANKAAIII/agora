const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const pinJSONFile = async (body: any) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      options
    );
    const data = await response.json();
    // IPFS upload successful
    return data;
  } catch (err) {
    // IPFS upload error
    throw err; // rethrow the error to be handled by the caller
  }
};

export const unpinJSONFile = async (CID: String) => {
  const options = {
    method: "DELETE",
    headers: { Authorization: `Bearer ${JWT}` },
  };

  try {
    await fetch(`https://api.pinata.cloud/pinning/unpin/${CID}`, options);
  } catch (err) {
    // Pin to IPFS error
    throw err; // rethrow the error to be handled by the caller
  }
};
