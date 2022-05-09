class Scanner {

  pos = 0;
  template = '';
  
  tokens = [];
  nowTokens = this.tokens;

  keyTag = ['{', '}'];
  isReplace = false;

  constructor(props) {
    this.template = props.template;
    if(typeof this.template !== 'string') return
    while (!this.canNotContinue()) {
      this.scanUtil();
      this.scan();
    }
  }

  // 掠过关键字
  scan() {
    if (this.canNotContinue()) return;
    while (this.meetKeyTag() && !this.canNotContinue()) {
      if (this.template[this.pos] === '{') this.isReplace = true;
      else if (this.template[this.pos] === '}') this.isReplace = false;
      this.pos++;
    }
  };

  scanUtil() {
    if (this.canNotContinue()) return;
    let startPos = this.pos;
    while (!this.meetKeyTag() && !this.canNotContinue()) {
      this.pos++;
    }
    this.addTokens(startPos, this.pos);
  };

  canNotContinue() {
    return this.pos > this.template.length - 1;
  }

  meetKeyTag() {
    return this.keyTag.includes(this.template[this.pos]);
  }

  addTokens(start, end) {
    if (this.template[start] === '#') {
      let prev = this.nowTokens;
      this.nowTokens.push(['#', this.template.substring(start + 1, end), [], start + 1, end]);
      this.nowTokens = this.nowTokens[this.nowTokens.length - 1][2];
      this.nowTokens.prev = prev;
    }
    else if (this.template[start] === '/') {
      let next = this.nowTokens;
      this.nowTokens = this.nowTokens.prev;
      delete next.prev;
    }
    else if (this.isReplace) this.nowTokens.push(['name', this.template.substring(start, end), start, end]);
    else this.nowTokens.push(['text', this.template.substring(start, end), start, end]);
  }
}

export default Scanner