'use strict'

const User = use('App/Models/User')

class UserController {

    async store({ request }) {
        const user = request.only([
            'name',
            'cpf',
            'street',
            'number',
            'district',
            'city',
            'zip',
            'state'
        ]);

        await User.create(user);

        return (user);
    }

    async index() {
        const users = await User.all();

        return users;
    }

    async show({ params }) {
        const user = await User.findOrFail(params.id);

        return (user);
    }

    async update({ request, params }) {
        const user = await User.findOrFail(params.id);

        const newuser = request.only([
            'name',
            'cpf',
            'street',
            'number',   
            'district',
            'city',
            'zip',
            'state'
        ]);

        user.merge(newuser);

        await user.save();

        return ('Updated successfully');
    }

    async destroy({ params }) {
        const user = await User.findOrFail(params.id);

        await user.delete();

        return ('successfully deleted ');
    }

}

module.exports = UserController
