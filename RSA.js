function textToBigInt(text) {
  let hexString = "";
  for (let i = 0; i < text.length; i++) {
    hexString += text.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return BigInt("0x" + hexString);
}

function bigIntToText(bigInt) {
  let hexString = bigInt.toString(16);
  if (hexString.length % 2) {
    hexString = "0" + hexString;
  }
  let text = "";
  for (let i = 0; i < hexString.length; i += 2) {
    text += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return text;
}

function generatePrime(bits) {
  const minLimit = BigInt(2) ** BigInt(bits - 1);
  const maxLimit = BigInt(2) ** BigInt(bits) - BigInt(1);
  let primeCandidate;

  while (true) {
    primeCandidate = getRandomBigInt(minLimit, maxLimit);
    if (isPrime(primeCandidate)) {
      return primeCandidate;
    }
  }
}

function isPrime(num, k = 10) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2n === 0n || num % 3n === 0n) return false;

  let d = num - 1n;
  while (d % 2n === 0n) {
    d /= 2n;
  }

  for (let i = 0; i < k; i++) {
    if (!millerRabinTest(num, d)) {
      return false;
    }
  }
  return true;
}

function millerRabinTest(num, d) {
  const a = getRandomBigInt(2n, num - 2n);
  let x = modPow(a, d, num);

  if (x === 1n || x === num - 1n) return true;

  while (d !== num - 1n) {
    x = modPow(x, 2n, num);
    d *= 2n;

    if (x === 1n) return false;
    if (x === num - 1n) return true;
  }

  return false;
}

function modPow(base, exponent, modulus) {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }
  return result;
}

function getRandomBigInt(min, max) {
  const range = max - min + 1n;
  const randomBytes = crypto.getRandomValues(
    new Uint8Array(range.toString(2).length / 8 + 1)
  );
  const randomBigInt = BigInt(
    "0x" +
      Array.from(randomBytes)
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
  );
  return min + (randomBigInt % range);
}

function gcd(a, b) {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function modInverse(e, phi) {
  let [a, m] = [e, phi];
  let [m0, y, x] = [m, 0n, 1n];

  if (m === 1n) return 0n;

  while (a > 1n) {
    let q = a / m;
    [a, m] = [m, a % m];
    [x, y] = [y, x - q * y];
  }

  if (x < 0n) x += m0;

  return x;
}

function generateRSAKeys(bits) {
  const prime1 = generatePrime(bits / 2);
  const prime2 = generatePrime(bits / 2);
  const n = prime1 * prime2;
  const phi = (prime1 - 1n) * (prime2 - 1n);
  let e = 65537n;
  while (gcd(e, phi) !== 1n) {
    e += 2n;
  }
  const d = modInverse(e, phi);

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
}

function encrypt(message, publicKey) {
  const { e, n } = publicKey;
  const m = textToBigInt(message);
  return modPow(m, e, n);
}

function decrypt(ciphertext, privateKey) {
  const { d, n } = privateKey;
  const m = modPow(ciphertext, d, n);
  return bigIntToText(m);
}

const keySize = 512;
const { publicKey, privateKey } = generateRSAKeys(keySize);

const plaintext = "12345";
const encryptedText = encrypt(plaintext, publicKey);
const decryptedText = decrypt(encryptedText, privateKey);

console.log(`Original message: ${plaintext}`);
console.log(`Encrypted message: ${encryptedText}`);
console.log(`Decrypted message: ${decryptedText}`);
