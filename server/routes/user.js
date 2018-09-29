import User from '../controllers/user';
import checkAuth from '../middleware/checkAuthentication';

export default function(app) {

    app.post('/register', User.register);

    app.post('/authenticate', User.authenticate);

    app.post('/delete/:userId', checkAuth , User.delete);

    app.post('/reset', checkAuth , User.passwordReset);

    app.get('/users', checkAuth , User.list);

}