import MultiDataHandler from '@/logic/DataHandler/MultiDataHandler';
import ValueSpecifierCollection from '@/logic/ValueSpecifier/ValueSpecifierCollection';

class SingleDataHandler extends MultiDataHandler {    

    type: string = 'single';
}

class SingleSpatialDataHandler extends MultiDataHandler {    

    type: string = 'single,spatial';
}

export { SingleDataHandler, SingleSpatialDataHandler };

