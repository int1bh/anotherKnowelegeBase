import _cloneDeep = require('lodash/cloneDeep');
export class Tools {
    /**
     * Склонировать объект
     * @param data - объект
     */
    public static cloneObject(data) {
        return _cloneDeep(data);
    }
}