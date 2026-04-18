import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::interval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
export const interval = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: interval.url(options),
    method: 'post',
})

interval.definition = {
    methods: ["post"],
    url: '/admin/clock/interval',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::interval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
interval.url = (options?: RouteQueryOptions) => {
    return interval.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::interval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
interval.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: interval.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::interval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
const intervalForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: interval.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::interval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
intervalForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: interval.url(options),
    method: 'post',
})

interval.form = intervalForm

const clock = {
    interval: Object.assign(interval, interval),
}

export default clock