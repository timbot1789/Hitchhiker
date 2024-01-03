export class TrieNode {
  #children: {
    [key: string]: TrieNode
  } = {}
  #isEndOfWord: boolean = false;

  insert(word: string) {
    if (word.length === 0){
      this.#isEndOfWord = true;
      return;
    }
    const nodeVal = word[0];
    if (!this.#children[nodeVal]) this.#children[nodeVal] = new TrieNode();
    this.#children[nodeVal].insert(word.substring(1));
  }

  search(word: string): boolean{
    if (word === "") return this.#isEndOfWord;
    const letter = word[0];
    const nextNode = this.#children[letter];
    return Boolean(nextNode) && nextNode.search(word.substring(1));
  }

  isLeaf(){
    return Object.keys(this.#children).length === 0;
  }
  
  get isEndOfWord() {
    return this.#isEndOfWord;
  }

  getWords(partial: string = ''){
    let words: string[] = [];
    if (this.#isEndOfWord){
      words.push(partial);
    }
    for (const val in this.#children) {
      const newWords: string[] = this.#children[val].getWords(partial.concat(val));
      if (words) words = words.concat(newWords);
    }
    return words;
  }
}

export class Trie {

  #root: TrieNode;

  constructor() {
    this.#root = new TrieNode();
  }

  insert(word: string){
    this.#root.insert(word);
  }

  getWords(){
    return this.#root.getWords();
  }

  search(word: string){
    return this.#root.search(word);
  }
}

const trie = new Trie();
console.log("hello is not in the trie (should be false):", trie.search("hello"))
trie.insert("hello");
console.log("hello is in the trie (should be true):", trie.search("hello"))
console.log(trie.getWords());
console.log("help is not in the trie (should be false):", trie.search("help"))
trie.insert("help");
console.log("insert help");
console.log("help is in the trie (should be true):", trie.search("help"))
console.log(trie.getWords());
console.log("healthy is not in the trie (should be false):", trie.search("healthy"))
console.log("insert healthy");
trie.insert("healthy");
console.log("healthy is in the trie (should be true):", trie.search("healthy"))
console.log(trie.getWords());

