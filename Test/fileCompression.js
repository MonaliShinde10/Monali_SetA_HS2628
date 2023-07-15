// Helper classes and functions

class Node {
  constructor(char, freq, left = null, right = null) {
    this.char = char;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

function buildFrequencyTable(text) {
  const freqTable = new Map();
  for (const char of text) {
    if (freqTable.has(char)) {
      freqTable.set(char, freqTable.get(char) + 1);
    } else {
      freqTable.set(char, 1);
    }
  }
  return freqTable;
}

function buildHuffmanTree(freqTable) {
  const nodes = [];
  for (const [char, freq] of freqTable.entries()) {
    nodes.push(new Node(char, freq));
  }

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    const parent = new Node(null, left.freq + right.freq, left, right);
    nodes.push(parent);
  }

  return nodes[0];
}

function buildCodeTable(huffmanTree) {
  const codeTable = new Map();

  function traverse(node, code) {
    if (node.char !== null) {
      codeTable.set(node.char, code);
    } else {
      traverse(node.left, code + '0');
      traverse(node.right, code + '1');
    }
  }

  traverse(huffmanTree, '');

  return codeTable;
}

// Compression functions

function compress(text) {
  const freqTable = buildFrequencyTable(text);
  const huffmanTree = buildHuffmanTree(freqTable);
  const codeTable = buildCodeTable(huffmanTree);

  let compressed = '';
  for (const char of text) {
    compressed += codeTable.get(char);
  }

  return compressed;
}

function decompress(compressed, huffmanTree) {
  let decompressed = '';
  let currentNode = huffmanTree;

  for (const bit of compressed) {
    if (bit === '0') {
      currentNode = currentNode.left;
    } else {
      currentNode = currentNode.right;
    }

    if (currentNode.char !== null) {
      decompressed += currentNode.char;
      currentNode = huffmanTree;
    }
  }

  return decompressed;
}

// Usage example

const text = 'Hello, World!';
const compressed = compress(text);
console.log('Compressed:', compressed);
const decompressed = decompress(compressed, buildHuffmanTree(buildFrequencyTable(text)));
console.log('Decompressed:', decompressed);
