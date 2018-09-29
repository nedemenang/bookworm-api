import express from 'express';
import User from '../models/user';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import config from '../config/database';

export default {

    register(req, res, next ) {
        // console.log("I did say before and I say now")
         User.findOne({email: req.body.email})
            .exec()
            .then(user => {
                if(user) {
                    return res.status(409).json({
                        message: "Email already exists"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err,hash) => {
                        if(err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const newUser = new User({
                                name: req.body.name,
                                email: req.body.email,
                                username: req.body.username,
                                password: hash
                            });
                            newUser.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "user sucessfully created"
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                        }
                    });
                }
            });
        },

        authenticate(req, res, next) {
             User.findOne({email: req.body.email})
                .then(user => {
                    if(!user) {
                        return res.status(401).json({
                            message: "Authentication failed"
                        })
                    }
                    bcrypt.compare(req.body.password, user.password, (err, result) => {
                        if (err) {
                            return res.status(401).json({
                                message: "Authentication failed"
                            })
                        }
                        if(result){
                            const token = jwt.sign(
                                {
                                    name: user.name,
                                    email: user.email,
                                    username: user.username,
                                },
                                process.env.SECRET_KEY,
                                {
                                    expiresIn: "1h"
                                }
                            );
                            return res.status(200).json({
                                message: "Authentication successful",
                                token: token
                            })
                        }
                        res.status(401).json({
                            message: "Authentication failed"
                        })
                    })
                });
        },

        passwordReset(req, res, next) {
            User.findOne({email: req.body.email})
            .then(user => {
                if(!user) {
                    return res.status(409).json({
                        message: "User does not exist"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err,hash) => {
                        if(err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            user.password = hash
                            user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "user sucessfully updated"
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error:err
                                });
                            });
                        }
                    });
                }
            });
        },

        delete(req, res, next) {
             User.remove({_id: req.params.userId})
                .then(result => {
                    res.status(200).json({
                        message: "User deleted"
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        },

        list(req, res, next) {
            User.find()
            .select("_id name email username")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    users: docs.map(doc => {
                        return {
                            name: doc.name,
                            username: doc.username,
                            email: doc.email
                        }
                    })
                }
                res.status(200).json(response);
            })
            .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
        }
}