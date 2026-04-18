import Auth from './Auth'
import AdminController from './AdminController'
import GameController from './GameController'
import Settings from './Settings'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    AdminController: Object.assign(AdminController, AdminController),
    GameController: Object.assign(GameController, GameController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers