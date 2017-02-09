/* Test Cases
 *  1. test if parser can check for invalid schemas
 *  2. if valid schema is passed check for following cases :
 *   a. check if it can parse arrays
 *   b. check if it can parse objects
 *   c. check if it can parse $ref
 *  3. pass a sample schema and check if the palette are correctly populated
 * */

import {Parser} from "../components/parser/parser";

describe('Test palette items', function() {
    it('should test if the palette contains the correct list of items', function() {

        let parser: Parser = new Parser();
        let result = parser.getRootElement();
        let testpalette = ["class","attribute"];
        let hasOwnProperty = Object.prototype.hasOwnProperty;

        function isEmpty(obj){
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }
            return true;
        }

        let resultpalette=[];

        function findPaletteItems(result){
            for (var key in result) {
                if(isEmpty(result)) return;
                resultpalette.push(key);
                findPaletteItems(result[key].draggables);
            }
        }

        findPaletteItems(result.draggables);

        expect(resultpalette.sort().join(',')=== testpalette.sort().join(',')).toBe(true);

    });
});