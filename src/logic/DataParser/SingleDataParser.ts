import MultiDataParser from '@/logic/DataParser/MultiDataParser';
import ValueParserCollection from '@/logic/ValueParser/ValueParserCollection';

class SingleDataParser extends MultiDataParser {    

    type: string = 'single';
}

class SingleSpatialDataParser extends MultiDataParser {    

    type: string = 'single,spatial';
}

export { SingleDataParser, SingleSpatialDataParser };

