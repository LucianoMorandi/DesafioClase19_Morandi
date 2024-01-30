import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";


const sessionRoutes = Router();

sessionRoutes.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password, rol } = req.body;
    try {
        const user = await userModel.create({
            first_name, last_name, email, age, password, rol
        })
        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(401).send({error});
    }
});

sessionRoutes.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email: email});
        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }
        if (user.password !== password) {
            return res.status(401).send({message: 'Invalid password'});
        }
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.rol = 'admin';
        } else {
            user.rol = 'usuario';
        }
        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        res.status(400).send({error});
    }
});

sessionRoutes.post('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send({message: 'logout failed'});
            }
        });
        res.send({redirect: 'http://localhost:8080/login'});
    } catch (error) {
        res.status(400).send({error});
    }
});

export default sessionRoutes;