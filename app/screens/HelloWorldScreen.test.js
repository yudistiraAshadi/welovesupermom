import { transformAlternateCase, transformUpperCase } from "./HelloWorldScreen"

const wordList = [
  "hello world",
  "sommething big 123",
  "I can BE whateve^^r",
  "lorem 879123 ipsum",
  "test some STR1NG hErE 999",
]

// using https://convertcase.net/
const wordListAlternate = [
  "hElLo wOrLd",
  "sOmMeThInG BiG 123",
  "i cAn bE WhAtEvE^^r",
  "lOrEm 879123 IpSuM",
  "tEsT SoMe sTr1nG HeRe 999",
]
const wordListUpper = [
  "HELLO WORLD",
  "SOMMETHING BIG 123",
  "I CAN BE WHATEVE^^R",
  "LOREM 879123 IPSUM",
  "TEST SOME STR1NG HERE 999",
]

describe("Test files for 'transformAlternateCase'", () => {
  // // iterate word list to test
  wordList.map((word, index) => {
    test("Alternate Case '" + { word } + "'", () => {
      expect(transformAlternateCase(word)).toEqual(wordListAlternate[index])
    })
  })
})

describe("Test files for 'transformUpperCase'", () => {
  // // iterate word list to test
  wordList.map((word, index) => {
    test("Upper Case '" + { word } + "'", () => {
      expect(transformUpperCase(word)).toEqual(wordListUpper[index])
    })
  })
})
