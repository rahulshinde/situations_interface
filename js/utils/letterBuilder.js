import * as THREE from 'three';

import { LetterA } from '../letters/a.js'
import { LetterB } from '../letters/b.js'
import { LetterC } from '../letters/c.js'
import { LetterD } from '../letters/d.js'
import { LetterE } from '../letters/e.js'
import { LetterF } from '../letters/f.js'
import { LetterG } from '../letters/g.js'
import { LetterH } from '../letters/h.js'
import { LetterI } from '../letters/i.js'
import { LetterJ } from '../letters/j.js'
import { LetterK } from '../letters/k.js'
import { LetterL } from '../letters/l.js'
import { LetterM } from '../letters/m.js'
import { LetterN } from '../letters/n.js'
import { LetterO } from '../letters/o.js'
import { LetterP } from '../letters/p.js'
import { LetterQ } from '../letters/q.js'
import { LetterR } from '../letters/r.js'
import { LetterS } from '../letters/s.js'
import { LetterT } from '../letters/t.js'
import { LetterU } from '../letters/u.js'
import { LetterV } from '../letters/v.js'
import { LetterW } from '../letters/w.js'
import { LetterX } from '../letters/x.js'
import { LetterY } from '../letters/y.js'
import { LetterZ } from '../letters/z.js'
import { Number1 } from '../numbers/1.js'
import { Number2 } from '../numbers/2.js'
import { Number3 } from '../numbers/3.js'
import { Number4 } from '../numbers/4.js'
import { Number5 } from '../numbers/5.js'
import { Number6 } from '../numbers/6.js'
import { Number7 } from '../numbers/7.js'
import { Number8 } from '../numbers/8.js'
import { Number9 } from '../numbers/9.js'
import { Number0 } from '../numbers/0.js'
import { SymbolParenthesesL } from '../symbols/parenthesesL.js'
import { SymbolParenthesesR } from '../symbols/parenthesesR.js'
import { SymbolBracketL } from '../symbols/bracketL.js'
import { SymbolBracketR } from '../symbols/bracketR.js'

var charMap = {
	'A': LetterA,
	'B': LetterB,
	'C': LetterC,
	'D': LetterD,
	'E': LetterE,
	'F': LetterF,
	'G': LetterG,
	'H': LetterH,
	'I': LetterI,
	'J': LetterJ,
	'K': LetterK,
	'L': LetterL,
	'M': LetterM,
	'N': LetterN,
	'O': LetterO,
	'P': LetterP,
	'Q': LetterQ,
	'R': LetterR,
	'S': LetterS,
	'T': LetterT,
	'U': LetterU,
	'V': LetterV,
	'W': LetterW,
	'X': LetterX,
	'Y': LetterY,
	'Z': LetterZ,

	'0': Number0,
	'1': Number1,
	'2': Number2,
	'3': Number3,
	'4': Number4,
	'5': Number5,
	'6': Number6,
	'7': Number7,
	'8': Number8,
	'9': Number9,

	'(': SymbolParenthesesL,
	')': SymbolParenthesesR,
	'[': SymbolBracketL,
	']': SymbolBracketR
}


export function constructLetter(letter, splineWidth, material){
	let letterObject = new charMap[letter](splineWidth, material).path
	let randName = parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(8).toString().replace(".", ""));
	letterObject.name = 'id' + randName;

	return {
		'object': letterObject,
		'character': letter
	}
}