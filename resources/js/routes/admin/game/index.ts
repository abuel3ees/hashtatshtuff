import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::start
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/admin/game/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::start
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::start
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::start
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::start
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\AdminController::stop
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
export const stop = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

stop.definition = {
    methods: ["post"],
    url: '/admin/game/stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::stop
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
stop.url = (options?: RouteQueryOptions) => {
    return stop.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::stop
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
stop.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::stop
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
const stopForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::stop
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
stopForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(options),
    method: 'post',
})

stop.form = stopForm

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
export const reset = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/admin/game/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
reset.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
const resetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::reset
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
resetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reset.url(options),
    method: 'post',
})

reset.form = resetForm

const game = {
    start: Object.assign(start, start),
    stop: Object.assign(stop, stop),
    reset: Object.assign(reset, reset),
}

export default game