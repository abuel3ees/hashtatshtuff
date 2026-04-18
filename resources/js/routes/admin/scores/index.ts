import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
export const reset = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/admin/scores/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
reset.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
const resetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
resetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

reset.form = resetForm

const scores = {
    reset: Object.assign(reset, reset),
}

export default scores