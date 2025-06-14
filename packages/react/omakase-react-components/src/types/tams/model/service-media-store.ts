/**
 * Time-addressable Media Store
 *
 * Contact: cloudfit-opensource@rd.bbc.co.uk
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * Provide information about the media store for this service
 */
export interface ServiceMediaStore { 
    /**
     * The type of the media store. This determines the endpoints for reading and writing media
     */
    type: ServiceMediaStore.TypeEnum;
}
export namespace ServiceMediaStore {
    export type TypeEnum = 'http_object_store';
    export const TypeEnum = {
        HttpObjectStore: 'http_object_store' as TypeEnum
    };
}


