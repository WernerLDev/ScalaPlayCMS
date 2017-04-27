import ApiCall from './ApiBase.js';

export function getEntities() {
    return ApiCall("/api/v1/entities", "GET");
}

export function getInstancesOf(name) {
    return ApiCall("/api/v1/" + name, "GET");
}