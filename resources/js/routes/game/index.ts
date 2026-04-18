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

const game = {
    submit: Object.assign(submit, submit),
}

export default game