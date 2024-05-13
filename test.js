async function generateNanoid() {
  try {
    // Dynamically import the nanoid module
    const { customAlphabet } = await import("nanoid");

    // Define the alphabet and the ID length
    const alphabet =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = 7;

    // Create a nanoid generator
    const nanoid = customAlphabet(alphabet, length);

    // Generate and return the nanoid
    return nanoid();
  } catch (error) {
    console.error("Failed to load nanoid module:", error);
    return null;
  }
}

async function main() {
  await console.log(await generateNanoid());
}
main();
