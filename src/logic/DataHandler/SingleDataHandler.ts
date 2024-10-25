import MultiDataHandler from '@/logic/DataHandler/MultiDataHandler';
import ValueParserCollection from '@/logic/ValueParser/ValueParserCollection';

class SingleDataHandler extends MultiDataHandler {    

    type: string = 'single';
}

class SingleSpatialDataHandler extends MultiDataHandler {    

    type: string = 'single,spatial';
}

export { SingleDataHandler, SingleSpatialDataHandler };

