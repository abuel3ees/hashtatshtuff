import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:18
* @route '/admin'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:18
* @route '/admin'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:18
* @route '/admin'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:18
* @route '/admin'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:18
* @route '/admin'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:18
* @route '/admin'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AdminController::index
* @see app/Http/Controllers/AdminController.php:18
* @route '/admin'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\AdminController::bulkCreate
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
export const bulkCreate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkCreate.url(options),
    method: 'post',
})

bulkCreate.definition = {
    methods: ["post"],
    url: '/admin/users/bulk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::bulkCreate
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
bulkCreate.url = (options?: RouteQueryOptions) => {
    return bulkCreate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::bulkCreate
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
bulkCreate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkCreate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::bulkCreate
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
const bulkCreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkCreate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::bulkCreate
* @see app/Http/Controllers/AdminController.php:35
* @route '/admin/users/bulk'
*/
bulkCreateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkCreate.url(options),
    method: 'post',
})

bulkCreate.form = bulkCreateForm

/**
* @see \App\Http\Controllers\AdminController::startGame
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
export const startGame = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startGame.url(options),
    method: 'post',
})

startGame.definition = {
    methods: ["post"],
    url: '/admin/game/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::startGame
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
startGame.url = (options?: RouteQueryOptions) => {
    return startGame.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::startGame
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
startGame.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startGame.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::startGame
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
const startGameForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: startGame.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::startGame
* @see app/Http/Controllers/AdminController.php:62
* @route '/admin/game/start'
*/
startGameForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: startGame.url(options),
    method: 'post',
})

startGame.form = startGameForm

/**
* @see \App\Http\Controllers\AdminController::stopGame
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
export const stopGame = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopGame.url(options),
    method: 'post',
})

stopGame.definition = {
    methods: ["post"],
    url: '/admin/game/stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::stopGame
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
stopGame.url = (options?: RouteQueryOptions) => {
    return stopGame.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::stopGame
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
stopGame.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stopGame.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::stopGame
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
const stopGameForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stopGame.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::stopGame
* @see app/Http/Controllers/AdminController.php:77
* @route '/admin/game/stop'
*/
stopGameForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stopGame.url(options),
    method: 'post',
})

stopGame.form = stopGameForm

/**
* @see \App\Http\Controllers\AdminController::resetGame
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
export const resetGame = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetGame.url(options),
    method: 'post',
})

resetGame.definition = {
    methods: ["post"],
    url: '/admin/game/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::resetGame
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
resetGame.url = (options?: RouteQueryOptions) => {
    return resetGame.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::resetGame
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
resetGame.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetGame.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::resetGame
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
const resetGameForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resetGame.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::resetGame
* @see app/Http/Controllers/AdminController.php:88
* @route '/admin/game/reset'
*/
resetGameForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resetGame.url(options),
    method: 'post',
})

resetGame.form = resetGameForm

/**
* @see \App\Http\Controllers\AdminController::setInterval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
export const setInterval = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setInterval.url(options),
    method: 'post',
})

setInterval.definition = {
    methods: ["post"],
    url: '/admin/clock/interval',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::setInterval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
setInterval.url = (options?: RouteQueryOptions) => {
    return setInterval.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::setInterval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
setInterval.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setInterval.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::setInterval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
const setIntervalForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setInterval.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::setInterval
* @see app/Http/Controllers/AdminController.php:101
* @route '/admin/clock/interval'
*/
setIntervalForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setInterval.url(options),
    method: 'post',
})

setInterval.form = setIntervalForm

/**
* @see \App\Http\Controllers\AdminController::resetScores
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
export const resetScores = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetScores.url(options),
    method: 'post',
})

resetScores.definition = {
    methods: ["post"],
    url: '/admin/scores/reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AdminController::resetScores
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
resetScores.url = (options?: RouteQueryOptions) => {
    return resetScores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::resetScores
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
resetScores.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resetScores.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::resetScores
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
const resetScoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resetScores.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::resetScores
* @see app/Http/Controllers/AdminController.php:109
* @route '/admin/scores/reset'
*/
resetScoresForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resetScores.url(options),
    method: 'post',
})

resetScores.form = resetScoresForm

/**
* @see \App\Http\Controllers\AdminController::removeAllUsers
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
export const removeAllUsers = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeAllUsers.url(options),
    method: 'delete',
})

removeAllUsers.definition = {
    methods: ["delete"],
    url: '/admin/users',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AdminController::removeAllUsers
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
removeAllUsers.url = (options?: RouteQueryOptions) => {
    return removeAllUsers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AdminController::removeAllUsers
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
removeAllUsers.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeAllUsers.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AdminController::removeAllUsers
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
const removeAllUsersForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeAllUsers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AdminController::removeAllUsers
* @see app/Http/Controllers/AdminController.php:117
* @route '/admin/users'
*/
removeAllUsersForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeAllUsers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeAllUsers.form = removeAllUsersForm

const AdminController = { index, bulkCreate, startGame, stopGame, resetGame, setInterval, resetScores, removeAllUsers }

export default AdminController