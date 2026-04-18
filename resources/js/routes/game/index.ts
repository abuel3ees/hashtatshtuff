import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\GameController::submit
* @see app/Http/Controllers/GameController.php:39
* @route '/game/submit'
*/
export const submit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/game/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GameController::submit
* @see app/Http/Controllers/GameController.php:39
* @route '/game/submit'
*/
submit.url = (options?: RouteQueryOptions) => {
    return submit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GameController::submit
* @see app/Http/Controllers/GameController.php:39
* @route '/game/submit'
*/
submit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GameController::submit
* @see app/Http/Controllers/GameController.php:39
* @route '/game/submit'
*/
const submitForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GameController::submit
* @see app/Http/Controllers/GameController.php:39
* @route '/game/submit'
*/
submitForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submit.url(options),
    method: 'post',
})

submit.form = submitForm

/**
* @see routes/web.php:37
* @route '/game/pulse-id'
*/
export const pulseId = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pulseId.url(options),
    method: 'get',
})

pulseId.definition = {
    methods: ["get","head"],
    url: '/game/pulse-id',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:37
* @route '/game/pulse-id'
*/
pulseId.url = (options?: RouteQueryOptions) => {
    return pulseId.definition.url + queryParams(options)
}

/**
* @see routes/web.php:37
* @route '/game/pulse-id'
*/
pulseId.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pulseId.url(options),
    method: 'get',
})

/**
* @see routes/web.php:37
* @route '/game/pulse-id'
*/
pulseId.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pulseId.url(options),
    method: 'head',
})

/**
* @see routes/web.php:37
* @route '/game/pulse-id'
*/
const pulseIdForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pulseId.url(options),
    method: 'get',
})

/**
* @see routes/web.php:37
* @route '/game/pulse-id'
*/
pulseIdForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pulseId.url(options),
    method: 'get',
})

/**
* @see routes/web.php:37
* @route '/game/pulse-id'
*/
pulseIdForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pulseId.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pulseId.form = pulseIdForm

const game = {
    submit: Object.assign(submit, submit),
    pulseId: Object.assign(pulseId, pulseId),
}

export default game