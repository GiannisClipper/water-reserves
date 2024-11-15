import ParamValues from "@/logic/ParamValues";

import type { 
    SearchParamsType, 
    ProductionSearchParamsType,
} from "@/types/searchParams";

import { ObjectType } from "@/types";

class ProductionParamValues extends ParamValues {

    _factories: { [ key: string ]: any }[] = [];
    _factoryFilter: { [ key: string ]: boolean } = {};
    _factoryAggregation: string | undefined;

    constructor( productionSearchParams: ProductionSearchParamsType, factories: { [ key: string ]: any }[] ) {
        const searchParams: SearchParamsType = productionSearchParams;
        super( searchParams );

        this._factories = factories;
        this.convertFactoryFilter( productionSearchParams.factory_filter );
        this._factoryAggregation = Object.keys( productionSearchParams ).length
            ? productionSearchParams.factory_aggregation || ''
            : 'sum';
    }

    convertFactoryFilter( val: string | undefined ) {

        if ( val ) {
            this._factories.forEach( r => this._factoryFilter[ r.id ] = false );
            const ids = val.split( ',' );
            ids.forEach( id => this._factoryFilter[ id ] = true );
            return;
        }

        this._factories.forEach( r => this._factoryFilter[ r.id ] = true );
    }

    set factoryAggregation( val: string | undefined ) {
        this._factoryAggregation = val ? val : this._factoryAggregation;
    }

    fromJSON( values: ObjectType ): ProductionParamValues {

        super.fromJSON( values );
        this._factoryFilter = values.factoryFilter;
        this._factoryAggregation = values.factoryAggregation;

        return this;
    }

    toJSON(): ObjectType {
        return {
            ...super.toJSON(),
            factoryFilter: this._factoryFilter,
            factoryAggregation: this._factoryAggregation,
        }
    }

    toSearchParams(): ProductionSearchParamsType {

        const searchParams: SearchParamsType = super.toSearchParams();

        const result: ProductionSearchParamsType = { ...searchParams };
    
        const factory_filter: string = Object.entries( this._factoryFilter )
            .filter( entry => entry[ 1 ] === true )
            .map( entry => entry[ 0 ] )
            .join( ',' );
    
        if ( factory_filter ) {
            result.factory_filter = factory_filter
        }

        if ( this._factoryAggregation ) {
            result.factory_aggregation = this._factoryAggregation
        }
    
        return result;    
    }

    toQueryString(): string {
        return Object
            .entries( this.toSearchParams() )
            .map( entry => `${entry[ 0 ]}=${entry[ 1 ]}` ).join( '&' );
    }
}

export default ProductionParamValues;