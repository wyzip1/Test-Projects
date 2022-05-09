export default function parseHTML(_html = '') {
  const html = _html.trim()
  let surplus = html
  let index = 0
  const startTag = /^\<([a-zA-Z]+\d?)(\s[^\<]+)?\>/
  const endTag = /^\<\/([a-zA-Z]+\d?)\>/
  const inTagTexT = /^([^\<]+)\<\/[a-zA-Z]+\d?\>/
  const outTagText = /^([^\<]+)\<[a-zA-Z]+\d?\s[^\<]+\>/
  const aloneTag = /^\<([a-zA-Z]+\d?)(\s[^\<]+)? \/\>/
  const isEmpty = /^\s+$/

  const stack = []

  while(surplus) {
    if(startTag.test(surplus)) {
      if(aloneTag.test(surplus)) {
        const match = surplus.match(aloneTag)
        const tagName = match[1]
        const attrs = parseAttrs(match[2])
        !stack.at(-1).children && (stack.at(-1).children = [])
        stack.at(-1).children.push({ tag: tagName, type: 1, attrs })
        index += match[0].length
      } else {
        const match = surplus.match(startTag);
        const tagName = match[1]
        const attrs = parseAttrs(match[2])
        stack.push({ tag: tagName, type: 1, attrs })
        index += match[0].length
      }
    }else if(endTag.test(surplus)) {
      const match = surplus.match(endTag)
      if(match[1] === stack.at(-1).tag && stack.length >= 2) {
        !stack.at(-2).children && (stack.at(-2).children = [])
        stack.at(-2).children.push(stack.splice(-1, 1)[0])
      }
      index += match[0].length
    } else if(inTagTexT.test(surplus)) {
      const match = surplus.match(inTagTexT)
      index += match[1].length
      if(isEmpty.test(match[1])) {
        surplus = html.slice(index)
        continue
      }
      !stack.at(-1).children && (stack.at(-1).children = [])
      stack.at(-1).children.push({ text: match[1], type: 3 })
    } else if(outTagText.test(surplus)) {
      const match = surplus.match(outTagText)
      index += match[1].length
      if(isEmpty.test(match[1])) {
        surplus = html.slice(index)
        continue
      }
      !stack.at(-1).children && (stack.at(-1).children = [])
      stack.at(-1).children.push({ text: match[1], type: 3 })
    }  else {
      index ++
    }
    surplus = html.slice(index)
  }
  return stack[0]
}

function parseAttrs(attrString) {
  if(attrString === undefined) return
  attrString = attrString.trim() + ' '
  let isInContent = false
  let attrs = {}
  let index = 0
  for(let i = 0; i < attrString.length; i++) {
    if(attrString[i] === '"') isInContent = !isInContent
    if(attrString[i] === ' ' && !isInContent) {
        const attr = attrString.slice(index, i).replaceAll('"', '')
        const keyValue = attr.split('=').map(item => item?.trim())
        attrs[keyValue[0]] = keyValue[1] ?? true
        index = i
    }
  }

  return attrs
}