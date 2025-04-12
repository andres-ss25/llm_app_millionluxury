/**
* @class Spanish lip-sync processor
*/

class LipsyncEs {

  /**
  * @constructor
  */
  constructor() {

    // Reglas fonéticas y visemas para español latino
    this.rules = {
      'A': [
        "[A]#=aa", " [AL]=aa L", " [AR]=aa RR", "[AM]=aa M", "[AN]=aa N",
        "[AU]=aa U", " [AV]=aa B", "[A]=aa"
      ],
      'B': [
        "[B]=B"
      ],
      'C': [
        "[CH]=CH", "[CE]=SS", "[CI]=SS", "[C]+=kk"
      ],
      'D': [
        "[D]=DD"
      ],
      'E': [
        "[EN]=E N", "[ER]=E RR", "[EL]=E L", "[ES]=E SS", "[E]=E"
      ],
      'F': [
        "[F]=FF"
      ],
      'G': [
        "[GU]=G", "[GA]=G", "[GO]=G", "[GE]=HH", "[GI]=HH"
      ],
      'H': [
        "[H]=" // H es muda en español
      ],
      'I': [
        "[IN]=I N", "[IM]=I M", "[IR]=I RR", "[IL]=I L", "[I]=I"
      ],
      'J': [
        "[J]=HH"
      ],
      'K': [
        "[K]=kk"
      ],
      'L': [
        "[LL]=Y", "[L]=L"
      ],
      'M': [
        "[M]=M"
      ],
      'N': [
        "[Ñ]=NY", "[N]=N"
      ],
      'O': [
        "[OM]=O M", "[ON]=O N", "[OR]=O RR", "[OS]=O SS", "[O]=O"
      ],
      'P': [
        "[P]=PP"
      ],
      'Q': [
        "[QU]=K"
      ],
      'R': [
        "[RR]=RR", "[R]=R"
      ],
      'S': [
        "[S]=SS"
      ],
      'T': [
        "[T]=T"
      ],
      'U': [
        "[UE]=U E", "[UI]=U I", "[UN]=U N", "[UR]=U RR", "[U]=U"
      ],
      'V': [
        "[V]=B"
      ],
      'X': [
        "[X]=KS"
      ],
      'Y': [
        "[Y]=Y", "[Y]O=O"  // Y funciona como "I" al final
      ],
      'Z': [
        "[Z]=SS"
      ]
    };

    const ops = {
      '#': '[AEIOUY]+', // Una o más vocales AEIOUY
      '.': '[BDVGJLMNRWZ]', // Una consonante sonora BDVGJLMNRWZ
      '%': '(?:ER|E|ES|ED|ING|ELY)', // Uno de ER, E, ES, ED, ING, ELY
      '&': '(?:[SCGZXJ]|CH|SH)', // Uno de S, C, G, Z, X, J, CH, SH
      '@': '(?:[TSRDLZNJ]|TH|CH|SH)', // Uno de T, S, R, D, L, Z, N, J, TH, CH, SH
      '^': '[BCDFGHJKLMNPQRSTVWXZ]', // Una consonante BCDFGHJKLMNPQRSTVWXZ
      '+': '[EIY]', // Una de E, I, Y
      ':': '[BCDFGHJKLMNPQRSTVWXZ]*', // Cero o más consonantes BCDFGHJKLMNPQRSTVWXZ
      ' ': '\\b' // Inicio/fin de la palabra
    };

    // Convertir reglas a expresiones regulares
    Object.keys(this.rules).forEach( key => {
      this.rules[key] = this.rules[key].map( rule => {
        const posL = rule.indexOf('[');
        const posR = rule.indexOf(']');
        const posE = rule.indexOf('=');
        const strLeft = rule.substring(0,posL);
        const strLetters = rule.substring(posL+1,posR);
        const strRight = rule.substring(posR+1,posE);
        const strVisemes = rule.substring(posE+1);

        const o = { regex: '', move: 0, visemes: [] };

        let exp = '';
        exp += [...strLeft].map( x => ops[x] || x ).join('');
        const ctxLetters = [...strLetters];
        ctxLetters[0] = ctxLetters[0].toLowerCase();
        exp += ctxLetters.join('');
        o.move = ctxLetters.length;
        exp += [...strRight].map( x => ops[x] || x ).join('');
        o.regex = new RegExp(exp);

        if ( strVisemes.length ) {
          strVisemes.split(' ').forEach( viseme => {
            o.visemes.push(viseme);
          });
        }

        return o;
      });
    });

    // Duraciones de visemas en español (en unidades relativas)
    this.visemeDurations = {
      'aa': 0.95, 'E': 0.90, 'I': 0.92, 'O': 0.96, 'U': 0.95, 'PP': 1.08,
      'SS': 1.23, 'HH': 1.0, 'DD': 1.05, 'FF': 1.00, 'kk': 1.21, 'NN': 0.88,
      'RR': 0.88, 'CH': 1.2, 'NY': 1.05, 'Y': 1.0, 'B': 1.1, 'M': 1.0, 'sil': 1
    };

    // Pausas en unidades relativas (1=promedio)
    this.specialDurations = { ' ': 1, ',': 3, '-':0.5, "'":0.5 };

    // Números en palabras en español
    this.digits = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    this.ones = ['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];
    this.tens = ['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
    this.teens = ['diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve'];

    // Símbolos en español
    this.symbols = {
      '%': 'por ciento', '€': 'euros', '&': 'y', '+': 'más', '$': 'dólares'
    };
    this.symbolsReg = /[%€&\+\$]/g;
  }

  // Funciones de conversión de números y palabras
  convertNumberToWords(num) {
    // Conversión de números en español
  }

  preProcessText(s) {
    return s.replace('/[#_*\":;]/g','')
      .replace(this.symbolsReg, (symbol) => {
        return ' ' + this.symbols[symbol] + ' ';
      })
      .replace(/\d+/g, this.convertNumberToWords.bind(this))
      .replace(/(\D)\1\1+/g, "$1$1")
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC')
      .trim();
  }

  wordsToVisemes(w) {
    let o = { words: w.toUpperCase(), visemes: [], times: [], durations: [], i: 0 };
    let t = 0;

    const chars = [...o.words];
    while (o.i < chars.length) {
      const c = chars[o.i];
      const ruleset = this.rules[c];
      if (ruleset) {
        for (let i = 0; i < ruleset.length; i++) {
          const rule = ruleset[i];
          const test = o.words.substring(0, o.i) + c.toLowerCase() + o.words.substring(o.i + 1);
          let matches = test.match(rule.regex);
          if (matches) {
            rule.visemes.forEach(viseme => {
              if (o.visemes.length && o.visemes[o.visemes.length - 1] === viseme) {
                const d = 0.7 * (this.visemeDurations[viseme] || 1);
                o.durations[o.durations.length - 1] += d;
                t += d;
              } else {
                const d = this.visemeDurations[viseme] || 1;
                o.visemes.push(viseme);
                o.times.push(t);
                o.durations.push(d);
                t += d;
              }
            });
            o.i += rule.move;
            break;
          }
        }
      } else {
        o.i++;
        t += this.specialDurations[c] || 0;
      }
    }
    return o;
  }
}

export { LipsyncEs };