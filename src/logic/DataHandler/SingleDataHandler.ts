import MultiDataHandler from '@/logic/DataHandler/MultiDataHandler';
import ValueSpecifierCollection from '@/logic/ValueSpecifier/ValueSpecifierCollection';

class SingleDataHandler extends MultiDataHandler {    

    type: string = 'single';
}

class SingleTimelessDataHandler extends MultiDataHandler {    

    type: string = 'single,timeless';
}

export { SingleDataHandler, SingleTimelessDataHandler };

