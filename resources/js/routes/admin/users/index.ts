import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::bulk
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/admin/users/bulk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::bulk
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::bulk
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
bulk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::bulk
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulk.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::bulk
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
bulkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulk.url(options),
    method: 'post',
})

bulk.form = bulkForm

/**
* @see \App\Http\Controllers\AdminController::removeAll
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
export const removeAll = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeAll.url(options),
    method: 'delete',
})

removeAll.definition = {
    methods: ["delete"],
    url: '/admin/users',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::removeAll
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
removeAll.url = (options?: RouteQueryOptions) => {
    return removeAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::removeAll
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
removeAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeAll.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminController::removeAll
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
const removeAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeAll.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::removeAll
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
removeAllForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeAll.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeAll.form = removeAllForm

const users = {
    bulk: Object.assign(bulk, bulk),
    removeAll: Object.assign(removeAll, removeAll),
}

export default users